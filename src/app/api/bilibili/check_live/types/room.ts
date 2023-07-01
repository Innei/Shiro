export interface BLRoom {
  code: number
  message: string
  ttl: number
  data: Data
}
interface Data {
  by_uids: {}
  by_room_ids: By_room_ids
}

interface By_room_ids {
  [key: number]: RoomInfo
}
export interface RoomInfo {
  room_id: number
  uid: number
  area_id: number
  live_status: number
  live_url: string
  parent_area_id: number
  title: string
  parent_area_name: string
  area_name: string
  live_time: string
  description: string
  tags: string
  attention: number
  online: number
  short_id: number
  uname: string
  cover: string
  background: string
  join_slide: number
  live_id: number
}
