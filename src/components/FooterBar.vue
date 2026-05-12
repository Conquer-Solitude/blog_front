<template>
  <div>
    <div class="footer">
      <img :src="qqUrl" alt="qq扫一扫" />
      <ul>
        <li><h2>@Conquer_Solitude</h2></li>
        <li>备案号：不告诉你</li>
      </ul>
      <ul>
        <li><h2>联系我：</h2></li>
        <li>3388659470@qq.com</li>
        <li>conquersolitude@gmail.com</li>
        <li>13980534095@163.com</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { IMAGE_BASE_URL } from '@/constants'
const qqUrl = IMAGE_BASE_URL + 'qq.jpg';
console.log(qqUrl)
</script>
