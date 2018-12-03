<template>
  <div class="zip-reader">
    <base-dialog ref="dialog" @close="close" :title="title">
      <div class="zip-reader-content">
        <base-scrollbar>
          <div class="zip-reader-content-item" v-for="item in zips" @click="clickFile(item)">
            <div class="zip-reader-content-item-icon">
              <svg-icon :icon-class="String(item.fileType)" class-name="icon" />
            </div>
            <div class="zip-reader-content-item-name" :title="item.simpleName">
              {{ item.simpleName }}
            </div>
            <div class="zip-reader-content-item-button" v-if="item.fileType !== '1'" @click.stop>
              <el-button type="primary" size="mini" @click="download(item)">下载</el-button>
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
  import baseDialog from './baseDialog.vue';
  import baseScrollbar from './baseScrollbar.vue';
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
        console.log(file);
      },
      clickFile(file) {
        if (file.fileType === "1") {
          this.zips = file.children;
          this.historyNode.push(this.zips);
        } else if (file.type === 'jpg') {
          this._zip.file(file.name).async("base64").then(res => {
            // let blob = new Blob([res]);
            // let url = URL.createObjectURL(blob);
            this.$emit('action', 'openImg', {
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
      padding: 0px 20px;
      width: 700px;
      height: 380px;
      &-item {
        position: relative;
        vertical-align: top;
        margin-top: 10px;
        cursor: pointer;
        & > div {
          display: inline-block;
          vertical-align: middle;
        }
        &:hover {
          background: #e3ecf76b;
        }
        &-icon {
          margin: auto;
        }
        &-name {
          height: 24px;
          margin-top: 0px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &-button {
          position: absolute;
          right: 0;
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
