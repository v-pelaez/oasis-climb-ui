import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Own design system first; Bootstrap/CoreUI stay until RFP-22 for the sections not migrated yet.
import '@fontsource-variable/outfit'
import './assets/styles/tokens.scss'
import './assets/styles/base.scss'
import '@coreui/coreui/dist/css/coreui.min.css'
import './assets/styles/main.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
