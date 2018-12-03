<template>
  <div class="zip-reader">
    <base-dialog ref="dialog"
                 @close="close"
                 :title="title">
      <div class="zip-reader-content">
        <base-scrollbar>
          <div class="zip-reader-content-item"
               v-for="item in zips"
               @click="clickFile(item)">
            <div class="zip-reader-content-item-icon">
              <svg-icon :icon-class="String(item.fileType)"
                        class-name="icon" />
            </div>
            <div class="zip-reader-content-item-name"
                 :title="item.simpleName">
              {{ item.simpleName }}
            </div>
          </div>
        </base-scrollbar>
      </div>
      <div slot="footer"
           class="zip-reader-footer">
        <el-button size="small"
                   type="primary"
                   @click="back"
                   v-if="historyNode.length > 1">返 回</el-button>
        <el-button size="small"
                   @click="close">关 闭</el-button>
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
      clickFile(file) {
        if (file.fileType === "1") {
          this.zips = file.children;
          this.historyNode.push(this.zips);
        } else if (file.type === 'jpg') {
          this._zip.file(file.name).async("base64").then(res => {
            // let blob = new Blob([res]);
            // let url = URL.createObjectURL(blob);
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
      width: 700px;
      height: 400px;
      &-item {
        display: inline-block;
        vertical-align: top;
        margin-left: 20px;
        margin-top: 20px;
        width: 120px;
        height: 150px;
        text-align: center;
        border-radius: 6px;
        cursor: pointer;
        &:hover {
          background: #e3ecf76b;
        }
        &-icon {
          margin: auto;
          padding: 10px;
          .icon {
            width: 100px;
            height: 100px;
          }
        }
        &-name {
          height: 24px;
          margin-top: 0px;
          padding: 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    &-footer {
      text-align: right;
      padding: 20px;
    }
  }
</style>
