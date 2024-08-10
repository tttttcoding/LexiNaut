import { CacheEnum } from './../../enum/cacheEnum'
import store from '@/utils/store'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import router from '@/router'

export default class Axios {
  private instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors()
  }
  private interceptors() {
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  public async request<T, D = ResponseResult<T>>(config: AxiosRequestConfig) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.instance.request<D>(config)
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    }) as Promise<D>
  }
  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config) => {
        config.headers!.Authorization =
          'Bearer ' + store.get(CacheEnum.TOKEN_NAME)
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }
  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        switch (error.response.status) {
          case 401:
            store.remove(CacheEnum.TOKEN_NAME)
            router.push({ name: 'login' })
            break
        }
        return Promise.reject(error)
      },
    )
  }
}
