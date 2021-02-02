<template>
  <div>
    <el-card>
      <div slot="header">
        <h2>
          大纲管理
          <el-button type="text" @click="BackAdd"> 添加 </el-button>
        </h2>
      </div>
      <el-tree
        ref="tree"
        :data="$store.state.outlines.outlinesList"
        :props="{ label: 'outlinename' }"
      >
        <template #default="{ data, node }">
          <div>
            {{ data.outlinename }}
            <el-button type="text" @click="addSunMenu(data._id)"
              >添加子菜单</el-button
            >
            <el-button
              type="text"
              @click="
                $router.push({
                  name: 'Edit',
                  params: { id: data._id },
                })
              "
              >编辑</el-button
            >
            <el-button
              type="text"
              v-if="data.children.length === 0"
              @click="del(data._id)"
              >删除</el-button
            >
            <el-button
              type="text"
              v-if="node.previousSibling"
              @click.stop="srot(data._id, node.previousSibling.data._id)"
              icon="el-icon-arrow-up"
            >
            </el-button>
            <el-button
              type="text"
              v-if="node.nextSibling"
              @click.stop="srot(data._id, node.nextSibling.data._id)"
              icon="el-icon-arrow-down"
            >
            </el-button>
          </div>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("outlines/getOutlines");
  },
  methods: {
    async srot(firstId, secondId) {
      await this.$store.dispatch("outlines/SortOutlines", {firstId, secondId,});
      await this.$store.dispatch("outlines/getOutlines");
    },
    async del(id) {
      const r = await this.$confirm("确定删除吗?");
      if (r) {
        await this.$store.dispatch("outlines/delOutlines", id);
        this.$message.success("删除成功");
        this.$store.dispatch("outlines/getOutlines");
      }
    },
    addSunMenu(id) {
      this.$store.commit("outlines/OUTLINES_LIST_PID", id);

      this.$router.push({
        name: "Add",
      });
    },
    BackAdd() {
      this.$router.push({
        name: "Add",
      });
    },
  },
};
</script>