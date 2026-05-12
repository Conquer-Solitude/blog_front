<script setup>
import { computed, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import http from '@/api/http'

const title = ref('')
const introduce = ref('')
const type = ref(1)
const articleUrl = ref('')
const coverId = ref(-1)
const uploadRef = ref(null)

const headers = computed(() => ({
  Authorization: localStorage.getItem('token') || null,
}))

function submitCover() {
  uploadRef.value?.submit()
}

async function submitArticle() {
  if (title.value === '' || introduce.value === '') {
    alert('请填写完整信息')
    return
  }

  if (coverId.value === -1) {
    alert('请先上传视频封面')
    return
  }

  if (articleUrl.value === '') {
    alert('请先上传视频')
    return
  }

  const payload = {
    id: coverId.value,
    title: title.value,
    introduce: introduce.value,
    type: type.value,
    articleUrl: articleUrl.value,
  }

  const response = await http.post('api/file/submit', payload, { headers: headers.value })
  alert(response.data.msg)
  location.reload()
}

function handleCoverSuccess(response) {
  if (typeof response.data !== 'number') {
    alert(response.data)
    return
  }

  coverId.value = response.data
  alert('封面上传成功')
}

function handleVideoSuccess(response) {
  articleUrl.value = response.data
  alert(response.data)
}
</script>

<template>
  <div class="submit-container">
    <label>标题：</label>
    <input v-model="title" type="text" placeholder="请输入标题" />
    <br />
    <br />
    <br />

    <label>内容简介：</label>
    <textarea
      v-model="introduce"
      class="submit-content"
      cols="30"
      rows="10"
      placeholder="请输入内容简介"
    ></textarea>
    <br />
    <br />
    <br />

    <label>类型选择：</label>
    <input v-model="type" type="radio" name="type" :value="1" checked />
    <label>生活</label>
    <input v-model="type" type="radio" name="type" :value="2" />
    <label>数据结构</label>
    <input v-model="type" type="radio" name="type" :value="3" />
    <label>技术</label>
    <br />
    <br />
    <br />

    <label>上传视频封面：</label>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      action="/api/file/upload"
      :auto-upload="false"
      :limit="1"
      accept=".jpg,.png"
      method="POST"
      :headers="headers"
      @success="handleCoverSuccess"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="submitCover">上传文件</el-button>
    </el-upload>

    <br />
    <br />
    <br />

    <label>上传视频：</label>
    <el-upload
      class="upload-demo"
      drag
      action="/api/file/video"
      multiple
      :limit="1"
      accept=".mp4,.mp3"
      method="POST"
      :headers="headers"
      @success="handleVideoSuccess"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">将视频拖拽至此,或者 <em>点击此处上传文件</em></div>
    </el-upload>

    <div class="submit-btn" @click="submitArticle">提交</div>
  </div>
</template>
