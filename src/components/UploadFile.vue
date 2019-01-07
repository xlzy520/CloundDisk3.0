<template>
  <el-dialog
    :title="'文件'+title"
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
      action="/djcpsdocument/category/fileUpload.do"
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
      <div class="el-upload__tip" slot="tip"><span>{{filePath}}</span>{{tip}}</div>
    </el-upload>
    <div v-if="type==='update'">
      <div class="file-desc-label">文件描述</div>
      <el-input type="textarea" v-model="fileDesc"></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small"  type="primary" @click="submitUpload" :disabled="btDisable">开始{{title}}</el-button>
      <el-button @click="close" size="small">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatSize } from '@/utils/index';
export default {
  name: 'UploadFile',
  props: ['navList'],
  data() {
    return {
      visible: false,
      type: 'upload',
      filePath: '当前文件夹：',
      fileList: [],
      uploadData: {},
      btDisable: true,
      currentFile: null,
      fileDesc: '',
      speed: '',
      time: '',
      loaded: 0
    };
  },
  computed: {
    ...mapGetters([
      'selectedData'
    ]),
    title() {
      const isUpload = this.type === 'update';
      this.filePath = isUpload ? '要更新的文件：' : '当前文件夹：';
      return isUpload ? '更新' : '上传';
    },
    tip() {
      let tip = '';
      for (const item of this.navList) {
        tip += ' / ' + item.fname;
      }
      if (this.type === 'update') return tip + ' / ' + this.selectedData[0].fname;
      return tip;
    }
  },
  methods: {
    onProgress(event) {
      const interval = new Date().getTime() - this.time;
      this.time = new Date().getTime();
      const size = event.loaded - this.loaded;
      this.speed = formatSize((size / (interval / 1000)).toFixed(0)) + '/s';
      this.loaded = event.loaded;
    },
    onError() {
      this.$message1000('文件上传出错：网络错误', 'error');
      this.visible = false;
      this.$refs.upload.clearFiles();
      this.$emit('action', 'refresh');
      this.speed = '';
    },
    onRemove(file, filelist) {
      this.speed = '';
      this.fileList = filelist;
      if (filelist.length === 0) {
        this.btDisable = true;
      }
    },
    submitUpload() {
      if (this.currentFile == null) {
        return;
      }
      this.uploadData.fremarks = this.fileDesc;
      this.$refs.upload.submit();
      this.time = new Date().getTime();
      this.btDisable = true;
    },
    uploadOk(response) {
      this.speed = '';
      if (response.success === true) {
        this.$message1000('文件上传成功', 'success');
        this.$refs.upload.clearFiles();
        this.fileList = [];
        this.visible = false;
        this.$emit('action', 'refresh');
      } else {
        let msg = response.msg;
        if (msg == null || msg === '') {
          msg = '服务器错误';
        }
        msg = '文件上传出错：' + msg;
        this.$message1000(msg, 'error');
        this.$refs.upload.clearFiles();
        this.fileList = [];
        this.visible = false;
        this.$emit('action', 'refresh');
      }
    },
    onFileChange(file, filelist) {
      if (this.type === 'update') {
        if (file.name !== this.selectedData[0].fname) {
          filelist.pop();
          this.$message1000('文件上传失败！上传文件名与更新文件名不符', 'error');
        }
      }
      if (filelist.length > 1) {
        for (let i = 0; i < filelist.length - 1; i++) {
          if (filelist[i].name === file.name) {
            filelist.pop();
            this.$message1000('上传失败！文件上传列表中存在同名文件', 'error');
          }
        }
      }
      this.fileList = filelist;

      if (file.status === 'ready') {
        this.$emit('action', 'refresh');
        this.btDisable = false;
        this.currentFile = file;
        this.uploadData = {
          fparentid: this.$route.query.dirid || 0
        };

        if (this.selectedData.length === 1 && this.type === 'update') {
          this.uploadData = {
            fparentid: this.$route.query.dirid || 0,
            fcategoryid: this.selectedData[0].fcategoryid,
            fversionsign: this.selectedData[0].fversionsign
          };
        }
      }
    },
    close() {
      var uploadingFiles = [];
      for (let i = 0; i < this.fileList.length; ++i) {
        if (this.fileList[i].status === 'uploading') {
          uploadingFiles.push(this.fileList[i]);
        }
      }
      if (this.fileList.length > 0) {
        if (confirm('文件正在上传中，关闭后上传被中止, 是否继续?')) {
          for (let v = 0; v < uploadingFiles.length; ++v) {
            this.$refs.upload.abort(uploadingFiles[v]);
          }
          this.speed = '';
          this.$refs.upload.clearFiles();
          this.fileList = [];
          this.visible = false;
        } else {
          return;
        }
        this.$message1000('文件上传被中止', 'warning');
      }
      this.$refs.upload.clearFiles();
      this.fileList = [];
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .upload-file{
    .el-upload__tip {
      color: #a00;
      word-break: break-all;
      >span{
        color: #888;padding-right: 2px;
      }
    }
   .el-dialog__header {
      padding: 10px 20px 5px 20px;
    }
    .el-upload-dragger {
      height: 135px;
    }
    .el-upload-dragger .el-icon-upload {
      margin: 22px 0 16px;
    }
    .file-desc-label {
      font-size: 14px;
      margin: 5px 0 5px 0px;
      color: #666;
    }
    .upload-speed{
      color: forestgreen;
    }
  }
</style>
