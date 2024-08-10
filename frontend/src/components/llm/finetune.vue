<template>
  <div class="pl-3">
    <el-drawer title="模型微调与部署 ( Root )" size="700px" v-model="isDrawerShow" direction="rtl">
      <Area />
    </el-drawer>
    <div class="duration-300 hover:scale-125">
      <Equalizer class="cursor-pointer" theme="outline" size="28" fill="#a29bfe" @click="handleFinetune" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Equalizer } from '@icon-park/vue-next';
import Area from './area.vue'


const isDrawerShow = ref(false)
const handleFinetune = () => {
  isDrawerShow.value = !isDrawerShow.value
}


</script>

<style scoped></style>