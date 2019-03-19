<template>
  <div class="auth-box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分配权限" name="1">
        <allot class="flex-up"></allot>
      </el-tab-pane>
      <el-tab-pane label="编辑权限" name="2">
        <consult class="flex-up"></consult>
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
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};

</script>
<style lang="scss">
  .auth-box {
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;

    /deep/ .el-tabs {
      height: 100%;
    }

    /deep/ .el-tabs__content {
      height: calc(100%);
    }

    /deep/ .el-tab-pane {
      height: 100%;
    }
  }

  .flex-up {
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
  }

  .scroll-bar {
    min-width: 1200px;
    flex-grow: 8 !important;
  }

  .handler-box {
    flex: 1 1 12px;
  }

  .list-checkbox {
    width: 300px;
    line-height: 40px;

    .scroll-box {
      width: 200px;
      height: 56vh;
      border: 1px solid #eee;
      margin-top: 10px;
      flex-grow: unset !important;
    }

    li {
      border: 1px solid #fff;
      &.actived {
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        border-radius: 10px;
      }

      .name {
        width: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        height: 100%;
      }
    }
  }
</style>
