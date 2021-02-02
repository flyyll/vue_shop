import {
  AddUser,
  exist,
  addUsers,
  EditUsers,
  updateUsersId,
  deleteUsersId,
} from '@/api/users.js'

export default {
  namespaced: true,
  state: {
    list: [],
    TableLoading: false,
    FromLoading: false,
    AddFrom: {
      username: '',
      password: '',
      email: '',
      phone: '',
      //  设置一个默认值
      gender: '1',
      // 确认密码
      ConfirmPassword: '',
    },
    // 储存编辑时的数据
    EditData: {
      username: '',
      email: '',
      phone: '',
      //  设置一个默认值
      gender: '1',
    },
    // 储存编辑时的数据
    OldDitData: {
      username: '',
      email: '',
      phone: '',
      //  设置一个默认值
      gender: '1',
    },

  },


  mutations: {
    // 储存编辑用户时的数据
    SET_E_USERNAME(state, value) {
      state.EditData.username = value
      // 表示我老值为空的情况下下能进行赋值
      if (!state.OldDitData.username) {
        state.OldDitData.username = value
      }
    },

    SET_E_EMAIL(state, value) {
      state.EditData.email = value
      // 表示我老值为空的情况下下能进行赋值
      if (!state.OldDitData.email) {
        state.OldDitData.email = value
      }
    },
    SET_E_PHONE(state, value) {
      state.EditData.phone = value
      // 表示我老值为空的情况下下能进行赋值
      if (!state.OldDitData.phone) {
        state.OldDitData.phone = value
      }
    },
    SET_E_GENDER(state, value) {
      state.EditData.gender = value
    },


    SET_FROMLOADING(state, value) {
      state.FromLoading = value
    },
    SET_TABLELOADING(state, value) {
      state.TableLoading = value
    },
    SET_LIST(state, value) {
      state.list = value
    },
    SET_USERNAME(state, value) {
      state.AddFrom.username = value
    },
    SET_PASSWORD(state, value) {
      state.AddFrom.password = value
    },
    SET_EMAIL(state, value) {
      state.AddFrom.email = value
    },
    SET_PHONE(state, value) {
      state.AddFrom.phone = value
    },
    SET_GENDER(state, value) {
      state.AddFrom.gender = value
    },
    SET_CONFIRMPASSWORD(state, value) {
      state.AddFrom.ConfirmPassword = value
    },
  },
  // 请求数据添加用户的数据
  actions: {
    deleteUsersId(store,id){
      return deleteUsersId(id);
    },
    updateUsersId(store, id) {
      const where = {
        gender: String(store.state.EditData.gender),
      };

      if(store.state.EditData.username !== store.state.OldDitData.username ) {
        where.username = store.state.EditData.username;
      }
      if(store.state.EditData.email !== store.state.OldDitData.email ) {
        where.username = store.state.EditData.email;
      }
      if(store.state.EditData.phone !== store.state.OldDitData.phone ) {
        where.username = store.state.EditData.phone;
      }
    
      updateUsersId(id,where).then((data) => {
        console.log(data);
      })
    },
    EditUsers(store, id) {
      EditUsers(id).then(({
        data
      }) => {
        store.commit('SET_E_USERNAME', data.username);
        store.commit('SET_E_EMAIL', data.email);
        store.commit('SET_E_PHONE', data.phone);
        store.commit('SET_E_GENDER', data.gender);
        console.log(data);
      })
    },



    AddUser(store) {
      AddUser({
        username: store.state.AddFrom.username,
        password: store.state.AddFrom.password,
        email: store.state.AddFrom.email,
        phone: store.state.AddFrom.phone,
        gender: store.state.AddFrom.gender,
      }).then((r) => {
        console.log(r);
      })
    },
    exist(store, data) {
      return exist(data.filed, data.value)
    },
    addUsers(store, data) {
      store.commit('SET_TABLELOADING', true)
      addUsers(data).then(({
        data
      }) => {
        store.commit('SET_LIST', data)
        // console.log(data);
        store.commit('SET_TABLELOADING', false)
      })

    }
  },


}