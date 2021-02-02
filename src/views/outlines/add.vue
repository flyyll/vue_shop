<template>
  <div>
    <el-card>
      <div slot="header">
        <h2>
          添加大纲
          <el-button type="text" @click="BackIndex"> 返回 </el-button>
        </h2>
      </div>
      <el-form
        :model="$store.state.outlines.addFrom"
        :rules="rules"
        ref="addFrom"
      >
        <el-form-item label="大纲名称" prop="outlinename">
          <el-input v-model="outlinename"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOutlines">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        outlinename: [
          { required: true, message: "名称必须填写", trigger: "blur" },
          { max: 18, min: 2, message: "名称2-18个字符", trigger: "change" },
          {
            validator: async (rule, value, cb) => {
              // 调用判断字符段是否存在的接口
              const r = await this.$store.dispatch("outlines/exist", {
                field: "outlinename", // filed能写什么取决于后端接口的要求是什么
                value,
              });
              console.log(r);
              //  表示如果用户输入的值不存在就通过验证   存在当失去焦点就跳出提示
              if (r.data === false) {
                cb();
              } else {
                cb(new Error("大纲名称已存在"));
              }
            },
            trigger: "blur",
          },
          // 此处验证: 大纲名称是否存在
          // {
          //   validator: async (rule, value, cb) => {
          //     // 调用判断字符段是否存在的接口
          //     const r = await this.$store.dispatch("outlines/Exist", {
          //       filed: "outlinename", // filed能写什么取决于后端接口的要求是什么
          //       value,
          //     });
          //     //  表示如果用户输入的值不存在就通过验证   存在当失去焦点就跳出提示
          //     if (r.data === false) {
          //       cb();
          //     } else {
          //       cb(new Error("大纲名称已存在"));
          //     }
          //   },
          //   trigger: "blur",
          // },
        ],
      },
    };
  },
  computed: {
    outlinename: {
      get() {
        return this.$store.state.outlines.addFrom.outlinename;
      },
      set(value) {
        this.$store.commit("outlines/OUTLINES_LIST", value);
      },
    },
  },
  methods: {
    async addOutlines() {
      const r = await this.$refs.addFrom.validate().catch(() => {});
      console.log(r);
      if (r) {
        await this.$store.dispatch("outlines/addOutlines");
        this.$message.success("添加成功");
        // 保存完以后清空
        this.$refs.addFrom.resetFields();
        this.$router.push({
          name:"OutLinesIndex"
        })
      }
      // await  this.$store.dispatch('outlines/addOutlines')
    },
    BackIndex() {
      this.$router.push({
        name: "OutLinesIndex",
      });
    },
  },
};
</script>