import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fontsource-variable/outfit'
import './assets/styles/tokens.scss'
import './assets/styles/base.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
