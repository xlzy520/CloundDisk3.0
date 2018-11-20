<template>
  <div class="left-menu" ref="menu">
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
    data () {
      return {
        draging: false
      };
    },
    mounted () {
      this.$refs.menu.style.width = '200px';
      window.addEventListener('mousemove', this.mousemove);
      window.addEventListener('mousedown', this.mousedown);
      window.addEventListener('mouseup', this.mouseup);
    },
    beforeDestroy () {
      window.removeEventListener('mousemove', this.mousemove);
      window.removeEventListener('mousedown', this.mousedown);
      window.removeEventListener('mouseup', this.mouseup);
    },
    methods: {
      mousemove(event) {
        if (this.draging) {
          this.$refs.menu.style.width = `${event.clientX}px`;
        }
        event.target.style.cursor = this.atBorder(event, this.$refs.menu) ? 'ew-resize' : '';
      },
      mousedown(event) {
        if (this.atBorder(event, this.$refs.menu)) {
          this.draging = true;
        }
      },
      mouseup() {
        this.draging = false;
      },
      atBorder(event, box) {
        if (event.clientX > box.offsetWidth - 4 && event.clientX <= box.offsetWidth) {
          return true;
        } else {
          return false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
.left-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  min-width: 200px;
  max-width: 500px;
  cursor: default;
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
}
</style>
