import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/views/home/index').default
    },
    {
      path: '/create-room',
      component: require('@/views/create-room/index').default
    },
    {
      path: '/join-room',
      component: require('@/views/join-room/index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
