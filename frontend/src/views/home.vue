<template>
  <div class="h-screen w-screen bg-gray-700 flex flex-col justify-center items-center">
    <img src="/images/011.png" alt="" class="w-40 h-40 object-cover rounded-full border-8 border-white">
    <div class="mt-4">
      <router-link  :to="{ name: 'admin/home' }" class="y_button ">LLM 后台管理</router-link>
      <router-link v-if="!utils.user.isLogin()" :to="{ name: 'login' }" class="y_button ml-3 y-danger">用户登陆</router-link>
    </div>
    <div class="text-gray-200 text-sm font-mono drop-shadow-md mt-3">young's home</div>
  </div>
</template>

<script setup lang="ts">
import utils from '@/utils';

</script>

<style lang="scss" scoped>

</style>
<script lang="ts">
export default { route: { name: 'home' } }
</script>