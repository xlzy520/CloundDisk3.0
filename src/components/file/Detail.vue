<template>
  <el-dialog
    :title="title+'详情'"
    v-if="visible"
    :visible="true"
    custom-class="file-detail"
    @close="close"
    width="32vw">
    <div class="detail">
      <div v-for="item in detailItems" :key="item.id" class="detail-item">
        <span class="detail-item__label">{{item.label}}</span>
        <span class="detail-item__content">{{item.content}}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close" size="small" type="primary">关 闭</el-button>
      </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import { formatSize, parseTime } from "@/utils/index";
import fileService from "@/api/service/file";

export default {
  name: "Detail",
  data() {
    return {
      visible: false,
      title: '',
      versionDetail: {},
      detailItems: []
    };
  },
  computed: {
    ...mapGetters(["selectedData"])
  },
  methods: {
    close() {
      this.visible = false;
      this.detailItems = [];
    },
    requestData() {
      if (this.selectedData.length === 1) {
        const {ffiletype, fname, foperator, fcreatetime, fupdatetime, fsize, fversionsign} = this.selectedData[0];
        this.title = '文件夹';
        this.detailItems = [
          { label: this.title + "名称：", content: fname },
          { label: "创建人：", content: foperator },
          { label: "创建时间：", content: parseTime(fcreatetime) }
        ];
        if (ffiletype !== 1) {
          this.title = '文件';
          fileService.getVersionList(fversionsign).then(res => {
            this.versionDetail = res.data.find(item => item.fdisplay);
            const { fversion, fremarks, fupdater } = this.versionDetail;
            this.detailItems = this.detailItems.concat([
              { label: "当前版本：", content: fversion },
              { label: "版本描述：", content: fremarks },
              { label: "最后修改人：", content: fupdater },
              { label: "修改时间：", content: parseTime(fupdatetime) },
              { label: "文件大小：", content: formatSize(fsize) }
            ]);
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .detail{
  padding: 0 20px;
  .detail-item {
    display: flex;
    border-bottom: 1px solid #ddd;
    line-height: 40px;
    &__label {
      width: 8vw;
      color: #3366FF;
    }
    &__content {
      display: flex;
      flex-grow: 1;
      width: 0;
      color: #333;
    }
  }
}
</style>
