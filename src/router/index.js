import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import StudyPage from '../pages/StudyPage.vue'
import MyPage from '../pages/MyPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'Signup', component: SignupPage },
  { path: '/study', name: 'Study', component: StudyPage },
  { path: '/my', name: 'My', component: MyPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router