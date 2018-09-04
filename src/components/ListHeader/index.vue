<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="uploadFile">上传文件</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="newFolder">新建文件夹</el-button>
      <el-button type="primary" v-if="[4].indexOf(isShow) > -1" icon="el-icon-document" @click="previewFile">预览</el-button>
      <a
        class="el-button el-button--primary"
        v-if="[2,4].indexOf(isShow) > -1"
        icon="el-icon-download"
        @click="downloadFile"
        ref="downloadBtn"><i class="el-icon-download"></i>下载</a>
      <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-edit" @click="updateFile">更新</el-button>
      <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-tickets" @click="showVersion">版本</el-button>
      <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-edit-outline" @click="rename">重命名</el-button>
      <el-button type="primary" v-if="[1, 2, 3, 4].indexOf(isShow) > -1" icon="el-icon-delete" @click="deleteFile">删除</el-button>
      <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-info" @click="getDetail">详情</el-button>
    </div>
    <ul id="menu-btn" v-show="menuVisible" :style="{top:(coordinate[2]+'px'),left:(coordinate[1]+'px')}">
      <li :class="{disabled:([1, 2, 4].indexOf(isShow) > -1?false:true)}" @click.stop="fileType(selectedData[0].ffiletype,selectedData[0].fcategoryid)">打开</li>
      <li :class="{disabled:([2, 4].indexOf(isShow) > -1?false:true)}" @click="downloadFile2">下载</li>
      <li :class="{disabled:([2, 4].indexOf(isShow) > -1?false:true)}" @click="updateFile">更新</li>
      <li :class="{disabled:([2, 4].indexOf(isShow) > -1?false:true)}" @click="showVersion">版本</li>
      <li :class="{disabled:([1, 2, 4].indexOf(isShow) > -1?false:true)}" @click="rename">重命名</li>
      <li :class="{disabled:([1, 2, 3, 4].indexOf(isShow) > -1?false:true)}" @click="deleteFile">删除</li>
      <li :class="{disabled:([1, 2, 4].indexOf(isShow) > -1?false:true)}" @click="getDetail">详情</li>
    </ul>
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
      'hasSearch',
      'menuVisible',
      'coordinate'
    ]),
    isShow() {
      const folderCheckedCount = this.selectedData.filter(item => item.ffiletype === 1).length
      const fileCheckedCount = this.selectedData.filter(item => item.ffiletype === 2).length
      const previewCheckedCount = this.selectedData.filter(item => item.ffiletype !== 1 && item.ffiletype !== 2).length
      if (this.selectedData.length > 1) {
        return 3
      } else if (folderCheckedCount === 1 && fileCheckedCount === 0) {
        return 1
      } else if (folderCheckedCount === 0 && fileCheckedCount === 1) {
        return 2
      } else if (folderCheckedCount === 0 && fileCheckedCount === 0 && previewCheckedCount === 1) {
        return 4
      }
    }
  },
  methods: {
    fileType(type, fcategoryid) {
      this.$store.dispatch('RightTogglemenuVisible', [false])
      switch (type) {
        case 1:
          this.$store.dispatch('GetCategory', fcategoryid)
          this.$store.dispatch('SetParentId', fcategoryid)
          break
        case 2:
          this.$message({
            message: '只可以对markdown文件进行预览编辑哦 ',
            type: 'warning'
          })
          break
        case 3:
          this.$store.dispatch('TogglePreviewVisible')
          console.log(fcategoryid)
          this.$store.dispatch('GetDocInfo', fcategoryid)
          break
      }
    },
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
      this.$store.dispatch('RightTogglemenuVisible', [false])
    },
    newFolder() {
      this.$prompt('请输入文件夹名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '文件夹名称不能为空',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (value.trim().length === 0) {
            return '文件夹名称不能为空'
          }
        }
      }).then(({ value }) => {
        addCategory(this.parentId, value.trim())
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: res.msg,
                duration: 1000
              })
              this.$store.dispatch('Refresh')
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
          duration: 1000
        })
      })
    },
    previewFile() {
      this.$store.dispatch('GetDocInfo', this.selectedData[0].fcategoryid)
    },
    downloadFile() {
      this.$refs.downloadBtn.href = '/api_zhq/djcpsdocument/fileManager/downloadFile.do?id=' + this.selectedData[0].fcategoryid
      this.$refs.downloadBtn.download = this.selectedData[0].fname
    },
    downloadFile2() {
      this.downloadFile()
      this.$refs.downloadBtn.click()
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
    #menu-btn{
      list-style: none;
      background: #fbfcff;
      height: 213px;
      line-height: 30px;
      width: 100px;
      text-align: center;
      border-radius: 4px;
      box-shadow: 0px 2px 5px #a9a7a7;
      color: #7d7b7b;
      position: fixed;
      z-index: 200;
      li:hover{
        background: #e2edf9;
      }
      .disabled {
        color: #bbbbbb;
        pointer-events: none;
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
