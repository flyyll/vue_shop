<template>
  <div class="add">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="Number(activeIndex)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFromRules"
        label-width="100px"
        label-position="top"
        size="normal"
      >
        <!-- tab栏区域 -->
        <!-- 
        tab-position : 指定标签所在位置
        v-model="activeIndex": 点击后, 会把对应的name 储存现在这里。 做到和上面的 不走条起到联动的效果

        before-leave: tab的切换操作
       -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" size="normal" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" size="normal" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量(kg)"
              size="normal"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量(个)"
              size="normal"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" size="normal" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片上传 -->
            <!-- 
              action：图片上传后台的 url 地址
              on-preview: 图片预览事件
              on-remove: 删除图片时触发的事件
              headers: 缺少 token 手动上传 请求头部
              on-success: 监测图片上传成功的钩子函数
             -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <!-- 添加商品的按钮 -->
            <el-button type="primary" size="default" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="perviewVisible" width="35%">
      <img class="perviewImg" :src="perviewpath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// 导入 lodash 插件  (使用了深拷贝)
import _ from "lodash";

import {
  getCascaderData,
  getParameterData,
  addParameterData,
} from "@/api/goods.js";
export default {
  data() {
    return {
      // 隐藏图片预览对话框
      perviewVisible: false,

      // 图片的真实路径
      perviewpath: "",

      // 图片上传组件的headers请求头部对象
      headersObj: {
        authorization: localStorage.getItem("token"),
      },

      // 上传图片的url地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //  动态参数列表数据
      manyTableData: [],
      // 静态数据赋值
      onlyTableData: [],

      // 商品分类列表数据
      catelist: [],

      // 步骤条活跃项
      activeIndex: "0",

      // 添加商品的表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数据
        goods_cat: [],
        // 储存图片的数组
        pics: [],

        // 商品的详情描述
        goods_introduce: "",

        // 储存 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: [],
      },

      // 表单验证对象
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getCascaderData();
  },

  methods: {
    //  点击添加商品分类的预验证
    async add() {
      // 预验证
      const r = await this.$refs.addFormRef.validate().catch(() => {});
      if (!r) return this.$message.error("请填写必要的表单数据!");

      // 执行添加的业务逻辑

      // api 要求为 以逗号(,)分割的字符串形式(使用join方法将数组分割成字符串)   当时级联选择框 要求以数组的形式绑定数据   方法: 使用深度拷贝

      // 1. 使用插件的 深拷贝
      const cloneFrom = _.cloneDeep(this.addForm);
      // 2. 把克隆好的数据 在重新赋值给原数据
      cloneFrom.goods_cat = cloneFrom.goods_cat.join(",");

      // 3. 处理动态参数,  把api 需要的数据提取出来  ("attr_id","attr_value")
      this.manyTableData.forEach((el) => {
        // 3.1  api 要求数据是对象的格式
        const newInfo = {
          attr_id: el.attr_id,
          attr_value: el.attr_vals.join(" "),
        }; //  el.attr_vals.join(' ')   api 要求是数据是字符串类型,  此时动态参数的数据类型为 数组  所以要用 join 转换

        // 3.2 把行的数据赋值给   attrs
        this.addForm.attrs.push(newInfo);
      });

      // 4. 处理静态属性, 把api 需要的数据提取出来  ("attr_id","attr_value")
      this.onlyTableData.forEach((el) => {
        // 3.1  api 要求数据是对象的格式
        const newInfo = { attr_id: el.attr_id, attr_value: el.attr_vals };

        // 3.2 把行的数据赋值给   attrs
        this.addForm.attrs.push(newInfo);
      });

      // 5. 把数据赋值给深拷贝过来的数据
      // 最终提交的是深拷贝过来的数据
      cloneFrom.attrs = this.addForm.attrs;

      // 6. 发起请求 商品添加操作
      const { data: res } = await addParameterData(cloneFrom);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);

      // 7. 跳转到对应页面

      this.$router.push('/goods')
    },

    //  监听图片上传成功的事件
    handleSuccess(response) {
      // response 请求返回信息

      //  1. 拼接得到一个图片对象信息
      const pricInfo = { pic: response.data.tmp_path };
      // 2. 将图片信息对象,push 到 pics 数组中
      this.addForm.pics.push(pricInfo);
    },

    //  处理移除图片的操作
    handleRemove(file) {
      // file 将要被移除的那个图片的信息
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;

      // 2. 从 pics 数组中,找到这个图片对应的索引值  使用findIndex() 方法找到索引值
      const PicsIndex = this.addForm.pics.findIndex((i) => {
        // 如果属性相同 就返回其索引值
        i.pic === filePath;
      });

      // 3. 调用数组中的 splice 方法,把图片信息队形, 从 pics 数组中移除掉
      this.addForm.pics.splice(PicsIndex, 1);
    },

    // 处理图片预览效果
    handlePreview(file) {
      // file : 图片的信息
      // 1. 获取 图片的正式url地址
      const perviewpath = file.response.data.url;

      // 2. 将获取的url地址 储存到 perviewpath 中
      this.perviewpath = perviewpath;

      // 3. 将对话框显示出来
      this.perviewVisible = true;
    },

    async tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        // 获取的是动态的参数
        const { data: res } = await getParameterData(this.cateId, {
          sel: "many",
        });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 把字符串数据,转换成数据的形式
        // 因为遍历的数据里面有的是空数据,所以先要做一个三元判断,去点不符合要求的
        // 将有数据的属性(字符串类型),通过 split(街而过返回一个数组)  让字符串以,结尾的  组成一个数组 在赋值给原来的数据
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        });
        // 动态数据赋值
        this.manyTableData = res.data;
      } else if (
        // 证明访问的是静态参数面板
        this.activeIndex === "2"
      ) {
        // 获取的是动态的参数
        const { data: res } = await getParameterData(this.cateId, {
          sel: "only",
        });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 静态数据赋值
        this.onlyTableData = res.data;
      }
    },

    // tab 的切换
    // activeName : 进入的标签页的索引   oldActiveName: 离开的标签页的索引
    beforeLeave(activeName, oldActiveName) {
      //  做一个判断,当级联选择器没有填选就提示用户
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类!");
        // 当为 false 时 就不会做跳转
        return false;
      }
    },

    // 级联选择器选项发生变化会触发
    handleChange() {
      // 默认选中的只能是三级
      if (this.addForm.goods_cat.length !== 3) {
        // 如果不是3级,就做清空处理
        this.addForm.goods_cat = [];
      }
    },

    async getCascaderData() {
      const { data: res } = await getCascaderData();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      // 商品分类列表数据
      this.catelist = res.data;
      // console.log(this.catelist);
    },
  },

  computed: {
    disableds() {
      if (this.addForm.goods_price < 0) {
        return true;
      }
    },

    // 级联选择框的最后一项的 id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        // 把最后一项的id值返回出去,给外面的接收
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
   padding: 10px;
  .el-card {
    margin-top: 15px;

    .el-checkbox {
      margin: 0 13px 0 0 !important;
    }
    .el-tab-pane {
      .el-button {
        margin-top: 15px;
      }
    }
  }
  .el-dialog {
    .perviewImg {
      width: 100%;
    }
  }
}
</style>