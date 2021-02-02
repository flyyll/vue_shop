import Vue from 'vue'
import VueRouter from 'vue-router';

import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/index',
    meta: {
      title: "系统首页",
      icon: "el-icon-s-home",
    },
    component: Layout,
    children: [{
      path: 'index',
      name: 'HomeIndex',
      component: () => import('@/views/home')
    }]
  },
  {
    path: '/users',
    name: 'Users',
    redirect: '/users/index',
    component: Layout,
    meta: {
      title: '用户相关',
      icon: "el-icon-user-solid",
    },
    children: [{
        path: 'index',
        name: 'UsersIndex',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/users')
      },
      {
        path: 'add',
        name: 'ADD',
        meta: {
          title: '添加用户',
          icon: 'el-icon-circle-plus-outline'
        },
        component: () => import('@/views/users/add.vue')
      },
      {
        path: 'Edit/:id',
        name: 'EditUser',
        component: () => import('@/views/users/edit.vue'),
        props: true
      },
    ],
  },

  {
    path: '/addClass',
    name: 'AddClass',
    redirect: '/addClass/index',
    meta: {
      title: '班级相关',
      icon: "el-icon-s-custom"
    },

    component: Layout,
    children: [{
        path: 'index',
        name: "ClassIndex",
        meta: {
          title: '班级管理',
          icon: 'el-icon-circle-plus-outline'
        },
        component: () => import('@/views/addClass'),
      },
      {
        path: 'add',
        name: "Add",
        meta: {
          title: '添加班级',
          icon: 'el-icon-circle-plus-outline'
        },
        component: () => import('@/views/addClass/add.vue'),
      },
      {
        path: 'edit:id',
        name: "EditClasses",
        // 方便获取ID
        props: true,
        component: () => import('@/views/addClass/edit.vue'),
      },

    ]
  },

  {
    path: '/outlines',
    name: 'OutLines',
    redirect: "/outlines/index",
    meta: {
      title: '大纲相关',
      icon: 'el-icon-document-copy'
    },
    component: Layout,
    children: [{
        path: 'index',
        name: "OutLinesIndex",
        meta: {
          title: '大纲管理',
          icon: "el-icon-setting",
        },
        component: () => import("@/views/outlines")
      },
      {
        path: 'add',
        name: "Add",
        meta: {
          title: '添加大纲',
          icon: "el-icon-circle-plus-outline",
        },
        component: () => import("@/views/outlines/add.vue")
      },
      {
        path: 'edit/:id',
        name: "Edit",
        props: true,
        component: () => import("@/views/outlines/edit.vue")
      },
    ]

  },

  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/404/index.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router