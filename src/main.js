import { createApp } from 'vue'

import App from './App.vue'
import Icon from './components/Icon/Icon.vue';
import router from './router.js'

import "./global.css";

const app = createApp(App)
app.use(router)
app.component('Icon', Icon)
app.mount('#app')
