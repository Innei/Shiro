export interface BLLive {
  code: number
  message: string
  ttl: number
  data: Data
}
interface Data {
  room_id: number
  short_id: number
  uid: number
  is_hidden: boolean
  is_locked: boolean
  is_portrait: boolean
  live_status: number
  hidden_till: number
  lock_till: number
  encrypted: boolean
  pwd_verified: boolean
  live_time: number
  room_shield: number
  all_special_types: any[]
  playurl_info: Playurl_info
}
export interface Playurl_info {
  conf_json: string
  playurl: Playurl
}
interface Playurl {
  cid: number
  g_qn_desc: GQnDescItem[]
  stream: StreamItem[]
  p2p_data: P2p_data
  dolby_qn: null
}
interface GQnDescItem {
  qn: number
  desc: string
  hdr_desc: string
}
interface StreamItem {
  protocol_name: string
  format: FormatItem[]
}
interface FormatItem {
  format_name: string
  codec: CodecItem[]
}
interface CodecItem {
  codec_name: string
  current_qn: number
  accept_qn: number[]
  base_url: string
  url_info: UrlInfoItem[]
  hdr_qn: null
  dolby_type: number
}
interface UrlInfoItem {
  host: string
  extra: string
  stream_ttl: number
}
interface P2p_data {
  p2p: boolean
  p2p_type: number
  m_p2p: boolean
  m_servers: null
}
