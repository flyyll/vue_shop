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
        component: () => import('@/components/Welcoms.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: "/users",
        component: () => import("@/views/users/index.vue"),
        meta: {
          title: '用户列表'
        }

      },
      {
        path: '/rights',
        component: () => import("@/views/power/Jurisdiction.vue"),
        meta: {

          title: '权限列表'
        }
      },
      {
        path: '/roles',
        component: () => import("@/views/power/Roles.vue"),
        meta: {
          title: '角色列表'
        }
      },
      {
        path: '/categories',
        component: () => import("@/views/goods/Cate.vue"),
        meta: {
          title: '商品分类'
        }
      },
      {
        path: '/params',
        component: () => import("@/views/goods/Params.vue"),
        meta: {
          title: '分类参数'
        },
      },
      {
        path: '/goods',
        component: () => import("@/views/goods/list.vue"),
        meta: {
          title: '商品列表'
        },
      },
      {
        path: '/goods/list',
        component: () => import("@/views/goods/Add.vue"),
        meta: {
          title: '添加用户'
        },
      },
      {
        path: '/orders',
        component: () => import("@/views/order/Order.vue"),
        meta: {
          title: '订单列表'
        },
      },
      {
        path: '/reports',
        component: () => import("@/views/report"),
        meta: {
          title: '数据报表'
        },
      },

    ]
  },
]
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    if (localStorage.token) {
      next({
        path: '/home'
      })
    }
  }

  if (to.path !== '/login') {
    if (!localStorage.token) {
      next({
        path: '/login'
      })
    }
  }
  next()
})

export default router