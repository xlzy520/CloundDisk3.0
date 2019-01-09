<template>
  <div class="app-wrapper">
    <div class="app-wrapper-menu" :class="[{hideMenu: !sidebar.opened}]">
      <sidebar></sidebar>
    </div>
    <div class="app-wrapper-main">
      <navbar></navbar>
      <app-main ref="appMain"></app-main>
    </div>
    <div class="app-wrapper-right-menu">
      <right-menu @action="dispatchAction"></right-menu>
    </div>
  </div>
</template>

<script>
import childComponents from './components';
import rightMenu from '../list/components/rightMenu/index.vue';

export default {
  name: 'Layout',
  components: {
    ...childComponents,
    rightMenu
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    dispatchAction(event) {
      this.$nextTick(()=>{
        this.$refs.appMain.$children[0].dispatchAction(event);
      });
    }
  }
};
</script>

<style lang="scss">
  @import "@/styles/mixin.scss";
  .app-wrapper {
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
      @include flex_column;
      flex-shrink: 1;
      overflow: hidden;
    }
    &-right-menu {
      position: absolute;
      display: none;
    }
  }
</style>
