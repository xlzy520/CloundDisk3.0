<template>
  <div class="left-menu">
    <div class="logo">
      <img src="@/assets/logo/logo.png" width="36" height="36" class="logo-img">
      <span class="logo-title">东经云盘</span>
    </div>
    <div class="left">
      <tree-menu type="sidebar"></tree-menu>
    </div>
  </div>
</template>

<script>
  import treeMenu from '@/components/treeMenu';
  export default {
    name: 'left-menu',
    components: { treeMenu },
  };
</script>

<style lang="scss" scoped>
.left-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 200px;
  .logo {
    margin: auto;
    margin-top: 15px;
    margin-bottom: 15px;
    cursor: default;
    &-img {
      margin-right: 5px;
      vertical-align: middle;
    }
    &-title {
      font-size: 24px;
      color: #31ba78;
      vertical-align: middle;
    }
  }
  // .logo + .el-scrollbar .el-scrollbar__wrap{
  //   // width: 13vw;
  //   // height: 91vh;
  //   overflow-y: hidden;
  //   // margin-right: 0!important;
  //   & + .el-scrollbar__bar.is-horizontal{
  //     height: 1.5vh;
  //     .el-scrollbar__thumb{
  //       background-color: rgba(64,158,255,.8);
  //       height: 1.5vh;
  //     }
  //   }
  // }
}
</style>
