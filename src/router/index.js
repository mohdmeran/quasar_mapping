import { route } from 'quasar/wrappers';
import {
  createRouter, createMemoryHistory, createWebHistory, createWebHashHistory,
} from 'vue-router';
// eslint-disable-next-line no-unused-vars
import firebase from 'src/boot/firebase';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  // eslint-disable-next-line no-unused-vars
  Router.beforeEach((to, from, next) => {
    // if (firebase.auth.currentUser === null && !to.path.includes('/login')) {
    //   next({ path: '/login' });
    // } else if (firebase.auth.currentUser != null && to.path.includes('/login')) {
    //   next({ path: '/' });
    // } else {
    //   next();
    // }
    // eslint-disable-next-line no-console
    console.log(firebase.auth.currentUser);
    next();
  });

  return Router;
});
