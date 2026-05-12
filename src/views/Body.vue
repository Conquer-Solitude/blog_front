<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'

const articleCoverBase = 'https://oss.littlestrange.site/conquer/articlecover/'
const avatarUrl = 'https://oss.littlestrange.site/conquer/image/avatar.jpg'
const router = useRouter()

const quote = ref('')
const latestArticles = ref([])
const articleCount = ref(0)
const currentDate = ref('')
const currentTime = ref('')

let timer = null

async function fetchLatestArticles() {
  const response = await http.get('api/article/latest')
  latestArticles.value = response.data.data ?? []
}

async function fetchArticleCount() {
  const response = await http.get('/api/article/nums')
  articleCount.value = response.data.data ?? 0
}

async function fetchQuote() {
  const response = await fetch('https://yy.kuailemao.xyz/?c=a&c=j&encode=json')
  const data = await response.json()
  quote.value = data.hitokoto ?? ''
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
            <img src="https://oss.littlestrange.site/conquer/image/gitee.jpg" alt="码云" title="gitee" />
          </a>
          <a
            href="https://steamcommunity.com/profiles/76561199528374631/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="https://oss.littlestrange.site/conquer/image/steam.jpg" alt="steam" title="steam" />
          </a>
          <a href="https://github.com/Conquer-Solitude" target="_blank" rel="noreferrer">
            <img src="https://oss.littlestrange.site/conquer/image/github.jpg" alt="github" title="github" />
          </a>
        </div>
      </li>

      <li class="inspirational">
        <span>每日鸡汤</span>
        <img
          src="https://oss.littlestrange.site/conquer/image/huanyihuan.png"
          alt="换一换"
          title="换一换"
          style="cursor: pointer"
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
