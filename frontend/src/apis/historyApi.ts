import { CacheEnum } from '@/enum/cacheEnum'
import store from '@/utils/store'

export interface HistoryType {
  id?: number
  owner_id?: number
  content: string
}

export function createConversation(userId: number, data: string) {
  return fetch(`/api/user/${userId}/history`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${store.get(CacheEnum.TOKEN_NAME)}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: data as any
  })
}




