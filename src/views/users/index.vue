<template>
  <div>
    <el-card shadow="never" class="card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="ClickAdd">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-input
      placeholder="请输入内容"
      v-model="searchValue"
      class="input-with-select"
    >
      <el-select v-model="searchField" slot="prepend" placeholder="请选择">
        <el-option label="用户名" value="username"></el-option>
        <el-option label="邮箱" value="email"></el-option>
        <el-option label="手机号" value="phone"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="getUsers()"
      ></el-button>
    </el-input>
    <el-table
      v-loading="$store.state.users.TableLoading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      :data="$store.state.users.list.result"
      border
      stripe
      class="aaa"
    >
      <el-table-column prop="username" label="用户名" width="200px" class="bbb">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="200">
      </el-table-column>
      <el-table-column label="性别" width="60px">
        <template #default="{ row }">
          {{ ["女", "男"][row.gender] }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200px">
      </el-table-column>
      <el-table-column prop="ctime" label="创建日期" width="250px">
        <template #default="{ row }">
          {{ moment(row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class="ubut">
        <template #default="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                name: 'EditUser',
                params: { id: row._id },
              })
            "
            >编辑</el-button
          >
          <el-button type="text" icon="el-icon-delete" @click="del(row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="$store.state.users.list.count"
      @current-change="currentChange"
      :page-size="PageSize"
    >
    </el-pagination> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="currentChange"
      :page-size="PageSize"
      :page-sizes="[5, 10]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="$store.state.users.list.count"
    >
    </el-pagination>
  </div>
</template>

<script>
// import day from "dayjs";
// import isLeapYear from "dayjs/plugin/isLeapYear";
// import "dayjs/locale/zh-cn";
import moment from "moment";
export default {
  data() {
    return {
      PageNums: 1,
      searchField: "username",
      searchValue: "",
      PageSize: 5,
      page: 1,
    };
  },
  mounted() {
    this.getUsers();
    // this.$store.dispatch("users/addUsers", {
    //   page: this.page,
    //   perPage: this.PageSize,
    //   searchField: this.searchField,
    //   searchValue: this.searchValue,
    // });
  },
  methods: {
    async del(id) {
      const r = await this.$confirm("您确定要删除吗?").catch(() => {});

      if (r === "confirm") {
        await this.$store.dispatch("users/deleteUsersId", id);
        this.getUsers(this.PageNums);
      }
    },
    getUsers(page = 1) {
      const where = {};
      if (this.searchField !== "" && this.searchValue !== "") {
        where.searchField = this.searchField;
        where.searchValue = this.searchValue;
      }
      this.$store.dispatch("users/addUsers", {
        page,
        perPage: this.PageSize,
        ...where,
      });
    },
    handleSizeChange(page) {
      this.PageSize = page;
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
      return moment(time).fromNow();
    },
    ClickAdd() {
      this.$router
        .push({
          name: "ADD",
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
</style>


