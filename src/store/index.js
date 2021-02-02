import Vue from 'vue'
import Vuex from 'vuex'
import login from '../store/modules/login.js';
import users from '../store/modules/users.js';
import classes from "../store/modules/classes.js";
import outlines from "../store/modules/outlines.js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    login,
    users,
    classes,
    outlines,
  }
})