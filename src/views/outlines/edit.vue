<template>
  <div>
    <el-card>
      <div slot="header">
        <h2>
          编辑大纲
          {{ id }}
          <el-button type="text" @click="BackIndex"> 返回 </el-button>
        </h2>
      </div>
      <el-form
        :model="$store.state.outlines.EditFrom"
        :rules="rules"
        ref="ExidFrom"
      >
        <el-form-item label="大纲名称" prop="outlinename">
          <el-input v-model="outlinename"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ExidOutlines">保存</el-button>
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

  created() {
    this.$store.dispatch("outlines/EditOutlines", this.id);
    // this.$store.dispatch("outlines/UpdateOutlines", { id: this.id });
  },
  data() {
    return {
      rules: {
        outlinename: [
          { required: true, message: "名称必须填写", trigger: "blur" },
          { max: 18, min: 2, message: "名称2-18个字符", trigger: "change" },
          {
            validator: async (rule, value, cb) => {
              if (this.$store.state.outlines.EditFrom.outlinename === value) {
                cb();
                return;
              }
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
        ],
      },
    };
  },
  computed: {
    outlinename: {
      get() {
        return this.$store.state.outlines.EditFrom.outlinename;
      },
      set(value) {
        this.$store.commit("outlines/OUTLINES_EDITFROM", value);
      },
    },
  },
  methods: {
    async ExidOutlines() {
      const r = await this.$refs.ExidFrom.validate().catch(() => {});
      console.log(r);
      if (r) {
        await this.$store.dispatch("outlines/UpdateOutlines", {
          id: this.id,
          outlinename: this.$store.state.outlines.EditFrom.outlinesname,
        });
        this.$message.success("编辑成功");
        // 保存完以后清空
        this.$refs.ExidFrom.resetFields();
        this.$router.push({
          name: "OutLinesIndex",
        });
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