import type { LinkCardData, LinkCardPlugin, UrlMatchResult } from '../../types'

export const neteaseMusicPlugin: LinkCardPlugin = {
  name: 'netease-music-song',
  displayName: 'Netease Music Song',
  priority: 60,
  typeClass: 'wide',

  matchUrl(url: URL): UrlMatchResult | null {
    if (url.hostname !== 'music.163.com') return null
    if (!url.pathname.includes('/song') && !url.hash.includes('/song'))
      return null

    // Handle hash-based URLs like music.163.com/#/song?id=123
    const urlString = url.toString().replaceAll('/#/', '/')
    const _url = new URL(urlString)
    const id = _url.searchParams.get('id')

    if (!id) return null

    return {
      id,
      fullUrl: url.toString(),
    }
  },

  isValidId(id: string): boolean {
    return id.length > 0
  },

  async fetch(id: string): Promise<LinkCardData> {
    const songData = await fetch(`/api/music/netease`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songId: id }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch NeteaseMusic song title')
      }
      return res.json()
    })

    const songInfo = songData.songs[0]
    const albumInfo = songInfo.al
    const singerInfo = songInfo.ar

    return {
      title: (
        <>
          <span>{songInfo.name}</span>
          {songInfo.tns && (
            <span className="ml-2 text-sm text-zinc-400">
              {songInfo.tns[0]}
            </span>
          )}
        </>
      ),
      desc: (
        <>
          <span className="block">
            <span className="font-bold">歌手：</span>
            <span>
              {singerInfo.map((person: any) => person.name).join(' / ')}
            </span>
          </span>
          <span className="block">
            <span className="font-bold">专辑：</span>
            <span>{albumInfo.name}</span>
          </span>
        </>
      ),
      image: albumInfo.picUrl,
      color: '#e72d2c',
    }
  },
}
