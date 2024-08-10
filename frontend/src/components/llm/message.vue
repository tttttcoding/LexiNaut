<template>
  <section class="px-32 flex flex-col">
    <messageFrame class="my-4" :role="history?.role" v-for="history in data">
      <template #name> {{ history?.role === 'machine' ? 'ZISU旅游小助理' : '你' }} </template>
      <template #date> {{ history?.date && new Date(history.date).toLocaleString() }} </template>
      <template class="py-4" v-if="history?.role === 'machine'" #content>
        <div v-html="md.render(history?.content)"></div>
      </template>
      <template v-else-if="history?.role==='user'" #content>
        {{ JSON.parse(history?.content).content }}
      </template>
    </messageFrame>
  </section>
</template>

<script setup lang="ts">
import { getCurrentUser } from "@/apis/userApi";
import sessionStore, { HistoryType } from "@/store/sessionStore";
import { md } from "@/utils/md";
import messageFrame from "./messageFrame.vue";
const name = ref("");
const email = ref("");
getCurrentUser().then((r: any) => {
  name.value = r.name;
  email.value = r.email;
});
let data = ref<HistoryType[]>(
  sessionStore().getCurrentSession(sessionStore().currentIndex) as any
);
watch(sessionStore(), async () => {
  data.value = (await sessionStore().getCurrentSession(
    sessionStore().currentIndex
  )) as any;
});

sessionStore().setFlush();
</script>

<style scoped></style>./md
