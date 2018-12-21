import Vue from 'vue';

import '@/styles/index.scss'; // global css

import App from './App';
import router from './router';
import store from './store';
import './registerServiceWorker';

import '@/icons'; // icon

import '@/permission'; // permission control

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import './plugins/element.js';

Vue.use(mavonEditor);

Vue.config.productionTip = true;

/* eslint-disable no-new */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
