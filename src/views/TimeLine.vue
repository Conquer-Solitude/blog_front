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
  position: relative;
}

.timeline-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 15% 20%, rgba(102, 126, 234, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.timeline-heading {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 4px;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.timeline-divider {
  width: 60px;
  height: 4px;
  margin: 0 auto 40px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.timeline-divider::before,
.timeline-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: translateY(-50%);
}

.timeline-divider::before {
  left: -12px;
}

.timeline-divider::after {
  right: -12px;
}

.timeLineContent {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  cursor: pointer;
  animation: fadeSlideIn 0.5s ease both;
}

.timeline-item:nth-child(1) { animation-delay: 0.05s; }
.timeline-item:nth-child(2) { animation-delay: 0.1s; }
.timeline-item:nth-child(3) { animation-delay: 0.15s; }
.timeline-item:nth-child(4) { animation-delay: 0.2s; }
.timeline-item:nth-child(5) { animation-delay: 0.25s; }
.timeline-item:nth-child(6) { animation-delay: 0.3s; }
.timeline-item:nth-child(7) { animation-delay: 0.35s; }
.timeline-item:nth-child(8) { animation-delay: 0.4s; }
.timeline-item:nth-child(9) { animation-delay: 0.45s; }
.timeline-item:nth-child(10) { animation-delay: 0.5s; }

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Timeline dot & connector overrides ── */
.timeline-item :deep(.el-timeline-item__tail) {
  border-left: 2px solid rgba(160, 146, 126, 0.25);
}

.timeline-item :deep(.el-timeline-item__node) {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
}

.timeline-item:hover :deep(.el-timeline-item__node) {
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.25), 0 0 12px rgba(102, 126, 234, 0.3);
}

.timeline-item :deep(.el-timeline-item__timestamp) {
  color: #a0927e;
  font-size: 13px;
  letter-spacing: 0.5px;
  font-weight: 500;
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
  position: relative;
  overflow: hidden;
}

.timeline-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0 2px 2px 0;
}

.timeline-card:hover::before {
  opacity: 1;
}

.timeline-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: rgba(212, 165, 116, 0.15);
}

.timeline-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 12px;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.timeline-card:hover .timeline-card-title {
  color: #5c4b37;
}

.timeline-card-body {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.timeline-img {
  width: 160px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8e0d5;
  position: relative;
}

.timeline-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: 12px;
}

.timeline-card:hover .timeline-img::after {
  opacity: 1;
}

.timeline-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.5s ease;
}

.timeline-card:hover .timeline-img img {
  transform: scale(1.06);
}

.timeline-card-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.7;
  color: #5c4b37;
  text-indent: 2em;
}
</style>
