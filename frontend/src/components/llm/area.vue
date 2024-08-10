<template>
  <div class="w-full flex flex-col justify-center items-center">
    <section class="flex flex-col">
      <el-progress type="dashboard" :percentage="percentage" :color="color" />
      <h2 class="text-center">总进度</h2>
    </section>
    <el-divider />
    <section>
      <el-switch v-model="mode" active-text="全自动" inactive-text="半自动" />
    </section>
    <section class="w-5/6">
      <h1 class="mb-3 text-lg font-bold">目标地区配置</h1>
      <div class="flex flex-col justify-center items-center">
        <el-cascader placeholder="选择目标区域" class="w-full mb-2" size="large" :options="cities" v-model="selectedOptions">
        </el-cascader>
        <div class="w-full flex flex-col mb-12">
          <span class="min-w-max">数据量</span>
          <el-slider class="" v-model="crawlAmount" :step=10 show-stops :min="1" :max="1000" :marks="marks"
            show-input />
        </div>
      </div>
      <el-popconfirm v-if="!mode" title="请确认区域选择无误" @confirm="requestCrawl">
        <template #reference>
          <el-button class="w-full" type="primary" size="default" :disabled="isRunning">数据采集</el-button>
        </template>
      </el-popconfirm>
    </section>
    <el-divider />
    <section class="w-5/6">
      <h1 class="mb-3 text-lg font-bold">模型微调配置</h1>
      <div>
        <el-cascader v-if="!mode" placeholder="选择部署文件" class="w-full mb-2" size="large" :options="crawlDataNames"
          v-model="selectName">
        </el-cascader>
        <div class="w-full flex flex-col mb-12">
          <span class="min-w-max">Max Samples</span>
          <el-slider v-model="maxSamples" :step=10 show-stops :min="1" :max="1000" show-input />
        </div>
      </div>
      <div v-if="mode">
        <el-switch v-model="isMulti" active-text="多轮对话" inactive-text="单轮对话" />
      </div>
      <el-popconfirm v-if="!mode" title="确认微调配置无误" @confirm="requestFinetune">
        <template #reference>
          <el-button class="w-full" type="primary" size="default" :disabled="isRunning">微调</el-button>
        </template>
      </el-popconfirm>
    </section>
    <el-divider />
    <section class="w-5/6">
      <h1 class="mb-3 text-lg font-bold">模型导出</h1>
      <div class="flex flex-col gap-3">
        <el-input v-model="exportModelName" class="w-full mb-3" placeholder="请输入要导出的模型名称, 必须为英文" />
      </div>
      <el-button v-if="!mode" class="w-full" type="primary" size="default" :disabled="isRunning"
        @click="exportModel">导出</el-button>
    </section>
    <el-divider />
    <section class="w-5/6" v-if="!mode">
      <h1 class="text-lg font-bold mb-3">模型部署</h1>
      <el-cascader v-if="!mode" placeholder="选择要部署的模型" class="w-full mb-2" size="large" :options="models"
        v-model="deployModelName">
      </el-cascader>
      <el-button class="w-full" type="primary" size="default" :disabled="isRunning" @click="deployModel">部署</el-button>
    </section>
    <section class="w-5/6" v-if="mode">
      <el-popconfirm title="请确认区域选择无误" @confirm="fullAuto">
        <template #reference>
          <el-button class="w-full" type="primary" size="default" :disabled="isRunning">一键微调</el-button>
        </template>
      </el-popconfirm>
    </section>
  </div>
</template>

<script setup lang="ts">
import { http } from "@/plugins/axios";
import {
  pcTextArr
} from "element-china-area-data";
import { CSSProperties, watch, onBeforeMount } from 'vue'
import { ElNotification } from 'element-plus'

enum COLOR {
  ERROR = "#eb2f06",
  INIT = "#ffffff",
  BEGIN = "#0c2461",
  AFTER_CRAWL = "#38ada9",
  AFTER_FINETUNE = "#b8e994",
  AFTER_EXPORT = "#b8e994",
  SUCCESS = "#6ab04c"
}
enum PERCENTAGE {
  INIT = 0,
  BEGIN = 20,
  AFTER_CRAWL = 40,
  AFTER_FINETUNE = 60,
  AFTER_EXPORT = 80,
  SUCCESS = 100
}

interface Mark {
  style: CSSProperties
  label: string
}

type Marks = Record<number, Mark | string>

// 省市 && 城市数据, 支持到二级地区
const cities = pcTextArr as any
const selectedOptions = ref([])
const crawlCity = ref("")
const crawlAmount = ref<any>("0")
const isRunning = ref(false)
const crawlDataNames = ref<any>([])
const selectName = ref("")
const maxSamples = ref(0)
const mode = ref(false)
const models = ref<any>([])
const exportModelName = ref("")
const deployModelName = ref("")
const isMulti = ref(false)

const marks = reactive<Marks>({
  80: '较少数据',
  300: '中等数据',
  700: '较多数据',
  1000: '大量数据',
})

const percentage = ref<PERCENTAGE>(PERCENTAGE.INIT)
const color = ref<COLOR>(COLOR.INIT)

interface DataPath {
  names: string[]
}
const getDataPath = () => {
  http.request<DataPath>({
    url: "/llm/crawl",
    method: 'GET',
  }).then((res) => {
    const tmp: { value: string, label: string }[] = []
    res.data.names.forEach(item => {
      tmp.push(
        {
          value: item,
          label: item
        }
      )
    })
    crawlDataNames.value = tmp
  })
}


const getModels = () => {
  http.request<DataPath>({
    url: "/llm/model",
    method: "GET"
  }).then((res) => {
    const tmp: { value: string, label: string }[] = []
    res.data.names.forEach((item) => {
      tmp.push({
        value: item,
        label: item
      })
    })
    models.value = tmp
  })
}


watch(() => selectedOptions.value, (newValue) => {
  crawlCity.value = newValue.join("")
})

const toggleDisabled = () => {
  isRunning.value = !isRunning.value
}

const requestCrawl = () => {
  toggleDisabled()
  percentage.value = PERCENTAGE.BEGIN
  color.value = COLOR.BEGIN
  http.request({
    url: "/llm/crawl",
    method: 'POST',
    data: {
      city: crawlCity.value,
      amount: crawlAmount.value,
      is_multi: 0
    }
  }).then((res) => {
    if (res.status === "success") {
      console.log('res', res)
      // toggleDisabled()
      percentage.value = PERCENTAGE.AFTER_CRAWL
      color.value = COLOR.AFTER_CRAWL
      // 更新路径
      getDataPath()
    } else {
      console.error("Error: 数据采集错误")
    }
  }).finally(() => {
    toggleDisabled()
  })
}

const requestFinetune = () => {
  ElNotification({
    title: "进度信息",
    message: '模型微调中...',
    type: 'info',
  })
  http.request({
    url: "/llm/finetune",
    method: "POST",
    data: {
      data_path: selectName.value[0].slice(0, -5),
      max_samples: maxSamples.value,
      is_multi: selectName.value[0].endsWith('_more.json') ? 1 : 0
    }
  }).then(res => {
    if (res.status === 'success') {
      ElNotification({
        title: "进度信息",
        message: '模型微调完成',
        type: 'success',
      })
      percentage.value = PERCENTAGE.AFTER_FINETUNE
      color.value = COLOR.AFTER_FINETUNE
    } else {
      console.error("Error: 微调错误")
    }
  })
}


const exportModel = () => {
  ElNotification({
    title: "进度信息",
    message: '模型导出中...',
    type: 'info',
  })
  http.request({
    url: "/llm/export",
    method: "POST",
    data: {
      dir_name: exportModelName.value
    }
  }).then((res) => {
    percentage.value = PERCENTAGE.AFTER_EXPORT
    color.value = COLOR.AFTER_EXPORT
    ElNotification({
      title: "进度信息",
      message: '模型导出完毕',
      type: 'success',
    })
    getModels()
  })
}

const deployModel = () => {
  ElNotification({
    title: "进度信息",
    message: '部署中...',
    type: 'info',
  })
  http.request({
    url: "/llm/deploy",
    method: "POST",
    data: {
      name: deployModelName.value[0]
    }
  }).then(() => {
    ElNotification({
      title: "进度信息",
      message: '部署完毕',
      type: 'success',
    })
  })
}

const fullAuto = () => {
  ElNotification({
    title: "进度信息",
    message: '一键部署开始',
    type: 'info',
  })
  toggleDisabled()
  percentage.value = PERCENTAGE.BEGIN
  color.value = COLOR.BEGIN
  http.request({
    url: "/llm/crawl",
    method: 'POST',
    data: {
      city: crawlCity.value,
      amount: crawlAmount.value,
      is_multi: isMulti.value ? 1 : 0
    }
  }).then((res: any) => {
    if (res.status === "success") {
      ElNotification({
        title: "进度信息",
        message: '数据采集完成',
        type: 'success',
      })
      console.log(res.data.map_name)
      percentage.value = PERCENTAGE.AFTER_CRAWL
      color.value = COLOR.AFTER_CRAWL

      ElNotification({
        title: "进度信息",
        message: '模型微调中...',
        type: 'info',
      })
      http.request({
        url: "/llm/finetune",
        method: "POST",
        data: {
          data_path: isMulti ? res.data.map_name : res.data.map_name + '_more',
          max_samples: maxSamples.value,
          is_multi: isMulti.value
        }
      }).then(res => {
        if (res.status === 'success') {
          ElNotification({
            title: "进度信息",
            message: '模型微调完成',
            type: 'success',
          })
          percentage.value = PERCENTAGE.AFTER_FINETUNE
          color.value = COLOR.AFTER_FINETUNE
          ElNotification({
            title: "进度信息",
            message: '模型导出中...',
            type: 'info',
          })
          http.request({
            url: "/llm/export",
            method: "POST",
            data: {
              dir_name: exportModelName.value
            }
          }).then((res) => {
            ElNotification({
              title: "进度信息",
              message: '模型导出完毕',
              type: 'success',
            })
            percentage.value = PERCENTAGE.AFTER_EXPORT
            color.value = COLOR.AFTER_EXPORT
            getModels()
            ElNotification({
              title: "进度信息",
              message: '部署中...',
              type: 'info',
            })
            http.request({
              url: "/llm/deploy",
              method: "POST",
              data: {
                name: exportModel.name
              }
            }).then(() => {
              percentage.value = PERCENTAGE.SUCCESS
              color.value = COLOR.SUCCESS
              ElNotification({
                title: "进度信息",
                message: '部署完毕, 一键部署自动化完成',
                type: 'success',
              })
            })
          })
        } else {
          console.error("Error: 微调错误")
        }
      })
    } else {
      console.error("Error: 数据采集错误")
    }
  }).finally(() => {
    toggleDisabled()
  })
}
/**
 * 微调页面打开前, 获取数据文件的名称
*/
onBeforeMount(() => {
  getDataPath()
  getModels()
})

</script>

<style scoped></style>