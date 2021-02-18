import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {
  Table
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 引入全局样式表
import './assets/css/global.css'
// 引入登录input小图标
import './assets/fonts/iconfont.css'
// 引入左菜单栏小图标
import './assets/fonts/font_2361802_5e9rjjkd9j8/iconfont.css';

// 使用树状插件
import treeTable from 'vue-table-with-tree-grid';
//  定义为全局组件使用
Vue.component('tree-table', treeTable)


import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'


Vue.use(VXETable)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 将导入富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')