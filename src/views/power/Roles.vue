<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <!-- 使用24榄栅布局 -->
            <el-row
              v-for="(item1, index1) in row.children"
              :key="item1.id"
              :class="[
                index1 === 0 ? 'el_tag_top' : 'el_tag_bottom',
                'vcenter',
              ]"
            >
              <!-- 循环得出一级权限 -->
              <el-col :span="5" :offset="0">
                <el-tag closable @close="removeRightById(row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 循环得出二/三级权限 -->
              <el-col :span="19" :offset="0">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'el_tag_top', 'vcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色名称"> </el-table-column>
        <el-table-column width="300px" label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row.id)"
            >
              编辑
            </el-button>

            <!-- 删除角色按钮 -->

            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeRelosById(row.id)"
              size="mini"
              >删除</el-button
            >

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :close-on-click-modal="false"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog"
    >
      <!-- 修改用户的对话框 -->

      <!-- 内容主体区 -->
      <el-form
        :model="editRoles"
        :rules="editRolesRules"
        ref="editRolesRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRelosInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :close-on-click-modal="false"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <!-- 树形控件 -->
      <!-- node-key="id" 表示具体选中的值为id -->
      <el-tree
        show-checkbox
        :data="rightList"
        :props="treeProps"
        :default-expand-all="true"
        ref="setTreePowerRef"
        node-key="id"
        :default-checked-keys="defKeys"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  editRoles,
  addRoles,
  deleteRoles,
  deleteRight,
  getRight,
  roleEmpower,
} from "@/api/power.js";
export default {
  data() {
    return {
      // 获取分配权限时所需要的id
      roleId: "",

      // 所有权限的数据
      rightList: [],

      // 树形控件的属性绑定对象

      treeProps: {
        // 指定子树为节点对象的某个属性值
        children: "children",
        label: "authName",
      },

      // 树状默认选中的节点id值
      defKeys: [],

      // 控制分配权限对话框的显示与隐藏
      SetRightDialogVisible: false,

      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,

      // 所有角色列表数据
      rolist: [],

      // 编辑用户的信息数据
      editRoles: {},

      // 编辑表单的验证规则对象
      editRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度在2~5个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3~10个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    // 上来就调用数据,为了直接把数据展示在页面
    this.getRoles();
  },

  methods: {
    // 为角色分配权限
    async allotRights() {
      // 获取所有被选中、叶子节点的key和半选中节点的key
      // 调用tree组件的方法 ,获取全选状态下的key,和半选状态下的key,因为要求是数组所有定义一个数组
      const keys = [
        ...this.$refs.setTreePowerRef.getCheckedKeys(),
        ...this.$refs.setTreePowerRef.getHalfCheckedKeys(),
      ];
      // 根据后端要求 以 `,` 分隔获取的id
      const separate = keys.join(",");
      // 获取分配去权限的数据
      const { data: res } = await roleEmpower(this.roleId, { rids: separate });
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg)

        // 重新调用数据,数据才会展示出来
       this.getRoles();

      //  关闭对话框
       this.SetRightDialogVisible = false
    },

    // 关闭对话框清空数据
    closeDialog() {
      this.defKeys = [];
    },

    // 展示分配权限的对话框
    async showSetRightDialog(row) {
      // 获取分配权限时所需要的id b
     this.roleId = row.id

      // 获取所有权限的数据
      const { data: res } = await getRight();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 获取到的权限数据
      this.rightList = res.data;

      // 通过id 映射相应的数据

      // // 方法一: 通过循环遍历,把数据映射到树状组件上
      // await row.children.forEach((el) => {
      //   return el.children.filter((el) => {
      //     el.children.forEach((el) => {
      //       this.defKeys.push(el.id + "");
      //     });
      //   });
      // });

      // 方法二: 通过递归的到三级菜单
      this.getLeafKeys(row, this.defKeys);
      this.SetRightDialogVisible = true;
    },

    // 方法二: 通过递归的到三级菜单
    getLeafKeys(node, arr) {
      // 如果没有children 就代表到三级菜单了
      if (!node.children) {
        // 然后赋值操作
        return arr.push(node.id);
      }
      // 如果有children就代表没到第三级菜单
      // 就直接遍历操作，在返回出去这个函数，递归操作
      node.children.forEach((el) => {
        return this.getLeafKeys(el, arr);
      });
    },

    // 根据id删除对应的权限
    async removeRightById(roleId, rightId) {
      // 弹窗提示用户是否删除
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      if (r === "confirm") {
        const { data: res } = await deleteRight(roleId.id, rightId);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success("删除权限成功");
        // 删除成功后不需要刷新页面,只需要把数据重新赋值到角色数据里
        roleId.children = res.data;
      } else {
        this.$message.info("取消成功");
      }
    },

    //  根据id删除对应的用户信息
    async removeRelosById(id) {
      // 询问用户是否删除
      // this.$confirm()   element 提示语,  是一个promise  可以用await运算
      const r = await this.$confirm("您确定要删除吗?", "提示", {
        type: "warning",
      }).catch(() => {});
      // 当点击确认删除时 r 的返回值是 confirm   ,  那就拿个返回值做判断
      if (r === "confirm") {
        const { data: res } = await deleteRoles(id);
        // 当用户删除成功提示用户
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 删除成功后要刷新一下页面,
        this.getRoles();
      } else {
        this.$message.info("取消成功");
      }

  
    },

    // 监听修改用户对话框的关闭事件
    closeEditDialog() {
      this.$refs.editRolesRef.resetFields();
    },
    // 修改用户信息的预验证
    async editRelosInfo() {
      const r = await this.$refs.editRolesRef.validate().catch(() => {});
      // 如果不是true 就不通过
      if (!r) return;

      // 发起修改用户信息的数据请求
      const { data: res } = await addRoles(this.editRoles.roleId, {
        roleName: this.editRoles.roleName,
        roleDesc: this.editRoles.roleDesc,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.$message.success("修改成功");

      // 隐藏添加的对话框
      this.editDialogVisible = false;
      // 重新获取用户列表数据
      this.getRoles();
    },

    // 编辑用户数据
    async showEditDialog(id) {
      const { data: res } = await editRoles(id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editRoles = res.data;

      this.editDialogVisible = true;
    },

    // 获取角色列表区域
    async getRoles() {
      const { data: res } = await getRoles();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolist = res.data;


    },
  },
};
</script>
<style lang="scss" scoped>
.roles {
   padding: 10px;
  .el-card {
    margin-top: 15px;

    .el-tag {
      margin: 7px;
    }
    .vcenter {
      display: flex;
      align-items: center;
    }
    .el_tag_top {
      border-top: 1px solid #eee;
    }
    .el_tag_bottom {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>

