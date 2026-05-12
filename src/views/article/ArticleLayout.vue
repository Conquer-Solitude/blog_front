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
