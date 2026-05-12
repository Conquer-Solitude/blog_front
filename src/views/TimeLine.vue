<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/api/http'
import {IMAGE_BASE_URL} from '@/constants'

const router = useRouter()
const articleCoverBase = IMAGE_BASE_URL
const items = ref([])

async function fetchAll() {
  const response = await http.get('api/article/all')
  items.value = response.data.data ?? []
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

onMounted(fetchAll)
</script>

<template>
  <div class="timeline">
    <h2 class="title">时间线</h2>
    <hr />
    <el-timeline style="max-width: 600px" class="timeLineContent">
      <el-timeline-item
        v-for="item in items"
        :key="item.id"
        :timestamp="item.createTime"
        class="timeLineContent"
        @click="openVideo(item)"
      >
        <h2>{{ item.title }}</h2>
        <div class="items">
          <div class="imgs" style="height: 100px">
            <img
              :src="articleCoverBase + item.cover"
              alt="加载中"
              :title="item.title"
              style="cursor: pointer"
            />
          </div>
          <div style="text-indent: 2em">{{ item.introduce }}</div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
