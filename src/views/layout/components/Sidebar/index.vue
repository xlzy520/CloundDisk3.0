<template>
  <!--<el-scrollbar wrapClass="scrollbar-wrapper">-->
  <div>
    <div class="logo" v-show="!isCollapse">
      <img src="@/assets/logo/logo.png" width="36" height="36" class="logo__img">
      <span class="logo__title">东经云盘</span>
    </div>
    <el-scrollbar style="display: inline-block">
      <tree-menu type="sidebar"></tree-menu>
    </el-scrollbar>
  </div>

  <!--<el-menu-->
      <!--mode="vertical"-->
      <!--:show-timeout="200"-->
      <!--:default-active="$route.path"-->
      <!--:collapse="isCollapse"-->
      <!--background-color="rgba(145,212,143,.5)"-->
      <!--text-color="#063873"-->
      <!--active-text-color="#409EFF"-->
    <!--&gt;-->

      <!--<sidebar-item -->
        <!--v-for="route in routes" -->
        <!--:key="route.name" -->
        <!--:item="route" -->
        <!--:base-path="route.path">-->
      <!--</sidebar-item>-->
    <!--</el-menu>-->
  <!--</el-scrollbar>-->
</template>

<script>
  import treeMenu from '@/components/treeMenu/index'
  import { mapGetters } from 'vuex'
  export default {
    components: { treeMenu },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>

<style lang="scss">
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
