<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/api/http'

const title = ref('')
const introduce = ref('')
const type = ref(1)
const articleUrl = ref('')
const coverId = ref(-1)
const uploadRef = ref(null)
const bgUploadRef = ref(null)

const headers = computed(() => ({
  Authorization: localStorage.getItem('token') || null,
}))

function submitCover() {
  uploadRef.value?.submit()
}

async function submitArticle() {
  if (title.value === '' || introduce.value === '') {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (coverId.value === -1) {
    ElMessage.warning('请先上传视频封面')
    return
  }

  if (articleUrl.value === '') {
    ElMessage.warning('请先上传视频')
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
  ElMessage.success(response.data.msg)
  location.reload()
}

function handleCoverSuccess(response) {
  if (typeof response.data !== 'number') {
    ElMessage.error(response.data)
    return
  }

  coverId.value = response.data
  ElMessage.success('封面上传成功')
}

function handleVideoSuccess(response) {
  articleUrl.value = response.data
  ElMessage.success(response.data)
}

function handleBgSuccess(response) {
  ElMessage.success(response.data || '背景图片上传成功')
}

function submitBg() {
  bgUploadRef.value?.submit()
}
</script>

<template>
  <div class="submit-container">
    <div class="submit-card">
      <div class="submit-header">
        <h2 class="submit-heading">发布内容</h2>
        <p class="submit-subtitle">填写信息并上传资源</p>
        <div class="submit-divider"></div>
      </div>

      <div class="form-group">
        <label class="form-label">标题</label>
        <input v-model="title" type="text" class="form-input" placeholder="请输入标题" />
      </div>

      <div class="form-group">
        <label class="form-label">内容简介</label>
        <textarea
          v-model="introduce"
          class="form-textarea"
          cols="30"
          rows="6"
          placeholder="请输入内容简介"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">类型选择</label>
        <div class="radio-group">
          <label class="radio-item">
            <input v-model="type" type="radio" name="type" :value="1" checked />
            <span class="radio-label">生活</span>
          </label>
          <label class="radio-item">
            <input v-model="type" type="radio" name="type" :value="2" />
            <span class="radio-label">数据结构</span>
          </label>
          <label class="radio-item">
            <input v-model="type" type="radio" name="type" :value="3" />
            <span class="radio-label">技术</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">上传视频封面</label>
        <div class="upload-wrapper">
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
              <div class="upload-trigger">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span class="upload-text">选择封面图片</span>
                <span class="upload-hint">支持 JPG、PNG 格式</span>
              </div>
            </template>
            <el-button class="ml-3 upload-action-btn" type="success" @click="submitCover">上传文件</el-button>
          </el-upload>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">上传视频</label>
        <div class="upload-wrapper">
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
            <div class="drag-upload-content">
              <svg class="upload-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div class="drag-upload-text">将视频拖拽至此，或者 <em>点击此处上传文件</em></div>
              <div class="drag-upload-hint">支持 MP4、MP3 格式</div>
            </div>
          </el-upload>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">上传背景图片</label>
        <div class="upload-wrapper">
          <el-upload
            ref="bgUploadRef"
            class="upload-demo"
            action="/api/background/upload"
            :auto-upload="false"
            :limit="1"
            accept=".jpg,.png,.jpeg,.webp"
            method="POST"
            :headers="headers"
            @success="handleBgSuccess"
          >
            <template #trigger>
              <div class="upload-trigger">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span class="upload-text">选择背景图片</span>
                <span class="upload-hint">支持 JPG、PNG、WebP 格式</span>
              </div>
            </template>
            <el-button class="ml-3 upload-action-btn" type="success" @click="submitBg">上传背景</el-button>
          </el-upload>
        </div>
      </div>

      <div class="submit-btn" @click="submitArticle">提交</div>
    </div>
  </div>
</template>

<style scoped>
.submit-container {
  min-height: calc(100vh - 100px);
  padding: 40px 20px;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
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

.submit-card {
  max-width: 720px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.submit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.6;
}

.submit-header {
  margin-bottom: 32px;
}

.submit-heading {
  font-size: 28px;
  font-weight: 700;
  color: #4a4a4a;
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.submit-subtitle {
  font-size: 14px;
  color: #a0927e;
  margin: 0 0 16px;
  letter-spacing: 1px;
}

.submit-divider {
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #5c4b37;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 2px solid #e8e0d5;
  border-radius: 12px;
  font-size: 15px;
  color: #4a4a4a;
  background: #fff;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #d4a574;
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15);
}

.form-textarea {
  width: 100%;
  min-height: 140px;
  padding: 14px 16px;
  border: 2px solid #e8e0d5;
  border-radius: 12px;
  font-size: 15px;
  color: #4a4a4a;
  background: #fff;
  resize: vertical;
  line-height: 1.7;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #d4a574;
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.15);
}

.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 12px;
  border: 2px solid #e8e0d5;
  transition: all 0.3s ease;
  background: #fff;
}

.radio-item:hover {
  border-color: #d4a574;
  background: #faf8f5;
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.15);
}

.radio-item input[type="radio"] {
  width: auto;
  margin: 0;
  accent-color: #d4a574;
}

.radio-item:has(input:checked) {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.06);
}

.radio-label {
  font-size: 14px;
  color: #5c4b37;
  font-weight: 500;
}

/* ── Upload styling ── */
.upload-wrapper {
  margin-top: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 20px;
  border: 2px dashed #e8e0d5;
  border-radius: 12px;
  background: #faf8f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-trigger:hover {
  border-color: #d4a574;
  background: rgba(212, 165, 116, 0.06);
}

.upload-icon {
  width: 28px;
  height: 28px;
  color: #a0927e;
  transition: color 0.3s ease;
}

.upload-trigger:hover .upload-icon {
  color: #667eea;
}

.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #5c4b37;
}

.upload-hint {
  font-size: 12px;
  color: #a0927e;
}

.upload-action-btn {
  margin-top: 8px;
}

.drag-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
}

.upload-icon-large {
  width: 40px;
  height: 40px;
  color: #a0927e;
}

.drag-upload-text {
  font-size: 14px;
  color: #5c4b37;
}

.drag-upload-text em {
  color: #667eea;
  font-style: normal;
  font-weight: 600;
}

.drag-upload-hint {
  font-size: 12px;
  color: #a0927e;
}

/* ── Element Plus overrides ── */
.upload-wrapper :deep(.el-upload) {
  width: 100%;
}

.upload-wrapper :deep(.el-upload-dragger) {
  border: 2px dashed #e8e0d5;
  border-radius: 12px;
  background: #faf8f5;
  transition: all 0.3s ease;
  padding: 24px 20px;
}

.upload-wrapper :deep(.el-upload-dragger:hover) {
  border-color: #d4a574;
  background: rgba(212, 165, 116, 0.06);
}

.upload-wrapper :deep(.el-upload-list) {
  margin-top: 8px;
}

.upload-wrapper :deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.upload-wrapper :deep(.el-button--success) {
  background: linear-gradient(135deg, #67c23a, #52b817);
  border-color: transparent;
  border-radius: 10px;
  font-weight: 600;
}

.submit-btn {
  width: 160px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  margin: 32px auto 0;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5cb8 100%);
}

.submit-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .submit-card {
    padding: 24px 16px;
    border-radius: 16px;
  }

  .submit-heading {
    font-size: 22px;
  }

  .radio-group {
    gap: 8px;
  }

  .radio-item {
    padding: 8px 14px;
  }
}
</style>