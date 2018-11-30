<template>
  <div class="app-wrapper">
    <div class="app-wrapper-menu" :class="classObj">
      <sidebar></sidebar>
    </div>
    <div class="app-wrapper-main">
      <navbar></navbar>
      <app-main ref="appMain"></app-main>
    </div>
    <div class="app-wrapper-right-menu">
      <right-menu @action="event => $refs.appMain.$refs.content.dispatchAction(event)"></right-menu>
    </div>
  </div>
</template>

<script>
import childComponents from './components';
import rightMenu from '../list/components/rightMenu/index.vue';
import ResizeMixin from './mixin/ResizeHandler';

export default {
  name: 'layout',
  components: {
    ...childComponents,
    rightMenu
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    classObj() {
      return {
        hideMenu: !this.sidebar.opened,
        // openSidebar: this.sidebar.opened,
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      };
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "src/styles/mixin.scss";
  .app-wrapper {
    // @include clearfix;
    position: relative;
    display: flex;
    min-width: 1300px;
    min-height: 600px;
    height: 100%;
    user-select: none;
    &-menu {
      position: relative;
      flex-shrink: 0;
      background-color: rgba(239, 248, 224, 0.9);
      transition: width 0.28s;
      border-right: 1px solid #e2e2e2;
      overflow: hidden;
      &.hideMenu {
        width: 0;
      }
    }
    &-main {
      position: relative;
      flex-shrink: 1;
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    &-right-menu {
      position: absolute;
      display: none;
    }
  }
</style>
