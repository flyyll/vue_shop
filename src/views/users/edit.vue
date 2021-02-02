<template>
  <div>
    <el-card class="card">
      <!-- 使用命名插槽 -->
      <template #header>
        <div class="header">
          <h1>编辑用户</h1>
          <el-button type="text" @click="BackUser" class="el-icon-close">
          </el-button>
        </div>
      </template>

      <el-form
        label-width="80px"
        label-position="left"
        :rules="rules"
        :model="$store.state.users.EditData"
        ref="eidtUsers"
        v-loading="$store.state.users.FromLoading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="primary_item">
          <el-button>取消</el-button>
          <el-button type="primary" @click="eidt()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      data() {
        return {
          list: [],
        };
      },

      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^[a-z]{2,18}$/.test(value)) {
                cb();
              } else {
                cb(new Error("用户名必须是2-18个英文字符"));
              }
            },
            trigger: "change",
          },
          {
            validator: async (rule, value, cb) => {
              const r = await this.$store.dispatch("users/exist", {
                filed: "username",
                value,
              });
              if (this.$store.state.users.OldDitData.username === value) {
                cb();
                return;
              }
              if (r.data === false) {
                cb();
              } else {
                cb(new Error("用户名已存在"));
              }
            },
            trigger: "blur",
          },
        ],

        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^([A-Za-z0-9_\-\.])+\@(163.com|qq.com)$/.test(value)) {
                cb();
              } else {
                cb(new Error("邮箱格式不正确"));
              }
            },
            trigger: "change",
          },
          {
            validator: async (rule, value, cb) => {
              const r = await this.$store.dispatch("users/exist", {
                filed: "email",
                value,
              });
              if (this.$store.state.users.OldDitData.email === value) {
                cb();
                return;
              }

              if (r.data === false) {
                cb();
              } else {
                cb(new Error("邮箱已存在"));
              }
            },
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "手机号必须填写", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^1[356789]\d{9}$/.test(value)) {
                cb();
              } else {
                cb(new Error("手机号格式不正确"));
              }
            },
            trigger: "change",
          },
          {
            validator: async (rule, value, cb) => {
              const r = await this.$store.dispatch("users/exist", {
                filed: "phone",
                value,
              });
              if (this.$store.state.users.OldDitData.phone === value) {
                cb();
                return;
              }
              if (r.data === false) {
                cb();
              } else {
                cb(new Error("手机号已存在"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.$store.dispatch("users/EditUsers", this.id);
    this.$store.dispatch("users/updateUsersId", this.id);
  },
  computed: {
    username: {
      get() {
        return this.$store.state.users.EditData.username;
      },
      set(value) {
        this.$store.commit("users/SET_E_USERNAME", value);
      },
    },

    email: {
      get() {
        return this.$store.state.users.EditData.email;
      },
      set(value) {
        this.$store.commit("users/SET_E_EMAIL", value);
      },
    },
    phone: {
      get() {
        return this.$store.state.users.EditData.phone;
      },
      set(value) {
        this.$store.commit("users/SET_E_PHONE", value);
      },
    },
    gender: {
      get() {
        return this.$store.state.users.EditData.gender;
      },
      set(value) {
        this.$store.commit("users/SET_E_GENDER", value);
      },
    },
  },
  methods: {
    async eidt() {
      const r = await this.$refs.eidtUsers.validate().catch(() => {});

      if (r) {
        // this.$store.commit("users/SET_FROMLOADING", true);
        await this.$store.dispatch("users/updateUsersId", this.id);
        this.$router.push({ name: "Users" });
        // this.$store.commit("users/SET_FROMLOADING", false);
        this.$message({
          showClose: true,
          message: "编辑成功",
          type: "success",
        });
        console.log(r);
      }
    },
    BackUser() {
      this.$router.push({
        name: "Users",
      });
    },
  },
};
</script><style lang="scss" scoped>
.card {
  width: 50%;
  margin: 0 auto;
  // position: relative;
  .header {
    display: flex;
    justify-content: space-between;
    .el-icon-close {
      color: #9897ac;
      font-size: 16px;
    }
  }

  .primary_item {
    display: flex;
    justify-content: flex-end;
  }
}
</style>