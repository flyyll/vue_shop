import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import './assets/commonstyle/common.css'

// 表示在项目部署的时候还要不要给用户打印出警告信息
// Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    if (localStorage.token) {
      next({
        name: 'Home'
      })
    }
  }
  if (to.name !== 'Login') {
    if (!localStorage.token) {
      next({
        name: 'Login'
      })
    }
  }
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')