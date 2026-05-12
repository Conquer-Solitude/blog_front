import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'body',
    component: () => import('@/views/Body.vue'),
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('@/views/TimeLine.vue'),
  },
  {
    path: '/hole',
    name: 'treehole',
    component: () => import('@/views/TreeHole.vue'),
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/Message.vue'),
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('@/views/article/ArticleLayout.vue'),
    redirect: '/article/life?name=生活动态&id=1',
    children: [
      { name: 'life', path: 'life', component: () => import('@/views/article/ArticleChildren.vue') },
      { name: 'algorithm', path: 'algorithm', component: () => import('@/views/article/ArticleChildren.vue') },
      { name: 'programming', path: 'programming', component: () => import('@/views/article/ArticleChildren.vue') },
    ],
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/views/Video.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/submit',
    name: 'submit',
    component: () => import('@/views/Submit.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
