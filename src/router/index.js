import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index') },
  { path: '/404', component: () => import('@/views/404') },
  { path: '/office', component: () => import('@/views/office') },
  {
    path: '',
    redirect: '/index'
  },
  {
    path: '/index',
    component: ()=>import('@/views/layout/Layout'), //不使用()=>import会导致Unexpected token
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component: () => import('@/views/list/index'),
        name: '文件列表'
      },
      {
        path: 'recycle',
        component: () => import('@/views/recycle/index'),
        name: '回收站'
      },
      {
        path: 'record',
        component: () => import('@/views/record/index'),
        name: '操作记录'
      },
      {
        path: 'search',
        component: () => import('@/views/search/index'),
        name: '搜索结果'
      },
      {
        path: 'Auth',
        component: () => import('@/views/Auth/index'),
        name: '权限页面'
      }
    ]
  },
  { path: '*', redirect: '/404' }
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

