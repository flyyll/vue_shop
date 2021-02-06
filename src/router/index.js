import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from '@/views/home/index.vue'
Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import("@/views/login"),
  },
  {
    path: '/home',
    component: () => import("@/views/home"),
    // 重订向到welcome.vue组件
    redirect: '/welcome',
    children: [{
        // 以 / 开头的嵌套路径会被当作根路径
        path: "/welcome",
        component: () => import('@/components/Welcoms.vue')
      },
      {
        path: "/users",
        component: () => import("@/views/users/index.vue")
      },
      {
        path: '/rights',
        component: () => import("@/views/power/Jurisdiction.vue")
      },
      {
        path: '/roles',
        component: () => import("@/views/power/Roles.vue")
      },
    ]
  },
]
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (sessionStorage.token) {
      next({
        path: '/home'
      })
    }
  }

  if (to.path !== '/login') {
    if (!sessionStorage.token) {
      next({
        path: '/login'
      })
    }
  }
  next()
})

export default router