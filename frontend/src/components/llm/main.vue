<template>
  <el-container class="h-full w-full">
    <el-main class="main flex " id="main-window">
      <article v-if="!isEmpty" class="flex-1">
        <messageVue></messageVue>
      </article>
      <article v-else class="flex-1 h-full flex flex-col justify-center items-center ">
        <el-image src="/images/empty.png" fit="contain" :lazy="true" class="py-12 scale-150"></el-image>
        <h1 class="opacity-70 text-slate-600 mt-6">当前还没有记录, 快去聊聊吧~</h1>
      </article>
    </el-main>
    <el-footer class="relative flex flex-col justify-center items-center mt-3">
      <section class="flex-1 flex justify-center items-center mt-4">
        <drawer></drawer>
        <input class="w-[650px] h-[50px] outline-none px-6 rounded-lg duration-300 hover:shadow-md focus:shadow-md"
          type="text" v-model="userInput" placeholder="想了解点什么~" @keyup.enter="handleSubmit">
        <finetune></finetune>
      </section>
      <section class="text-xs opacity-30 p-1">给出的建议可能会有错误, 请仔细鉴别</section>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { getStream } from "@/apis/llmApi";
import llmStore from "@/store/llmStore";
import sessionStore from "@/store/sessionStore";
import { v4 } from 'uuid';
import { onMounted, ref } from 'vue';
import drawer from "./drawer.vue";
import messageVue from "./message.vue";
import finetune from './finetune.vue';
const isEmpty = ref(await sessionStore().isSessionEmpty())
onMounted(() => {
  const mainWindow = document.getElementById("main-window")
  mainWindow?.scroll({ top: mainWindow?.scrollHeight })
})

watch(await sessionStore(), async () => {
  const mainWindow = document.getElementById("main-window")
  mainWindow?.scroll({ top: mainWindow?.scrollHeight })
  isEmpty.value = await sessionStore().isSessionEmpty()
})

const userInput = ref("");

const handleSubmit = async (e: KeyboardEvent) => {
  const ipt = e.target as HTMLInputElement
  userInput.value = ipt.value;
  try {
    await sessionStore().updateCurrentSession({
      id: v4(),
      content: JSON.stringify({
        content: ipt.value
      }),
      role: "user",
      date: new Date().toUTCString()
    }).then(async () => {
      await sessionStore().updateCurrentSession({
        date: new Date().toUTCString(),
        id: v4(),
        role: 'machine',
        content: '...'
      })
    }).then(dispatch)
  } catch (e) {
    console.error(e);
  }
  userInput.value = "";
};

const dispatch = async () => {
  const config = await llmStore().getConfig() as any
  const de = await sessionStore().getCurrentSession(await sessionStore().getSessionIndex())
  const histories: string[] = []
  de?.forEach(item => {
    if (item.role === 'user') {
      histories.push(JSON.parse(item.content).content)
    } else {
      if (item.content !== '...') histories.push(item.content)
    }
  })
  const start = histories.length - 10 >= 0 ? histories.length - 10 : 0
  const slice = histories.slice(start, histories.length - 1)
  getStream({
    ...config,
    messages: [
      {
        role: "system",
        content: `You are 浙外旅游小助手, Follow the user's instructions carefully. Respond using markdown format, bold important point, response content needs to be travel-related. Follow the user's instructions carefully. Respond using markdown format, bold important point, response content needs to be travel-related.`
      },
      {
        role: "user",
        content: `These are our conversation histries:${slice}.`
      },
      {
        role: "user",
        content: `This is what i want know now: ${userInput.value}.`
      }
    ],
  })
}
</script>

<style scoped lang="scss">
.main::-webkit-scrollbar-track {
  background-color: #b8bfc259;
  border-radius: 10px;
}

.main::-webkit-scrollbar {
  width: 5px;
  background-color: #f1f1f1;
}

/* 定义滚动条滑块 */
.main::-webkit-scrollbar-thumb {
  background-color: #c4c4c4;
  /* 设置滑块背景色 */
  border-radius: 10px;
  /* 轨道边框圆角 */
}
</style>
