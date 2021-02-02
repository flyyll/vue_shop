import {
  login
} from "@/api/users.js";
import router from '@/router'
export default {
  namespaced: true,

  state: {
    username: "",
    password: "",
  },

  getters: {
    disable(state) {
      return !(state.username && state.password)
    }
  },

  mutations: {
    SET_USERNAME(state, data) {
      state.username = data
    },
    SET_PASSWORD(state, data) {
      state.password = data
    },
  },

  // 接口是异步的写在actions里面
  actions: {
    login(store, data) {
      login(data).then(({
        data
      }) => {
        localStorage.token = data

        router.push({
          name: 'Home'
        })
      })
    },
    loginOut(store, data) {
      localStorage.removeItem('token')
      router.push({
        name: 'Login'
      })
    },
  }
}