export interface BLUser {
  code: number
  msg: string
  message: string
  data: Data
}
interface Data {
  info: UserInfo
  level: Level
  san: number
}
export interface UserInfo {
  uid: number
  uname: string
  face: string
  rank: string
  platform_user_level: number
  mobile_verify: number
  identification: number
  official_verify: Official_verify
  vip_type: number
  gender: number
}
interface Official_verify {
  type: number
  desc: string
  role: number
}
interface Level {
  uid: number
  cost: number
  rcost: number
  user_score: string
  vip: number
  vip_time: string
  svip: number
  svip_time: string
  update_time: string
  master_level: Master_level
  user_level: number
  color: number
  anchor_score: number
}
interface Master_level {
  level: number
  color: number
  current: number[]
  next: number[]
  anchor_score: number
  upgrade_score: number
  master_level_color: number
  sort: string
}
