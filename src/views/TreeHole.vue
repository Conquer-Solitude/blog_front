<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import http from '@/api/http'

const content = ref('')
const treeholes = ref([])
const holeRef = ref(null)

let currentIndex = 0
let spawnTimer = null
const moveTimers = new Set()

async function fetchTreeholes() {
  const response = await http.get('api/treehole/all')
  treeholes.value = response.data.data ?? []
}

async function submitTreehole() {
  const userId = localStorage.getItem('userId')

  if (content.value === '') {
    alert('请输入内容')
    return
  }

  if (userId == null) {
    alert('请先登录')
    content.value = ''
    return
  }

  const payload = {
    content: content.value,
    userId: Number.parseInt(userId, 10),
    id: treeholes.value.length + 1,
  }

  treeholes.value.push(payload)
  content.value = ''

  const response = await http.post('api/treehole/add', payload)
  alert(response.data.data)
}

function spawnBubble() {
  if (!treeholes.value.length || !holeRef.value) {
    return
  }

  currentIndex = currentIndex % treeholes.value.length
  const bubble = document.createElement('div')
  bubble.innerHTML = treeholes.value[currentIndex++].content
  bubble.className = 'newDiv'
  bubble.style.top = `${Math.floor(Math.random() * 500)}px`
  bubble.style.right = '0px'
  holeRef.value.appendChild(bubble)

  const moveTimer = window.setInterval(() => {
    const right = Number.parseInt(getComputedStyle(bubble).right, 10) || 0

    if (right > (holeRef.value?.clientWidth ?? 0) + bubble.clientWidth + 20) {
      clearInterval(moveTimer)
      moveTimers.delete(moveTimer)
      bubble.remove()
      return
    }

    bubble.style.right = `${right + 3}px`
  }, 20)

  moveTimers.add(moveTimer)
}

onMounted(async () => {
  await fetchTreeholes()
  spawnTimer = window.setInterval(spawnBubble, 3000)
})

onBeforeUnmount(() => {
  if (spawnTimer) {
    clearInterval(spawnTimer)
  }

  moveTimers.forEach((timer) => clearInterval(timer))
  moveTimers.clear()
})
</script>

<template>
  <div ref="holeRef" class="hole">
    <div class="submit">
      <input
        v-model="content"
        class="input-type"
        type="text"
        placeholder="在这里留下自己的足迹吧（*＾3＾）/～☆"
      />
      <button class="button" @click="submitTreehole">提交</button>
    </div>
  </div>
</template>
