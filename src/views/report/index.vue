<template>
  <div class="report">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card style="margin-top: 15px">
      <!-- 2. 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 1000px; height: 530px"></div>
    </el-card>
  </div>
</template>
<script>
// 1.  导入可视化图表库 (echarts)
import * as echarts from "echarts";

import { getReportsData } from "@/api/reports.js";

// 导入 lodash 插件  (对象的合并)
import _ from "lodash";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },

  // 只能在dom渲染完成后初始化图表  所以只能在 mounted 中初始化图表
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 展示图表数据
    const { data: res } = await getReportsData();
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    console.log(res);

    // 4. 指定图表的配置项和数据
    // 获取的数据不追却需合并两个对象
    // 使用 lodash 插件合并对象
    const newOptions = _.merge(this.options, res.data);

    // 5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(newOptions);
  },
};
</script>

<style lang="scss" scoped>
.report {
  padding: 10px;
  .canvas {
    border: 1px solid;
  }
}
</style>