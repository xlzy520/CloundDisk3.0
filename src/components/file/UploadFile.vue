<template>
  <el-dialog
    :title="'文件'+title"
    :visible.sync="visible"
    @close="close"
    :close-on-click-modal="true"
    width="32vw">
    <el-upload
      ref="upload"
      drag
      :action="url"
      :on-success="uploadOk"
      :data="uploadData"
      :on-change="onFileChange"
      :auto-upload="false"
      :on-remove="onRemove"
      :show-file-list="true"
      :on-error="onError"
      :on-progress="onProgress"
      :accept="mold"
      multiple
    >
      <i class="el-icon-upload"></i>
      <p class="upload-speed" v-show="speed">{{speed}}</p>
      <div class="el-upload__text">将文件拖到此处或点击上传</div>
      <div class="el-upload__tip" slot="tip"><span>{{filePath}}</span>{{tip}}</div>
    </el-upload>
    <div v-if="type==='update'">
      <div class="change_log">更新内容：</div>
      <el-input type="textarea" v-model="changeLog"></el-input>
    </div>
    <div v-if="type==='relevance'">
      <div class="change_log">
        操作提示<br />
        1. 用Axure软件打开对应的RP文档<br />
        2. 选择工具栏的【发布(P) - 生成原型文件 - 复制"生成HTML文件的目标文件夹"地址】<br />
        3. 进入到上述地址文件夹，将该目录所有文件打包成zip格式的压缩包<br />
        4. 选择对应的压缩包文件，完成上传操作<br />
      </div>
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
      changeLog: '',
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
      if (this.type === 'update' && this.selectedData.length > 0) {
        return tip + ' / ' + this.selectedData[0].fname;
      }
      return tip;
    },
    isRp() {
      return this.selectedData.length === 1 && this.selectedData[0].ffiletype === 12 && this.type === 'relevance';
    },
    url() {
      return this.isRp ? '/djcpsdocument/fileManager/zipFileUpload.do' : '/djcpsdocument/category/fileUpload.do';
    },
    mold() {
      return this.isRp ? '.zip' : '';
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
      this.uploadData.fremarks = this.changeLog;
      this.$refs.upload.submit();
      this.time = new Date().getTime();
      this.btDisable = true;
    },
    uploadOk(res) {
      this.speed = '';
      if (res.success) {
        this.$message1000('文件上传成功', 'success');
        this.$refs.upload.clearFiles();
        this.visible = false;
        this.$emit('action', 'refresh');
        if (this.isRp) {
          var a = document.createElement("a"); //创建a标签
          let intime = +new Date();
          a.id = intime;
          a.setAttribute("href", res.data.previewUrl);
          a.setAttribute("target", "_blank");
          document.body.appendChild(a);
          a.click(); //执行当前对象
          setTimeout(() => {
            document.body.removeChild(document.getElementById(intime));
          }, 500);
        }
      } else {
        let msg = res.msg;
        if (msg == null || msg === '') {
          msg = '服务器错误';
        }
        msg = '文件上传出错：' + msg;
        this.$message1000(msg, 'error');
        this.$refs.upload.clearFiles();
        this.fileList = [];
        this.visible = false;
      }
    },
    onFileChange(file, fileList) {
      if (fileList.length > 0) {
        this.btDisable = false;
      }
      if (this.type === 'update' && file.name !== this.selectedData[0].fname) {
        fileList.pop();
        this.$message1000('文件上传失败！上传文件名与更新文件名不符', 'error');
      }
      if (fileList.length > 1) {
        for (let i = 0; i < fileList.length - 1; i++) { //此时fileList里面已经包含file了，所以需要长度减一再判断
          if (fileList[i].name === file.name) {
            fileList.pop();
            this.$message1000('上传失败！文件上传列表中存在同名文件', 'error');
          }
        }
      }
      this.fileList = fileList;
      if (file.status === 'ready') {
        this.btDisable = false;
        this.currentFile = file;
        if (this.isRp) {
          this.uploadData = {
            fcategoryid: this.selectedData[0].fcategoryid
          };
        } else {
          this.uploadData = {
            fparentid: this.$route.query.dirid || 0
          };
        }
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
      let uploadingFiles = [];
      for (const item of this.fileList) {
        if (item.status === 'uploading') {
          uploadingFiles.push(item);
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
  /deep/ .el-upload{
    display: block;
    &__tip {
      word-break: break-all;
      >span{
        font-size: 14px;
        color: #ff7676;
      }
    }
    &-list__item{
      outline: none;
    }
    &-dragger {
      width: 100%;
      height: 22vh;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .el-icon-upload {
        margin: 0;
      }
    }
  }
  .el-dialog__header {
    padding: 20px 20px 5px;
  }
  .change_log {
    margin: 5px 0;
    color: #ff7676;
  }
  .upload-speed{
    color: forestgreen;
  }
</style>
