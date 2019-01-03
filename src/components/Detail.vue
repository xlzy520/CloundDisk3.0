<template>
  <div class="el-dialog__detail">
    <el-dialog
      :title="topTitle"
      v-if="visible"
      :visible="true"
      :modal-append-to-body="false"
      custom-class="file-detail"
      :close-on-click-modal="true"
      @close="close"
      width="380px">
      <div class="detail-content">
        <div class="detail-item">
          <div class="label">
            {{title}}名称：
          </div>
          <div class="content">
            {{selectedData[0].fname}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            当前版本：
          </div>
          <div class="content">
            {{versionDetail.fversion}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            版本描述：
          </div>
          <div class="content">
            {{versionDetail.fremarks}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item">
          <div class="label">
            创建人：
          </div>
          <div class="content">
            {{selectedData[0].foperator}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item">
          <div class="label">
            创建时间：
          </div>
          <div class="content">
            {{timeCreate}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            最后修改人：
          </div>
          <div class="content">
            {{versionDetail.fupdater}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            修改时间：
          </div>
          <div class="content">
            {{timeEdit}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            文件大小：
          </div>
          <div class="content">
            {{size}}
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { formatSize, parseTime } from '@/utils/index';
  import fileService from '@/api/service/file.js';

  export default {
    name: 'Detail',
    data() {
      return {
        visible: false,
        isLoad: true,
        versionDetail: {}
      };
    },
    computed: {
      ...mapGetters([
        'selectedData'
      ]),
      isFolder() {
        if (this.selectedData.length === 1) {
          return this.selectedData[0].ffiletype === 1;
        }
      },
      title() {
        if (this.selectedData.length === 1) {
          return this.isFolder ? '文件夹' : '文件';
        }
      },
      topTitle() {
        return this.title + '详情';
      },
      size() {
        return formatSize(Number(this.selectedData[0].fsize.replace('B', '')));
      },
      timeEdit() {
        return parseTime(this.selectedData[0].fupdatetime);
      },
      timeCreate() {
        return parseTime(this.selectedData[0].fcreatetime);
      }
    },
    methods: {
      close() {
        this.visible = false;
      },
      async requestData() {
        if (this.selectedData.length === 1 && this.selectedData[0].ffiletype !== 1) {
          const versionListInfo = await fileService.getVersionList(this.selectedData[0].fversionsign, this.$route.query.dirid || 0);
          if (versionListInfo.success) {
            versionListInfo.data.filter((item) => {
              if (item.fdisplay) {
                this.versionDetail = item;
              }
            });
          }
        }
      }
    }
  };
</script>
<style lang="scss">
  .file-detail,.upload-file{
    .el-dialog__body {
      padding: 10px 20px;
    }
    .el-dialog__header {
      padding: 10px 20px 5px 20px;
    }
  }
</style>
<style lang="scss" scoped>
  /deep/ .file-detail {
    .el-dialog__headerbtn {
      top: 14px;
    }
    .detail-content{
      .detail-item {
        border-bottom: 1px solid #ddd;
        padding-bottom: 8px;
        margin-bottom: 8px;
      }
      .label {
        float: left;
        width: 100px;
        line-height: 22px;
        color: #888;
      }
      .content {
        float: right;
        margin-left: 0;
        text-align: left;
        width: 240px;
        line-height: 22px;

        color: #333;
        font-size: 14px;
        word-break: break-all;
        overflow: hidden;
      }
    }
  }
</style>
