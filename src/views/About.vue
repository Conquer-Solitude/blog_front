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
          <label class="about-navigation">---------我的个人导航---------</label>
        </li>
        <li class="about-self-link">
          <div @click="openBili"><img :src="bilibiliUrl" alt="正在加载中" /></div>
          <div @click="openGitee"><img :src="giteeUrl" alt="正在加载中" /></div>
          <div @click="openGithub"><img :src="githubUrl" alt="正在加载中" /></div>
        </li>
      </ul>
    </div>
  </div>
</template>
