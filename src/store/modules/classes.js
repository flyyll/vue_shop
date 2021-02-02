import {
  addClass,
  ClassExist,
  getClass,
  getClassID,
  editClassID,
  delClassID
} from '@/api/classes.js'

export default {
  namespaced: true,

  state: {
    // 用来储存我添加用户的数据
    getClassData: [],
    classes: {
      classname: '',
    },

    ClassesIDData: {
      classname: '',
    },


    OldClassesIDData: {
      classname: '',
    }

  },
  mutations: {
    SET_CLASSESIDDATA(state, value) {
      if (state.OldClassesIDData.classname === '') {
      state.OldClassesIDData.classname = value
      }
      state.ClassesIDData.classname = value
    },
    ADD_CLASSESDATA(state, value) {
      state.getClassData = value
    },
    SET_CLASSNAME(state, value) {
      state.classes.classname = value
    }
  },
  actions: {
    delClassID(store,id) {
      return delClassID(id);
    },
    editClassID(store, {
      id
    }) {
      // 做一个判断当编辑输入的名和原来的名称和一样就不请求直接过
      const r = {}
      if(store.state.OldClassesIDData.classname !== store.state.ClassesIDData.classname) {
        r.classname = state.OldClassesIDData.classname
      }
      return editClassID(id, r);
    },
    getClassID(store, id) {
      getClassID(id).then(({
        data
      }) => {
        store.commit('SET_CLASSESIDDATA', data.classname)
      });
    },
    getClass(store, data) {
      getClass(data).then(({
        data
      }) => {
        // console.log(data);
        store.commit("ADD_CLASSESDATA", data)
      })
    },
    ClassExist(store, data) {
      return ClassExist(data.filed, data.value)
    },
    addClass(store) {
      addClass({
        classname: store.state.classes.classname
      }).then((r) => {
        // console.log(r);
      })
    }
  },
}