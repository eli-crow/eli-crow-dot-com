import { createApp } from 'vue'

import App from './App.vue'
import Icon from './components/Icon/Icon.vue';
import router from './router'

import "./global.css";

if (import.meta.env.DEV) {
    // @ts-ignore
    window['ga-disable-G-VJ6EPKW4FM'] = true;
}

const app = createApp(App)
app.use(router)
app.component('Icon', Icon)
app.mount('#app')
