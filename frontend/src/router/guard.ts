import { RouteLocationNormalized, Router } from "vue-router"
import { CacheEnum } from "../enum/cacheEnum"
import util from "../utils"
import userStore from "@/store/userStore"
import utils from "../utils"

class Guard {
  constructor(private router: Router) { }
  public run() {
    this.router.beforeEach(this.beforeEach.bind(this))
  }
  private token(): string | null{
    return util.store.get(CacheEnum.TOKEN_NAME)
  }
  private getUserInfo(){
    if (this.token()) return userStore().getUserInfo()
  }
  private isLogin(route: RouteLocationNormalized): boolean {
    const state =  Boolean(!route.meta.auth || (route.meta.auth && this.token()))
    if (state === false){
      utils.store.set(CacheEnum.REDIRECT_ROUTE_NAME,route.name)
    }
    return state

  }
  private isGuest(route: RouteLocationNormalized): boolean {
    return Boolean(!route.meta.guest || (route.meta.guest && !this.token()))
  }

  private async beforeEach(to:RouteLocationNormalized,from:RouteLocationNormalized) {
    // if (this.isLogin(to) == false) return {name:'login'}
    // if (this.isGuest(to) == false ) return from
    // await this.getUserInfo()
    //记录历史路由
    // menuStore().addHistoryMenu(to)
    if (to.meta.auth && !this.token()) return {name:'login'}
    if (to.meta.guest && this.token()) return from
  }
}
export default (router: Router) => {
  new Guard(router).run()
}