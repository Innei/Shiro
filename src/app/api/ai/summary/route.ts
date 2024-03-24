import OpenAI from 'openai'
import type { ArticleDataType } from '~/types/api'
import type { NextRequest } from 'next/server'

import { sql } from '@vercel/postgres'

import { API_URL } from '~/constants/env'
import { apiClient } from '~/lib/request'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl

  const dataString = searchParams.get('data') as string
  const lang = searchParams.get('lang') || ('zh' as string)

  let data: ArticleDataType

  try {
    data = JSON.parse(decodeURIComponent(dataString))
  } catch {
    return new Response('Failed to parse the data.', { status: 400 })
  }

  let text: string
  let modified: string
  let cid: string
  switch (data.type) {
    case 'post': {
      const { category, slug } = data
      const res = await apiClient.post.getPost(category, slug)
      text = res.text
      modified = res.modified || res.created
      cid = res.id

      break
    }

    case 'note': {
      const { nid } = data
      const res = await apiClient.note
        .getNoteById(+nid)
        .then((data) => data.data)
      text = res.text
      modified = res.modified || res.created
      cid = res.id
      break
    }
    case 'page': {
      const { slug } = data
      const res = await apiClient.page.getBySlug(slug)
      text = res.text
      modified = res.modified || res.created
      cid = res.id
      break
    }
  }
  await sql`create table if not exists summary (id SERIAL PRIMARY KEY, api_endpoint varchar(50), summary text, lang varchar(10), modified varchar(30), cid varchar(40))`

  const sqlResult =
    await sql`select * from summary where lang = ${lang} and api_endpoint = ${API_URL} and modified = ${modified} and cid = ${cid}`

  if (sqlResult.rows.length > 0) {
    return new Response(
      JSON.stringify({
        summary: sqlResult.rows[0].summary,
        source: 'db-cache',
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=UTF-8',
        },
      },
    )
  }

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `Summarize this in "${lang}" language:
"${text}"

CONCISE SUMMARY:`,
      },
    ],
    model: 'gpt-3.5-turbo',
  })

  const summary = completion.choices[0].message.content

  await sql`insert into summary (api_endpoint, summary, lang, modified, cid) values (${API_URL}, ${summary}, ${lang}, ${modified}, ${cid})`

  return new Response(
    JSON.stringify({
      summary,
      source: 'openai',
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    },
  )
}
