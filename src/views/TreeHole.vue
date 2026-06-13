<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'

const content = ref('')
const treeholes = ref([])
const holeRef = ref(null)
const containerWidth = ref(0)

// 弹幕轨道系统 - 5条轨道
const TRACK_COUNT = 5
const TRACK_HEIGHT = 100
const trackStatus = ref(Array(TRACK_COUNT).fill(false))

// 当前显示的弹幕
const activeDanmaku = ref([])
let danmakuIdCounter = 0
let spawnTimer = null

// 弹幕颜色方案 - 柔和的玻璃拟态色调
const colorSchemes = [
  { bg: 'rgba(255, 182, 193, 0.85)', border: 'rgba(255, 182, 193, 0.5)', shadow: 'rgba(255, 182, 193, 0.3)' },
  { bg: 'rgba(135, 206, 250, 0.85)', border: 'rgba(135, 206, 250, 0.5)', shadow: 'rgba(135, 206, 250, 0.3)' },
  { bg: 'rgba(152, 251, 152, 0.85)', border: 'rgba(152, 251, 152, 0.5)', shadow: 'rgba(152, 251, 152, 0.3)' },
  { bg: 'rgba(221, 160, 221, 0.85)', border: 'rgba(221, 160, 221, 0.5)', shadow: 'rgba(221, 160, 221, 0.3)' },
  { bg: 'rgba(255, 218, 185, 0.85)', border: 'rgba(255, 218, 185, 0.5)', shadow: 'rgba(255, 218, 185, 0.3)' },
  { bg: 'rgba(176, 224, 230, 0.85)', border: 'rgba(176, 224, 230, 0.5)', shadow: 'rgba(176, 224, 230, 0.3)' },
  { bg: 'rgba(255, 255, 224, 0.85)', border: 'rgba(255, 255, 224, 0.5)', shadow: 'rgba(255, 255, 224, 0.3)' },
  { bg: 'rgba(230, 230, 250, 0.85)', border: 'rgba(230, 230, 250, 0.5)', shadow: 'rgba(230, 230, 250, 0.3)' },
]

async function fetchTreeholes() {
  try {
    const response = await http.get('/api/treehole/all')
    treeholes.value = response.data.data ?? []
  } catch (error) {
    console.error('Failed to fetch treeholes:', error)
  }
}

async function submitTreehole() {
  const userId = localStorage.getItem('userId')

  if (content.value === '') {
    ElMessage.warning('请输入内容')
    return
  }

  if (userId == null) {
    ElMessage.warning('请先登录')
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

  try {
    const response = await http.post('/api/treehole/add', payload)
    ElMessage.success(response.data.data)
  } catch (error) {
    console.error('Failed to submit treehole:', error)
    ElMessage.error('提交失败，请重试')
  }
}

// 获取可用轨道
function getAvailableTrack() {
  const availableTracks = []
  for (let i = 0; i < TRACK_COUNT; i++) {
    if (!trackStatus.value[i]) {
      availableTracks.push(i)
    }
  }
  
  if (availableTracks.length === 0) {
    return Math.floor(Math.random() * TRACK_COUNT)
  }
  
  return availableTracks[Math.floor(Math.random() * availableTracks.length)]
}

// 创建新弹幕
function createDanmaku() {
  if (!treeholes.value.length || !containerWidth.value) {
    return
  }

  const trackIndex = getAvailableTrack()
  trackStatus.value[trackIndex] = true

  const content = treeholes.value[Math.floor(Math.random() * treeholes.value.length)].content
  const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
  const id = danmakuIdCounter++
  
  const danmaku = {
    id,
    content,
    trackIndex,
    top: trackIndex * TRACK_HEIGHT + 20,
    colorScheme,
    duration: 12 + Math.random() * 6, // 12-18秒随机速度
  }

  activeDanmaku.value.push(danmaku)

  // 动画结束后清理
  setTimeout(() => {
    trackStatus.value[trackIndex] = false
    const index = activeDanmaku.value.findIndex(d => d.id === id)
    if (index > -1) {
      activeDanmaku.value.splice(index, 1)
    }
  }, danmaku.duration * 1000)
}

// 处理窗口大小变化
function handleResize() {
  if (holeRef.value) {
    containerWidth.value = holeRef.value.clientWidth
  }
}

onMounted(async () => {
  await fetchTreeholes()
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // 启动弹幕生成器
  spawnTimer = window.setInterval(createDanmaku, 2500)
  
  // 立即生成第一条
  createDanmaku()
})

onBeforeUnmount(() => {
  if (spawnTimer) {
    clearInterval(spawnTimer)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="treehole-page">
    <div class="treehole-header">
      <h2 class="treehole-heading">树洞</h2>
      <p class="treehole-subtitle">匿名倾诉，自由飞翔</p>
      <div class="treehole-divider"></div>
    </div>
    <div ref="holeRef" class="hole">
      <!-- 弹幕层 -->
      <div class="danmaku-layer">
        <transition-group name="danmaku">
          <div
            v-for="item in activeDanmaku"
            :key="item.id"
            class="danmaku-item"
            :style="{
              top: `${item.top}px`,
              '--duration': `${item.duration}s`,
              '--bg-color': item.colorScheme.bg,
              '--border-color': item.colorScheme.border,
              '--shadow-color': item.colorScheme.shadow,
            }"
          >
            <span class="danmaku-text">{{ item.content }}</span>
          </div>
        </transition-group>
      </div>

      <!-- 输入层 -->
      <div class="submit">
        <input
          v-model="content"
          class="input-type"
          type="text"
          placeholder="在这里留下自己的足迹吧（*＾3＾）/～☆"
          maxlength="50"
        />
        <button class="button" @click="submitTreehole">提交</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.treehole-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.treehole-header {
  text-align: center;
  margin-bottom: 32px;
}

.treehole-heading {
  font-size: 32px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 8px;
  letter-spacing: 4px;
}

.treehole-subtitle {
  font-size: 15px;
  color: #8b7355;
  margin: 0 0 16px;
  letter-spacing: 2px;
}

.treehole-divider {
  width: 60px;
  height: 4px;
  margin: 0 auto;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hole {
  position: relative;
  width: 100%;
  height: 700px;
  border-radius: 10px;
  background-image:
    /* linear-gradient(135deg, rgba(44, 62, 80, 0.7), rgba(52, 73, 94, 0.8)), */
    url(https://pub-41822fd5bdc845a69bd37104e547c5ce.r2.dev/image/1.png);
  background-size: cover;
  background-position: center;
  background-color: #2c3e50;
  overflow: hidden;
}

.danmaku-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.danmaku-item {
  position: absolute;
  left: 100%;
  padding: 10px 20px;
  border-radius: 25px;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  box-shadow:
    0 4px 15px var(--shadow-color),
    0 0 30px rgba(255, 255, 255, 0.1) inset;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: slideLeft var(--duration) linear forwards;
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: auto;
  cursor: default;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.danmaku-item:hover {
  transform: scale(1.05);
  box-shadow: 
    0 6px 25px var(--shadow-color),
    0 0 40px rgba(255, 255, 255, 0.2) inset;
  z-index: 10;
}

.danmaku-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

@keyframes slideLeft {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(calc(-100vw - 150%));
    opacity: 0;
  }
}

/* 进入和退出的过渡效果 */
.danmaku-enter-active,
.danmaku-leave-active {
  transition: opacity 0.3s ease;
}

.danmaku-enter-from,
.danmaku-leave-to {
  opacity: 0;
}

.submit {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.input-type {
  width: 350px;
  height: 45px;
  border-radius: 22px;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(200, 200, 200, 0.5);
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.input-type:focus {
  border-color: #7cc01c;
  box-shadow: 0 0 15px rgba(124, 192, 28, 0.3);
  background-color: #fff;
}

.input-type::placeholder {
  color: #999;
  font-size: 14px;
}

.button {
  width: 80px;
  height: 45px;
  border-radius: 22px;
  background: linear-gradient(135deg, #7cc01c, #6ab015);
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(124, 192, 28, 0.3);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 192, 28, 0.4);
  background: linear-gradient(135deg, #8cd02c, #7cc01c);
}

.button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .treehole-page {
    padding: 24px 12px;
  }

  .treehole-heading {
    font-size: 24px;
    letter-spacing: 2px;
  }

  .treehole-subtitle {
    font-size: 13px;
  }

  .hole {
    height: 500px;
    border-radius: 12px;
  }

  .submit {
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 20px;
    width: calc(100% - 32px);
  }

  .input-type {
    width: 100%;
    height: 40px;
    font-size: 14px;
  }

  .button {
    width: 100%;
    height: 40px;
  }
}
</style>
