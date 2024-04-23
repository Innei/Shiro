import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { s3Config as config } from '~/app.static.config'
import { apiClient } from '~/lib/request'

const s3 = new S3Client({
  region: 'auto',
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
})

async function uploadToS3(path: string, body: Buffer, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: path,
    Body: body,
    ContentType: contentType,
  })

  await s3.send(command)
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData()
  const file = formData.get('file')
  const token = formData.get('token') as string

  if (!token) {
    return NextResponse.json({ error: 'No token received.' }, { status: 400 })
  }
  const { isGuest } = await apiClient.user.checkTokenValid(token)

  if (isGuest) {
    return NextResponse.json({ error: 'Invalid token.' }, { status: 401 })
  }

  if (!file) {
    return NextResponse.json({ error: 'No files received.' }, { status: 400 })
  }

  if (typeof file === 'string') {
    return NextResponse.json({ error: 'File is not a file.' }, { status: 400 })
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name.replaceAll(' ', '_')

  const date = new Date()
  const path = `bed/${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${+date}`
  const ext = filename.split('.').pop()
  await uploadToS3(`${path}.${ext}`, buffer, file.type)

  return NextResponse.json({ url: `${config.customDomain}/${path}.${ext}` })
}
