import userApi, { AuthReturnType, UserLoginType } from '../apis/userApi';
import { CacheEnum } from './../enum/cacheEnum';
import store from "./store";
import router from '@/router'
import userStore from '../store/userStore';
import sessionStore from '@/store/sessionStore';
import { ElMessage, ElMessageBox } from 'element-plus';

export async function login(values: UserLoginType | URLSearchParams) {
  const { access_token } = await userApi.login(values) as any
  if ((access_token !== null) || (access_token !== undefined)) {
    store.set(CacheEnum.TOKEN_NAME, access_token)
    if (!store.get(CacheEnum.REDIRECT_ROUTE_NAME)) {
      store.set(CacheEnum.REDIRECT_ROUTE_NAME, "llm")
    }
    const routeName = store.get(CacheEnum.REDIRECT_ROUTE_NAME) ?? 'home'
    userStore().getUserInfo()
    console.log('routeName', routeName)
    router.push({ name: routeName })
  }
}
export function logout() {
  ElMessageBox.confirm(
    '退出登录会清空当下的聊天记录, 确定退出登录吗？',
    '确认登出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '用户已退出登录',
      })
      setTimeout(() => {
        store.remove(CacheEnum.TOKEN_NAME)
        router.push('/login')
        sessionStore().clearAllSession()
        location.reload()
        userStore().info = null
      }, 3000)
    })

}
export function isLogin() {
  return Boolean(store.get(CacheEnum.TOKEN_NAME))
}