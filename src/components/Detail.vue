<template>
  <div class="detail">
    <base-dialog ref="dialog" :title="topTitle" @close="close">
      <div class="detail-content">
        <div class="detail-content-item">
          <div class="label">{{title}}名称：</div>
          <div class="content">{{selectedData.fname}}</div>
        </div>
        <div class="detail-content-item" v-if="!isFolder">
          <div class="label">当前版本：</div>
          <div class="content">{{versionDetail.fversion}}</div>
        </div>
        <div class="detail-content-item" v-if="!isFolder">
          <div class="label">版本描述：</div>
          <div class="content">{{versionDetail.fremarks}}</div>
        </div>
        <div class="detail-content-item">
          <div class="label">创建人：</div>
          <div class="content">{{selectedData.foperator}}</div>
        </div>
        <div class="detail-content-item">
          <div class="label">创建时间：</div>
          <div class="content">{{timeCreate}}</div>
        </div>
        <div class="detail-content-item" v-if="!isFolder">
          <div class="label">最后修改人：</div>
          <div class="content">{{versionDetail.fupdater}}</div>
        </div>
        <div class="detail-content-item" v-if="!isFolder">
          <div class="label">修改时间：</div>
          <div class="content">{{timeEdit}}</div>
        </div>
        <div class="detail-content-item" v-if="!isFolder">
          <div class="label">文件大小：</div>
          <div class="content">{{size}}</div>
        </div>
      </div>
      <div slot="footer" class="detail-footer">
        <el-button @click="close" size="small" type="primary">关 闭</el-button>
      </div>
    </base-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { formatSize, parseTime } from '@/utils/index';
  import fileService from '@/api/service/file.js';
  import baseDialog from '@/components/baseDialog.vue';

  export default {
    name: 'Detail',
    components: {
      baseDialog
    },
    data() {
      return {
        dialogVisible: false,
        isLoad: true,
        versionDetail: {
          fupdater: ''
        },
        selectedData: {
          fname: '',
          fversion: '',
          fremarks: '',
          foperator: '',
          fcreatetime: '',
          fupdatetime: '',
          fsize: ''
        }
      };
    },
    computed: {
      ...mapGetters([
        // 'selectedData'
      ]),
      isFolder() {
        return this.selectedData && this.selectedData.ffiletype === 1;
      },
      title() {
        return this.selectedData && this.isFolder ? '文件夹' : '文件';
      },
      topTitle() {
        return this.title + '详情';
      },
      size() {
        if (this.selectedData) {
          return formatSize(Number(this.selectedData.fsize.replace('B', '')));
        }
      },
      timeEdit() {
        if (this.selectedData) {
          return parseTime(this.selectedData.fupdatetime);
        }
      },
      timeCreate() {
        if (this.selectedData) {
          return parseTime(this.selectedData.fcreatetime);
        }
      }
    },
    methods: {
      close() {
        this.$refs.dialog.dialogVisible = false;
      },
      openFrame(row) {
        this.$refs.dialog.dialogVisible = true;
        this.selectedData = row;
        this.requestData();
      },
      async requestData() {
        if (this.selectedData && this.selectedData.ffiletype !== 1) {
          const versionListInfo = await fileService.getVersionList(this.selectedData.fversionsign, this.$store.getters.parentId);
          if (versionListInfo.success) {
            versionListInfo.data.filter((item) => {
              if (!item.fdisplay) {
                this.versionDetail = item;
              }
            });
          }
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
.detail {
  &-content {
    width: 340px;
    margin: 0 10px;
    &-item {
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-bottom: 8px;
      & > div {
        display: inline-block;
      }
      .label {
        width: 100px;
        color: #888;
      }
      .content {
        width: 210px;
      }
    }
  }
  &-footer {
    text-align: right;
    padding: 20px;
  }
}
</style>
