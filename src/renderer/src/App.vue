<script setup lang="ts">
import Versions from './components/Versions.vue'
import { trpcClient } from './trpc/trpc-client'
import { onMounted, ref } from 'vue'

const list = ref<Awaited<ReturnType<typeof trpcClient.trpc.trpcQueryList.query>>>([])

async function trpcQueryList() {
  list.value = await trpcClient.trpc.trpcQueryList.query()
}

async function trpcMutationTest() {
  await trpcClient.trpc.trpcMutationList.mutate({ id: 1, name: 'hello' + Date.now() })
  trpcQueryList()
}

async function trpcSubscribeTest() {
  await trpcClient.trpc.subscribeSendTest.mutate({ id: 1, value: 'value' + Date.now() })
  trpcQueryList()
}

onMounted(() => {
  const sub = trpcClient.trpc.subscribeTest.subscribe(undefined, {
    onData: async () => {
      trpcQueryList()
    }
  })
  sub.unsubscribe()
})
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <table class="table" border="1">
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in list" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.value }}</td>
      </tr>
    </tbody>
  </table>
  <div class="actions">
    <div class="action">
      <a @click="trpcQueryList"> trpcQueryList (Get List) </a>
    </div>
    <div class="action">
      <a @click="trpcMutationTest"> trpcMutationTest (Update Name)</a>
    </div>
    <div class="action">
      <a @click="trpcSubscribeTest"> trpcSubscribeTest (Update Value) </a>
    </div>
  </div>
  <Versions />
</template>

<style scoped>
.table {
  margin-top: 20px;
  border-collapse: collapse;
  border: 1px solid #ccc;
  td,
  th {
    padding: 6px 10px;
  }
}
</style>
