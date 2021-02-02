<template>
  <el-card class="login" shadow="hover">
    <div slot="header">登录</div>
    <div>
      <el-form label-position="left">
        <el-form-item label="用户" label-width="60px">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="60px">
          <el-input type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item class="but">
          <el-button
            type="primary"
            round
            plain
            @click="login"
            :disabled="$store.getters['login/disable']"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>
<script>
export default {
  computed: {
    username: {
      get() {
        return this.$store.state.login.username;
      },

      set(value) {
        return this.$store.commit("login/SET_USERNAME", value);
      },
    },
    password: {
      get() {
        return this.$store.state.login.password;
      },

      set(value) {
        return this.$store.commit("login/SET_PASSWORD", value);
      },
    },
  },

  methods: {
    login() {
      this.$store.dispatch("login/login", {
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login {
  width: 30%;
  margin: 100px auto;
  .but {
    display: flex;
    justify-content: center;
  }
}
</style>