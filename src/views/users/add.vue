<template>
  <div>
    <el-card class="card">
      <!-- 使用命名插槽 -->
      <template #header>
        <div class="header">
          <h1>用户注册</h1>
          <el-button type="text" @click="BackUser" class="el-icon-close">
          </el-button>
        </div>
      </template>

      <el-form
        label-width="80px"
        label-position="left"
        :rules="rules"
        :model="$store.state.users.AddFrom"
        ref="addUser"
        v-loading="$store.state.users.FromLoading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ConfirmPassword">
          <el-input
            type="password"
            v-model="ConfirmPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="phone"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="primary_item">
          <el-button>取消</el-button>
          <el-button type="primary" @click="add">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
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
              if (r.data === false) {
                cb();
              } else {
                cb(new Error("用户名已存在"));
              }
            },
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        ConfirmPassword: [
          {
            required: true,
            message: "请确定密码",
            trigger: "blur",
          },
          {
            validator: (rule, value, cb) => {
              if (this.password === value) {
                cb();
              } else {
                cb(new Error("两次密码不一致"));
              }
            },
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
  computed: {
    username: {
      get() {
        return this.$store.state.users.AddFrom.username;
      },
      set(value) {
        this.$store.commit("users/SET_USERNAME", value);
      },
    },
    password: {
      get() {
        return this.$store.state.users.AddFrom.password;
      },
      set(value) {
        this.$store.commit("users/SET_PASSWORD", value);
      },
    },
    email: {
      get() {
        return this.$store.state.users.AddFrom.email;
      },
      set(value) {
        this.$store.commit("users/SET_EMAIL", value);
      },
    },
    phone: {
      get() {
        return this.$store.state.users.AddFrom.phone;
      },
      set(value) {
        this.$store.commit("users/SET_PHONE", value);
      },
    },
    gender: {
      get() {
        return this.$store.state.users.AddFrom.gender;
      },
      set(value) {
        this.$store.commit("users/SET_GENDER", value);
      },
    },
    ConfirmPassword: {
      get() {
        return this.$store.state.users.AddFrom.ConfirmPassword;
      },
      set(value) {
        this.$store.commit("users/SET_CONFIRMPASSWORD", value);
      },
    },
  },
  methods: {
    async add() {
      const r = await this.$refs.addUser.validate().catch(() => {});

      if (r) {
        this.$store.commit("users/SET_FROMLOADING", true);
        await this.$store.dispatch("users/AddUser");
        this.$refs.addUser.resetFields();
        this.$store.commit("users/SET_FROMLOADING", false);
        this.$message({
          showClose: true,
          message: "添加成功",
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