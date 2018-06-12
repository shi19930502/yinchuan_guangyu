import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/view/index.vue')
    },
    {
      path: '/base',
      name: 'base',
      component: () => import('@/view/base.vue')
    },
    {
      path: '/enterprise',
      name: 'enterprise',
      component: () => import('@/view/enterprise.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/view/news.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/view/feedback.vue')
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('@/view/store.vue')
    },
    {
      path: '/client',
      name: 'client',
      component: () => import('@/view/client.vue')
    }
  ]
})
