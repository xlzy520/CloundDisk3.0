<!--  -->
<template>
  <div class="AuthBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分配权限" name="1">
        <allot></allot>
      </el-tab-pane>
      <el-tab-pane label="编辑权限" name="2">
        <consult></consult>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import allot from './allot.vue';
import consult from './consult.vue';

export default {
  data () {
    return {
      activeName: '1',
    };
  },
  components: {
    allot,
    consult
  },
  created() {
    if (this.$route.query.isEdit === "1") {
      this.activeName = "2";
    }
  },
  beforeDestroy() {
    localStorage.obj = "";
  },
  computed: {
    fcategoryid: {
      get: function() {
        return JSON.parse(localStorage.obj).map(v => {
          return v.fcategoryid;
        }).join(",");
      },
      set: function() {}
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};

</script>
<style lang="scss" scoped>
  .AuthBox {
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;
  }
</style>