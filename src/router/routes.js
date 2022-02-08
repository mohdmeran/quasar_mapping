const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/pageHome.vue') },
      { path: '/map', name: 'pageMap', component: () => import('pages/pageMap.vue') },
      { path: '/mapper', component: () => import('pages/pageMapper.vue') },
      { path: '/offers', component: () => import('pages/Offers.vue') },
      { path: '/storeSetup', component: () => import('pages/pageMapper.vue') },
      {
        path: '/main-profile',
        component: () => import('pages/Profile/ProfileMain.vue'),
      },
    ],
  },
  {
    path: '/login/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/Login/LoginMain.vue'),
        children: [
          {
            path: '',
            component: () => import('src/pages/Login/Login.vue'),
          },
          {
            path: 'register',
            component: () => import('src/pages/Login/Register.vue'),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
