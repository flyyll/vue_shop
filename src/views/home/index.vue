<template>
  <div>
    home
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          username: this.$store.state.users.list.result,
        },
      ],
    };
  },
 
};
</script>
