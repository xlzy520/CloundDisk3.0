<template>
  <div class="djcd">
    <div class="djcd-menu" :class="[{hideMenu: !sidebar.opened}]">
      <sidebar></sidebar>
    </div>
    <div class="djcd-main">
      <navbar></navbar>
      <app-main ref="appMain"></app-main>
    </div>
    <div class="context-container">
      <context-menu @action="dispatchAction"></context-menu>
    </div>
  </div>
</template>

<script>
import ChildComponents from './components/index.js';
import ContextMenu from '../list/components/contextMenu/index.vue';

export default {
  name: 'Layout',
  components: {
    ...ChildComponents,
    ContextMenu
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
  .djcd {
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
    .context-container {
      position: absolute;
      display: none;
    }
  }
</style>
