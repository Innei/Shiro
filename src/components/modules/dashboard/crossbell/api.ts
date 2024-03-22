import axios from 'axios'
import type { NoteDto, PostDto } from '~/models/writing'
import type { CrossBell } from './types'

import { apiClient } from '~/lib/request.new'

const endpoint = 'https://indexer.crossbell.io/v1'
// characterId 52055
// noteId 431
export class CrossBellApi {
  private http = axios.create({
    baseURL: '/api/crossbell',
  })
  constructor(
    // private readonly token = process.env.CROSSBELL_TOKEN,
    private readonly characterId: number,
  ) {
    this.http.interceptors.request.use((config) => {
      // config.headers.Authorization = `Bearer ${this.token}`
      return config
    })
  }

  getNote(noteId: number) {
    return this.http.get<CrossBell.CrossbellNote | null>(
      `/notes/${this.characterId}/${noteId}`,
    )
  }

  async createNote(model: NoteDto | PostDto) {
    const articleUrl = await apiClient.proxy
      .helper('url-builder')(model.id)
      .get<{
        data: string
      }>()
      .then(({ data }) => data)
      .catch(() => '')

    if (!articleUrl) {
      throw new Error('文章链接生成失败')
    }

    const { title, text } = model
    const contentWithFooter = `${text}

<span style="text-align: right;font-size: 0.8em; float: right">此文由 [Shiro · Light dashboard](https://github.com/innei/Shiro) 同步更新至 xLog
原始链接为 <${articleUrl}></span><br ><br >`
    const slug = 'slug' in model ? model.slug : `note-${model.nid}`

    return this.http.put(
      `/siwe/contract/characters/${this.characterId}/notes`,
      {
        metadata: {
          tags: ['post'],
          type: 'note',
          title,
          isPost: true,
          summary: '',
          published: true,
          applications: ['xlog'],
          content: contentWithFooter,

          sources: ['xlog'],
          attributes: [
            {
              value: slug, // 这里是自定义 slug
              trait_type: 'xlog_slug',
            },
          ],
          attachments: [],
        },
        locked: false,
        linkItemType: null,
      },
    )
  }
}
