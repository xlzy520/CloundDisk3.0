<template>
  <div class="delete-file">
    <base-dialog ref="dialog" :title="'删除文件'" @close="close">
      <div class="delete-file-list">
        <base-scrollbar>
          <div v-for="(item, index) in selected" :key="index" class="delete-file-list-item">
            <svg-icon :icon-class="String(item.ffiletype)" class-name="delete-file-list-item-icon"/><span class="delete-file-list-item-name">{{item.fname}}</span>
          </div>
        </base-scrollbar>
      </div>
      <div class="info-panel">
        <span class="info" v-if="deleting === true">
          <i class="el-icon-loading"></i> 正在删除...
        </span>
      </div>
      <div slot="footer" class="delete-file-footer">
        <el-button type="primary" @click="submitForm" size="small">开始删除</el-button>
        <el-button @click="close" size="small">关闭</el-button>
      </div>
    </base-dialog>
    <!-- <el-dialog
      title="删除文件"
      :visible.sync="visible"
      :modal-append-to-body="false"
      custom-class="delete-file"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="430px">
      <div class="file-list">
        <div v-for="(item, index) in selected" :key="index" class="item">
          <svg-icon :icon-class="String(item.ffiletype)" class-name="icon"/> <span class="item-name">{{item.fname}}</span>
        </div>
      </div>
      <div class="info-panel">
        <span class="info" v-if="deleting === true">
          <i class="el-icon-loading"></i> 正在删除...
        </span>
        <span class="info2" v-if="deleteInfo !== ''">
          {{deleteInfo}}
        </span>
        <span class="err" v-if="err !== ''">
          {{err}}
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="tooltip">{{err}}</span>
        <el-button type="primary" @click="submitForm" size="small">开始删除</el-button>
        <el-button @click="close" size="small">关闭</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex';
  import fileService from '@/api/service/file.js';
  import baseDialog from '@/components/baseDialog.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  export default {
    name: 'DeleteFile',
    // computed: {
    //   ...mapGetters([
    //     'selected'
    //   ])
    // },
    components: {
      baseDialog,
      baseScrollbar
    },
    data() {
      return {
        visible: false,
        // err: '',
        // deleteInfo: '',
        deleting: false,
        selected: []
      };
    },
    methods: {
      close() {
        this.restValues();
      },
      restValues() {
        this.$refs.dialog.dialogVisible = false;
        this.selected = [];
        // this.deleteInfo = '';
        // this.err = '';
        this.deleting = false;
      },
      openFrame(rows) {
        this.selected = rows;
        this.$refs.dialog.dialogVisible = true;
      },
      submitForm() {
        this.deleting = true;
        // const categoryids = [];
        // this.selected.forEach(item => {
        //   categoryids.push(item.fcategoryid);
        // });
        fileService.deleteCategory(this.selected.map(item => item.fcategoryid), this.$store.getters.parentId)
          .then(res => {
            // this.visible = false;
            if (res.success) {
              this.$message1000(res.msg, 'success');
              // this.deleting = false;
              this.$emit('delete-success');
              // this.$store.dispatch('Refresh');
            }
          })
          .catch(err => {
            if (this.$store.getters.hasSearch) {
              this.$message1000(err.message, 'info');
            }
            // this.deleting = false;
            // this.close();
          }).finally(() => {
            this.close();
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
.delete-file {
  &-list {
    display: flex;
    width: 390px;
    height: 140px;
    padding: 0 6px;
    border: 1px solid #ddd;
    &-item {
      &-name {
        vertical-align: middle;
      }
      &-icon {
        width: 1.5em;
        height: 1.5em;
      }
    }
  }
  &-footer {
    text-align: right;
    padding: 20px;
  }
}
</style>
