<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
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
    alert('亲！请输入评论内容')
    return
  }

  if (userId == null) {
    alert('请先登录')
    commentContent.value = ''
    return
  }

  const response = await http.post('/api/comment/video', {
    content: commentContent.value,
    userId: Number.parseInt(userId, 10),
    articleId: route.query.id,
  })

  alert(response.data.data)
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
  <div class="video-comment">
    <h1>{{ route.query.title }}</h1>
    <hr />
    <video class="video" :src="articleVideoBase + (route.query.url ?? '')" controls preload="auto"></video>
    <hr />
    <h2>简介&gt;&gt;&gt;</h2>
    <hr />
    <div class="intro">{{ route.query.introduce }}</div>
    <hr />

    <div>
      <h2>评论&gt;&gt;&gt;</h2>
      <input
        v-model="commentContent"
        type="text"
        class="user-comment"
        placeholder="亲，请友善评论（*＾3＾）/～☆"
      />
      <button @click="submitComment">提交</button>
    </div>

    <hr />

    <div v-for="comment in comments" :key="comment.id" class="avatar-message">
      <el-avatar class="avatar">{{ `${comment.userName.slice(0, 5)}***` }}</el-avatar>
      <div class="message-content">:{{ comment.content }}</div>
    </div>
  </div>
</template>
