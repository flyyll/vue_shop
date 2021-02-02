<template>
  <div class="layout">
    <el-container class="home_content">
      <el-header
        ><h1>
          问卷管理系统
          <el-button type="text" @click="loginOut">退出</el-button>
        </h1>
      </el-header>
      <el-container class="el_container">
        <Menu />
        <el-container>
          <el-main><router-view></router-view></el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import Menu from "@/components/Menu";
export default {
  components: {
    Menu,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("login", ["loginOut"]),
  },
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  .home_content {
    height: 100%;

    .el_container {
      height: 100%;
    }
  }
}
</style>