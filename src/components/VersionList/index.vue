<template>
  <div>
    <el-dialog
      title="版本列表"
      :visible.sync="versionVisible"
      :modal-append-to-body="false"
      custom-class="version-list"
      :close-on-click-modal="true"
      width="650px">
      <div class="file-list">
        <el-table
          :data="tableData"
          height="260"
          stripe
          style="width: 100%">
          <el-table-column
            width="70"
            prop="fversion"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="fupdater"
            label="修改人"
            width="90">
          </el-table-column>
          <el-table-column
            width="145"
            label="修改时间">
            <template slot-scope="scope">
              {{scope.row.fupdatetime | time}}
            </template>
          </el-table-column>
          <el-table-column
            prop="filesize"
            label="文件长度"
            width="80">
            <template slot-scope="scope">
              {{scope.row.size | fileSize}}
            </template>
          </el-table-column>
          <el-table-column
            prop="fremarks"
            label="版本描述">
          </el-table-column>

          <el-table-column
            width="80"
            label="操作">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="downloadFile(scope.row.fattribution)">下载</a>
              <a href="javascript:void(0)" @click="downloadFile(scope.row.fattribution)" title="设为最新版本">回退</a>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose" size="small" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getVersionList } from '@/api/file'
  export default {
    name: 'VersionList',
    computed: {
      versionVisible: {
        get() {
          return this.$store.state.file.versionVisible
        },
        set() {
          this.$store.dispatch('ToggleVersionVisible')
        }
      },
      ...mapGetters([
        'selectedData'
      ])
    },
    data() {
      return {
        tableData: []
      }
    },
    methods: {
      dialogClose() {
        this.$store.dispatch('ToggleVersionVisible')
      },
      downloadFile(id) {

      },

      requestData() {

      }
    },
    async mounted() {
      if (this.selectedData.length === 1) {
        const versionListInfo = await getVersionList(this.selectedData[0].fname, this.selectedData[0].fcategoryid)
        this.tableData = versionListInfo.data
      }
    }
  }
</script>

<style>
  .version-list .el-dialog__body {
    padding: 10px 20px !important;
  }
  .version-list .el-dialog__header {
    padding: 10px 20px 5px 20px !important;
  }
  .version-list .el-form-item {
    margin-bottom: 5px !important;
  }
  .version-list .el-dialog__headerbtn {
    top:14px;
  }
  .version-list .tooltip {
    color: #a00;
    font-size: 12px;
    padding-right: 10px;
  }
  .version-list .file-list {

    border: 1px solid #ddd;
    border-radius: 0px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .version-list .file-list .item {
    line-height: 28px;
    padding: 0 6px 0 6px;
    font-size: 12px;
    white-space:nowrap;
    text-overflow:ellipsis;
    width: 330px;
    overflow: hidden;
  }

  .version-list .el-table__row {
    font-size:12px;
    color: #333;
  }

  .version-list .el-table__row a {
    color: #409eff;
    height: 30px;
    text-decoration: none;
  }
  .version-list .el-table__row a:hover {
    text-decoration: underline;
  }
  .version-list .el-table__row .cell {
    line-height: 18px;
  }


</style>
