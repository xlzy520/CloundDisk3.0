import router from './router';
import store from './store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条样式

// const whiteList = ['/login', '/index/list']; // 不重定向白名单
const authList = ['/index/authSettings', '/index/userManagement'];
router.beforeEach((to, from, next) => {
  NProgress.start();
  const {userName, utype} = store.getters.userData;
  if (userName === undefined) {
    if (to.path !== '/login') {
      if (to.path !== '/index/list') {
        store.dispatch('GetInfo', to.path);
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    if (utype === '0') {
      if (authList.includes(to.path)) {
        next('404');
      }
    }
    next();
  }

});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
