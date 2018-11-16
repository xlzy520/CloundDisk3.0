<template>
  <div class="app-wrapper">
    <div class="left-menu" :class="classObj">
      <sidebar></sidebar>
    </div>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideMenu: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "src/styles/mixin.scss";
  .app-wrapper {
    // @include clearfix;
    display: flex;
    position: relative;
    // height: 100%;
    // width: 100%;
    .left-menu {
      width: 250px;
      background-color: rgba(239, 248, 224, 0.9);
      transition: width 0.28s;
      border-right: 1px solid #e2e2e2;
      overflow: hidden;
      &.hideMenu {
        width: 0;
      }
    }
    .main-container {
      flex-grow: 1;
      min-width: 1300px;
      position: relative;
    }
  }
</style>
