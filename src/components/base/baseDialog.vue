<template>
  <div class="base-dialog">
    <el-dialog
      ref="dialog"
      :visible="dialogVisible"
      :show-close="true"
      top="0"
      :width="width"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog">
      <div class="base-dialog-title" v-if="title">
        {{ title }}
      </div>
      <div class="base-dialog-content">
        <slot></slot>
      </div>
      <slot name="footer">
        <div class="base-dialog-footer" v-if="!notFooterBtn">
          <div class="base-dialog-footer-button">
            <div class="base-dialog-footer-button-ok">
              <el-button type="primary" @click="handleOk" :loading="submitLoading" :disabled="submitDisabled">确 定</el-button>
            </div>
            <div class="base-dialog-footer-button-close">
              <el-button @click="closeDialog">取 消</el-button>
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
  props: {
    title: {
      type: String,
      default: ''
    },
    notFooterBtn: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'auto'
    },
    submitLoading: {
      type: Boolean,
      default: false
    },
    submitDisabled: false
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    handleOk() {
      this.$emit('confirm');
    }
  }
};
</script>

<style lang="scss" scoped>
.base-dialog {
  &-title {
    font-size: 18px;
    padding: 15px 32px 10px 32px;
  }
  &-content {
    padding: 0 12px;
  }
  &-footer {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-right: 30px;
    &-button {
      text-align: right;
      & > div {
        display: inline-block;
        & + div {
          margin-left: 12px;
        }
      }
      .el-button {
        padding: 8px 12px;
        font-size: 14px;
      }
    }
  }
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/ .el-dialog__header {
      height: 0;
      padding: 0;
    }
    /deep/ .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
