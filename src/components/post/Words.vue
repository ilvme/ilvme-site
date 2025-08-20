<script setup lang="ts">
import { formatPast } from '../../libs/support.ts'
import type { Word } from '../../../scripts/types'
import { getWords } from '../../../scripts/notion-fetcher.ts'
import { onMounted, type Ref, ref } from 'vue'
const words: Ref<Word[]> = ref([])

const expireTime = 5 * 60 * 1000 // 5 分钟

onMounted(async () => {
  let wordStr = localStorage.getItem('words')

  const wordsLastUpdateTime = parseInt(localStorage.getItem('words_last_update_time') || '0')

  // 缓存有效
  if (wordStr && Date.now() - wordsLastUpdateTime < expireTime) {
    words.value = JSON.parse(wordStr)
  } else {
    // 1a4c485ef35680f18abdf460c74835e4
    words.value = await getWords('1a4c485ef35680f18abdf460c74835e4')
    localStorage.setItem('words', JSON.stringify(words))
    localStorage.setItem('words_last_update_time', String(new Date().getTime()))
  }
})
</script>

<template>
  <div>
    <div class="max-h-[300px] space-y-6 overflow-auto border border-5 border-gray-400/10 px-3 py-2">
      <div
        class="flex w-[80%] cursor-pointer flex-col gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 py-3 transition-all duration-200 hover:scale-101"
        v-for="word in words"
        :key="word.id"
      >
        <p class="text-xs text-gray-400">{{ formatPast(word.time) }}</p>
        <p class="text-sm font-bold">{{ word.title }}</p>
        <p class="text-secondary text-xs">{{ word.content }}</p>
      </div>
      )) }
    </div>

    <p class="text-secondary text-right text-xs">
      <span>累积 {{ words.length }} 条说说。</span>
      <span>第一条说说发布于{{ formatPast(words[words.length - 1]?.time) }}。 </span>
      <span>最近一条发布于{{ formatPast(words[0].time) }}。</span>
    </p>
  </div>
</template>

<style scoped></style>
