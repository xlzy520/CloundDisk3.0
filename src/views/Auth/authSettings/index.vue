<template>
  <div class="auth-settings">
    <el-tabs v-model="activeName" @tab-click="setTabType">
      <el-tab-pane label="分配权限" name="set"></el-tab-pane>
      <el-tab-pane label="编辑权限" name="edit"></el-tab-pane>
      <permission-tab ref="permission" class="permission-main flex-column" :type="activeName"></permission-tab>
    </el-tabs>
  </div>
</template>

<script>
  import permissionTab from './permissionTab.vue';

  export default {
    name: 'AuthSettings',
    data() {
      return {
        activeName: 'edit',
      };
    },
    components: {
      permissionTab
    },
    methods: {
      setTabType() {
        this.$refs.permission.resetData();
      }
    },
    created() {
      if (this.$route.query.isConfigured === "1") {
        this.activeName = "edit";
      } else {
        this.activeName = "set";
      }
    },
  };
</script>

<style lang="scss">
  .auth-settings {
    width: 100%;
    padding-left: 20px;
    .permission-main {
      height: calc(100vh - 105px); /*105px为导航栏与权限tab栏的高度加margin*/
    }
    .scroll-bar {
      min-width: 1200px;
    }
  }
  .list-check {
    display: flex;
    justify-content: space-around;
    line-height: 40px;
    .scroll-box {
      height: 64vh;
      border: 1px solid #eee;
      margin-top: 10px;
      flex-grow: unset !important;
    }
    .org-radio {
      border: 1px solid #fff;
      padding-left: 15px;
      margin: 2px 10px 0 10px;
      &.active {
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        border-radius: 10px;
      }
    }
    &-header{
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .el-tabs__nav-wrap::after{
    height: 1px;
  }
</style>
