<script setup>
const avatarUrl = 'https://oss.littlestrange.site/conquer/image/avatar.jpg'
const nameUrl = 'https://oss.littlestrange.site/conquer/image/name.png'
const biliUrl = 'https://oss.littlestrange.site/conquer/image/bilibili.png'
const githubUrl = 'https://oss.littlestrange.site/conquer/image/github.jpg'
const giteeUrl = 'https://oss.littlestrange.site/conquer/image/gitee.jpg'

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
          <h2 class="about-title">一名中二Web后端开发工程师</h2>
          <p class="about-introduce-content">
            千年以前，看见元婴强者自己的小世界，非常羡慕，于是心中立誓，我也要变强，后抛弃世间情爱，终踏上修仙一途，
            虽一介散修，但亦往，经历千磨万难，炼气百年，四百年筑基，一千年结丹，两千年突破元婴，又一千年后遭遇瓶颈，
            决心闭死关，四千年后的今日，终于突破化神，感叹回首沧桑，道不尽仙凡殊途，尽人间。
          </p>
        </li>
        <li class="about-link">
          <label class="about-navigation">---------我的个人导航---------</label>
        </li>
        <li class="about-self-link">
          <div @click="openBili"><img :src="biliUrl" alt="正在加载中" /></div>
          <div @click="openGitee"><img :src="giteeUrl" alt="正在加载中" /></div>
          <div @click="openGithub"><img :src="githubUrl" alt="正在加载中" /></div>
        </li>
      </ul>
    </div>
  </div>
</template>
