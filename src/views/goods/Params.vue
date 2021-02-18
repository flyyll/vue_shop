<template>
  <div class="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类参数 </el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区 -->
    <el-card>
      <!-- 卡片警告区 -->
      <el-alert
        title="注意：只允许修改第三级分类设置的相关参数!"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="catopt">
        <el-col :span="12" :offset="0">
          <span class="text">选择商品分类：</span>

          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="slectedcateKeys"
            :options="cateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区 -->
      <!-- v-modle 绑定值，默认选中选项卡的 name -->
      <el-tabs
        class="tab-item"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            size="mini"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >

          <!-- 动态参数的表格 -->
          <el-table stripe border :data="manyTableDate">
            <el-table-column type="expand">
              <!-- 通过循环遍历出对应数据 -->
              <!-- 使用作用域插槽 -->
              <template #default="{ row }">
                <el-tag
                  v-for="(item, index) in row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delEditParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only"
          >
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            size="mini"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性的表格 -->
          <el-table stripe border :data="onlyTableDate">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 通过循环遍历出对应数据 -->
              <!-- 使用作用域插槽 -->
              <template #default="{ row }">
                <el-tag v-for="(item, index) in row.attr_vals" :key="index" 
                closable @close="handleClose(index, row)">{{
                  item
                }}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delEditParams(row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="titleText"
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addUsers"
        ref="addUsersRef"
        :rules="addUsersRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addUsers.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editUsers"
        ref="editUsersRef"
        :rules="editUsersRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editUsers.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsCateList,
  getParameterList,
  addParamsDataList,
  editParamsDataList,
  submitParamsDataList,
  delParamsDataList,
  SubmitElTagData,
} from "@/api/goods.js";
export default {
  data() {
    return {
      // 级联选择框双向绑定的数组
      slectedcateKeys: [],

      // 商品分类数据列表
      cateList: [],

      // 默认选中的页卡名
      activeName: "many",

      // 此处储存的是动态参数数据
      manyTableDate: [],
      // 此处储存的是静态属性数据
      onlyTableDate: [],

      // 控制添加参数对话框的显示隐藏
      addDialogVisible: false,

      // 添加参数表单数据对象
      addUsers: {
        attr_name: "",
      },

      // 添加参数表单的验证规则
      addUsersRules: {
        attr_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~5个字符",
            trigger: "blur",
          },
        ],
      },

      // 控制修改对话框的显示与否
      editDialogVisible: false,

      //修改表单的数据对象
      editUsers: {},

      // 修改表单的验证规则
      editUsersRules: {
        attr_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在2~10个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getGoodsCateList();
  },

  methods: {
    // 删除对应的参数可选项
    handleClose(index, row) {
      // 点击关闭删除数组中的某一项
      row.attr_vals.splice(index, 1);
      // 把数据重新放进数据库
      this.saveAttrVals(row);
    },

    // 文本框失去焦点,或者摁下 Enter 都会触发
    async handleInputConfirm(row) {
      //  做一层优化, 当输入文字后,去除(trim)左右两端空格。当输入的文字为空时,带把你输入的文字不合法,直接置为空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";

        // 失去焦点时显示 button 按钮
        row.inputVisible = false;

        // 因为你输入的值为空, 所以直接return 出去
        return;
      }

      // 如果没有return证明用户输入内容,需要做后续处理
      // 把用户输入的值,放进attr_vals中,用为循环遍历的就是这个数组
      row.attr_vals.push(row.inputValue.trim());

      // 当把用户输入的值传入 attr_vals 后, 文本输入框里面的值就没有意义了,为了严谨直接做清空文本框操作
      row.inputValue = "";

      // 失去焦点时显示 button 按钮
      row.inputVisible = false;

      // 发送网络请求,把用户输入的数据提交到数据库中保存
      this.saveAttrVals(row);
    },

    // 因为多次用到所以抽离出来组成一个新函数
    async saveAttrVals(row) {
      const { data: res } = await SubmitElTagData(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 因为数据库数据是字符串,现在这个数据已经是数据了,所以要把数据转换成字符串(join) , 以逗号分隔
        attr_vals: row.attr_vals.join(","),
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("操作成功!");
    },

    //  点击按钮显示输入文本框
    showInput(row) {
      row.inputVisible = true;

      // 让文本框自动获取焦点

      // $nextTick 方法的作用: 当页面元素被重新渲染后,才会指定会点元素中的代码
      // 如果 直接拿  this.$refs.saveTagInput.$refs.input.focus();  很可能会查找不到  因为 dom 没有被渲染,  $nextTick 就是表示dom渲染之后在使用回调函中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //  删除信息
    async delEditParams(id) {
      // 询问用户是否删除
      // this.$confirm()   element 提示语,  是一个promise  可以用await运算
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      // 当点击确认删除时 r 的返回值是 confirm   ,  那就拿个返回值做判断
      if (r === "confirm") {
        const { data: res } = await delParamsDataList(this.cateId, id);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 删除成功后要刷新一下页面,
        this.getParamsData();
      } else {
        this.$message.info("取消成功");
      }
    },

    // 点击确定修改按钮的信息
    async editParams() {
      const r = await this.$refs.editUsersRef.validate().catch(() => {});
      // 如果不是true 就不通过

      if (!r) return;
      const { data: res } = await submitParamsDataList(
        this.cateId,
        this.editUsers.attr_id,
        { attr_name: this.editUsers.attr_name, attr_sel: this.activeName }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);

      // 隐藏添加的对话框
      this.editDialogVisible = false;
      // 重新获取用户列表数据
      this.getParamsData();
    },

    //  修改对话框的关闭事件
    editDialogClose() {
      // 重置修改的表单
      this.$refs.editUsersRef.resetFields();
    },

    // 点击按钮修改对话框
    async showEditDialog(id) {
      const { data: res } = await editParamsDataList(this.cateId, id, {
        attr_sel: this.activeName,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      //  把数据储存到相应的对象里
      this.editUsers = res.data;

      console.log(this.editUsers);
      this.editDialogVisible = true;
    },

    // 点击按钮,确定添加参数
    async addParams() {
      const r = this.$refs.addUsersRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;

      const { data: res } = await addParamsDataList(this.cateId, {
        attr_name: this.addUsers.attr_name,
        attr_sel: this.activeName,
      });
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);

      // 隐藏添加的对话框
      this.addDialogVisible = false;
      // 重新获取用户列表数据
      this.getParamsData();

      // console.log(res);
    },

    //  监听添加对话框关闭的事件
    addDialogClose() {
      this.$refs.addUsersRef.resetFields();
    },

    // 页卡的点击事件
    handleTabClick() {
      this.getParamsData();
      // console.log(this.activeName);
    },

    // 级联选择框发生改变会触发这个函数
    handleChange() {
      this.getParamsData();
    },

    // 此函数的为了,改变级联样式和页卡的点击事件发生东湖改变获取的数据,在他们个子函数的内部调用次函数就可以
    async getParamsData() {
      // 要求: 只能选中最后一级菜单,选择其他全部不行

      if (this.slectedcateKeys.length !== 3) {
        // 清空 级联选择框数据数据
        this.slectedcateKeys = [];

        // 清空动态数据数据
        this.manyTableDate = [];

         // 清空静态数据数据
        this.onlyTableDate = [];
        return;
      }

      // 获取分类参数列表
      const { data: res } = await getParameterList(this.cateId, {
        sel: this.activeName,
      });
      // 现在数据是两份,需要做一下判断,分别把不同的数据储存在不同的地方

      // 遍历数据把数组里面 attr_vals 字符串 把以空格分隔的 打撒组成成一个数组
      res.data.forEach((item) => {
        // 因为遍历的数据里面有的是空数据,所以先要做一个三元判断,去点不符合要求的
        // 将有数据的属性(字符串类型),通过 split(街而过返回一个数组)  让字符串以,结尾的  组成一个数组 在赋值给原来的数据
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];

        // 增加一些布尔值 , 控制 文本输入框的显示 , 原因:vue是双向绑定的,如果定义在data中改一个全部都会改变

        // 控制按钮与文本框的切换显示
        item.inputVisible = false;

        // v-model 文本框输入的数据
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        // 此处储存的是动态参数数据
        this.manyTableDate = res.data;
      } else {
        // 此时储存的是静态属性数据
        this.onlyTableDate = res.data;
      }
    },

    // 获取数据, 次数据应该在值发生改变的时候获取,所以应放在改变级联框触发的函数中
    async getGoodsCateList() {
      const { data: res } = await getGoodsCateList();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
      // console.log(this.cateList);
    },
  },

  computed: {
    // 控制tabs的使用和禁用
    isBtnDisabled() {
      if (this.slectedcateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },

    // 分类列表的id
    cateId() {
      if ((this.slectedcateKeys.length = 3)) {
        // 把最后一项的id值返回出去,给外面的接收
        return this.slectedcateKeys[this.slectedcateKeys.length - 1];
      } else {
        return null;
      }
    },

    // 动态标题
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.params {
   padding: 10px;
  .el-card {
    margin-top: 15px;

    .catopt {
      margin-top: 15px;

      .text {
        font-weight: 550;
      }
    }

    .tab-item /deep/ .el-tabs__nav-wrap::after {
      // background-color: red;
      height: 2px;
      border-radius: 5px;
    }
    .tab-item /deep/ .el-tabs__active-bar {
      height: 2px;
      background-color: #43bd85;
      border-radius: 5px;
    }

    .el-tag {
      margin: 8px;
    }

    .el-input {
      width: 120px;
    }
  }
}
</style>