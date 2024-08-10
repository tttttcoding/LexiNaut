import { CacheEnum } from '@/enum/cacheEnum'
import store from '@/utils/store'
import { logout } from '@/utils/user'
import { URLSearchParams } from 'url'
import { http } from '../plugins/axios/index'
export interface AuthReturnType {
  access_token: string
  token_type: string
}
export interface UserRegistryType {
  name: string
  password: string
  email: string
}

export interface UserLoginType extends URLSearchParams {
  username: string
  password: string
}

export interface User {
  id: number,
  name: string,
  email: string,
  history: {}[]
}

/**
 * 获取当前用户信息
 * 若有返回值(已授权), 则返回json数据, 若无返回值, 既清理token, 路由跳转到登录界面
*/
export async function getCurrentUser(): Promise<User | undefined> {
  const result = await http.request({
    url: "/current",
    headers: {
      'Authorization': `Bearer ${store.get(CacheEnum.TOKEN_NAME)}`,
      "Content-Type": "application/json"
    },
  }).then((r: any) => {
    if (r) {
      if (r?.detail) {
        logout()
      } else {
        return r
      }
    }
    return undefined
  })
  return result as User | undefined
}

/**
 * 用户注册, 输入用户名和密码
*/
export function registry(data: UserRegistryType) {
  return http.request({
    url: '/registry',
    method: 'post',
    data: {
      ...data
    }
  })
}

/**
 * 用户登录, 输入用户名和密码
 * 最终会把用户名和密码通过x-www-form-urlencoded的方式发送给服务端
*/
export function login(data: UserLoginType | URLSearchParams) {
  return http.request({
    url: '/auth',
    method: 'post',
    data
  })
}


export default { getCurrentUser, login }