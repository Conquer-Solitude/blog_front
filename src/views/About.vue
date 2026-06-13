<script setup>
import {IMAGE_BASE_URL} from '@/constants'
const avatarUrl = IMAGE_BASE_URL + 'avatar.jpg'
const nameUrl = IMAGE_BASE_URL + 'name.png'
const bilibiliUrl = IMAGE_BASE_URL + 'bilibili.png'
const githubUrl = IMAGE_BASE_URL + 'github.webp'
const giteeUrl = IMAGE_BASE_URL+ 'gitee.png'

function openBili() {
  window.open('https://space.bilibili.com/2012700921')
}

function openGitee() {
  window.open('https://gitee.com/happy-state')
}

function openGithub() {
  window.open('https://github.com/Conquer-Solitude')
}
</script>

<template>
  <div class="about-container">
    <div class="about-left">
      <ul class="ul">
        <li class="about-avatar-image">
          <img class="about-avatar" :src="avatarUrl" alt="正在加载中" />
        </li>
        <li class="about-name">
          <img :src="nameUrl" alt="正在加载中" />
        </li>
      </ul>
    </div>

    <div class="about-right">
      <ul class="ul">
        <li class="about-introduce">
          <h2 class="about-title">一名中二的后端开发工程师</h2>
          <p class="about-introduce-content">
            大家好我是 CoSolitude，一名后端程序员。
            平日里热爱钻研算法、持续学习各类新技术，也喜欢用文字记录生活点滴。
            业余时间喜欢玩 CS，闲暇之余习惯听歌放松，在代码、爱好与日常里慢慢成长，温柔且自律
          </p>
        </li>
        <li class="about-link">
          <label class="about-navigation">—— 我的个人导航 ——</label>
        </li>
        <li class="about-self-link">
          <div class="social-link" @click="openBili"><img :src="bilibiliUrl" alt="Bilibili" /></div>
          <div class="social-link" @click="openGitee"><img :src="giteeUrl" alt="Gitee" /></div>
          <div class="social-link" @click="openGithub"><img :src="githubUrl" alt="GitHub" /></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  margin: 0 auto;
  max-width: 1240px;
  min-height: calc(100vh - 100px);
  padding: 40px 20px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 40px;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
  border-radius: 0;
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

.about-left,
.about-right {
  width: 50%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-left {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.about-right {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 40px 30px;
}

.ul {
  list-style: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.about-avatar {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  display: block;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  object-fit: cover;
}

.about-avatar:hover {
  transform: scale(1.03);
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.1);
}

.about-avatar-image {
  text-align: center;
}

.about-name {
  width: 280px;
  margin: 0 auto;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,245,0.9));
  border-radius: 50px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  text-align: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.about-name:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.about-name img {
  width: 100%;
  height: 50px;
  object-fit: cover;
  display: block;
  border-radius: 25px;
}

.about-introduce {
  width: 100%;
}

.about-title {
  text-align: center;
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  letter-spacing: 2px;
}

.about-introduce-content {
  text-indent: 2em;
  margin: 0 0 30px;
  text-align: left;
  line-height: 2;
  font-size: 16px;
  color: #5c4b37;
}

.about-link {
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
}

.about-navigation {
  font-size: 16px;
  color: #8b7355;
  letter-spacing: 4px;
  font-weight: 500;
}

.about-self-link {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-link {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.social-link:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.social-link img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .about-container {
    flex-direction: column;
    gap: 24px;
  }
  .about-left,
  .about-right {
    width: 100%;
  }

  .about-avatar {
    width: 180px;
    height: 180px;
  }

  .about-name {
    width: 220px;
  }
}

@media (max-width: 600px) {
  .about-container {
    padding: 24px 12px;
  }

  .about-right {
    padding: 24px 16px;
  }

  .about-title {
    font-size: 20px;
    letter-spacing: 1px;
  }

  .about-introduce-content {
    font-size: 14px;
  }

  .social-link {
    width: 48px;
    height: 48px;
  }
}
</style>
