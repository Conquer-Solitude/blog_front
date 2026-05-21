<script setup>
import { ref } from 'vue'
import { Document, Management } from '@element-plus/icons-vue'

const collapse = ref(false)
const onOpen = () => {}
const onClose = () => {}
</script>

<template>
  <div class="articel-container">
    <div class="article-menu">
      <el-radio-group style="margin-bottom: 20px">
        <el-radio-button>目录</el-radio-button>
      </el-radio-group>

      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="collapse"
        @open="onOpen"
        @close="onClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>文章</span>
          </template>
          <el-menu-item-group>
            <RouterLink :to="{ name: 'life', query: { name: '生活动态', id: 1 } }">
              <el-menu-item index="1-1">life</el-menu-item>
            </RouterLink>
            <RouterLink :to="{ name: 'algorithm', query: { name: '算法讲解', id: 2 } }">
              <el-menu-item index="1-2">algorithm</el-menu-item>
            </RouterLink>
            <RouterLink :to="{ name: 'programming', query: { name: '技术分析', id: 3 } }">
              <el-menu-item index="1-3">programming</el-menu-item>
            </RouterLink>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="2" disabled>
          <template #title>管理</template>
          <el-icon><Management /></el-icon>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="article-content">
      <RouterView class="view" />
    </div>
  </div>
</template>

<style scoped>
.articel-container {
  max-width: 1240px;
  margin: 20px auto;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%);
  position: relative;
}

.articel-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 10% 30%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 70%, rgba(118, 75, 162, 0.02) 0%, transparent 50%);
  pointer-events: none;
  border-radius: 16px;
}

.article-menu {
  width: 200px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 16px 12px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.06),
    0 1px 3px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.article-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.5;
  border-radius: 16px 16px 0 0;
}

.article-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

/* ── Radio group styling ── */
.article-menu :deep(.el-radio-group) {
  display: flex;
  width: 100%;
  margin-bottom: 16px !important;
}

.article-menu :deep(.el-radio-button__inner) {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(0, 0, 0, 0.06) !important;
  color: #5c4b37;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 14px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  border-radius: 8px !important;
}

.article-menu :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  border-color: transparent !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.article-menu :deep(.el-radio-button__inner:hover) {
  color: #667eea;
  background: rgba(102, 126, 234, 0.06);
}

/* ── Menu styling ── */
.article-menu :deep(.el-menu) {
  background: transparent !important;
  border-right: none !important;
  border-radius: 12px;
  padding: 4px 0;
}

.article-menu :deep(.el-menu-vertical-demo:not(.el-menu--collapse)) {
  width: 176px;
  min-height: 400px;
  border-radius: 12px;
}

.article-menu :deep(.el-sub-menu__title) {
  color: #4a4a4a !important;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 48px;
  line-height: 48px;
}

.article-menu :deep(.el-sub-menu__title:hover) {
  background: rgba(102, 126, 234, 0.06) !important;
  color: #667eea !important;
}

.article-menu :deep(.el-sub-menu__title .el-icon) {
  color: #a0927e;
  transition: color 0.3s ease;
}

.article-menu :deep(.el-sub-menu__title:hover .el-icon) {
  color: #667eea;
}

.article-menu :deep(.el-menu-item) {
  color: #5c4b37 !important;
  font-size: 14px;
  height: 42px;
  line-height: 42px;
  border-radius: 10px;
  margin: 2px 0;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 48px !important;
}

.article-menu :deep(.el-menu-item::before) {
  content: '';
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e8e0d5;
  transition: all 0.3s ease;
}

.article-menu :deep(.el-menu-item:hover) {
  background: rgba(102, 126, 234, 0.06) !important;
  color: #667eea !important;
}

.article-menu :deep(.el-menu-item:hover::before) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 0 6px rgba(102, 126, 234, 0.4);
}

.article-menu :deep(.el-menu-item.is-active) {
  background: rgba(102, 126, 234, 0.08) !important;
  color: #667eea !important;
  font-weight: 600;
}

.article-menu :deep(.el-menu-item.is-active::before) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  width: 6px;
  height: 6px;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

.article-menu :deep(.el-menu-item-group__title) {
  padding: 0;
}

.article-menu :deep(.el-menu-item.is-disabled) {
  color: #c0b8a8 !important;
  opacity: 0.6;
}

/* ── Collapse toggle ── */
.article-menu :deep(.el-menu--collapse) {
  border-radius: 12px;
}

.article-menu :deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #667eea !important;
}
</style>
