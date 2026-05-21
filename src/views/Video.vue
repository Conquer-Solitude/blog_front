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
      <h1 class="video-title">{{ route.query.title }}</h1>
      <video class="video-player" :src="articleVideoBase + (route.query.url ?? '')" controls preload="auto"></video>
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
.video-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
}

.video-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.video-title {
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 16px;
  letter-spacing: 1px;
}

.video-player {
  width: 100%;
  border-radius: 12px;
  background: #000;
  outline: none;
}

.intro-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #5c4b37;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8e0d5;
  letter-spacing: 1px;
}

.intro-text {
  font-size: 15px;
  line-height: 1.8;
  color: #4a4a4a;
  text-indent: 2em;
  margin: 0;
}

.comment-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
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
  gap: 16px;
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
</style>