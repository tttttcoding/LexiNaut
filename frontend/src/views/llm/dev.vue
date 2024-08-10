<template>
  <div class="h-screen w-screen">
    <!-- <drawerVue @getConfig="getConfig"/> -->
    <el-container class="h-full w-full bg-orange-50">
      <el-aside width="300px" class="h-full">
        <sideVue></sideVue>
      </el-aside>
      <el-main>
        <mainVue ></mainVue>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import mainVue from "@/components/llm/main.vue";
import sideVue from "@/components/llm/side.vue";

</script>

<style scoped></style>
