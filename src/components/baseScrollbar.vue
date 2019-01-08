<template>
  <div class="base-scrollbar">
    <el-scrollbar ref="elscrollbar">
      <slot></slot>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'base-scrollbar',
};
</script>
<style lang="scss" scoped>
.base-scrollbar {
  position: relative;
  flex-grow: 1;
  display: flex;
  /deep/ .el-scrollbar {
    position: absolute;
    height: 100%;
    width: 100%;
    .el-scrollbar__thumb {
      background-color: rgba(64, 158, 255, 0.6);
      &:hover {
        background-color: hsla(220,4%,58%,.5);
      }
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
