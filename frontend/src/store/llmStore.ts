import userApi, { User } from '../apis/userApi'
import { defineStore } from 'pinia'
import store from '@/utils/store'
import { CacheEnum } from '@/enum/cacheEnum'
import { v4 } from 'uuid'
export interface LLMRequestConfigType {
  model: string;
  // stream: boolean;
  max_tokens: number;
  temperature: number;
  top_p: number;
}
// export interface
export interface ResponseStream {
  model: string;
  id: string;
  object: string;
  choices: ChoiceStream[];
  created: number;
}

interface ChoiceStream {
  delta: DeltaStream;
  finish_reason?: any;
  index: number;
}

interface DeltaStream {
  role: string;
  content: string;
  function_call?: any;
}

export interface LLMResponse {
  model: string;
  id: string;
  object: string;
  choices: Choice[];
  created: number;
  usage: Usage;
}

interface Usage {
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens: number;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
  delta?: Delta;
}

interface Delta {
  role: string;
  content: string;
  function_call: Functioncall;
}

interface Message {
  role: string;
  content: string;
  name: string;
  function_call: Functioncall;
}

interface Functioncall {
  name: string;
  arguments: string;
}
export default defineStore('llm-config', {
  state: () => {
    return {
      config: {
        model: "chatglm3-6b",
        stream: true,
        max_tokens: 100,
        temperature: 0.8,
        top_p: 0.8,
        repetition_penalty: 1.1
      },
      currentData: {}
    }
  },
  actions: {
    async getConfig() {
      if (store.get(CacheEnum.TOKEN_NAME)) {
        return this.config
      }
    },
    async updateConfig(newConfig: LLMRequestConfigType) {
      if (store.get(CacheEnum.TOKEN_NAME)) {
        this.config = { ...this.config, ...newConfig }
      }
    },

    async getCurrentData() {
      if (store.get(CacheEnum.TOKEN_NAME)) {
        return this.currentData
      }
    },
  },
  persist: true
})
