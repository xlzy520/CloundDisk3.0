<template>
  <el-dialog
    title="上传文件"
    :visible.sync="uploadVisible"
    :modal-append-to-body="false"
    custom-class="upload-file"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="400px">
    <el-upload
      ref="upload"
      class="upload-demo"
      drag
      :action="uploadUrl"
      :limit="4"
      :on-success="uploadOk"
      :data="uploadData"
      :on-change="onFileChange"
      :auto-upload="false"
      :on-remove="onRemove"
      :on-exceed="onExceed"
      :show-file-list="true"
      :on-error="onError"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        <span style="color: #888;padding-right: 2px;">当前文件夹：</span>
        {{tip}}
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="submitUpload" :disabled="btDisable">开始上传</el-button>
                <el-button @click="quitDialog" size="small">关 闭</el-button>
              </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UploadFile',
  computed: {
    ...mapGetters([
      'uploadVisible'
    ])
  },
  data() {
    return {
      isVisible: false,
      isLoad: true,
      uploadUrl: '',
      tip: '',
      detail: {},
      fileList: [],
      uploadData: {},
      btDisable: true,
      currentFile: null
    }
  },
  methods: {
    onError(err, file, fileList) {
      const msg = '文件上传出错：网络错误'
      this.$message({
        message: msg,
        showClose: true,
        type: 'error',
        duration: 6000
      })
      this.isVisible = false
      this.$refs.upload.clearFiles()
    },
    onRemove(file, filelist) {
      this.fileList = filelist
      if (filelist.length === 0) {
        this.btDisable = true
      }
    },
    onExceed(file, filelist) {
      this.$message({
        message: '每次只能上传一个文件',
        type: 'error',
        duration: 2000
      })
    },
    submitUpload() {
      if (this.currentFile == null) {
        return
      }

      this.$refs.upload.submit()
      this.btDisable = true
    },
    uploadOk(response, file, filelist) {
      if (response.code === '0') {
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 2000
        })
        this.isVisible = false
        this.$refs.upload.clearFiles()
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
        this.isVisible = false
        this.$refs.upload.clearFiles()
      }
    },
    onFileChange(file, filelist) {
      this.fileList = filelist
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
          this.isVisible = false
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
      this.isVisible = false
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
</style>
