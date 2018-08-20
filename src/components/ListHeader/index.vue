<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload">上传文件</el-button>
      <el-button type="primary" icon="el-icon-plus">新建文件夹</el-button>
      <el-button type="primary" icon="el-icon-document">预览</el-button>
      <el-button type="primary" icon="el-icon-download">下载</el-button>
      <el-button type="primary" icon="el-icon-edit">更新</el-button>
      <el-button type="primary" icon="el-icon-tickets">版本</el-button>
      <el-button type="primary" icon="el-icon-edit-outline">重命名</el-button>
      <el-button type="primary" icon="el-icon-delete">删除</el-button>
      <el-button type="primary" icon="el-icon-info">详情</el-button>
    </div>
    <div class="action-wrap">
      <el-tooltip class="item" effect="dark" content="列表" placement="bottom">
        <div class="action-item" @click="showList">
          <svg-icon icon-class="list" className="icon" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩略图" placement="bottom">
        <div class="action-item" @click="showThumbnail">
          <svg-icon icon-class="abbr" className="icon" />
        </div>
      </el-tooltip>
    </div>
    <div class="list-crumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">公司文件</el-breadcrumb-item>
        <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  methods: {
    showList() {
      this.$emit('list_type_toggle', 'List')
    },
    showThumbnail() {
      this.$emit('list_type_toggle', 'Thumbnail')
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
    .list-crumb {
      width: 100%;
      margin-top: 15px;
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
