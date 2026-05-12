<script setup>
import { onMounted, ref } from 'vue'

const canSubmit = ref(false)

onMounted(() => {
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  canSubmit.value = userId === '1' || userName === '3388659470@qq.com'
})
</script>

<template>
  <div>
    <div class="head">
      <h3>Conquer_Solitude</h3>
      <ul>
        <li><RouterLink to="/">首页</RouterLink></li>
        <li><RouterLink :to="{ path: '/timeline' }">动态</RouterLink></li>
        <li><RouterLink :to="{ path: '/article' }">文章</RouterLink></li>
        <li><RouterLink :to="{ path: '/hole' }">树洞</RouterLink></li>
        <li><RouterLink :to="{ path: '/message' }">留言</RouterLink></li>
        <li><RouterLink :to="{ path: '/about' }">关于</RouterLink></li>
        <li v-if="canSubmit"><RouterLink :to="{ path: '/submit' }">投稿</RouterLink></li>
      </ul>
    </div>
  </div>
</template>
