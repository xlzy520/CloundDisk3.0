<template>
  <div class="left-menu">
    <div class="logo" v-show="!isCollapse">
      <img src="@/assets/logo/logo.png" width="36" height="36" class="logo__img">
      <span class="logo__title">东经云盘</span>
    </div>
    <div class="left">
      <tree-menu type="sidebar"></tree-menu>
    </div>
  </div>
</template>

<script>
  import treeMenu from '@/components/treeMenu';
  import { mapGetters } from 'vuex';
  export default {
    components: { treeMenu },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .logo {
    display: inline-block;
    margin: 15px 0 15px -10px;
    cursor: default;
    text-align: center;
    width: 100%;
    line-height: 1;
    vertical-align: middle;
    &__img {
      margin-right: 5px;
      vertical-align: middle;
    }
    &__title {
      font-size: 24px;
      color: #31ba78;
      vertical-align: middle;
    }
  }
  .logo + .el-scrollbar .el-scrollbar__wrap{
    width: 13vw;
    height: 91vh;
    overflow-y: hidden;
    margin-right: 0!important;
    & + .el-scrollbar__bar.is-horizontal{
      height: 1.5vh;
      .el-scrollbar__thumb{
        background-color: rgba(64,158,255,.8);
        height: 1.5vh;
      }
    }
  }
</style>
