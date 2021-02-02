<template>
  <div class="menus">
    <el-aside width="250px" class="el_aside">
      <el-menu
        class="sidebar-el-menu"
        active-text-color="#20a0ff"
        unique-opened
        :default-active="onRoutes"
        background-color="#324157"
        text-color="#bfcbd9"
      >
        <template v-for="item in menus">
          <template v-if="item.children.length === 1">
            <el-menu-item
              :index="item.children[0].name"
              :key="item.index"
              @click="to(item.name)"
            >
              <i :class="item.meta.icon"> </i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
          </template>
          <template v-else>
            <el-submenu :index="item.children[0].name" :key="item.index">
              <template slot="title">
                <i :class="item.meta.icon"></i>
                <span slot="title">{{ item.meta.title }}</span>
              </template>
              <template>
                <el-menu-item
                  @click="to(item.name)"
                  :index="item.children[0].name"
                >
                  <span slot="title">
                    {{
                      item.children.find((el) => el.path === "index").meta.title
                    }}
                  </span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  methods: {
    to(name) {
      this.$router
        .push({
          name: name,
        })
        .catch(() => {});
    },
  },

  computed: {
    onRoutes() {
      return this.$route.name;
    },
    menus() {
      return this.$router.options.routes.filter((el) => el.children);
    },
  },
};
</script>
<style lang="scss" scoped>
.menus {
  .el_aside {
    height: 100%;
    background-color: #324157;

    .sidebar-el-menu {
      // height: 100%;
      // background-color: #324157;
    }
  }
}
</style>