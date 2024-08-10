<template>
  <div class="pr-3">
    <el-drawer size="700px" v-model="isDrawerShow" direction="rtl" :before-close="tip">
      <template #header>
        <h1 class="text-xl border-b-2 py-6">参数调整</h1>
      </template>
      <template #default>
        <div class="flex flex-col">
          <div class="mb-7">
            <div class="flex">
              <span class="">文本数量</span>
              <span class="ml-auto">max_tokens</span>
            </div>
            <el-slider :max="2048" v-model="max_tokens" :marks="tokenMark" show-input />
          </div>
          <div class="mb-7">
            <span class="demonstration"></span>
            <div class="flex">
              <span class="">文本多样性</span>
              <span class="ml-auto">temperature</span>
            </div>
            <el-slider v-model="temperature" :min="0.1" :max="1" :step="0.02" :marks="temperatureMark" show-input />
          </div>
          <div class="mb-7">
            <div class="flex">
              <span class="">用词频率</span>
              <span class="ml-auto">top_p</span>
            </div>
            <el-slider v-model="top_p" :min="0.1" :max="1" :step="0.02" :marks="top_pMark" show-input />
          </div>
        </div>
      </template>
    </el-drawer>
    <div class="duration-300 hover:scale-125">
      <Config theme="outline" size="28" fill="#6a89cc" class="cursor-pointer" @click="toggleDrawerShow" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from "element-plus";
import { defineEmits } from "vue";
import { Config, Equalizer } from "@icon-park/vue-next";
import llmStore from "@/store/llmStore";
const conf = llmStore()

const emit = defineEmits(["getConfig"]);

const toggleDrawerShow = () => {
  isDrawerShow.value = !isDrawerShow.value;
};

const isDrawerShow = ref(false);
const stream = ref(await conf.getConfig().then(r => r?.stream));

const max_tokens = ref(await conf.getConfig().then(r => r?.max_tokens));
const tokenMark = reactive({
  300: "输出少量内容",
  1024: "输出中量内容",
  1800: "输出大量内容",
});

const temperature = ref(await conf.getConfig().then(r => r?.temperature));
const temperatureMark = reactive({
  0.2: "更加精准",
  0.6: "适中",
  0.8: "更加有建议性",
});
const top_p = ref(await conf.getConfig().then(r => r?.top_p));
const top_pMark = reactive({
  0.2: "文本更加重复",
  0.6: "适中",
  0.8: "文本更加生动",
});

/**
 * 发送配置数据到父组件
 * 监听drawer组件是否隐藏, 若隐藏则将数据通过pinia更新
 */
watch(
  () => isDrawerShow.value,
  (value) => {
    if (value === false) {
      llmStore().updateConfig({
        model: "chatglm3-6b",
        max_tokens: max_tokens.value!,
        temperature: temperature.value!,
        top_p: top_p.value!
      })
    }
  }
);

const tip = (done: any) => {
  done();
  ElNotification({
    title: "配置重载成功",
    message: "快去对话试试吧!",
    type: "success",
  });
};
</script>
