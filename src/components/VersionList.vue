<template>
  <div>
    <el-dialog
      title="版本列表"
      :visible="true"
      :modal-append-to-body="false"
      custom-class="version-list"
      :close-on-click-modal="true"
      @close="close"
      width="750px">
      <el-dialog
        width="80%"
        title="版本对比详情"
        custom-class="diffMaster"
        :visible.sync="versionDiff"
        append-to-body>
        <el-switch
          class="lineSwitch"
          v-model="lineSwitch"
          active-text="双栏"
          inactive-text="单栏"
          active-color="#13ce66"
          inactive-color="#ff4949"></el-switch>
        <el-form class="rangeDiff" label-width="200px">
          <el-form-item label="差异化范围:">
            <el-input-number
              v-model="numDiff"
              size="mini"
              :min="1" :max="100"
              label="差异化范围"></el-input-number>
          </el-form-item>
        </el-form>

        <vue-code-diff
          :old-string="oldStr"
          :new-string="newStr"
          :context="numDiff"
          style="min-height: 70vh"
          :outputFormat="outputFormat"
          v-if="versionDiff"></vue-code-diff>
      </el-dialog>
      <div class="file-list">
        <el-table
          :data="tableData"
          height="260"
          stripe
          v-loading="loading"
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
                title="设为最新版本" v-if="scope.row.fdisplay">回退</a>
              <a size="mini" @click="fileType(scope.row)" v-if="selectedData[0].ffiletype!==0">查看</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="diff-select clearfix" v-if="selectedData[0].ffiletype === 2&&tableData.length>1">
          <el-select v-model="oldVersion.value" filterable placeholder="请选择旧版本" size="small">
            <el-option
              v-for="item in tableData"
              :key="item.value"
              :label="item.fversion"
              :value="item.filesgin">
            </el-option>
          </el-select>
          <el-select v-model="newVersion.value" filterable placeholder="请选择新版本" size="small">
            <el-option
              v-for="item in tableData"
              :key="item.value"
              :label="item.fversion"
              :value="item.filesgin">
            </el-option>
          </el-select>
          <el-button @click="diff" size="small" type="success" :loading="diffLoading">版本对比</el-button>
        </div>
        <el-button @click="close" size="small" type="warning">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import fileService from '@/api/service/file.js';
  import { formatSize, parseTime } from '@/utils/index';
  import vueCodeDiff from 'vue-code-diff';

  export default {
    name: 'VersionList',
    components: {
      vueCodeDiff
    },
    computed: {
      ...mapGetters([
        'selectedData'
      ]),
      outputFormat() {
        return this.lineSwitch === true ? 'line-by-line' : 'side-by-side';
      }
    },
    data() {
      return {
        versionDiff: false,
        tableData: [],
        oldStr: '',
        newStr: '',
        oldVersion: {
          label: '',
          value: ''
        },
        newVersion: {
          label: '',
          value: ''
        },
        lineSwitch: true,
        numDiff: 5,
        loading: false,
        diffLoading: false
      };
    },
    methods: {
      downloadVersion(id, evt, filename) {
        evt.target.href = '/djcpsdocument/fileManager/downloadFile.do?id=' + id;
        evt.target.download = filename; // 暂时不加版本号
      },
      close() {
        this.$emit('closeDialog', 'versionVisible');
        this.$store.dispatch('Refresh');
      },
      async rollBack(newVer) {
        this.loading = true;
        if (this.selectedData.length === 1) {
          const version = await fileService.versionRollback(this.tableData[0].filesgin, newVer);
          if (version.success) {
            this.loading = false;
            this.$message1000('版本回退成功', 'success');
            this.requestData();
            // this.$store.dispatch('Refresh')  //刷新文件列表
          } else {
            this.loading = false;
            this.$message1000('版本回退失败', 'warning');
          }
        }
      },
      async requestData() {
        this.loading = true;
        if (this.selectedData.length === 1) {
          try {
            const versionListInfo = await fileService.getVersionList(this.selectedData[0].fversionsign);
            if (versionListInfo.success) {
              this.loading = false;
              this.tableData = versionListInfo.data;
              if (versionListInfo.data.length > 1 && this.newVersion.value === '' && this.oldVersion.value === '') {
                this.newVersion.label = versionListInfo.data[0].fversion;
                this.newVersion.value = versionListInfo.data[0].filesgin;
                this.oldVersion.label = versionListInfo.data[1].fversion;
                this.oldVersion.value = versionListInfo.data[1].filesgin;
              }
            }
          } catch (e) {
            this.loading = false;
          }
        }
      },
      formatterTime(row) {
        return parseTime(row.fupdatetime);
      },
      sizeFormatter(row) {
        if (row.filesize !== null) {
          return formatSize(Number(row.filesize.replace('B', '')));
        }
      },
      fileType({ fvsgin, filesgin }) {
        switch (this.selectedData[0].ffiletype) {
          case 1:
            this.$store.dispatch('GetCategory', filesgin);
            this.$store.dispatch('SetParentId', filesgin);
            if (this.$router.path !== '/list/index') {
              this.$router.push({ path: `/list/index?`, query: { dirid: filesgin }});
            }
            break;
          case 2:
            this.$store.dispatch('GetDocInfo', filesgin);
            break;
          case 3: case 4: case 5:
            window.open(`/#/office?id=${filesgin}&vid=${fvsgin}`);
            break;
          case 6:
            window.open(`/djcpsdocument/fileManager/previewPdf.do?id=${filesgin}`);
            break;
          case 7:
            this.$store.dispatch('ToggleImgEditor', filesgin);
            break;
        }
      },
      async diff() {
        this.diffLoading = true;
        if (this.oldVersion.value === '' || this.newVersion.value === '') {
          this.$message1000('请选择旧版本或者新版本', 'warning');
          this.diffLoading = false;
          return;
        }
        try {
          const oldVersion = await fileService.getDocInfo(this.oldVersion.value);
          const newVersion = await fileService.getDocInfo(this.newVersion.value);
          this.oldStr = oldVersion.data.file;
          this.newStr = newVersion.data.file;
          this.diffLoading = false;
          this.versionDiff = true;
        } catch (e) {
          this.$message1000('网络连接失败', 'warning');
          this.versionDiff = false;
          this.diffLoading = false;
        } finally {
          this.oldVersion.value = '';
          this.oldVersion.label = '';
        }
      }
    },
    mounted() {
      this.requestData();
    }
  };
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
  .lineSwitch{
    position: absolute;
    top: 22px;
    left: 40%;
  }
  .rangeDiff{
    position: absolute;
    top: 11px;
    left: 60%;
  }
</style>
