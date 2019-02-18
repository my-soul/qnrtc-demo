import Vue from 'vue';
import request from './utils/plugins/request';
import App from './App';
import router from './router';
import store from './store';
import db from '../shared/datastore';

Vue.use(request);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.prototype.$db = db;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');
