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
            prop="fcreator"
            label="创建人"
            width="70">
          </el-table-column>
          <el-table-column
            width="145"
            :formatter="formatterTime"
            prop="fupdatetime"
            sortable
            label="修改时间">
          </el-table-column>
          <el-table-column
            prop="filesize"
            :formatter="sizeFormatter"
            label="文件长度"
            width="80">
          </el-table-column>
          <el-table-column
            prop="fremarks"
            label="版本描述">
          </el-table-column>

          <el-table-column
            width="80"
            label="操作">
            <template slot-scope="scope">
              <a @click="downloadVersion(scope.row.filesgin, $event, scope.row.filename, scope.row.fversion)">下载</a>
              <a
                href="javascript:void(0)"
                @click="rollBack(scope.row.filesgin)"
                title="设为最新版本" v-if="!scope.row.fdisplay">回退</a>
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
  import { getVersionList, versionRollback } from '@/api/file'
  import { formatSize, parseTime } from '@/utils/index'
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
      downloadVersion(id, evt, filename, fversion) {
        evt.target.href = '/api_zhq/djcpsdocument/fileManager/downloadFile.do?id=' + id
        evt.target.download = filename // 暂时不加版本号
      },
      dialogClose() {
        this.$store.dispatch('ToggleVersionVisible')
      },
      async rollBack(newVer) {
        if (this.selectedData.length === 1) {
          const version = await versionRollback(this.tableData[0].filesgin, newVer)
          if (version.success) {
            this.requestData()
            // this.$store.dispatch('Refresh')  //刷新文件列表
          }
        }
      },
      async requestData() {
        if (this.selectedData.length === 1) {
          const versionListInfo = await getVersionList(this.selectedData[0].fname, this.$store.getters.parentId)
          this.tableData = versionListInfo.data
        }
      },
      formatterTime(row, column) {
        return parseTime(row.fupdatetime)
      },
      sizeFormatter(row) {
        if (row.filesize !== null) {
          return formatSize(Number(row.filesize.replace('B', '')))
        }
      }
    },
    mounted() {
      this.requestData()
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
