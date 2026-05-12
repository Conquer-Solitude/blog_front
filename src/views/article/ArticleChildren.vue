<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'

const route = useRoute()
const router = useRouter()
const list = ref([])
const title = computed(() => route.query.name ?? '')

async function fetchArticles() {
  const id = route.query.id
  if (!id) {
    list.value = []
    return
  }

  const response = await http.get(`/api/article/type/${id}`)
  list.value = response.data.data ?? []
}

function openVideo(article) {
  router.push({
    path: '/video',
    query: {
      url: article.articleUrl,
      id: article.id,
      title: article.title,
      introduce: article.introduce,
    },
  })
}

watch(() => route.query.id, fetchArticles, { immediate: true })
</script>

<template>
  <div class="article-container">
    <h1>{{ title }}</h1>
    <hr />
    <div v-for="article in list" :key="article.id" class="video-container" @click="openVideo(article)">
      <h2>{{ article.title }}</h2>
      <span class="article-time">{{ article.createTime }}</span>
      <hr />
    </div>
  </div>
</template>
