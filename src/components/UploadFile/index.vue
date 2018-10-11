<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    @close="close"
    :modal-append-to-body="false"
    custom-class="upload-file"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    :show-close="false"
    width="400px">
    <el-upload
      ref="upload"
      drag
      :action="uploadFileUrl"
      :on-success="uploadOk"
      :data="uploadData"
      :on-change="onFileChange"
      :auto-upload="false"
      :on-remove="onRemove"
      :show-file-list="true"
      :on-error="onError"
      :on-progress="onProgress"
      multiple

    >
      <i class="el-icon-upload"></i>
      <p class="upload-speed">{{speed}}</p>
      <div class="el-upload__text">将文件拖到此处或点击上传</div>
      <div class="el-upload__tip" slot="tip" v-if="!updateType"><span style="color: #888;padding-right: 2px;">当前文件夹：</span>{{tip}}</div>
      <div class="el-upload__tip" slot="tip" v-if="updateType"><span style="color: #888;padding-right: 2px;">要更新的文件：</span>{{tip}}</div>
    </el-upload>
    <div class="file-desc-label" v-if="updateType">文件描述</div>
    <el-input type="textarea" v-model="fileDesc" v-if="updateType"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button size="small"  v-if="!updateType" type="primary" @click="submitUpload" :disabled="btDisable">开始上传</el-button>
      <el-button size="small" v-if="updateType" type="primary" @click="submitUpload" :disabled="btDisable">开始更新</el-button>
      <el-button @click="close()" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatSize } from '@/utils/index'
export default {
  name: 'UploadFile',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoad: true,
      detail: {},
      fileList: [],
      uploadData: {},
      btDisable: true,
      currentFile: null,
      fileDesc: '',
      speed: '',
      time: '',
      loaded: 0
    }
  },
  computed: {
    ...mapGetters([
      'folderNav',
      'parentId',
      'selectedData'
    ]),
    uploadFileUrl() {
      return process.env.UPLOAD_API + '/djcpsdocument/category/fileUpload.do?'
    },
    title() {
      return this.type === 'upload' ? '文件上传' : '文件更新'
    },
    updateType() {
      return this.type === 'update'
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
    onProgress(event, file, fileList) {
      const interval = new Date().getTime() - this.time
      this.time = new Date().getTime()
      const size = event.loaded - this.loaded
      this.speed = formatSize((size / (interval / 1000)).toFixed(0)) + '/s'
      this.loaded = event.loaded
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error')
      this.$store.dispatch('ToggleUploadVisible')
      this.$refs.upload.clearFiles()
      this.$store.dispatch('Refresh')
      this.speed = ''
    },
    onRemove(file, filelist) {
      this.speed = ''
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
      this.time = new Date().getTime()
      this.btDisable = true
    },
    uploadOk(response, file, filelist) {
      this.speed = ''
      if (response.success === true) {
        this.$message1000('文件上传成功', 'success')
        this.$store.dispatch('ToggleUploadVisible')
        this.$refs.upload.clearFiles()
        this.$store.dispatch('Refresh')
      } else {
        let msg = response.msg
        if (msg == null || msg === '') {
          msg = '服务器错误'
        }
        msg = '文件上传出错：' + msg
        this.$message1000(msg, 'error')
        this.$store.dispatch('ToggleUploadVisible')
        this.$refs.upload.clearFiles()
        this.$store.dispatch('Refresh')
      }
    },
    onFileChange(file, filelist) {
      if (this.type === 'update') {
        if (file.name !== this.selectedData[0].fname) {
          filelist.pop()
          this.$message1000('文件上传失败！上传文件名与更新文件名不符', 'error')
        }
      }
      if (filelist.length > 1) {
        for (let i = 0; i < filelist.length - 1; i++) {
          if (filelist[i].name === file.name) {
            filelist.pop()
            this.$message1000('上传失败！文件上传列表中存在同名文件', 'error')
          }
        }
      }
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
            fcategoryid: this.selectedData[0].fcategoryid,
            fversionsign: this.selectedData[0].fversionsign
          }
        }
      }
    },
    close() {
      var uploadingFiles = []
      for (let i = 0; i < this.fileList.length; ++i) {
        if (this.fileList[i].status === 'uploading') {
          uploadingFiles.push(this.fileList[i])
        }
      }
      if (this.fileList.length > 0) {
        if (confirm('文件正在上传中，关闭后上传被中止, 是否继续?')) {
          for (let v = 0; v < uploadingFiles.length; ++v) {
            this.$refs.upload.abort(uploadingFiles[v])
          }
          this.speed = ''
          this.$refs.upload.clearFiles()
          this.fileList = []
          this.$emit('closeDialog', 'uploadVisible')
        } else {
          return
        }
        this.$message1000('文件上传被中止', 'warning')
      }
      this.$refs.upload.clearFiles()
      this.fileList = []
      this.$emit('closeDialog', 'uploadVisible')
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
  .upload-speed{
    color: forestgreen;
  }
</style>
