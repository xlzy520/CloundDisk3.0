import router from './router';
import store from './store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条样式

// const whiteList = ['/login', '/index/list']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.getters.userData.userName === undefined) {
    if (to.path !== '/login' && to.path !== '/index/list') {
      store.dispatch('GetInfo');
    }
  }
  next();
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
