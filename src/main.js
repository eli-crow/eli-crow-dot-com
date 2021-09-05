import { createApp } from 'vue'

import App from './App.vue'
import Icon from './components/Icon/Icon.vue';

import "./global.css";

const app = createApp(App)
app.component('Icon', Icon)
app.mount('#app')
