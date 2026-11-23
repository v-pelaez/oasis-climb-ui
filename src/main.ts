import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { syncDocumentLocale } from './composables/useLocale'
import '@fontsource-variable/outfit'
import './assets/styles/tokens.scss'
import './assets/styles/base.scss'

const app = createApp(App)

app.use(router)
app.use(i18n)
syncDocumentLocale(i18n.global)

app.mount('#app')
