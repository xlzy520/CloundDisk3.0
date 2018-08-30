<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="uploadFile">上传文件</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="newFolder">新建文件夹</el-button>
      <el-button type="primary" v-if="[2].indexOf(isShow) > -1" icon="el-icon-document" @click="previewFile">预览</el-button>
      <a
        class="el-button el-button--primary"
        v-if="[2].indexOf(isShow) > -1"
        icon="el-icon-download"
        @click="downloadFile"
        ref="downloadBtn"><i class="el-icon-download"></i>下载</a>
      <el-button type="primary" v-if="[2].indexOf(isShow) > -1" icon="el-icon-edit" @click="updateFile">更新</el-button>
      <el-button type="primary" v-if="[2].indexOf(isShow) > -1" icon="el-icon-tickets" @click="showVersion">版本</el-button>
      <el-button type="primary" v-if="[1, 2].indexOf(isShow) > -1" icon="el-icon-edit-outline" @click="rename">重命名</el-button>
      <el-button type="primary" v-if="[1, 2, 3].indexOf(isShow) > -1" icon="el-icon-delete" @click="deleteFile">删除</el-button>
      <el-button type="primary" v-if="[1, 2].indexOf(isShow) > -1" icon="el-icon-info" @click="getDetail">详情</el-button>
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
    <div class="back2FileList">
      <el-button v-waves type="success" plain size="mini" v-if="hasSearch" @click="back2FileList">返回文件列表</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '../Breadcrumb/index'
import { addCategory } from '@/api/file'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  directives: {
    waves
  },
  computed: {
    ...mapGetters([
      'selectedData',
      'fileList',
      'parentId',
      'hasSearch'
    ]),
    isShow() {
      const folderCheckedCount = this.selectedData.filter(item => item.ffiletype === 1).length
      const fileCheckedCount = this.selectedData.filter(item => item.ffiletype !== 1).length
      if (this.selectedData.length > 1) {
        return 3
      } else if (folderCheckedCount === 1 && fileCheckedCount === 0) {
        return 1
      } else if (folderCheckedCount === 0 && fileCheckedCount === 1) {
        return 2
      }
    }
  },
  methods: {
    typeShow(type) {
      this.$emit('list_type_toggle', type)
    },
    getDetail() {
      this.$store.dispatch('ToggleDetailVisible')
    },
    uploadFile() {
      this.$store.dispatch('ToggleUploadVisible', 'upload')
    },
    updateFile() {
      this.$store.dispatch('ToggleUploadVisible', 'update')
    },
    showVersion() {
      this.$store.dispatch('ToggleVersionVisible')
    },
    refresh() {
      this.$store.dispatch('Refresh')
    },
    deleteFile() {
      this.$store.dispatch('ToggleDeleteVisible')
    },
    rename() {
      if (this.selectedData.length === 1) {
        this.$set(this.selectedData[0], 'isEditor', true)
      }
    },
    newFolder() {
      this.$prompt('请输入文件夹名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[^\/:*?"<>|]+$/,
        inputErrorMessage: '文件夹名称格式不正确',
        closeOnClickModal: false
      }).then(({ value }) => {
        addCategory(this.parentId, value)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.$store.dispatch('Refresh')
            }
          })
          .catch(() => {
            this.$message({
              message: '无法连接服务器',
              showClose: true,
              type: 'error',
              duration: 2000
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    previewFile() {
      this.$store.dispatch('TogglePreviewVisible')
      this.$store.dispatch('GetDocInfo')
    },
    downloadFile() {
      this.$refs.downloadBtn.href = '/api_zhq/djcpsdocument/fileManager/downloadFile.do?id=' + this.selectedData[0].fcategoryid
      this.$refs.downloadBtn.download = this.selectedData[0].fname
    },
    back2FileList() {
      this.$store.dispatch('ToggleSearch', false)
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

  .back2FileList{
    display: block;
    position: absolute;
    right: 50px;
    top: 45px;
  }
</style>
