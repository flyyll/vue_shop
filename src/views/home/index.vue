<template>
  <el-container class="el_container">
    <!-- 头部区 -->
    <el-header>
      <div class="text">
        <h2>电商后台管理系统</h2>
      </div>
      <div>
        <el-button type="info" @click="logout">退出</el-button>
      </div></el-header
    >
    <!-- 页面主体区 -->
    <el-container class="container2">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="tiggle_button" @click="toggleCollapse">|||</div>
        <!-- 菜单栏区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="isActive"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="String(item.id)"
            v-for="item in meunsList"
            :key="item.id"
          >
            <template slot="title">
              <!-- 一级菜单的模板区 -->
              <!-- 图标 -->
              <!-- 使用[] 方法获取对应属性名的值 , 从而获取不一样的小图标-->
              <i :class="iconMuns[item.id]" class="MunsIcon"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- meun开启router模式以index作为跳转路径 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->

      <el-main>
        <!-- 路由占位符 -->
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import { menus } from "@/api/home.js";
export default {
  data() {
    return {
      isCollapse: false,
      // 第一层字体小图标的显示
      // 方法: 使数据的id 对应 字体小图标
      iconMuns: {
        125: "iconfont icon-yonghu1",
        103: "iconfont icon-quanxian",
        101: "iconfont icon-shangpinguanli",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },

      meunsList: [],
    };
  },
  computed: {
    isActive() {
      return this.$route.path;
    },
  },
  // 上来就展示左侧菜单的数据
  created() {
    this.menus();
  },
  methods: {
    // 点击按钮的折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 退出操作
    logout() {
      // sessionStorage.removeItem("token");
      localStorage.removeItem("token");

      this.$router.push("/login");
    },
    async menus() {
      const { data: res } = await menus();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.meunsList = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.el_container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      color: #fff;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
      .MunsIcon {
        padding-right: 8px;
      }
    }
    .tiggle_button {
      text-align: center;
      background-color: #485164;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      // 调整字体间的间距
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #eaedf1;
    // 使滚动区域缩小至子路由部分
    height: calc(100vh - 60px);
  }
}
</style>