import "reset-css";
import "./global.css";

import { createApp } from 'vue';
import App from './App.vue';
import Icon from './components/Icon/Icon.vue';

const app = createApp(App);

app.component('Icon', Icon);

app.mount('#app');