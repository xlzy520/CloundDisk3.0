<template>
  <div>
    <el-dialog
      v-if="visible"
      title="版本列表"
      :visible="true"
      custom-class="version-list"
      :close-on-click-modal="true"
      @close="close"
      v-loading.fullscreen.lock="fullLoading"
      width="750px">
      <el-dialog
        width="80%"
        title="版本对比详情"
        custom-class="diff_content"
        :visible.sync="versionDiff"
        append-to-body>
        <div class="diff_config_header">
          <el-switch
            v-model="lineSwitch"
            active-text="双栏"
            inactive-text="单栏"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
          <div class="diff_range">
            <label>差异化范围：</label>
            <el-input-number v-model="numDiff" size="mini" :min="1" :max="100"></el-input-number>
          </div>
        </div>
        <code-diff
          :old-string="oldStr"
          :new-string="newStr"
          :context="numDiff"
          :output-format="outputFormat"
          v-if="versionDiff"></code-diff>
      </el-dialog>
      <div class="file-list">
        <base-table
          ref="baseTable"
          stripe
          :loading="loading"
          :table-data="tableData"
          :table-columns="tableColumns">
        </base-table>
      </div>
      <div slot="footer" class="diff_footer">
        <div class="diff_version_select" v-if="[2,9,11].includes(selectedData[0].ffiletype)&&tableData.length>1">
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
  import {mapGetters} from 'vuex';
  import fileService from '@/api/service/file';
  import {formatSize, parseTime} from '@/utils/index';
  import CodeDiff from '@/components/file/CodeDiff.vue';
  import baseTable from '@/components/base/baseTable.vue';
  import fileType from '@/mixins/fileType';

  export default {
    name: 'VersionList',
    mixins: [fileType],
    components: {
      CodeDiff, baseTable
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
        visible: false,
        versionDiff: false,
        tableData: [],
        tableColumns: [
          {label: '版本号', prop: 'fversion', width: 70},
          {label: '创建人', prop: 'fcreator', width: 70},
          {
            label: '修改时间', prop: 'fupdatetime', width: 145, sortable: true,
            formatter: (row) => parseTime(row.fupdatetime)
          },
          {
            label: '文件大小', prop: 'filesize', width: 80,
            formatter: (row) => {
              if (row.filesize !== null) {
                return formatSize(row.filesize);
              }
              return '';
            }
          },
          {label: '版本描述', prop: 'fremarks'},
          {
            label: '操作', width: 120,
            render: (h, {props: {row}}) => {
              const download = (<a onClick={(event)=>this.downloadVersion(row.filesgin, row.filename, event)}>下载</a>);
              const rollBack = (<a href="javascript:void(0)" onClick={this.rollBack.bind(this, row.filesgin)} title="设为最新版本">回退</a>);
              const view = (<a onClick={this.fileType.bind(this, row)}>查看</a>);
              return (
                <div className="version-operate">
                  {download}
                  {row.fdisplay ? (rollBack) : (null)}
                  {this.selectedData[0].ffiletype !== 0 ? (view) : null}
                </div>
              );
            }
          }
        ],
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
        diffLoading: false,
        modify: false
      };
    },
    methods: {
      downloadVersion(id, filename, evt) {
        evt.target.href = '/djcpsdocument/fileManager/downloadFile.do?id=' + id;
        evt.target.download = filename; // 暂时不加版本号
      },
      close() {
        this.visible = false;
        if (this.modify) this.$emit('action', 'refresh'); //点过回退按钮才刷新。
      },
      rollBack(newVer) {
        this.loading = true;
        fileService.versionRollback(this.tableData[0].filesgin, newVer).then(() => {
          this.loading = false;
          this.modify = true;
          this.$message1000('版本回退成功', 'success');
          this.requestData();
        }).catch(() => {
          this.loading = false;
        });
      },
      requestData() {
        this.loading = true;
        if (this.selectedData.length === 1) {
          fileService.getVersionList(this.selectedData[0].fversionsign).then(res => {
            this.loading = false;
            this.tableData = res.data;
            if (res.data.length > 1 && this.newVersion.value === '' && this.oldVersion.value === '') {
              this.newVersion.label = res.data[0].fversion;
              this.newVersion.value = res.data[0].filesgin;
              this.oldVersion.label = res.data[1].fversion;
              this.oldVersion.value = res.data[1].filesgin;
            }
          }).catch(()=>{
            this.loading = false;
          });
        }
      },
      diff() {
        this.diffLoading = true;
        if (this.oldVersion.value === '' || this.newVersion.value === '') {
          this.$message1000('请选择旧版本或者新版本', 'warning');
          this.diffLoading = false;
          return;
        }
        const oldVersion = fileService.downloadFile(this.oldVersion.value);
        const newVersion = fileService.downloadFile(this.newVersion.value);
        Promise.all([oldVersion, newVersion]).then(res=>{
          this.oldStr = res[0];
          this.newStr = res[1];
          this.diffLoading = false;
          this.versionDiff = true;
        }).catch(()=>{
          this.$message1000('网络连接失败', 'warning');
          this.versionDiff = false;
          this.diffLoading = false;
        }).finally(()=>{
          this.oldVersion.value = '';
          this.oldVersion.label = '';
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .diff_content{
    .el-dialog__header{
      padding: 20px 20px 0;
    }
  }
  .diff_content.el-dialog{
    .diff_config_header{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .diff_range{
        margin-left: 50px;
      }
    }
  }
  /deep/ .version-list {
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-dialog__header{
      padding: 10px 20px 5px 20px;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
    .diff_footer{
      display: flex;
      justify-content: flex-end;
      .diff_version_select{
        width: 70%;
        margin-right: auto;
        display: flex;
        .el-select{
          margin-right: 30px;
        }
      }
    }
    .file-list {
      border: 1px solid #ddd;
      border-radius: 0;
      overflow: auto;
    }
    .el-table__row {
      font-size: 12px;
      color: #333;
      a {
        color: #409eff;
        height: 30px;
        padding: 0 3px;
        &:hover {
          text-decoration: underline;
        }
      }
      .cell {
        line-height: 18px;
      }
    }
    .el-table__body-wrapper.is-scrolling-none {
      &::-webkit-scrollbar {
        width: 6px;
        background-color: #e5e5e5;
      }
      &::-webkit-scrollbar-thumb {
        overflow: auto;
        border-radius: 4px;
        background-color: rgba(18, 150, 219, .8);
      }
    }
  }
</style>
