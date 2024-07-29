import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { currency, date } from './methods/filter';
import $httpMessageState from './methods/pushMessageState';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(VueAxios, axios);
app.component('Loading', Loading);
app.config.globalProperties.$filters = {
  currency,
  date,
};
// 此函式的用途是整合 Ajax 的錯誤事件，統一整理發送給予 Toast 處理
app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(router);
app.mount('#app');
