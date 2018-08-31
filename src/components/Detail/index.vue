<template>
  <div class="el-dialog__detail">
    <el-dialog
      :title="topTitle"
      :visible.sync="detailVisible"
      :modal-append-to-body="false"
      custom-class="file-detail"
      :close-on-click-modal="true"
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
            {{detail.newestVersion}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="isFolder">
          <div class="label">
            文件夹描述：
          </div>
          <div class="content">
            {{selectedData[0].desc}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            版本描述：
          </div>
          <div class="content">
            {{detail.fremarks}}
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
            {{selectedData[0].fcreatetime}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            最后修改人：
          </div>
          <div class="content">
            {{selectedData[0].editorRealname}}
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="detail-item" v-if="!isFolder">
          <div class="label">
            修改时间：
          </div>
          <div class="content">
            {{selectedData[0].fupdatetime}}
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
                <el-button @click="dialogClose" size="small" type="primary">关 闭</el-button>
              </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { formatSize } from '@/utils/index'
  import { getVersionList } from '@/api/file'
  export default {
    name: 'Detail',
    data() {
      return {
        isLoad: true,
        detail: {}
      }
    },
    computed: {
      detailVisible: {
        get() {
          return this.$store.state.file.detailVisible
        },
        set() {
          this.$store.dispatch('ToggleDetailVisible')
        }
      },
      ...mapGetters([
        'selectedData'
      ]),
      isFolder() {
        if (this.selectedData.length === 1) {
          return this.selectedData[0].ffiletype === 1
        }
      },
      title() {
        if (this.selectedData.length === 1) {
          return this.isFolder ? '文件夹' : '文件'
        }
      },
      topTitle() {
        return this.title + '详情'
      },
      size() {
        return formatSize(Number(this.selectedData[0].fsize.replace('B', '')))
      }
    },
    methods: {
      dialogClose() {
        this.$store.dispatch('ToggleDetailVisible')
      },
      async requestData() {
        if (this.selectedData.length === 1) {
          const versionListInfo = await getVersionList(this.selectedData[0].fname, this.$store.getters.parentId)
          if (versionListInfo.success) {
            versionListInfo.data.filter((item) => {
              if (item.fdisplay) {
                this.detail.newestVersion = item.fversion
                this.detail.fremarks = item.fremarks
              }
            })
          }
        }
      }
    },
    mounted() {
      this.requestData()
    }
  }
</script>

<style>
  .file-detail .el-dialog__body {
    padding: 10px 20px !important;
  }
  .file-detail .el-dialog__header {
    padding: 10px 20px 5px 20px !important;
  }
  .file-detail .el-dialog__headerbtn {
    top:14px;
  }
  .file-detail .detail-content .detail-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
  .file-detail .detail-content .label {
    float: left;
    width: 100px;
    line-height: 22px;
    color: #888;
  }
  .file-detail .detail-content .content {
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
  .file-detail .detail-content .clear {
    clear: both;
  }
</style>
