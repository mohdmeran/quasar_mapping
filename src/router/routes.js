const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '', component: () => import('pages/pageHome.vue') },
      { path: '/map', component: () => import('pages/pageMap.vue') },
      { path: '/mapper', component: () => import('pages/pageAddLot.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      { path: '/offers', component: () => import('pages/Offers.vue') },

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
