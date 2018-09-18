<template>
  <div>
    <el-dialog
      title="删除文件"
      :visible.sync="isVisible"
      :modal-append-to-body="false"
      custom-class="delete-file"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="430px">
      <div class="file-list">
        <div v-for="(item, index) in selectedData" :key="index" class="item">
          <svg-icon :icon-class="String(item.ffiletype)" className="icon"/> <span class="item-name">{{item.fname}}</span>
        </div>
      </div>
      <div class="info-panel">
        <span class="info" v-if="deleting===true">
          <i class="el-icon-loading"></i> 正在删除...
        </span>
        <span class="info2" v-if="deleteInfo!==''">
          {{deleteInfo}}
        </span>
        <span class="err" v-if="err !== ''">
          {{err}}
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="tooltip">{{err}}</span>
        <el-button type="primary" @click="submitForm" size="small">开始删除</el-button>
        <el-button @click="quitDialog" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { deleteCategory } from '@/api/file'
  export default {
    name: 'DeleteFile',
    data() {
      return {
        err: '',
        deleteInfo: '',
        deleting: false
      }
    },
    methods: {
      quitDialog() {
        if (this.deleting) {
          if (confirm('删除未完成，您关闭对话框后，删除将继续进行，仍要关闭对话框吗？')) {
            this.$store.dispatch('ToggleDeleteVisible')
            return
          }
          return
        }
        this.$store.dispatch('ToggleDeleteVisible')
      },
      submitForm() {
        this.deleting = true
        const categoryids = []
        this.selectedData.forEach(item => {
          categoryids.push(item.fcategoryid)
        })
        deleteCategory(categoryids, this.$store.getters.parentId)
          .then(res => {
            this.$store.dispatch('ToggleDeleteVisible')
            if (res.success) {
              this.$message1000(res.msg, 'success')
              this.deleting = false
              this.$store.dispatch('Refresh')
            }
          })
          .catch(err => {
            console.log(err)
            if (this.$store.getters.hasSearch) {
              this.$message1000('该文件已经被删除', 'info')
            }
            this.deleting = false
            this.$store.dispatch('ToggleDeleteVisible')
          }).finally(() => {
            this.$store.dispatch('SetSelectedData', [])
          })
      }
    },
    computed: {
      ...mapGetters({
        isVisible: 'deleteVisible',
        selectedData: 'selectedData'
      })
    },
    mounted() {}
  }
</script>

<style>
  .delete-file .el-dialog__body {
    padding: 10px 20px !important;
  }
  .delete-file .el-dialog__header {
    padding: 10px 20px 5px 20px !important;
  }
  .delete-file .el-form-item {
    margin-bottom: 5px !important;
  }
  .delete-file .el-dialog__headerbtn {
    top:14px;
  }
  .delete-file .tooltip {
    color: #a00;
    font-size: 12px;
    padding-right: 10px;
  }
  .delete-file .file-list {
    height: 140px;
    border: 1px solid #ddd;
    border-radius: 0px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .delete-file .file-list .item {
    line-height: 28px;
    padding: 0 6px 0 6px;
    font-size: 12px;
    white-space:nowrap;
    text-overflow:ellipsis;
    width: 330px;
    overflow: hidden;
  }
  .delete-file .file-list .item img {
    width: 18px;
    vertical-align: -15%;
    padding-right: 2px;
  }
  .delete-file .info-panel {
    margin: 5px 0 0px 0;
    color: #666;
    font-size:14px;
    line-height: 26px;
  }
  .delete-file .info-panel .info {
    font-size:14px;
    color: #888;
  }
  .delete-file .info-panel .info2 {
    font-size:12px;
    color: #a00;
  }

  .delete-file .info-panel .err {
    color: #a00;
    font-size: 14px;
  }

  .delete-file .dialog-footer a {
    font-size: 12px;
    color: #409eff;
    text-decoration: none;
    padding-right: 20px;
  }
  .delete-file .dialog-footer a:hover {
    text-decoration: underline;
  }

</style>

<style scoped>
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
  }
  .item-name {
    vertical-align: middle;
  }
</style>
