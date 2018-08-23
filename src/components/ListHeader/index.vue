<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="uploadFile">上传文件</el-button>
      <el-button type="primary" icon="el-icon-plus">新建文件夹</el-button>
      <el-button type="primary"  icon="el-icon-document">预览</el-button>
      <el-button type="primary"  icon="el-icon-download">下载</el-button>
      <el-button type="primary"  icon="el-icon-edit" @click="fileUpdate">更新</el-button>
      <el-button type="primary"  icon="el-icon-tickets" @click="showVersion">版本</el-button>
      <el-button type="primary"  icon="el-icon-edit-outline">重命名</el-button>
      <el-button type="primary" icon="el-icon-delete">删除</el-button>
      <el-button type="primary"  icon="el-icon-info" @click="getDetail">详情</el-button>
    </div>
    <div class="action-wrap">
      <el-tooltip class="item" effect="dark" content="列表" placement="bottom">
        <div class="action-item" @click="typeShow('List')">
          <svg-icon icon-class="list" className="icon" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩略图" placement="bottom">
        <div class="action-item" @click="typeShow('Thumbnail')">
          <svg-icon icon-class="abbr" className="icon" />
        </div>
      </el-tooltip>
    </div>
    <breadcrumb></breadcrumb>
  </div>
</template>

<script>

import Breadcrumb from '../Breadcrumb/index'
export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  props: {
    isFolder: false,
    isFile: false,
    isOther: false
  },
  methods: {
    typeShow(type) {
      this.$emit('list_type_toggle', type)
    },
    uploadFile() {
      this.$store.dispatch('ToggleUploadVisible')
    },
    refresh() {
      this.$store.dispatch('Refresh')
    },
    getDetail() {
      this.$store.dispatch('ToggleDetailVisible')
    },
    showVersion() {
      this.$store.dispatch('ToggleVersionVisible')
    },
    fileUpdate() {

    }
  }
}
</script>

<style lang="scss">
  .list-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fafafa;
    padding: 10px 20px 10px 20px;
    .list-btn {
      text-align: left;
      .el-button {
        padding: 6px 8px;
      }
    }
  }
  .action-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 28px;
      padding-right: 40px;
      .action-item {
        .icon {
          width: 24px;
          height: 24px;
          margin: 0 10px;
          cursor: pointer;
        }
      }
    }

</style>
