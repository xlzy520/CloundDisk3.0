<template>
  <div>
    <el-dialog
      title="版本列表"
      :visible.sync="versionVisible"
      :modal-append-to-body="false"
      custom-class="version-list"
      :close-on-click-modal="true"
      width="750px">
      <el-dialog
        width="80%"
        title="版本对比详情"
        custom-class="diffMaster"
        :visible.sync="versionDiff"
        append-to-body>
        <vue-code-diff
          :old-string="oldStr"
          :new-string="newStr"
          :context="10"
          style="min-height: 70vh"
          outputFormat="side-by-side"
          v-if="versionDiff"></vue-code-diff>
      </el-dialog>
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
            width="120"
            label="操作">
            <template slot-scope="scope">
              <a @click="downloadVersion(scope.row.filesgin, $event, scope.row.filename, scope.row.fversion)">下载</a>
              <a
                href="javascript:void(0)"
                @click="rollBack(scope.row.filesgin)"
                title="设为最新版本" v-if="!scope.row.fdisplay">回退</a>
              <a size="mini" @click="previewFile(scope.row.filesgin)" v-if="selectedData[0].ffiletype === 3">查看</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="diff-select clearfix" v-if="selectedData[0].ffiletype === 3&&tableData.length>1">
          <el-select v-model="oldVersion" filterable placeholder="请选择旧版本" size="small">
            <el-option
              v-for="item in tableData"
              :key="item.value"
              :label="item.fversion"
              :value="item.filesgin">
            </el-option>
          </el-select>
          <el-select v-model="newVersion" filterable placeholder="请选择新版本" size="small">
            <el-option
              v-for="item in tableData"
              :key="item.value"
              :label="item.fversion"
              :value="item.filesgin">
            </el-option>
          </el-select>
          <el-button @click="diff" size="small" type="success">版本对比</el-button>
        </div>
        <el-button @click="dialogClose" size="small" type="warning">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getVersionList, versionRollback, getDocInfo } from '@/api/file'
  import { formatSize, parseTime } from '@/utils/index'
  import vueCodeDiff from 'vue-code-diff'
  import { Loading } from 'element-ui';
  export default {
    name: 'VersionList',
    components: {
      vueCodeDiff
    },
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
        'selectedData',
      ])
    },
    data() {
      return {
        versionDiff: false,
        tableData: [],
        oldStr: '',
        newStr: '',
        oldVersion: '',
        newVersion: ''
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
        if (this.selectedData.length === 1 && this.versionVisible === true) {
          return new Promise((resolve, reject) => {
            const loadingInstance1 = Loading.service({ target: document.querySelector('.version-list') })
            getVersionList(this.selectedData[0].fname, this.$store.getters.parentId).then(response => {
              const versionListInfo = response
              this.tableData = versionListInfo.data
              loadingInstance1.close()
              if (this.newVersion === '' && this.oldVersion === '') {
                this.newVersion = versionListInfo.data[0].fversion
                this.oldVersion = versionListInfo.data[1].fversion
              }
              resolve(response)
            }).catch(error => {
              loadingInstance1.close()
              reject(error)
            })
          })
          // const versionListInfo = await getVersionList(this.selectedData[0].fname, this.$store.getters.parentId)
          // this.tableData = versionListInfo.data
          // if (this.newVersion === '' && this.oldVersion === '') {
          //   this.newVersion = versionListInfo.data[0].fversion
          //   this.oldVersion = versionListInfo.data[1].fversion
          // }
        }
      },
      formatterTime(row, column) {
        return parseTime(row.fupdatetime)
      },
      sizeFormatter(row) {
        if (row.filesize !== null) {
          return formatSize(Number(row.filesize.replace('B', '')))
        }
      },
      previewFile(id) {
        this.$store.dispatch('GetDocInfo', id)
      },
      async diff() {
        if (this.oldVersion === '' || this.newVersion === '') {
          this.$message({
            message: '请选择旧版本或者新版本',
            type: 'warning',
            duration: 1000
          })
          return
        }
        try {
          const oldVersion = await getDocInfo(this.oldVersion)
          const newVersion = await getDocInfo(this.newVersion)
          this.oldStr = oldVersion.data.file
          this.newStr = newVersion.data.file
          this.versionDiff = true
        } catch (e) {
          this.$message({
            message: '网络连接失败',
            type: 'warning',
            duration: 1000
          })
          this.versionDiff = false
        } finally {
          this.oldVersion = ''
          this.newVersion = ''
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
    top: 14px;
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
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 330px;
    overflow: hidden;
  }

  .version-list .el-table__row {
    font-size: 12px;
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

  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar {
    width: 6px;
    background-color: #e5e5e5;
  }

  .el-table__body-wrapper.is-scrolling-none::-webkit-scrollbar-thumb {
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 4px;
    background-color: rgba(18, 150, 219, .8);
  }
  .diff-select{
    float: left;
  }
  .diffMaster{
    margin-top: 8vh!important;
  }
</style>
