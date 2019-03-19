<template>
  <div class="auth-box">
    <el-tabs v-model="activeName">
      <el-tab-pane label="分配权限" name="set">
        <permission-setting class="tab-content-item"></permission-setting>
      </el-tab-pane>
      <el-tab-pane label="编辑权限" name="edit">
        <permission-edit class="tab-content-item"></permission-edit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import permissionSetting from './permissionSetting.vue';
  import permissionEdit from './permissionEdit.vue';

  export default {
    data() {
      return {
        activeName: 'set',
      };
    },
    components: {
      permissionSetting,
      permissionEdit
    },
    created() {
      if (this.$route.query.isEdit === "1") {
        this.activeName = "edit";
      }
    },
    beforeDestroy() {
      localStorage.obj = "";
    }
  };
</script>

<style lang="scss">
  .auth-box {
    padding-left: 20px;
    .tab-content-item {
      height: calc(100vh - 105px); /*105px为导航栏与权限tab栏的高度加margin*/
      display: flex;
      flex-direction: column;
    }
    .scroll-bar {
      min-width: 1200px;
    }
    .list-checkbox {
      width: 400px;
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
        &.active {
          background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
          border-radius: 10px;
        }
        .name {
          padding-left: 20px;
        }
      }
    }
  }
</style>
