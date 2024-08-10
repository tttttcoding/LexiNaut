import { CacheEnum } from './../../enum/cacheEnum';
import store from '@/utils/store';
import Axios from './Axios'
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { env } from 'process';
// const url = env.DEV_MODE ? env.DEV_BACKEND_URL : env.PRODUCTION_BACKEND_URL
const prodUrl = "http://127.0.0.1:8000/api"
const http = new Axios({
  // baseURL: '/api',
  baseURL: prodUrl,
  timeout: 100000,
  headers: {},

})
export { http }