<script setup>
import { onMounted, ref } from 'vue'
import http from '@/api/http'

const content = ref('')
const messages = ref([])

async function fetchMessages() {
  const response = await http.get('api/message')
  messages.value = response.data.data ?? []
}

async function submitMessage() {
  const userId = localStorage.getItem('userId')

  if (content.value === '') {
    alert('请输入留言')
    return
  }

  if (userId == null) {
    alert('请先登录')
    content.value = ''
    return
  }

  const response = await http.post('/api/message/submit', {
    content: content.value,
    userId: Number.parseInt(userId, 10),
  })

  if (response.data.data === true) {
    alert('留言成功')
  }

  location.reload()
}

onMounted(fetchMessages)
</script>

<template>
  <div>
    <div class="liuyan">
      <textarea
        v-model="content"
        placeholder="请输入你的留言（*＾3＾）/～☆"
        class="message"
      ></textarea>
      <button class="submit-message" @click="submitMessage">提交</button>
    </div>

    <div class="history">
      <h1>历史留言</h1>
      <hr />
      <div v-for="item in messages" :key="item.id" class="avatar-message">
        <el-avatar class="avatar">{{ `${item.userName.slice(0, 5)}***` }}</el-avatar>
        <div class="message-content">:{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>
