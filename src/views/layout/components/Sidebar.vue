<template>
  <div class="left-menu" ref="menu">
    <div class="left-menu-logo">
      <img src="@/assets/logo/logo.png" class="left-menu-logo-img">
      <span class="left-menu-logo-title">东经云盘</span>
    </div>
    <base-scrollbar class="left-menu-content">
      <tree-menu type="sidebar"></tree-menu>
    </base-scrollbar>
  </div>
</template>

<script>
  import TreeMenu from '@/components/treeMenu';
  import BaseScrollbar from "@/components/base/baseScrollbar";

  export default {
    name: 'Sidebar',
    components: { BaseScrollbar, TreeMenu },
    data () {
      return {
        dragging: false
      };
    },
    mounted () {
      this.$refs.menu.style.width = '200px';
      document.addEventListener('mousemove', this.mousemove);
      document.addEventListener('mousedown', this.mousedown);
      document.addEventListener('mouseup', this.mouseup);
    },
    beforeDestroy () {
      document.removeEventListener('mousemove', this.mousemove);
      document.removeEventListener('mousedown', this.mousedown);
      document.removeEventListener('mouseup', this.mouseup);
    },
    methods: {
      mousemove(event) {
        if (this.dragging) {
          this.$refs.menu.style.width = `${event.clientX}px`;
        }
        event.target.style.cursor = this.atBorder(event, this.$refs.menu) ? 'ew-resize' : '';
      },
      mousedown(event) {
        if (this.atBorder(event, this.$refs.menu)) {
          this.dragging = true;
        }
      },
      mouseup() {
        this.dragging = false;
      },
      atBorder(event, box) {
        return event.clientX > box.offsetWidth - 10 && event.clientX <= box.offsetWidth;
      }
    }
  };
</script>

<style lang="scss" scoped>
.left-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 200px;
  max-width: 500px;
  cursor: default;
  &-logo {
    margin: 15px auto;
    &-img {
      height: 36px;
      margin-right: 5px;
      vertical-align: middle;
    }
    &-title {
      font-size: 24px;
      color: #31ba78;
      vertical-align: middle;
    }
  }
}
</style>
