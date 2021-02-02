<template>
  <el-card shadow="never" class="card">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button type="primary" @click="ClickClass">添加班级</el-button>
      </el-col>
    </el-row>
    <el-input
      placeholder="请输入内容"
      v-model="searchValue"
      class="input-with-select"
    >
      <el-select
        v-model="searchField"
        slot="prepend"
        style="width: 150px"
        placeholder="请选择"
      >
        <el-option label="班级名" value="classname"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="getUsers()"
      ></el-button>
    </el-input>
    <el-table
      stripe
      style="width: 100%"
      border
      :data="$store.state.classes.getClassData.result"
    >
      <el-table-column prop="classname" label="班级名"> </el-table-column>
      <el-table-column prop="ctime" label="创建时间">
        <template #default="{ row }">
          {{ moment(row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class="ubut">
        <template #default="{ row }">
          <el-button
            type="text"
            @click="
              $router.push({
                name: 'EditClasses',
                params: { id: row._id },
              })
            "
            >编辑</el-button
          >
          <el-button type="text" @click="delClassID(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="currentChange"
      :page-size="PageSize"
      :page-sizes="[5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="$store.state.classes.getClassData.count"
    >
    </el-pagination>
  </el-card>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      PageNums: 1,
      PageSize: 5,
      searchField: "classname",
      searchValue: "",
      page: 1,
    };
  },

  created() {
    this.getUsers();
  },

  methods: {
    async delClassID(id) {
      const r = await this.$confirm("确定删除吗?");
      console.log(r);
      if (r) {
        await this.$store.dispatch("classes/delClassID", id);
        this.$message.success("删除成功");
        this.getUsers();
        // this.$store.dispatch("outlines/getOutlines");
      }
    },
    getUsers(page = 1) {
      const where = {};
      if (this.searchField !== "" && this.searchValue !== "") {
        where.searchField = this.searchField;
        where.searchValue = this.searchValue;
      }
      this.$store.dispatch("classes/getClass", {
        page,
        perPage: this.PageSize,
        ...where,
      });
    },
    // 调整页数的按钮  当点击调整后立刻调用请求数据的接口实现刷新
    handleSizeChange(page) {
      this.PageSize = page;
      this.getUsers();
    },
    currentChange(page) {
      this.getUsers(page);
      this.PageNums = page;

      // this.$store.dispatch("users/addUsers", {
      //   page,
      //   perPage: this.PageSize,
      //   searchField: this.searchField,
      //   searchValue: this.searchValue,
      // });
      // console.log(page);
    },
    moment(time) {
      moment.locale("zh-cn"); //设置语言
      return moment(time).format("LLLL");
    },
    ClickClass() {
      this.$router
        .push({
          name: "Add",
        })
        .catch(() => {});
    },
  },
};
</script>