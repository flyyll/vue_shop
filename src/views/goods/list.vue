<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="10">
        <el-col :span="8" :offset="0">
          <!-- 

             v-model="queryInfo.query"
             绑定查询参数数据

               @clear="getListData" 
               清除设置: 清除后再次调用页面数据
           -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getListData"
            @keyup.enter.native="getListData"
          >
            <!-- 
             @click="getListData"
             点击按钮,直接调用页面数据 
           -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getListData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <!--  @click="addDialogVisible = true" 开启对话框 -->
          <el-button type="primary" @click="addCommodity"> 添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px">
        </el-table-column>

        <el-table-column label="创建时间" prop="upd_time" width="140px">
          <template #default="{ row }">
            {{ moment(row.upd_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- 通过作用域插槽渲染 操作栏-->

          <template #default="{ row }">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="编辑"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(row.id)"
              >
              </el-button>
            </el-tooltip>
            <!-- 删除角色按钮 -->
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeById(row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 引用moment日期处理库把事件进行转换
import moment from "moment";
import { getListData, delListData } from "@/api/goods.js";
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },

      // 商品列表数据
      goodList: [],

      // 总数据条数
      total: 0,
    };
  },

  created() {
    this.getListData();
  },

  methods: {
    // 编程式导航
    addCommodity() {
      this.$router.push({
        path: "/goods/list",
      });
    },

    //  根据id 删除数据
    async removeById(id) {
      // 询问用户是否删除
      // this.$confirm()   element 提示语,  是一个promise  可以用await运算
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      // 当点击确认删除时 r 的返回值是 confirm   ,  那就拿个返回值做判断
      if (r === "confirm") {
        const { data: res } = await delListData(id);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 删除成功后要刷新一下页面,
        this.getListData();
      } else {
        this.$message.info("取消成功");
      }
    },

    // 监听页码值改变的事件
    handleCurrentChange(newSize) {
      // 改变的页码值,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getListData();
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newPage) {
      // 改变的pagesize,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newPage);
      this.queryInfo.pagesize = newPage;
      this.getListData();
    },

    // moment日期处理库
    moment(time) {
      moment.locale("zh-cn"); //设置语言
      return moment(time).format("YYYY-MM-DD h:mm:ss");
    },

    // 根据分页获取对应的商品列表
    async getListData() {
      const { data: res } = await getListData(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // console.log(res);

      // 商品列表数据
      this.goodList = res.data.goods;
      // 总数据条数
      this.total = res.data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
   padding: 10px;
  .el-card {
    margin-top: 15px;
  }
}
</style>