import { createRouter, createWebHistory } from 'vue-router'

import LandingView from '@/views/LandingView.vue'

//ES IMPORTANTE USAR EL LOADING LAZY component: ()=> import('@/views/ConcursoView.vue') y component: ()=> import('@/views/RankingView.vue') en estos en concreto ya que el landing si que es necesario que lo cargue por defecto sin lazy.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/concurso', name: 'concurso', component: ()=> import('@/views/ConcursoView.vue')},
    { path: '/ranking', name: 'rankings', component: ()=> import('@/views/RankingView.vue')}

  ],
})

export default router
