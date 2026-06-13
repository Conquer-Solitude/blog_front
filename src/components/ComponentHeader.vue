<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const canSubmit = ref(false)
const route = useRoute()

const isHome = computed(() => route.path === '/')

onMounted(() => {
  const userId = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  canSubmit.value = userId === '1' || userName === '3388659470@qq.com'
})
</script>

<template>
  <div :class="['header-wrapper', { 'header-over-hero': isHome }]">
    <div class="head">
      <h3>Conquer_Solitude</h3>
      <ul>
        <li><RouterLink to="/" :class="{ active: route.path === '/' }">首页</RouterLink></li>
        <li><RouterLink :to="{ path: '/timeline' }" :class="{ active: route.path === '/timeline' }">动态</RouterLink></li>
        <li><RouterLink :to="{ path: '/article' }" :class="{ active: route.path.startsWith('/article') }">文章</RouterLink></li>
        <li><RouterLink :to="{ path: '/hole' }" :class="{ active: route.path === '/hole' }">树洞</RouterLink></li>
        <li><RouterLink :to="{ path: '/message' }" :class="{ active: route.path === '/message' }">留言</RouterLink></li>
        <li><RouterLink :to="{ path: '/about' }" :class="{ active: route.path === '/about' }">关于</RouterLink></li>
        <li v-if="canSubmit"><RouterLink :to="{ path: '/submit' }" :class="{ active: route.path === '/submit' }">投稿</RouterLink></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 100;
}

.header-over-hero {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.head {
  margin: 16px auto 0;
  max-width: 1240px;
  width: calc(100% - 32px);
  height: 56px;
  background-color: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 100;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  animation: headerSlideIn 0.6s ease both;
}

@keyframes headerSlideIn {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-over-hero .head {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}

.head h3 {
  line-height: 56px;
  padding-left: 24px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #4a4a4a;
  white-space: nowrap;
  transition: color 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.header-over-hero .head h3 {
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.head ul {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.head ul li {
  list-style: none;
  text-align: center;
  font-size: 15px;
  padding: 0;
  position: relative;
}

.head ul li a {
  color: #4a4a4a;
  display: block;
  padding: 8px 18px;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-decoration: none;
}

.header-over-hero .head ul li a {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.head ul li a:hover,
.head ul li a.active {
  color: #667eea;
  background-color: rgba(102, 126, 234, 0.08);
}

.header-over-hero .head ul li a:hover,
.header-over-hero .head ul li a.active {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
}

.head ul li a.active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.header-over-hero .head ul li a.active::after {
  background: rgba(255, 255, 255, 0.8);
}

/* ── Responsive ── */
 @media (max-width: 900px) {
  .head {
    height: auto;
    flex-wrap: wrap;
    padding: 8px 12px;
    gap: 8px;
    border-radius: 12px;
    width: calc(100% - 16px);
    justify-content: flex-start;
  }

  .head h3 {
    line-height: 1.4;
    padding-left: 8px;
    font-size: 16px;
    position: static;
  }

  .head ul {
    flex: 1 1 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2px;
  }

  .head ul li a {
    padding: 6px 12px;
    font-size: 13px;
  }

  .head ul li a.active::after {
    bottom: 2px;
    width: 16px;
    height: 2px;
  }
}

@media (max-width: 600px) {
  .head ul li a {
    padding: 5px 8px;
    font-size: 12px;
  }
}
</style>