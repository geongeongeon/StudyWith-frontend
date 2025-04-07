import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css' // 부트스트랩 CSS
import 'bootstrap' // 부트스트랩 JS
import 'bootstrap-icons/font/bootstrap-icons.css' // 부트스트랩 ICON

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

app.mount('#app')