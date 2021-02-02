<template>
  <div>
    <el-card class="card">
      <!-- 使用命名插槽 -->
      <template #header>
        <div class="header">
          <h1>班级注册</h1>
          <el-button type="text" @click="BackClasses" class="el-icon-close">
          </el-button>
        </div>
      </template>
      <el-form
        label-width="80px"
        label-position="left"
        :rules="rules"
        :model="$store.state.classes.classes"
        ref="classes"
      >
        <el-form-item label="班级名" prop="classname">
          <el-input v-model="classname"></el-input>
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
        return {};
      },
      rules: {
        classname: [
          { required: true, message: "请输入班级名", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^[a-z]{2,18}$/.test(value)) {
                cb();
              } else {
                cb(new Error("班级名必须是2-18个英文字符"));
              }
            },
            trigger: "change",
          },
          {
            validator: async (rule, value, cb) => {
              const r = await this.$store.dispatch("classes/ClassExist", {
                filed: "classesname",
                value,
              });
              if (r.data === false) {
                cb();
              } else {
                cb(new Error("班级已存在"));
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    classname: {
      get() {
        return this.$store.state.classes.classes.classname;
      },
      set(value) {
        this.$store.commit("classes/SET_CLASSNAME", value);
      },
    },
  },
  methods: {
    async add() {
      const r = await this.$refs.classes.validate().catch(() => {});
      // console.log(r);
      if (r) {
        await this.$store.dispatch("classes/addClass");
        this.$refs.classes.resetFields();
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }

      // const r = await this.$store.dispatch("classes/addClass");
      // console.log(r);
    },
    BackClasses() {
      this.$router.push({
        name: "AddClass",
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