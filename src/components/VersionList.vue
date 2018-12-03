<template>
  <div>
    <el-dialog
      v-if="visible"
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
          class="code-diff"
          :output-format="outputFormat"
          v-if="versionDiff"></vue-code-diff>
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
      <div slot="footer" class="dialog-footer">
        <div class="diff-select clearfix" v-if="[2,9].includes(selectedData[0].ffiletype)&&tableData.length>1">
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
  import vueCodeDiff from 'vue-code-diff';
  import baseTable from '@/components/baseTable.vue';
  import fileType from '@/mixins/fileType';

  export default {
    name: 'VersionList',
    mixins: [fileType],
    components: {
      vueCodeDiff, baseTable
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
            formatter: (row, col) => parseTime(row[col.prop])
          },
          {
            label: '文件大小', prop: 'filesize', width: 80,
            formatter: (row, col) => {
              if (row.filesize !== null) {
                return formatSize(Number(row[col.prop].replace('B', '')));
              }
              return '';
            }
          },
          {label: '版本描述', prop: 'fremarks'},
          {
            label: '操作', width: 120,
            render: (h, {props: {row}}) => {
              return (
                <div className="version-operate">
                  <a onClick={(event)=>this.downloadVersion(row.filesgin, row.filename, event)}>下载</a>
                  {row.fdisplay ? (null) : (
                    <a href="javascript:void(0)" onClick={this.rollBack.bind(this, row.filesgin)} title="设为最新版本">回退</a>
                  )}
                  {this.selectedData[0].ffiletype !== 0 ? (<a onClick={this.fileType.bind(this, row)}>查看</a>) : null}
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
        if (this.modify) this.$emit('refresh'); //点过回退按钮才刷新。
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
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .version-list {
    .code-diff{
      min-height: 70vh;
    }
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-dialog__header {
      padding: 10px 20px 5px 20px;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
    .tooltip {
      color: #a00;
      font-size: 12px;
      padding-right: 10px;
    }
    .file-list {
      border: 1px solid #ddd;
      border-radius: 0;
      overflow-y: auto;
      overflow-x: auto;
      .item {
        line-height: 28px;
        padding: 0 6px 0 6px;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 330px;
        overflow: hidden;
      }
    }
    .el-table__row {
      font-size: 12px;
      color: #333;
      a {
        color: #409eff;
        height: 30px;
        padding: 0 3px;
        text-decoration: none;
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
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: 4px;
        background-color: rgba(18, 150, 219, .8);
      }
    }
    .diff-select {
      float: left;
    }
    .diffMaster {
      margin-top: 8vh !important;
    }
    .lineSwitch {
      position: absolute;
      top: 22px;
      left: 40%;
    }
    .rangeDiff {
      position: absolute;
      top: 11px;
      left: 60%;
    }
  }
</style>
