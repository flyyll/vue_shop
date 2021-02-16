<template>
  <div class="users">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区 -->
      <el-row :gutter="10">
        <el-col :span="8" :offset="0">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="0">
          <!--  @click="addDialogVisible = true" 开启对话框 -->
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="手机号" prop="mobile"> </el-table-column>

        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <!-- 通过作用域插槽渲染 开关 -->
          <template #default="{ row }">
            <div>
              <el-switch v-model="row.mg_state" @change="userStateChange(row)">
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
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
                @click="removeUsersById(row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配按钮 -->
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                size="mini"
                @click="setRole(row)"
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
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :close-on-click-modal="false"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <!-- 内容主体区 -->

      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFromRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="editUsers"
        ref="editUsersRef"
        :rules="editUsersRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="true" v-model="editUsers.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUsers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsersInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :close-on-click-modal="false"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="closeSetRoleDialog"
    >
      <!-- 内容主体区 -->
      <div>
        <p>用户的名称:{{ UserInfo.username }}</p>
        <p>当前的角色:{{ UserInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRolesId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUsers,
  modifyUsersState,
  addUsers,
  editUsers,
  submitUsers,
  deleteUsers,
  addRoles,
  distributionRoles,
} from "@/api/users.js";
export default {
  data() {
    return {
      // 已选中角色的id值
      selectedRolesId: "",

      // 所有角色的数据列表
      rolesList: [],

      //  需要被分配角色的用户数据
      UserInfo: {},
      // 控制分配用户对话框的显示与隐藏
      setRoleDialogVisible: false,

      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,

      // 编辑用户的信息数据
      editUsers: {},
      // 添加用户的表单数据
      addForm: {
        username: "",
        mobile: "",
        email: "",
        password: "",
      },
      // 添加表单的验证规则对象
      addFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~5个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名长度在6~15个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          // 自定义邮箱校验规则
          {
            validator: (rule, value, cb) => {
              /*
          1. cb 里面传一个 new Error 抛出错误信息  表示不管写什么都会弹出错误信息
          2. 如果 cb 什么都不传表示什么都正确  cb()
          */

              //  表示如果用户输入的符合要求就通过  不符合就跳出提示
              if (
                /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(
                  value
                )
              ) {
                cb();
              } else {
                cb(new Error("请输入合法的邮箱"));
              }
            },
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },

          // 自定义手机号校验规则
          {
            validator: (rule, value, cb) => {
              if (
                /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
                  value
                )
              ) {
                cb();
              } else {
                cb(new Error("请输入合法的手机号"));
              }
            },
            trigger: "blur",
          },
        ],
      },

      // 编辑表单的验证规则对象
      editUsersRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          // 自定义邮箱校验规则
          {
            validator: (rule, value, cb) => {
              if (
                /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(
                  value
                )
              ) {
                cb();
              } else {
                cb(new Error("请输入合法的邮箱"));
              }
            },
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入用户的手机号", trigger: "blur" },

          // 自定义手机号校验规则
          {
            validator: (rule, value, cb) => {
              if (
                /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
                  value
                )
              ) {
                cb();
              } else {
                cb(new Error("请输入合法的手机号"));
              }
            },
            trigger: "blur",
          },
        ],
      },
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 获取用户列表参数对象
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示几条
        pagesize: 2,
      },
      // 用户类列表数据
      usersList: [],
      // 显示的数据个数
      total: 0,
    };
  },
  created() {
    this.getUsers();
  },

  methods: {
    // 关闭对话框后,清除对话框数据
    closeSetRoleDialog() {
      this.selectedRolesId = "";
      this.UserInfo = {};
    },

    // 点击按钮确认分配的角色
    async saveRoleInfo() {
      // 做一个判断,如果没有选择角色就提示用户

      // 做取反判断,判断selectedRoles是否有值就可
      if (!this.selectedRolesId) {
        return this.$message.error("请选择要分配的角色!");
      }

      // 如果选择相应角色,就发起数据请求,保留请求的数据

      const { data: res } = await distributionRoles(this.UserInfo.id, {
        rid: this.selectedRolesId,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getUsers();

      this.setRoleDialogVisible = false;
    },

    //  展示分配角色的对话框
    async setRole(UserInfo) {
      // 把所需要的数据进行赋值
      this.UserInfo = UserInfo;

      // 展示对话框之前,获取所有角色的列表

      const { data: res } = await addRoles();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      this.setRoleDialogVisible = true;
    },

    //  根据id删除对应的用户信息
    async removeUsersById(id) {
      // 询问用户是否删除
      // this.$confirm()   element 提示语,  是一个promise  可以用await运算
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      // 当点击确认删除时 r 的返回值是 confirm   ,  那就拿个返回值做判断
      if (r === "confirm") {
        const { data: res } = await deleteUsers(id);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 删除成功后要刷新一下页面,
        this.getUsers();
      } else {
        this.$message.info("取消成功");
      }
    },

    // 监听修改用户对话框的关闭事件
    closeEditDialog() {
      this.$refs.editUsersRef.resetFields();
    },

    // 修改用户信息的预验证
    async editUsersInfo() {
      const r = await this.$refs.editUsersRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;

      // 发起修改用户信息的数据请求
      const { data: res } = await submitUsers(this.editUsers.id, {
        email: this.editUsers.email,
        mobile: this.editUsers.mobile,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);

      // 隐藏添加的对话框
      this.editDialogVisible = false;
      // 重新获取用户列表数据
      this.getUsers();
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await editUsers(id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.editUsers = res.data;
      this.editDialogVisible = true;
    },

    // 点击按钮添加新用户时的预校验
    async addUsers() {
      // 结果返回Boolean
      const r = await this.$refs.addFormRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;

      const { data: res } = await addUsers(this.addForm);
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg);

      this.$message.success(res.meta.msg);

      // 隐藏添加的对话框
      this.addDialogVisible = false;
      // 重新获取用户列表数据
      this.getUsers();
    },

    // 监听添加用户对话框的关闭
    closeDialog() {
      this.$refs.addFormRef.resetFields();
    },

    // 监听 switch 开关的改变
    async userStateChange(userInfo) {
      // 修改状态的数据
      const { data: res } = await modifyUsersState(
        userInfo.id,
        userInfo.mg_state
      );
      if (res.meta.status !== 200) {
        // 此处当用户修改状态失败,在报错的同时,需要把用户的状态在修改成原先的状态  只需要做一下取反
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },

    // 监听页码值改变的事件
    handleCurrentChange(newSize) {
      // 改变的页码值,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newSize);
      this.queryInfo.pagenum = newSize;
      this.getUsers();
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newPage) {
      // 改变的pagesize,把它在赋值给数据,紧接着再次调用数据,实现刷新功能
      // console.log(newPage);
      this.queryInfo.pagesize = newPage;
      this.getUsers();
    },

    async getUsers() {
      const { data: res } = await getUsers(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.users {
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 10px;
  }
}
</style>