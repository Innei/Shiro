import type { Contract } from 'crossbell'
import { createContract, Indexer } from 'crossbell'
import Unidata from 'unidata.js'

import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import type { NoteDto, PostDto } from '~/models/writing'

const unidata = new Unidata()

const crossbellGQLEndpoint = 'https://indexer.crossbell.io/v1/graphql'

export class CrossBellConnector {
  static SITE_ID = ''
  static setSiteId(siteId: string) {
    this.SITE_ID = siteId
  }

  private static contract: Contract | null = null

  private static async prepare() {
    if (this.contract) {
      return this.contract
    }

    const metamask = (globalThis as any).ethereum
    const contract = createContract(metamask)

    await contract.walletClient.requestAddresses()

    if (!contract.account.address) {
      throw new Error('未连接到 metamask')
    }
    this.contract = contract
    return contract
  }

  static createOrUpdate(data: NoteDto | PostDto) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (!('ethereum' in globalThis)) {
        resolve(null)
        return
      }
      if (!this.SITE_ID) {
        resolve(null)
        return
      }

      const { SITE_ID } = this

      await this.prepare()

      let postCallOnce = false
      let pageId = data.meta?.xLog?.pageId
      const slug = 'slug' in data ? data.slug : `note-${data.nid}`

      const post = async () => {
        if (postCallOnce) return
        const { text, title } = data
        postCallOnce = true

        // FIXME 如果 xLog 不存在这个 pageId，会报错 metamask rpc error
        // 如果是在 xLog 删除了这个文章，但是 mx 这边没有同步，会导致这个问题
        // 这里还是验证一下吧，只针对 note 的场景，post 还是根据记录的 pageId 来，因为 post 的 slug 不是固定的但是 note 的 nid 是固定的。
        // 如果 post 的 slug 改了，那么就在 xlog 拿不到 pageId 了，这个时候就会出问题（修改文章都是变成新增）

        if (!pageId || this.isNoteModel(data))
          pageId = await this.getCrossbellNotePageIdBySlug(slug)

        const articleUrl = await apiClient.proxy
          .helper('url-builder')(data.id)
          .get<{
            data: string
          }>()
          .then(({ data }) => data)
          .catch(() => '')

        if (!articleUrl) {
          throw new Error('文章链接生成失败')
        }

        const contentWithFooter = `${text}

<span style="text-align: right;font-size: 0.8em; float: right">此文由 [Mix Space](https://github.com/mx-space) 同步更新至 xLog
原始链接为 <${articleUrl}></span><br ><br >`

        toast.info('正在发布到 xLog...')

        const input = {
          siteId: SITE_ID,
          content: contentWithFooter,
          title,
          isPost: true,
          slug,
          published: true,
          applications: ['xlog'],
          externalUrl: `https://${SITE_ID}.xlog.app/${slug}`,
          pageId,
          tags:
            'tags' in data
              ? data.tags.toString()
              : this.isNoteModel(data)
                ? '手记'
                : '',
          publishedAt: data.created,
        }

        return unidata.notes.set(
          {
            source: 'Crossbell Note',
            identity: input.siteId,
            platform: 'Crossbell',
            action: input.pageId ? 'update' : 'add',
          },
          {
            ...(input.externalUrl && { related_urls: [input.externalUrl] }),
            ...(input.pageId && { id: input.pageId }),
            ...(input.title && { title: input.title }),
            ...(input.content && {
              body: {
                content: input.content,
                mime_type: 'text/markdown',
              },
            }),
            ...(input.publishedAt && {
              date_published: input.publishedAt,
            }),

            tags: [
              input.isPost ? 'post' : 'page',
              ...(input.tags
                ?.split(',')
                .map((tag) => tag.trim())
                .filter(Boolean) || []),
            ],
            applications: ['xlog'],
            ...(input.slug && {
              attributes: [
                {
                  trait_type: 'xlog_slug',
                  value: input.slug,
                },
              ],
            }),
          },
        )
      }

      await post().catch((err) => {
        console.error(err)
        toast.error('xLog 发布失败')

        throw err
      })

      toast.success('xLog 发布成功')

      let nextPageId = pageId
      if (!nextPageId) {
        nextPageId = await this.getCrossbellNotePageIdBySlug(slug)
      }

      if (!nextPageId) {
        toast.error('无法获取 Crossbell Note pageId 任务终止')
        return
      }
      // update meta for pageId
      await this.updateModel(data, {
        pageId: nextPageId,
      })

      const crossbellNoteData = await this.getCrossbellNoteData(
        nextPageId.split('-')[1],
      )
      if (!crossbellNoteData) {
        toast.error('无法获取 Crossbell Note 任务终止')
        return
      }
      const {
        metadata,
        uri,
        blockNumber,
        owner,
        transactionHash,
        updatedTransactionHash,
      } = crossbellNoteData

      // "metadata": {
      //   "network": "Crossbell",
      //   "proof": "52055-184",
      //   "blockNumber": 31902501,
      //   "owner": "0x0cc14dd429303aee55bfb56529b81d2a300362ed",
      //   "transactions": [
      //     "0x2906e8b6a321a4f53ab07d58b3227398022e55c0c18b52201edfc1a68f942956",
      //     "0xbb572893c077f488172a52edc67cab0b485713d8a21312052a1a1cb4f74c8675"
      //   ]
      // }

      await this.updateModel(data, {
        pageId: nextPageId,
        related_urls: [...metadata.content.external_urls],
        metadata: {
          network: 'Crossbell',
          proof: nextPageId,
          blockNumber,
          owner,
          transactions: [
            transactionHash,
            ...(updatedTransactionHash &&
            updatedTransactionHash !== transactionHash
              ? [updatedTransactionHash]
              : []),
          ],
        },
        cid: uri.split('ipfs://')[1],
      })

      resolve(null)
    })
  }

  private static isNoteModel(data: NoteDto | PostDto): data is NoteDto {
    return 'nid' in data
  }

  private static async updateModel(
    data: NoteDto | PostDto,

    meta: {
      pageId?: string
      cid?: string
      related_urls?: string[]
      metadata?: any
    },
  ) {
    const { id } = data
    const { cid, pageId, related_urls, metadata } = meta || {}

    // delete undefined value in meta object

    for (const key in meta) {
      // @ts-expect-error
      if (meta[key] === undefined) {
        // @ts-expect-error
        delete meta[key]
      }
    }

    const patchedData = {
      meta: {
        ...data.meta,
        xLog: {
          ...data.meta?.xLog,
          pageId,
          cid,
          related_urls,
          metadata,
        },
      },
    }
    if (this.isNoteModel(data)) {
      await apiClient.proxy.notes(id).patch({
        data: patchedData,
      })
    } else {
      await apiClient.proxy.posts(id).patch({
        data: patchedData,
      })
    }
  }

  private static indexer = new Indexer()

  private static async getCharacterId() {
    const { indexer } = this
    const result = await indexer.character.getByHandle(this.SITE_ID)

    if (!result) {
      return ''
    }

    return result.characterId
  }
  private static async getCrossbellNoteData(noteId: string) {
    await this.prepare()
    const characterId = await this.getCharacterId()
    if (!characterId) return
    return fetch(crossbellGQLEndpoint, {
      body: JSON.stringify({
        operationName: 'getNote',
        query: `query getNote {
          note(
            where: {
              note_characterId_noteId_unique: {
                characterId: ${characterId},
                noteId: ${noteId},
              },
            },
          ) {
            characterId
            noteId
            uri
            metadata {
              uri
              content
            }
            owner
            createdAt
            updatedAt
            publishedAt
            transactionHash
            blockNumber
            updatedTransactionHash
            updatedBlockNumber
          }
        }`,
        variables: {},
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then(
        (data) =>
          data.data?.note as {
            blockNumber: number
            characterId: string
            createdAt: string
            metadata: {
              content: {
                external_urls: string[]
                type: string
              }
              uri: string
            }
            noteId: string
            owner: string
            publishedAt: string
            transactionHash: string
            updatedAt: string
            updatedBlockNumber: number
            updatedTransactionHash: string
            uri: string
          },
      )
  }

  private static async getCrossbellNotePageIdBySlug(slug?: string) {
    await this.prepare()
    const characterId = await this.getCharacterId()
    if (!characterId) return
    return fetch(crossbellGQLEndpoint, {
      body: JSON.stringify({
        operationName: 'getNotes',
        query: `query getNotes {
          notes(
            where: {
              characterId: {
                equals: ${characterId},
              },
              deleted: {
                equals: false,
              },
              metadata: {
                AND: [
                  {
                    content: {
                      path: ["sources"],
                      array_contains: ["xlog"]
                    },
                  },
                  {
                    OR: [
                      {
                        content: {
                          path: ["attributes"],
                          array_contains: [{
                            trait_type: "xlog_slug",
                            value: "${slug}",
                          }]
                        }
                      },
                      {
                        content: {
                          path: ["title"],
                          equals: "${decodeURIComponent(slug!)}"
                        },
                      }
                    ]
                  }
                ]
              },
            },
            orderBy: [{ createdAt: desc }],
            take: 1,
          ) {
            characterId
            noteId
          }
        }`,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then((data) => {
        const note = data.data.notes[0]
        if (!note) return
        return `${note.characterId}-${note.noteId}`
      })
  }
}
