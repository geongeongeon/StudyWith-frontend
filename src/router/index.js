import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupStep1Page from '../pages/SignupStep1Page.vue'
import SignupStep2Page from '../pages/SignupStep2Page.vue'
import StudyPage from '../pages/StudyPage.vue'
import MyPage from '../pages/MyPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/signup/step1', name: 'SignupStep1', component: SignupStep1Page },
  { path: '/signup/step2', name: 'SignupStep2', component: SignupStep2Page },
  { path: '/study', name: 'Study', component: StudyPage },
  { path: '/my', name: 'My', component: MyPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router