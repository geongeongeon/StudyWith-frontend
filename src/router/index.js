import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupStep1Page from '../pages/SignupStep1Page.vue'
import SignupStep2Page from '../pages/SignupStep2Page.vue'
import MyPage from '../pages/MyPage.vue'
import { useAuthStore } from '../stores/authStore';
import { useAlertStore } from '../stores/alertStore'
import StudySearchPage from '../pages/StudySearchPage.vue'
import StudyCreatePage from '../pages/StudyCreatePage.vue'
import StudyPage from '../pages/StudyPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/auth/login', name: 'Login', component: LoginPage },
  { path: '/auth/signup/step1', name: 'SignupStep1', component: SignupStep1Page },
  { path: '/auth/signup/step2', name: 'SignupStep2', component: SignupStep2Page },
  { path: '/studies', name: 'StudyList', component: StudySearchPage },
  { path: '/studies/create', name: 'StudyCreate', component: StudyCreatePage },
  { path: '/studies/:id', name: 'Study', component: StudyPage, props: true },
  { path: '/members/me', name: 'My', component: MyPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const alertStore = useAlertStore();
  const authRequiredPages = ['My', 'Study']

  if (authStore.accessToken == null) {
    await authStore.autoRefresh();
  }

  if (to.name == 'Login' && authStore.isAuthenticated) {
    next({name: 'Home'})
    alertStore.showAlert('먼저 로그아웃을 해주세요.')
  } else if (authRequiredPages.includes(to.name) && !authStore.isAuthenticated) {
    next({name: 'Login'})
    alertStore.showAlert('먼저 로그인을 해주세요.')
  } else {
    next();
  }
});

export default router;