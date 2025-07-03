<script setup lang="ts">
import Versions from './components/Versions.vue'
import { trpcClient } from './trpc/trpc-client'
import { onMounted } from 'vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

async function trpcQueryTest() {
  const result = await trpcClient.trpc.queryTest.query({ text: 'hello world' })
  alert('trpcQueryTest: ' + result.text)
}

onMounted(() => {
  trpcClient.trpc.subscribeTest.subscribe(undefined, {
    onData(value) {
      console.log(value)
    }
  })
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
  <div class="actions">
    <div class="action">
      <a @click="trpcQueryTest"> trpcQueryTest </a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
  </div>
  <Versions />
</template>
