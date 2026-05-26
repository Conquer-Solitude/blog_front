<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '@/api/http'
import {VIDEO_BASE_URL} from '@/constants'

const route = useRoute()
const articleVideoBase = VIDEO_BASE_URL
const commentContent = ref('')
const comments = ref([])
const videoReady = ref(false)

function onVideoLoaded() {
  videoReady.value = true
}

function onVideoWaiting() {
  videoReady.value = false
}

function onVideoCanPlay() {
  videoReady.value = true
}

async function fetchComments() {
  if (!route.query.id) {
    comments.value = []
    return
  }

  const response = await http.get(`/api/comment/${route.query.id}`)
  comments.value = response.data.data ?? []
}

async function submitComment() {
  const userId = localStorage.getItem('userId')

  if (commentContent.value === '') {
    ElMessage.warning('亲！请输入评论内容')
    return
  }

  if (userId == null) {
    ElMessage.warning('请先登录')
    commentContent.value = ''
    return
  }

  const response = await http.post('/api/comment/video', {
    content: commentContent.value,
    userId: Number.parseInt(userId, 10),
    articleId: route.query.id,
  })

  ElMessage.success(response.data.data)
  comments.value.push({
    content: commentContent.value,
    userName: localStorage.getItem('userName') ?? '匿名用户',
    id: Date.now(),
  })
  commentContent.value = ''
}

onMounted(fetchComments)
</script>

<template>
  <div class="video-page">
    <div class="video-card">
      <div class="video-title-bar">
        <span class="title-accent"></span>
        <h1 class="video-title">{{ route.query.title }}</h1>
      </div>
      <div class="video-player-wrapper">
        <div class="video-player-frame">
          <div class="video-player-inner">
            <video
              class="video-player"
              :src="articleVideoBase + (route.query.url ?? '')"
              controls
              preload="auto"
              @loadeddata="onVideoLoaded"
              @waiting="onVideoWaiting"
              @canplay="onVideoCanPlay"
            ></video>
            <div v-if="!videoReady" class="video-loading-overlay">
              <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
              </div>
              <span class="loading-text">正在加载视频…</span>
            </div>
          </div>
          <div class="video-player-glow"></div>
        </div>
      </div>
    </div>

    <div class="intro-card">
      <h2 class="section-title">简介</h2>
      <p class="intro-text">{{ route.query.introduce }}</p>
    </div>

    <div class="comment-section">
      <h2 class="section-title">评论</h2>
      <div class="comment-input-row">
        <input
          v-model="commentContent"
          type="text"
          class="comment-input"
          placeholder="亲，请友善评论（*＾3＾）/～☆"
        />
        <button class="comment-submit-btn" @click="submitComment">提交</button>
      </div>

      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <el-avatar class="comment-avatar" :size="36">
            {{ `${comment.userName.slice(0, 5)}***` }}
          </el-avatar>
          <div class="comment-body">
            <span class="comment-user">{{ comment.userName }}</span>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ── */
.video-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px;
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
}

/* ── Video Card ── */
.video-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.07),
    0 2px 8px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.4s ease;
}

.video-card:hover {
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.06);
}

/* ── Title Bar ── */
.video-title-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title-accent {
  width: 4px;
  height: 24px;
  border-radius: 2px;
  background: linear-gradient(180deg, #d4a574, #c4956a);
  flex-shrink: 0;
}

.video-title {
  font-size: 22px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* ── Video Player Wrapper (cinematic frame) ── */
.video-player-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.video-player-frame {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #0a0a0a;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.25),
    0 24px 48px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.5s ease;
}

.video-player-frame:hover {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 12px 32px rgba(0, 0, 0, 0.3),
    0 32px 64px rgba(0, 0, 0, 0.2);
}

.video-player-inner {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
}

.video-player {
  width: 100%;
  display: block;
  border-radius: 14px;
  background: #0a0a0a;
  outline: none;
}

/* ── Ambient glow beneath the player ── */
.video-player-glow {
  position: absolute;
  bottom: -8px;
  left: 10%;
  right: 10%;
  height: 24px;
  background: radial-gradient(ellipse at center, rgba(212, 165, 116, 0.12) 0%, transparent 70%);
  filter: blur(8px);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.video-player-frame:hover + .video-player-glow,
.video-player-frame:hover ~ .video-player-glow {
  opacity: 1;
}

/* ── Loading Overlay ── */
.video-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #111 0%, #1a1a1a 50%, #111 100%);
  border-radius: 14px;
  z-index: 2;
  gap: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-spinner {
  position: relative;
  width: 48px;
  height: 48px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spinRing 1.4s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #d4a574;
  animation-delay: -0.15s;
}

.spinner-ring:nth-child(2) {
  inset: 6px;
  border-top-color: rgba(212, 165, 116, 0.6);
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  inset: 12px;
  border-top-color: rgba(212, 165, 116, 0.3);
  animation-delay: -0.45s;
}

@keyframes spinRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 13px;
  color: rgba(212, 165, 116, 0.7);
  letter-spacing: 2px;
  font-weight: 500;
}

/* ── Intro Card ── */
.intro-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px 28px;
  margin-bottom: 24px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.intro-card:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #5c4b37;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8e0d5;
  letter-spacing: 1px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 32px;
  height: 2px;
  background: linear-gradient(135deg, #d4a574, #c4956a);
  border-radius: 1px;
}

.intro-text {
  font-size: 15px;
  line-height: 1.8;
  color: #4a4a4a;
  text-indent: 2em;
  margin: 0;
}

/* ── Comment Section ── */
.comment-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
}

.comment-section:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.comment-input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  border: 2px solid #e8e0d5;
  border-radius: 12px;
  font-size: 14px;
  color: #4a4a4a;
  background: #fff;
  outline: none;
  transition: all 0.3s ease;
}

.comment-input:focus {
  border-color: #d4a574;
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15);
}

.comment-input::placeholder {
  color: #b8a99a;
}

.comment-submit-btn {
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.comment-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5cb8 100%);
}

.comment-submit-btn:active {
  transform: translateY(0);
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #faf8f5;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.comment-item:hover {
  background: #fff;
  border-color: #e8e0d5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transform: translateX(4px);
}

.comment-avatar {
  flex-shrink: 0;
  font-size: 12px !important;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-user {
  font-size: 14px;
  font-weight: 600;
  color: #5c4b37;
  display: block;
  margin-bottom: 4px;
}

.comment-text {
  font-size: 15px;
  color: #4a4a4a;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .video-page {
    padding: 16px 12px;
  }

  .video-card {
    padding: 16px;
    border-radius: 16px;
  }

  .video-title {
    font-size: 18px;
  }

  .video-player-frame {
    border-radius: 10px;
  }

  .video-player-inner {
    border-radius: 10px;
  }

  .video-player {
    border-radius: 10px;
  }

  .video-loading-overlay {
    border-radius: 10px;
  }

  .intro-card,
  .comment-section {
    padding: 16px;
    border-radius: 16px;
  }

  .comment-input-row {
    flex-direction: column;
  }

  .comment-submit-btn {
    width: 100%;
  }
}
</style>