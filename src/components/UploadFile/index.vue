<template>
  <el-dialog
    :title="title"
    :visible.sync="upload.visible"
    :modal-append-to-body="false"
    custom-class="upload-file"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    :show-close="false"
    width="400px">
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :action="uploadFileUrl"
      :on-success="uploadOk"
      :data="uploadData"
      :on-change="onFileChange"
      :auto-upload="false"
      :on-remove="onRemove"
      :show-file-list="true"
      :on-error="onError"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处或点击上传</div>
      <div class="el-upload__tip" slot="tip" v-if="!updateType"><span style="color: #888;padding-right: 2px;">当前文件夹：</span>{{tip}}</div>
      <div class="el-upload__tip" slot="tip" v-if="updateType"><span style="color: #888;padding-right: 2px;">要更新的文件：</span>{{tip}}</div>
    </el-upload>

    <div class="file-desc-label" v-if="updateType">文件描述</div>
    <el-input type="textarea" v-model="fileDesc" v-if="updateType"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button size="small"  v-if="!updateType" type="primary" @click="submitUpload" :disabled="btDisable">开始上传</el-button>
      <el-button size="small" v-if="updateType" type="primary" @click="submitUpload" :disabled="btDisable">开始更新</el-button>
      <el-button @click="quitDialog" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UploadFile',
  data() {
    return {
      isLoad: true,
      detail: {},
      fileList: [],
      uploadData: {},
      btDisable: true,
      currentFile: null,
      fileDesc: ''
    }
  },
  computed: {
    uploadVisible: {
      get() {
        return this.$store.state.file.uploadVisible
      },
      set() {
      }
    },
    ...mapGetters([
      'folderNav',
      'parentId',
      'selectedData',
      'upload'
    ]),
    uploadFileUrl() {
      return '/api_zhq/djcpsdocument/category/fileUpload.do?'
    },
    title() {
      return this.upload.type === 'upload' ? '文件上传' : '文件更新'
    },
    updateType() {
      return this.upload.type === 'update'
    },
    tip() {
      let tip = ''
      for (var i = 0; i < this.folderNav.length; ++i) {
        tip += '/' + this.folderNav[i].fname
      }
      return tip
    }
  },
  methods: {
    onError() {
      const msg = '文件上传出错：网络错误'
      this.$message({
        message: msg,
        showClose: true,
        type: 'error',
        duration: 6000
      })
      this.$store.dispatch('ToggleUploadVisible')
      this.$refs.upload.clearFiles()
      this.$store.dispatch('Refresh')
    },
    onRemove(file, filelist) {
      this.fileList = filelist
      if (filelist.length === 0) {
        this.btDisable = true
      }
    },
    submitUpload() {
      if (this.currentFile == null) {
        return
      }
      this.uploadData.fremarks = this.fileDesc
      this.$refs.upload.submit()
      this.btDisable = true
    },
    uploadOk(response, file, filelist) {
      if (response.success === true) {
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 2000
        })
        this.$store.dispatch('ToggleUploadVisible')
        this.$refs.upload.clearFiles()
        this.$store.dispatch('Refresh')
      } else {
        let msg = response.msg
        if (msg == null || msg === '') {
          msg = '服务器错误'
        }
        msg = '文件上传出错：' + msg
        this.$message({
          message: msg,
          showClose: true,
          type: 'error',
          duration: 6000
        })
        this.$store.dispatch('ToggleUploadVisible')
        this.$refs.upload.clearFiles()
        this.$store.dispatch('Refresh')
      }
    },
    onFileChange(file, filelist) {
      this.fileList = filelist
      if (file.status === 'ready') {
        this.$store.dispatch('Refresh')
        this.btDisable = false
        this.currentFile = file
        this.uploadData = {
          fparentid: this.parentId
        }

        if (this.selectedData.length === 1) {
          this.uploadData = {
            fparentid: this.parentId,
            fcategoryid: this.selectedData[0].fcategoryid
          }
        }
      }
    },
    quitDialog() {
      var uploadingFiles = []

      for (let i = 0; i < this.fileList.length; ++i) {
        if (this.fileList[i].status === 'uploading') {
          uploadingFiles.push(this.fileList[i])
        }
      }
      if (uploadingFiles.length > 0) {
        if (confirm('文件正在上传中，关闭后上传被中止, 是否继续?')) {
          for (let v = 0; v < uploadingFiles.length; ++v) {
            this.$refs.upload.abort(uploadingFiles[v])
          }
          this.$store.dispatch('ToggleUploadVisible')
          this.$refs.upload.clearFiles()
        } else {
          return
        }
        this.$message({
          message: '文件上传被中止',
          type: 'warning',
          duration: 2000
        })
      }
      this.$store.dispatch('ToggleUploadVisible')
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style>
  .upload-file .el-dialog__body {
    padding: 10px 20px !important;
  }
  .upload-file .el-dialog__header {
    padding: 10px 20px 5px 20px !important;
  }
  .upload-file .el-dialog__headerbtn {
    top:14px;
  }
  .upload-file .el-upload__tip {
    color: #a00;
  }
  .upload-file .el-upload-dragger {
    height: 135px !important;
  }
  .upload-file .el-upload-dragger .el-icon-upload {
    margin: 22px 0 16px;
  }
  .update-file .file-desc-label {
    font-size: 14px;
    margin: 5px 0 5px 0px;
    color: #666;
  }
</style>
