import { createRouter, createWebHistory } from 'vue-router'
import NewsView from '../views/NewsView.vue'

const routes = [
  {
    path: '/',
    name: 'news',
    component: NewsView
  },
  {
    path: '/allnews',
    name: 'allnews',
    component: () => import(/* webpackChunkName: "allnews" */ '../views/AllNews.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
