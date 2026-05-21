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
    <h1 class="article-page-title">{{ title }}</h1>
    <div class="article-divider"></div>
    <div v-for="article in list" :key="article.id" class="article-card" @click="openVideo(article)">
      <h2 class="article-card-title">{{ article.title }}</h2>
      <span class="article-time">{{ article.createTime }}</span>
    </div>
  </div>
</template>

<style scoped>
.article-container {
  height: 1000px;
  overflow-y: auto;
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
}

.article-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 2px;
}

.article-divider {
  width: 40px;
  height: 3px;
  margin: 0 auto 24px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.article-card {
  margin: 12px 0;
  padding: 16px 20px;
  text-align: left;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(212, 165, 116, 0.3);
}

.article-card-title {
  font-size: 17px;
  font-weight: 600;
  color: #4a4a4a;
  margin: 0 0 6px;
  letter-spacing: 0.5px;
}

.article-time {
  font-size: 13px;
  color: #a0927e;
}
</style>
