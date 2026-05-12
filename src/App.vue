<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import ComponentHeader from '@/components/ComponentHeader.vue'
import FooterBar from '@/components/FooterBar.vue'
import { IMAGE_BASE_URL } from '@/constants'

const router = useRouter()

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
    alert('请输入正确的QQ邮箱')
    email.value = ''
    return
  }

  if (password.value.length < 6 || password.value.length > 20) {
    alert('密码长度在6-20位之间')
    password.value = ''
    return
  }

  try {
    const response = await http.post('/api/login', {
      email: email.value,
      password: password.value,
    })

    alert(response.data.msg)
    localStorage.setItem('userId', response.data.data.id)
    localStorage.setItem('userName', response.data.data.email)
    localStorage.setItem('token', response.data.data.jwt)
    location.reload()
  } catch (error) {
    alert(error?.response?.data?.data ?? '登录失败')
    console.error(error)
  }
}

async function sendCode() {
  if (!/^[a-zA-Z0-9._%+-]+@qq\.com$/.test(email.value)) {
    alert('请输入正确的QQ邮箱')
    email.value = ''
    return
  }

  await http.post('/api/send', { email: email.value })

  countdown.value = 60
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

async function register() {
  if (!/^[a-zA-Z0-9._%+-]+@qq\.com$/.test(email.value)) {
    alert('请输入正确的QQ邮箱')
    return
  }

  if (password.value.length < 6 || password.value.length > 20) {
    alert('密码长度在6-20位之间')
    password.value = ''
    return
  }

  if (code.value === '') {
    alert('请输入你的邮箱验证码')
    return
  }

  const response = await http.post('/api/register', {
    email: email.value,
    password: password.value,
    code: code.value,
  })

  alert(response.data.data)
  showRegister.value = false
}

function switchToRegister() {
  showRegister.value = true
  password.value = ''
}

function switchToLogin() {
  showRegister.value = false
}

onMounted(() => {
  backgroundTimer = window.setInterval(rotateBackground, 8000)
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
      <div v-show="showLoginModal" class="login-container">
        <div class="login-title">
          <h2 class="h2">登录</h2>
          <div class="cancel" @click="resetForm">X</div>
        </div>
        <hr />
        <label>邮箱</label>
        <input v-model="email" type="text" placeholder="请输入你的qq邮箱" />
        <button
          v-if="showRegister"
          id="send"
          class="yanzheng"
          :disabled="countdown > 0"
          :style="{ cursor: countdown > 0 ? 'not-allowed' : 'pointer' }"
          @click="sendCode"
        >
          {{ countdown === 0 ? '发送验证码' : countdown }}
        </button>
        <br />
        <div v-if="showRegister">
          <label>验证码</label>
          <input v-model="code" type="text" placeholder="请输入你的邮箱验证码" />
        </div>
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="请输入你的密码(长度大于6位，小于20位)"
        />
        <br />
        <button v-if="!showRegister" class="login-btn" @click="login">登录</button>
        <button v-else class="login-btn" @click="register">注册</button>
        <br />
        <button v-if="!showRegister" class="login-btn" @click="switchToRegister">
          没有账号？立即注册
        </button>
        <button v-else class="login-btn" @click="switchToLogin">已有账号？去登录</button>
        <br />
        <br />
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
