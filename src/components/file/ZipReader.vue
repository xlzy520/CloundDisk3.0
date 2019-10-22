<template>
  <div class="zip-reader">
    <base-dialog ref="dialog" @close="close" :title="title">
      <div class="zip-reader-content">
        <base-scrollbar>
          <div class="zip-reader-content-item" v-for="item in zips" @click="clickFile(item)">
            <div class="zip-reader-content-item-name">
              <svg-icon :icon-class="String(item.fileType)"/>
              <span :title="item.simpleName">{{ item.simpleName }}</span>
            </div>
            <div class="zip-reader-content-item-button" v-if="item.fileType !== '1'" @click.stop>
              <el-button size="mini" @click="download(item)">下载</el-button>
            </div>
          </div>
        </base-scrollbar>
      </div>
      <div slot="footer"
           class="zip-reader-footer">
        <el-button size="small" type="primary" @click="back" v-if="historyNode.length > 1">返 回</el-button>
        <el-button size="small" @click="close">关 闭</el-button>
      </div>
    </base-dialog>
  </div>
</template>
<script>
  import baseDialog from '../base/baseDialog.vue';
  import baseScrollbar from '../base/baseScrollbar.vue';
  export default {
    name: 'zip-reader',
    data() {
      return {
        zips: [],
        title: '',
        historyNode: [],
        _zip: {}
      };
    },
    components: {
      baseDialog,
      baseScrollbar
    },
    methods: {
      openFrame(tree) {
        this.$refs.dialog.dialogVisible = true;
        this.restValues();
        this.zips = tree.children;
        this.title = tree.fname;
        this._zip = tree._zip;
        this.historyNode.push(this.zips);
      },
      restValues() {
        this.zips = [];
        this.title = '';
        this.historyNode = [];
      },
      close() {
        this.$refs.dialog.dialogVisible = false;
      },
      back() {
        this.historyNode.pop();
        this.zips = this.historyNode[this.historyNode.length - 1];
      },
      download(file) {
        this._zip.file(file.name).async("uint8array").then(res => {
          let blob = new Blob([res]);
          let url = URL.createObjectURL(blob);
          let download = document.createElement('a');
          download.download = file.simpleName;
          download.style.display = 'none';
          download.href = url;
          document.body.appendChild(download);
          download.click();
          document.body.removeChild(download);
          // URL.revokeObjectURL(url); //释放创建的对象URL
        });
      },
      clickFile(file) {
        if (file.fileType === "1") {
          this.zips = file.children;
          this.historyNode.push(this.zips);
        } else if (file.type === 'jpg') {
          this._zip.file(file.name).async("base64").then(res => {
            this.$emit('action', 'viewImg', {
              name: file.simpleName,
              url: 'data:image/jpeg;base64,' + res
            });
          });
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  .zip-reader {
    &-content {
      display: flex;
      position: relative;
      margin: 10px 0;
      padding: 0 20px;
      width: 600px;
      height: 380px;
      &-item {
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          background: #e3ecf76b;
        }
        &-name {
          width: 420px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &-button {
          position: relative;
          right: 15px;
          height: 100%;
          button {
            margin-top: 1px;
            padding: 5px 10px;
          }
        }
      }
    }
    &-footer {
      text-align: right;
      padding: 20px;
    }
  }
</style>
