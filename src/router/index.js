import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupStep1Page from '../pages/SignupStep1Page.vue'
import SignupStep2Page from '../pages/SignupStep2Page.vue'
import StudyPage from '../pages/StudyPage.vue'
import MyPage from '../pages/MyPage.vue'
import { useAuthStore } from '../stores/authStore';
import { useAlertStore } from '../stores/alertStore'

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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const alertStore = useAlertStore();

  if (authStore.accessToken == null) {
    await authStore.autoRefresh();
  }

  if (to.name == 'Login' && authStore.isAuthenticated) {
    next({name: 'Home'})
    alertStore.showAlert('먼저 로그아웃을 해주세요.')
  } else if (to.name == 'My' && !authStore.isAuthenticated) {
    next({name: 'Login'})
    alertStore.showAlert('먼저 로그인을 해주세요.')
  } else {
    next();
  }
});

export default router;