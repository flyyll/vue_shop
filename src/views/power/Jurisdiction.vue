<template>
  <div class="jurisdiction">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级">
          <!-- 通过自定义插槽的形式自定义样式 -->
          <template #default="{ row }">
            <!-- 通过判断显示相应的标签 -->
            <el-tag v-if="row.level === '0'">标签一</el-tag>
            <el-tag v-else-if="row.level === '1'" type="success">标签二</el-tag>
            <el-tag v-else type="info">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getPower } from "@/api/power.js";
export default {
  data() {
    return {
      // 权限列表数据
      rightsList: [],
    };
  },
  created() {
    // 上来就展示列表数据
    this.getPower();
  },

  methods: {
    async getPower() {
      const { data: res } = await getPower();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightsList = res.data;
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
.jurisdiction {
   padding: 10px;
  .el-card {
    margin-top: 15px;
  }
}
</style>