import {
  addOutlines,
  exist,
  getOutlines,
  delOutlines,
  SortOutlines,
  EditOutlines,
  UpdateOutlines
} from '@/api/outlines.js'

export default {
  namespaced: true,
  state: {
    outlinesList: [],
    // 用来储存 添加大纲接口的数据
    addFrom: {
      pid: '',
      outlinename: "",
    },
    EditFrom: {
      outlinename: "",
    },

    OldEditFrom: {
      outlinename: "",
    },
  },

  mutations: {
    OUTLINES_EDITFROM(state, value) {
      if (state.OldEditFrom.outlinename === "") {
        state.EditFrom.outlinename = value
      }
      state.EditFrom.outlinename = value
    },
    OUTLINES_LIST_LIST(state, value) {
      state.outlinesList = value
    },
    OUTLINES_LIST(state, value) {
      state.addFrom.outlinename = value;
    },
    OUTLINES_LIST_PID(state, value) {
      state.addFrom.pid = value;
    }
  },

  actions: {
    UpdateOutlines(store, {
      id
    }) {
      return UpdateOutlines(id, {
        outlinename: store.state.EditFrom.outlinename
      })
    },
    EditOutlines(store, id) {
      EditOutlines(id).then(({
        data
      }) => {
        // console.log(data);
        store.commit("OUTLINES_EDITFROM", data.outlinename)
      })
    },
    SortOutlines(store, {
      firstId,
      secondId 
    }) {
      return SortOutlines(firstId,secondId);

    },
    delOutlines(store, id) {
      return delOutlines(id)
    },
    addOutlines(store) {
      const r = {}
      r.outlinename = store.state.addFrom.outlinename
      if (store.state.addFrom.pid) {
        r.pid = store.state.addFrom.pid
      }
      return addOutlines(r)
    },

    exist(store, data) {
      return exist(data.field, data.value);
    },

    getOutlines(store) {
      getOutlines().then(({
        data
      }) => {
        store.commit('OUTLINES_LIST_LIST', data)
      })
    },
  },

}