<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'

const content = ref('')
const messages = ref([])
const currentUserId = ref(null)

onMounted(() => {
  currentUserId.value = Number(localStorage.getItem('userId')) || null
  fetchMessages()
})

async function fetchMessages() {
  try {
    const response = await http.get('/api/message')
    messages.value = response.data.data ?? []
    console.log('Fetched messages:', messages.value)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    messages.value = []
  }
}

async function submitMessage() {
  if (content.value.trim() === '') {
    ElMessage.warning('请输入留言')
    return
  }

  if (currentUserId.value == null) {
    ElMessage.warning('请先登录')
    content.value = ''
    return
  }

  try {
    const response = await http.post('/api/message/submit', {
      content: content.value,
      userId: currentUserId.value,
    })

    console.log('Submit response:', response.data)
    
    if (response.data.data === true) {
      ElMessage.success('留言成功')
      content.value = ''
      await fetchMessages()
    } else {
      ElMessage.error(response.data.message || '留言失败')
    }
  } catch (error) {
    console.error('Failed to submit message:', error)
    ElMessage.error('提交失败，请检查网络连接')
  }
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

</script>

<template>
  <div class="message-board">
    <!-- 页面标题 -->
    <div class="board-header">
      <h1 class="board-title">留言墙</h1>
      <p class="board-subtitle">留下你的想法，与世界分享</p>
    </div>

    <div class="board-content">
      <!-- 左侧：留言输入区 -->
      <div class="input-section">
        <div class="input-card">
          <div class="tape tape-top"></div>
          <div class="input-header">
            <span class="pin pin-red"></span>
            <h3>写留言</h3>
          </div>
          
          <div class="input-wrapper">
            <textarea
              v-model="content"
              class="message-input-main"
              placeholder="在这里写下你想说的话..."
              maxlength="200"
            ></textarea>
            <div class="input-actions">
              <span class="char-display">{{ content.length }} / 200</span>
              <button 
                @click="submitMessage" 
                type="button"
                class="submit-btn-modern"
              >
                <span class="btn-send-icon">→</span>
                <span class="btn-send-text">go</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 装饰元素 -->
        <div class="decoration-note note-1">
          <span>💡</span>
          <p>每一句留言都是一份心意</p>
        </div>
      </div>

      <!-- 右侧：留言列表 -->
      <div class="messages-section">
        <div class="messages-header">
          <h2>
            <span class="header-icon">💬</span>
            历史留言
            <span class="message-count">({{ messages.length }})</span>
          </h2>
        </div>

        <div class="messages-list">
          <div
            v-for="item in messages"
            :key="item.id"
            class="message-card"
            :class="{ 'message-own': item.userId === currentUserId }"
          >
            <div class="message-pin"></div>
            <div class="message-header">
              <el-avatar 
                :size="40" 
                class="message-avatar"
                :style="{ backgroundColor: stringToColor(item.userName) }"
              >
                {{ item.userName.charAt(0).toUpperCase() }}
              </el-avatar>
              <div class="message-meta">
                <span class="message-author">{{ maskUsername(item.userName) }}</span>
                <span class="message-time">{{ formatDate(item.createTime) }}</span>
              </div>
            </div>
            <div class="message-body">
              <p class="message-text">{{ item.content }}</p>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="messages.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <p>还没有留言，来做第一个留言的人吧！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 将用户名转换为颜色
function stringToColor(str) {
  if (!str) return '#909399'
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#f56c6c', '#e6a23c', '#67c23a', '#409eff', 
    '#909399', '#b37feb', '#ff85c0', '#5cdbd3'
  ]
  return colors[Math.abs(hash) % colors.length]
}

// 遮盖用户名
function maskUsername(username) {
  if (!username || username.length <= 2) return username
  return username.slice(0, 2) + '***'
}

export { stringToColor, maskUsername }
</script>

<style scoped>
/* 整体布局 */
.message-board {
  min-height: calc(100vh - 100px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f0e8 100%);
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

/* 页面头部 */
.board-header {
  text-align: center;
  margin-bottom: 40px;
}

.board-title {
  font-size: 42px;
  font-weight: 700;
  color: #4a4a4a;
  margin-bottom: 10px;
  letter-spacing: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.05);
}

.board-subtitle {
  font-size: 16px;
  color: #8b7355;
  letter-spacing: 2px;
}

/* 主内容区 */
.board-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
  min-height: 600px;
}

/* 左侧输入区 */
.input-section {
  height: fit-content;
}

.input-card {
  background: #fffef8;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  transform: rotate(-1deg);
  transition: transform 0.3s ease;
  border: 3px solid #e74c3c;
  display: flex;
  flex-direction: column;
}

.input-card:hover {
  transform: rotate(0deg);
}

/* 胶带装饰 */
.tape {
  position: absolute;
  width: 100px;
  height: 30px;
  background: rgba(255, 255, 255, 0.6);
  opacity: 0.8;
}

.tape-top {
  top: -15px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  background: linear-gradient(90deg, transparent, rgba(255, 230, 200, 0.8), transparent);
}

/* 图钉 */
.pin {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.pin-red {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
  top: 20px;
  right: 20px;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px dashed #e8e0d5;
}

.input-header h3 {
  font-size: 20px;
  color: #5c4b37;
  margin: 0;
}









/* 新的输入区布局 */
.input-wrapper {
  margin-top: 15px;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e8e0d5;
  overflow: hidden;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #d4a574;
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
}

.message-input-main {
  width: 100%;
  min-height: 120px;
  padding: 20px;
  border: none;
  font-size: 15px;
  line-height: 1.7;
  color: #4a4a4a;
  background: transparent;
  resize: vertical;
  font-family: inherit;
  outline: none;
}

.message-input-main::placeholder {
  color: #b8a99a;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: linear-gradient(90deg, #faf8f5, #f5f0e8);
  border-top: 1px solid #e8e0d5;
}

.char-display {
  font-size: 13px;
  color: #a0927e;
  font-weight: 500;
}

.submit-btn-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5cb8 100%);
}

.submit-btn-modern:active {
  transform: translateY(0);
}

.btn-send-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.submit-btn-modern:hover .btn-send-icon {
  transform: translateX(3px);
}

.btn-send-text {
  letter-spacing: 1px;
}

.btn-icon {
  font-size: 18px;
}

/* 装饰便签 */
.decoration-note {
  margin-top: 25px;
  padding: 20px;
  background: #fff9e6;
  border-radius: 12px;
  border-left: 4px solid #f0c040;
  transform: rotate(2deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.decoration-note span {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.decoration-note p {
  margin: 0;
  font-size: 14px;
  color: #8b7355;
  font-style: italic;
}

/* 右侧留言列表 */
.messages-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.messages-header {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8e0d5;
}

.messages-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  color: #5c4b37;
  margin: 0;
}

.header-icon {
  font-size: 28px;
}

.message-count {
  font-size: 16px;
  color: #a0927e;
  font-weight: normal;
}

/* 留言列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}

.messages-list::-webkit-scrollbar {
  width: 6px;
}

.messages-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-list::-webkit-scrollbar-thumb {
  background: #d4a574;
  border-radius: 3px;
}

/* 留言卡片 */
.message-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  transform: rotate(0.5deg);
}

.message-card:nth-child(even) {
  transform: rotate(-0.5deg);
  background: #fffef8;
}

.message-card:hover {
  transform: rotate(0deg) translateY(-3px);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-own {
  background: linear-gradient(135deg, #fff9f0, #fff5e6);
  border-left: 4px solid #d4a574;
}

/* 留言卡片图钉 */
.message-pin {
  position: absolute;
  top: 10px;
  right: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ffd93d, #f4a000);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.message-card:nth-child(3n+1) .message-pin {
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
}

.message-card:nth-child(3n+2) .message-pin {
  background: radial-gradient(circle at 30% 30%, #4ecdc4, #2a9d8f);
}

/* 留言头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.message-avatar {
  font-weight: 600;
  color: white;
}

.message-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.message-author {
  font-size: 15px;
  font-weight: 600;
  color: #5c4b37;
}

.message-time {
  font-size: 12px;
  color: #a0927e;
}

/* 留言内容 */
.message-body {
  padding-left: 52px;
}

.message-text {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #4a4a4a;
  word-break: break-word;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0927e;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 15px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 响应式 */
@media (max-width: 900px) {
  .board-content {
    grid-template-columns: 1fr;
  }
  
  .input-section {
    position: static;
  }
  
  .board-title {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .board-subtitle {
    font-size: 14px;
  }

  .message-board {
    padding: 24px 12px;
  }

  .messages-section {
    padding: 20px;
  }

  .input-card {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .board-title {
    font-size: 26px;
    letter-spacing: 2px;
  }

  .submit-btn-modern {
    padding: 8px 16px;
  }

  .message-card {
    padding: 14px;
  }
}
</style>
