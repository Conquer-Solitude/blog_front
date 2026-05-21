<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import {IMAGE_BASE_URL} from '@/constants'

const router = useRouter()
const articleCoverBase = IMAGE_BASE_URL
const items = ref([])

async function fetchAll() {
  const response = await http.get('api/article/all')
  items.value = response.data.data ?? []
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

onMounted(fetchAll)
</script>

<template>
  <div class="timeline-page">
    <h2 class="timeline-heading">时间线</h2>
    <div class="timeline-divider"></div>
    <el-timeline style="max-width: 600px" class="timeLineContent">
      <el-timeline-item
        v-for="item in items"
        :key="item.id"
        :timestamp="item.createTime"
        class="timeline-item"
        @click="openVideo(item)"
      >
        <div class="timeline-card">
          <h3 class="timeline-card-title">{{ item.title }}</h3>
          <div class="timeline-card-body">
            <div class="timeline-img">
              <img
                :src="articleCoverBase + item.cover"
                alt="加载中"
                :title="item.title"
              />
            </div>
            <div class="timeline-card-text">{{ item.introduce }}</div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.timeline-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
}

.timeline-heading {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 4px;
}

.timeline-divider {
  width: 60px;
  height: 4px;
  margin: 0 auto 40px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.timeLineContent {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  cursor: pointer;
}

.timeline-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

.timeline-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 0.5px;
}

.timeline-card-body {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.timeline-img {
  width: 160px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8e0d5;
}

.timeline-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.4s ease;
}

.timeline-card:hover .timeline-img img {
  transform: scale(1.05);
}

.timeline-card-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.7;
  color: #5c4b37;
  text-indent: 2em;
}
</style>
