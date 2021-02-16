<template>
  <div class="cate">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加区 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate"> 添加分类 </el-button>
        </el-col>
      </el-row>

      <!-- 表格插件 -->

      <vxe-table
        resizable
        border
        ref="xTree"
        :tree-config="{ children: 'children' }"
        :edit-config="{ trigger: 'click', mode: 'row' }"
        :checkbox-config="{ labelField: 'id' }"
        :data="cateList"
        class="vxe_table"
        stripe
        round
        highlight-hover-row
      >
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column
          field="cat_name"
          title="分类名称"
          tree-node
        ></vxe-table-column>
        <vxe-table-column title="是否有效">
          <!-- 是否有效 -->
          <!-- 使用作用域插槽 -->
          <template #default="{ row }">
            <i class="el-icon-success" v-if="!row.cat_deleted"></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </vxe-table-column>
        <vxe-table-column title="排序">
          <!-- 是否有效 -->
          <!-- 使用作用域插槽 -->
          <template #default="{ row }">
            <el-tag v-if="row.cat_level === 0" size="mini">一级</el-tag>
            <el-tag v-else-if="row.cat_level === 1" type="success" size="mini"
              >二级</el-tag
            >
            <el-tag v-else type="warning" size="mini">三级</el-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <!-- 是否有效 -->
          <!-- 使用作用域插槽 -->
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteCateById(row.cat_id)"
              >删除</el-button
            >
          </template>
        </vxe-table-column>
      </vxe-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :close-on-click-modal="false"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogVClose"
    >
      <!-- 内容主体区 -->

      <el-form
        :model="addCateForm"
        ref="addCateFormRef"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--  v-model 选择项发生改变时触发获取到的数据 -->
          <!-- options 用来指定数据源 -->
          <!--
             props 用来指定配置对象
             value: "cat_id" 指定的id
             label: "cat_name"  显示的名称
             children: 'children' 通过那个属性进行层级显示
          -->

          <el-cascader
            v-model="slectedKeys"
            :options="ParentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="OkAddCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑用户"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editCate"
        ref="editCateRef"
        :rules="editPowerCate"
        label-width="70px"
        @close="closeCateDialog"
      >
        <el-form-item label="用户名" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitCateById">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getGoodsList,
  addCateList,
  getParentCateList,
  editCateById,
  SubmitCateById,
  deleteCateById,
} from "@/api/goods.js";
export default {
  data() {
    return {
      // 编辑用户对话框的显示
      editDialogVisible: false,

      // 父级列表数据
      // 选择项发生改变时触发获取到的数据id
      ParentCateList: [],

      // 级联框绑定值的数据
      slectedKeys: [],

      // 添加分类的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "分类名称长度在2~10个字符",
            trigger: "blur",
          },
        ],
      },

      // 编辑表单的验证规则对象
      editPowerCate: {
        cat_name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~5个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑用户的数据
      editCate: {},

      // 添加分类表单的数据对象
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 分类父 ID
        cat_pid: 0,
        // 分类层级
        cat_level: 0,
      },
      //控制分类对话框的显示有隐藏
      addCateDialogVisible: false,

      // 接口查询的条件
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      // 商品分类的列表,默认为空
      cateList: [],

      // 分页条数数据
      total: 0,
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    //  根据 id 编辑提交分类

    async deleteCateById(id) {
      // 询问用户是否删除
      // this.$confirm()   element 提示语,  是一个promise  可以用await运算
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      // 当点击确认删除时 r 的返回值是 confirm   ,  那就拿个返回值做判断
      if (r === "confirm") {
        const { data: res } = await deleteCateById(id);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 删除成功后要刷新一下页面,
        this.getGoodsList();
      } else {
        this.$message.info("取消成功");
      }
    },

    //  根据 id 编辑提交分类
    async SubmitCateById() {
      // 预验证
      const r = await this.$refs.editCateRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;
      const { data: res } = await SubmitCateById(this.editCate.cat_id, {
        cat_name: this.editCate.cat_name,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);

      // 隐藏添加的对话框
      this.editDialogVisible = false;
      // 重新获取用户列表数据
      this.getGoodsList();
    },

    //  编辑分类的关闭事件
    closeCateDialog() {
      // 重置表单数据
      this.$refs.editCateRef.resetFields();
    },

    //  编辑用户对话框的显示
    async showEditDialog(id) {
      const { data: res } = await editCateById(id);
      console.log(res);

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //  把数据赋值给  ParentCateList
      this.editCate = res.data;

      this.editDialogVisible = true;
    },

    // 分类对话框的关闭事件,重置表单数据
    addCateDialogVClose() {
      // 重置表单数据
      this.$refs.addCateFormRef.resetFields();

      // 级联选择器绑定的数据,重置为空
      this.slectedKeys = [];

      // 父级分类数据重置为空
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 点击按钮添加分类
    async OkAddCate() {
      //  预验证
      const r = await this.$refs.addCateFormRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;
      const { data: res } = await addCateList(this.addCateForm);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);

      // 重新调用接口属性页面
      this.getGoodsList();
      // 关闭对话框
      this.addCateDialogVisible = false;
    },

    //  选择项发生改变时触发
    parentCateChange() {
      // 通过判断 this.slectedKeys 这个数组有没有长度,来确定用户有没有触发级联选择器
      if (this.slectedKeys.length > 0) {
        // 如果有触发, 就以最后一个id 作为父级id
        // 以最后一个id作为副局原因是选中的永远是最后一个
        this.addCateForm.cat_pid = this.slectedKeys[
          this.slectedKeys.length - 1
        ];
        // 为当前分类登记赋值
        this.addCateForm.cat_level = this.slectedKeys.length;

        // return 结束此操作
        return;
      } else {
        // 如果没有触发 就默认值为一级权限
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击按钮展示分类对话框
    addCate() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    //  商品分类数据列表
    async getParentCateList() {
      const { data: res } = await getParentCateList({ type: 2 });
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //  把数据赋值给  ParentCateList
      this.ParentCateList = res.data;
    },

    // 监听pageSize的改变事件
    handleSizeChange(newSize) {
      this.cateInfo.pagesize = newSize;
      // 刷新页面
      this.getGoodsList();
    },
    // 监听pageNum的改变
    handleCurrentChange(newPageNum) {
      this.cateInfo.pagenum = newPageNum;
      // 刷新页面
      this.getGoodsList();
    },

    async getGoodsList() {
      const { data: res } = await getGoodsList(this.cateInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 把数据列表赋值给  cateList
      this.cateList = res.data.result; 
      // 为总数据条数赋值
      this.total = res.data.total;
    },
  },
};
</script>
<style lang="scss" scoped>
.cate {
  .el-card {
    margin-top: 15px;
  }

  .vxe_table {
    margin-top: 15px;
    .el-icon-success {
      color: #16c4af;
      font-size: 18px;
    }
    .el-icon-error {
      color: #ff0000;
      font-size: 18px;
    }
  }
}
</style>