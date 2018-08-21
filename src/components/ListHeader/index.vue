<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="uploadFile">上传文件</el-button>
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
    <div class="toplink">
      <div class="left">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACLklEQVR4nO3WT4iMcRzH8dcuJW1te+IgeyBb2yp7QFG7NstB+VdyUFiJ2dpycHBSRBJKtDdTkji4rcSuP1kX/x1cyMXFQUgpiY02HH6/ybOzM7szz8xqaT41Nb/v9/l+n/d8n8/v+Q011fSfqQ4ymUza+gbswWrcwXmMJPKzcRGNidgb9OY3ymazYGZaEjTjGpbE9UbswCa8j7F52FqgdhxQTvUpYVbgaQImp+Ux3p6ybyqg7biHuYnY68T3+bgvTGxKgepwHJcwK8Z+4RBacCSuCd4awP5ygUr1UAMuY3Mi9g09uCp45xhe4YJg5nr0lQtUyoSa8SAP5i06cBdDwk4axC2swrtyQUoFKmTeZ1iGr3iCNTG+Nq4/C+Z+Xm2gQua9gk4sxmMsyqtpiVCtwgQHqgFUzLyHsQ0Z4TE1FenZFPO7sQUnClxzoBhQvqmLmXeXYN5zEWgyzUA/2rBPMHvWnx94KuYy+JEsTE6omHk7MYzbJcIk1RvrbqAbHxO5HsEScwoBLVXcvCMx11UmTE5dgq8+CWZ/mcitjPdpywfaqbB52/EIC1LC5LRQ2AStws4dTOSaBa+NATqIF8aatw/XjT2pK1Fj7LcXG3A2xh/iZD7QF+F90oGjMXZa+sO3mOpj35/CsdKN9fieuyC5yz7Ez9/UcH6g2hOoWJX8QYN1BWJDlTSsFOhmhfXjNO0eWQ1oMv1TQKNTdM8J+04E1D9ZcQqN4kyVe9ZU0/TWbwc+bHv5dNe2AAAAAElFTkSuQmCC">
        <template v-for="(item, index) in folderNav">
          <span v-if="index===navNum -1">{{item.fileName}}</span>
          <a href="javascript:void(0)" @click="jumpFolder(item.fileId)" v-if="index!==navNum -1">{{item.fileName}}</a>
          <i v-if="index!==navNum -1" class="el-icon-arrow-right" style="color:#aaa"></i>
        </template>
      </div>
      <div class="right">
        <a href="javascript:void(0)" v-if="false">返回搜索结果</a>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ListHeader',
  computed: {
    ...mapGetters([
      'folderNav'
    ]),
    navNum() {
      return this.folderNav.length
    }
  },
  methods: {
    typeShow(type) {
      this.$emit('list_type_toggle', type)
    },
    uploadFile() {
      this.$store.dispatch('ToggleUploadVisible')
    },
    jumpFolder(id) {
      console.log('重新查询文件列表')
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
    .toplink {
      width: 100%;
      margin-top: 10px;
      margin-bottom: 2px;
      font-size: 12px;
      color: #333;
      overflow: hidden;
      .left{
        float: left;
        img{
          height: 18px;
          padding-right: 0;
          vertical-align: -23%;
        }
        a,span{
          padding-right: 3px;
          padding-left: 3px;
        }
        a{
          color: #409eff;
          text-decoration: none;
        }
      }
      .el-breadcrumb{
        line-height: 20px;
      }
      .breadcrumb_home_icon{
        float: left;
        height: 19px;
        padding-right: 4px;
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
