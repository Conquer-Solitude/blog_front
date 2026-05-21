<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '@/api/http'
import ComponentHeader from '@/components/ComponentHeader.vue'
import FooterBar from '@/components/FooterBar.vue'
import { IMAGE_BASE_URL } from '@/constants'

const router = useRouter()
const totalImages = ref([])
const showRegister = ref(false)
const showLoginModal = ref(false)
const email = ref('')
const password = ref('')
const code = ref('')
const countdown = ref(0)
const backgroundIndex = ref(Math.floor(Math.random() * 32))

let backgroundTimer = null
let countdownTimer = null

const loginLabel = computed(() => {
  const userName = localStorage.getItem('userName')
  return userName == null ? '登录' : `${userName.slice(0, 1)}***`
})

const backgroundStyle = computed(() => ({
  // backgroundImage: `url(${IMAGE_BASE_URL}/${backgroundIndex.value}.gif)`,
  backgroundImage: `url(${IMAGE_BASE_URL}2.png)`,
}))

function rotateBackground() {
  backgroundIndex.value = (backgroundIndex.value + 1) % 33
}

function resetForm() {
  showLoginModal.value = false
  showRegister.value = false
  email.value = ''
  password.value = ''
  code.value = ''
}

async function handleLoginEntry() {
  if (localStorage.getItem('userName') != null) {
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    await router.push({ path: '/' })
    location.reload()
    return
  }

  showLoginModal.value = true
}

async function login() {
  if (!/^[0-9]{9,12}@qq\.com$/.test(email.value)) {
    ElMessage.warning('请输入正确的QQ邮箱')
    email.value = ''
    return
  }

  if (password.value.length < 6 || password.value.length > 20) {
    ElMessage.warning('密码长度在6-20位之间')
    password.value = ''
    return
  }

  try {
    const response = await http.post('/api/login', {
      email: email.value,
      password: password.value,
    })

    ElMessage.success(response.data.msg)
    localStorage.setItem('userId', response.data.data.id)
    localStorage.setItem('userName', response.data.data.email)
    localStorage.setItem('token', response.data.data.jwt)
    location.reload()
  } catch (error) {
    ElMessage.error(error?.response?.data?.data ?? '登录失败')
    console.error(error)
  }
}

async function sendCode() {
  if (!/^[a-zA-Z0-9._%+-]+@qq\.com$/.test(email.value)) {
    ElMessage.warning('请输入正确的QQ邮箱')
    email.value = ''
    return
  }

  try {
    const response = await http.post('/api/send', { email: email.value })
    ElMessage.success(response.data.data)

    countdown.value = 60
    countdownTimer = window.setInterval(() => {
      if (countdown.value > 0) {
        countdown.value -= 1
      } else {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (error) {
    ElMessage.error(error?.response?.data?.data ?? '发送验证码失败，请稍后重试')
    console.error(error)
  }
}

async function register() {
  if (!/^[a-zA-Z0-9._%+-]+@qq\.com$/.test(email.value)) {
    ElMessage.warning('请输入正确的QQ邮箱')
    return
  }

  if (password.value.length < 6 || password.value.length > 20) {
    ElMessage.warning('密码长度在6-20位之间')
    password.value = ''
    return
  }

  if (code.value === '') {
    ElMessage.warning('请输入你的邮箱验证码')
    return
  }

  const response = await http.post('/api/register', {
    email: email.value,
    password: password.value,
    code: code.value,
  })

  ElMessage.success(response.data.data)
  showRegister.value = false
}

function switchToRegister() {
  showRegister.value = true
  password.value = ''
}

function switchToLogin() {
  showRegister.value = false
}
async function getTotalImages() {
  http.get('/api/background').then((response) => {
    totalImages.value = response.data.data
    console.log(totalImages.value)
  })
}

onMounted(() => {
  backgroundTimer = window.setInterval(rotateBackground, 8000)
  getTotalImages()
})

onBeforeUnmount(() => {
  if (backgroundTimer) {
    clearInterval(backgroundTimer)
  }

  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <div>
    <div class="background" :style="backgroundStyle">
      <ComponentHeader />
      <div class="login" @click="handleLoginEntry">{{ loginLabel }}</div>
      <div v-show="showLoginModal" class="login-overlay" @click.self="resetForm">
        <div class="login-container">
          <div class="login-title">
            <h2 class="login-heading">{{ showRegister ? '注册' : '登录' }}</h2>
            <div class="cancel" @click="resetForm">&times;</div>
          </div>
          <div class="login-body">
            <div class="form-field">
              <label class="login-label">邮箱</label>
              <input v-model="email" type="text" class="login-input" placeholder="请输入你的QQ邮箱" />
            </div>
            <button
              v-if="showRegister"
              class="yanzheng"
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown === 0 ? '发送验证码' : countdown + 's' }}
            </button>
            <div v-if="showRegister" class="form-field">
              <label class="login-label">验证码</label>
              <input v-model="code" type="text" class="login-input" placeholder="请输入你的邮箱验证码" />
            </div>
            <div class="form-field">
              <label class="login-label">密码</label>
              <input
                v-model="password"
                type="password"
                class="login-input"
                placeholder="请输入密码（6-20位）"
              />
            </div>
            <button v-if="!showRegister" class="login-btn primary" @click="login">登录</button>
            <button v-else class="login-btn primary" @click="register">注册</button>
            <button v-if="!showRegister" class="login-btn secondary" @click="switchToRegister">
              没有账号？立即注册
            </button>
            <button v-else class="login-btn secondary" @click="switchToLogin">已有账号？去登录</button>
          </div>
        </div>
      </div>
      <div
        class="wave waveTop bgTop"
        style="background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png')"
      ></div>
      <div
        class="wave waveMiddle bgMiddle"
        style="background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png')"
      ></div>
      <div
        class="wave waveBottom bgBottom"
        style="background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png')"
      ></div>
    </div>
    <RouterView />
    <FooterBar />
  </div>
</template>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 420px;
  max-width: 90vw;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 0;
  overflow: hidden;
  animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.login-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.login-heading {
  font-size: 22px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0;
  letter-spacing: 2px;
}

.cancel {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  color: #999;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
}

.cancel:hover {
  background: rgba(0, 0, 0, 0.12);
  color: #4a4a4a;
  transform: rotate(90deg);
}

.login-body {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.login-label {
  font-size: 14px;
  font-weight: 600;
  color: #5c4b37;
  letter-spacing: 0.5px;
}

.login-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 2px solid #e8e0d5;
  border-radius: 12px;
  font-size: 14px;
  color: #4a4a4a;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  margin: 0;
}

.login-input:focus {
  border-color: #d4a574;
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15);
  background: #fff;
}

.login-input::placeholder {
  color: #b8a99a;
}

.yanzheng {
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 2px solid #e8e0d5;
  background: rgba(255, 255, 255, 0.6);
  color: #5c4b37;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.yanzheng:hover:not(:disabled) {
  border-color: #d4a574;
  background: rgba(212, 165, 116, 0.1);
}

.yanzheng:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  margin-top: 4px;
}

.login-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5cb8 100%);
}

.login-btn.primary:active {
  transform: translateY(0);
}

.login-btn.secondary {
  background: transparent;
  color: #8b7355;
  border: 2px solid #e8e0d5;
}

.login-btn.secondary:hover {
  border-color: #d4a574;
  background: rgba(212, 165, 116, 0.08);
  color: #5c4b37;
}
</style>
