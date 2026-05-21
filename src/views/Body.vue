<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IMAGE_BASE_URL } from '@/constants'
import http from '@/api/http'

const articleCoverBase = IMAGE_BASE_URL
const avatarUrl = IMAGE_BASE_URL+'avatar.jpg'
const giteeUrl = IMAGE_BASE_URL+'gitee.png'
const githubUrl = IMAGE_BASE_URL+'github.webp'
const steamUrl = IMAGE_BASE_URL+'steam.png'
const changeUrl= IMAGE_BASE_URL+'change.jpg'
const router = useRouter()

const quote = ref('')
const latestArticles = ref([])
const articleCount = ref(0)
const currentDate = ref('')
const currentTime = ref('')

let timer = null

async function fetchLatestArticles() {
  try {
    const response = await http.get('/api/article/latest')
    latestArticles.value = response.data.data ?? []
  } catch (error) {
    console.error('Failed to fetch latest articles:', error)
    latestArticles.value = []
  }
}

async function fetchArticleCount() {
  try {
    const response = await http.get('/api/article/nums')
    articleCount.value = response.data.data ?? 0
  } catch (error) {
    console.error('Failed to fetch article count:', error)
    articleCount.value = 0
  }
}

async function fetchQuote() {
  try {
    const response = await fetch('https://yy.kuailemao.xyz/?c=a&c=j&encode=json')
    if (!response.ok) {
      console.warn('Quote API unavailable, using fallback')
      quote.value = '保持热爱，奔赴山海'
      return
    }
    const data = await response.json()
    quote.value = data.hitokoto ?? '保持热爱，奔赴山海'
  } catch (error) {
    console.warn('Failed to fetch quote:', error)
    quote.value = '保持热爱，奔赴山海'
  }
}

function updateClock() {
  const now = new Date()
  const year = `${now.getFullYear()}年`
  const month = `${String(now.getMonth() + 1).padStart(2, '0')}月`
  const day = `${String(now.getDate()).padStart(2, '0')}日`
  currentDate.value = `${year}${month}${day}`
  currentTime.value = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join(':')
}

function openVideo(article) {
  router.push({
    path: '/video',
    query: {
      url: article.articleUrl,
      id: article.id,
      title: article.title,
      introduce: article.introduce,
    },
  })
}

function goAbout() {
  router.push({ path: '/about' })
}

onMounted(() => {
  fetchLatestArticles()
  fetchArticleCount()
  fetchQuote()
  updateClock()
  timer = window.setInterval(updateClock, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div class="bodycontent">
    <div class="content">
      <div class="latest">
        <h2 style="font-weight: 800">最新动态&gt;&gt;&gt;</h2>
        <hr style="margin-top: 5px" />
        <div
          v-for="article in latestArticles"
          :key="article.id"
          class="article"
          @click="openVideo(article)"
        >
          <div class="image">
            <img
              :src="articleCoverBase + article.cover"
              style="border-radius: 10px"
              alt="正在加载中"
              :title="article.title"
            />
          </div>
          <div class="contents">
            <h2 style="text-align: center">{{ article.title }}</h2>
            <span style="font-size: small">{{ article.createTime }}</span>
            <hr />
            <p style="text-indent: 2em; font-size: small">{{ article.introduce }}</p>
          </div>
        </div>
      </div>
    </div>

    <ul class="about">
      <li class="self">
        <div class="myAvatar">
          <img :src="avatarUrl" alt="正在加载中" @click="goAbout" />
        </div>
        <div class="name">CoSolitude</div>
        <div class="motto">庸碌者身陷人际关系的囚牢，而清醒者只与自己赛跑</div>
        <div class="introduce">
          <div style="border-right: 1px solid black">
            <p style="margin-bottom: 5px">{{ articleCount }}</p>
            <p>文章数</p>
          </div>
          <div>
            <p style="margin-bottom: 5px">{{ articleCount }}</p>
            <p>评论数</p>
          </div>
        </div>
        <div class="link">
          <a href="https://gitee.com/happy-state" target="_blank" rel="noreferrer">
            <img :src="giteeUrl" alt="码云" title="gitee" />
          </a>
          <a
            href="https://steamcommunity.com/profiles/76561199528374631/"
            target="_blank"
            rel="noreferrer"
          >
            <img :src="steamUrl" alt="steam" title="steam" />
          </a>
          <a href="https://github.com/Conquer-Solitude" target="_blank" rel="noreferrer">
            <img :src="githubUrl" alt="github" title="github" />
          </a>
        </div>
      </li>

      <li class="inspirational">
        <span>每日鸡汤</span>
        <img
          :src="changeUrl"
          alt="换一换"
          title="换一换"
          class="refresh-icon"
          @click="fetchQuote"
        />
        <br />
        <p>{{ quote }}</p>
      </li>

      <li class="time">
        <div class="text">电子时钟</div>
        <div class="date">{{ currentDate }}</div>
        <div class="colock">{{ currentTime }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.bodycontent {
  gap: 20px;
  padding: 0 20px;
}

/* ── Main content area ── */
.content {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.content::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(250, 248, 245, 0.15) 0%, transparent 30%);
  pointer-events: none;
  border-radius: 20px;
}

.latest {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.03);
}

.latest h2 {
  color: #4a4a4a;
  letter-spacing: 1px;
  position: relative;
  display: inline-block;
}

.latest h2::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* ── Article cards ── */
.article {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.article:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: rgba(212, 165, 116, 0.2);
}

.article .image {
  overflow: hidden;
  position: relative;
}

.article .image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article:hover .image::after {
  opacity: 1;
}

.article .image > img {
  transition: transform 0.5s ease;
  object-fit: cover;
}

.article:hover .image > img {
  transform: scale(1.06);
}

.article .contents {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
}

.article .contents h2 {
  color: #4a4a4a;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.article:hover .contents h2 {
  color: #5c4b37;
}

.article .contents span {
  color: #a0927e;
  font-size: 13px;
  letter-spacing: 0.3px;
}

.article .contents p {
  color: #5c4b37;
  line-height: 1.7;
}

/* ── Sidebar ── */
.about {
  gap: 0;
}

.about li {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.about li:hover {
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* ── Profile card ── */
.about .self {
  position: relative;
}

.about .self::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.4));
  pointer-events: none;
  z-index: 1;
}

.about .myAvatar {
  z-index: 2;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 0 3px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.about .myAvatar:hover {
  transform: scale(1.08);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.3),
    0 0 0 4px rgba(255, 255, 255, 0.4);
}

.about .myAvatar img {
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.about .name {
  z-index: 2;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  letter-spacing: 1px;
}

.about .motto {
  z-index: 2;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  font-size: 13px;
  line-height: 1.5;
}

.about .introduce {
  z-index: 2;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.about .introduce div {
  color: rgba(255, 255, 255, 0.9);
}

.about .introduce p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
}

.about .link {
  z-index: 2;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.about .link a {
  transition: all 0.3s ease;
  border-radius: 50%;
  overflow: hidden;
}

.about .link a:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* ── Inspirational / Quote card ── */
.inspirational {
  position: relative;
  background-color: rgba(255, 255, 255, 0.92) !important;
  background-image: none !important;
  padding: 20px 24px 24px 50px !important;
}

.inspirational::before {
  content: '\201C';
  position: absolute;
  top: 8px;
  left: 16px;
  font-size: 48px;
  line-height: 1;
  color: rgba(102, 126, 234, 0.15);
  font-family: Georgia, 'Times New Roman', serif;
  pointer-events: none;
}

.inspirational span {
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
  letter-spacing: 1px;
}

.inspirational .refresh-icon {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.inspirational .refresh-icon:hover {
  opacity: 1;
  transform: rotate(180deg);
}

.inspirational p {
  color: #5c4b37;
  font-size: 16px;
  line-height: 1.8;
  font-style: italic;
  position: relative;
  padding-left: 14px;
  border-left: 2px solid rgba(102, 126, 234, 0.3);
}

/* ── Clock card ── */
.time {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  overflow: hidden;
  position: relative;
}

.time::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.6;
}

.time .text {
  background-image: none !important;
  padding-left: 0 !important;
  text-align: center;
  font-size: 16px !important;
  font-weight: 600;
  color: #4a4a4a;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.time .text::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.time .date {
  text-align: center;
  font-size: 15px !important;
  color: #5c4b37 !important;
  letter-spacing: 1px;
  font-weight: 500;
}

.time .colock {
  text-align: center;
  font-size: 28px !important;
  color: #4a4a4a !important;
  font-family: 'Courier New', 'SF Mono', 'Fira Code', monospace;
  font-weight: 700;
  letter-spacing: 3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
</style>
