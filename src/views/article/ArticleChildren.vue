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
  const data = response.data.data ?? []
  list.value = data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
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
  padding: 28px 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
}

.article-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.5;
  border-radius: 16px 16px 0 0;
}

.article-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
}

.article-page-title::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.article-divider {
  width: 40px;
  height: 3px;
  margin: 16px auto 24px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.6;
}

.article-card {
  margin: 12px 0;
  padding: 16px 20px 16px 24px;
  text-align: left;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px 0 0 12px;
}

.article-card:hover::before {
  opacity: 1;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(212, 165, 116, 0.2);
  padding-left: 28px;
}

.article-card-title {
  font-size: 17px;
  font-weight: 600;
  color: #4a4a4a;
  margin: 0 0 6px;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.article-card:hover .article-card-title {
  color: #5c4b37;
}

.article-time {
  font-size: 13px;
  color: #a0927e;
  letter-spacing: 0.3px;
  position: relative;
  padding-left: 14px;
}

.article-time::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e8e0d5;
  transition: background 0.3s ease;
}

.article-card:hover .article-time::before {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* ── Custom scrollbar ── */
.article-container::-webkit-scrollbar {
  width: 6px;
}

.article-container::-webkit-scrollbar-track {
  background: transparent;
}

.article-container::-webkit-scrollbar-thumb {
  background: rgba(160, 146, 126, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.article-container::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 146, 126, 0.5);
}
</style>
