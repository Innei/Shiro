import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const qqMusicPlugin: LinkCardPlugin = {
  name: 'qq-music-song',
  displayName: 'QQ Music Song',
  priority: 60,
  typeClass: 'wide',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'y.qq.com') return null
    if (!url.pathname.includes('/songDetail/')) return null

    // /n/ryqq/songDetail/001234abc
    const parts = url.pathname.split('/')
    const songDetailIndex = parts.indexOf('songDetail')
    if (songDetailIndex === -1 || !parts[songDetailIndex + 1]) return null

    return {
      id: parts[songDetailIndex + 1],
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
    const songData = await fetch(`/api/music/tencent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songId: id }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch QQMusic song title')
      }
      return res.json()
    })

    const songInfo = songData.data[0]
    const albumId = songInfo.album.mid

    return {
      title: (
        <>
          <span>{songInfo.title}</span>
          {songInfo.subtitle && (
            <span className="ml-2 text-sm text-zinc-400">
              {songInfo.subtitle}
            </span>
          )}
        </>
      ),
      desc: (
        <>
          <span className="block">
            <span className="font-bold">歌手：</span>
            <span>
              {songInfo.singer.map((person: any) => person.name).join(' / ')}
            </span>
          </span>
          <span className="block">
            <span className="font-bold">专辑：</span>
            <span>{songInfo.album.name}</span>
          </span>
        </>
      ),
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumId}.jpg?max_age=2592000`,
      color: '#31c27c',
    }
  },
}
