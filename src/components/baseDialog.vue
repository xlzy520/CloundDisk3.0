<template>
  <div class="base-dialog">
    <el-dialog
      :visible="dialogVisible"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog">
      <div class="base-dialog-title" v-if="title">
        {{ title }}
      </div>
      <slot></slot>
      <slot name="footer">
        <div class="base-dialog-footer" v-if="!notFooterBtn">
          <div class="base-dialog-footer-button">
            <div class="base-dialog-footer-button-close">
              <el-button @click="closeDialog">取 消</el-button>
            </div>
            <div class="base-dialog-footer-button-ok">
              <el-button type="primary"
                @click="handleOk"
                :disabled="state !== 'edit'">保 存</el-button>
            </div>
          </div>
        </div>
      </slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'base-dialog',
  props: ['title', 'notFooterBtn'],
  data() {
    return {
      dialogVisible: false,
      state: 'edit'
    };
  },
  methods: {
    restValue() {
      this.state = 'edit';
    },
    closeDialog() {
      this.restValue();
      this.$emit('close');
    },
    handleOk() {
      this.restValue();
      this.$emit('comfirm');
    }
  }
};
</script>

<style lang="scss" scoped>
.base-dialog {
  &-title {
    text-align: center;
    box-shadow: 0 2px 10px #d1d6de;
    padding: 10px 10px;
  }
  &-footer {
    &-button {
      text-align: center;
      & > div {
        display: inline-block;
        & + div {
          margin-left: 40px;
          margin-bottom: 30px;
        }
      }
    }
  }
  /deep/ .el-dialog__header {
    height: 0;
    padding: 0;
  }
  /deep/ .el-dialog__body {
    padding: 0;
  }
  /deep/ .el-dialog--small {
    width: auto;
  }
}
</style>
