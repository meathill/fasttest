import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import TestCases from './test-cases';
import I18N from './i18n';

export const routes = [
  {
    path: '/',
    name: 'home',
    redirect: 'cases',
  },
  {
    path: '/cases',
    name: 'cases',
    component: TestCases,
  },
  {
    path: '/i18n',
    name: 'i18n',
    component: I18N,
  },
];

const router = createRouter({
  history: process.env.NODE_ENV === 'production'
    ? createWebHistory()
    : createWebHashHistory(),
  scrollBehavior(to) {
    if (to.hash && !/^#/.test(to.hash)) {
      return { selector: to.hash };
    }
    return { top: 0 };
  },
  routes,
  linkActiveClass: 'active',
});

export default router;
