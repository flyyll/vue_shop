<template>
  <div class="orders">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card style="margin-top: 15px">
      <!-- 搜索区 -->
      <el-row>
        <el-col :span="8">
          <el-input class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款">
          <template #default="{ row }">
            <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间">
          <template #default="{ row }">
            {{ moment(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="light"
              content="编辑"
              :enterable="false"
              placement="top"
            >
              <el-button
                @click="showBox"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              >
              </el-button>
            </el-tooltip>
            <!-- 物流信息按钮 -->
            <el-tooltip
              effect="light"
              content="物流进度"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-location-outline"
                size="mini"
                @click="showProgressBox"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :close-on-click-modal="false"
      :visible.sync="addressDialogVisible"
      width="40%"
      @close="addressDialogVisibleClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="adderssFrom"
        :rules="adderssRolesRules"
        ref="adderssRolesRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="adderss1">
          <el-cascader
            size="large"
            :options="regionData"
            v-model="adderssFrom.adderss1"
            :props="{
              expandTrigger: 'hover',
            }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adderss2">
          <el-input v-model="adderssFrom.adderss2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :close-on-click-modal="false"
      :visible.sync="ProgressDialogVisible"
      width="30%"
    >
      <el-timeline>
        <!-- 循环得到的数据的时间属性 (具体看 api 文档) -->
        <el-timeline-item
          v-for="(activity, index) in logisticsInfo"
          :key="index"
          :timestamp="activity.time"
          :color="activity.color"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>


<script>
// 引入省市县三级联动插件
import { regionData } from "element-china-area-data";

// 引用moment日期处理库把事件进行转换
import moment from "moment";

import { getOrders } from "@/api/orders.js";
export default {
  data() {
    return {
      //  物流信息对话框的显示与否
      ProgressDialogVisible: false,

      // 级联选择框数据源(插件)
      regionData,

      // 修改地址数据
      adderssFrom: {
        // 是一个级联选择器,应该是一个数组
        adderss1: [],
        // 文本输入框
        adderss2: "",
      },

      // 修改地址的验证规则对象
      adderssRolesRules: {
        adderss1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        adderss2: [
          { required: true, message: "请填写详细地址 ", trigger: "blur" },
        ],
      },

      //  修改地址对话框的显示与否
      addressDialogVisible: false,

      // 订单数据列表
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      // 商品列表数据
      ordersList: [],

      // 总数据条数
      total: 0,

      // 静态物流信息
      logisticsInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
          color: "#0bbd87",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },

  created() {
    this.getOrders();
  },

  methods: {
    // 展示物流信息对话框
    async showProgressBox() {
      // 发起请求 获取物流的数据
      // const { data: res } = await getProgressData(1106975712662);
      // console.log(res);
      console.log(this.ordersList);
      this.ProgressDialogVisible = true;
    },

    // 修改地址对话框的关闭事件
    addressDialogVisibleClose() {
      // 关闭后清空表
      this.$refs.adderssRolesRef.resetFields();
    },

    // 展示修改地址的对话框
    showBox() {
      // 显示对话框
      this.addressDialogVisible = true;
    },
    // 监听页码值改变的事件
    handleCurrentChange(newSize) {
      // 改变的页码值,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getOrders();
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newPage) {
      // 改变的pagesize,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newPage);
      this.queryInfo.pagesize = newPage;
      this.getOrders();
    },

    // moment日期处理库
    moment(time) {
      moment.locale("zh-cn"); //设置语言
      return moment(time).format("YYYY-MM-DD h:mm:ss");
    },

    async getOrders() {
      const { data: res } = await getOrders(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.total = res.data.total;
      this.ordersList = res.data.goods;
    },
  },
};
</script>

<style lang="scss" scoped>
.orders {
  padding: 10px;
  .el-dialog {
    border: 1px solid;
  }
}
</style>