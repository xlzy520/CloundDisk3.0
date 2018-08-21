<template>
  <div class="list-head">
    <div class="list-btn">
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="uploadFile">上传文件</el-button>
      <el-button type="primary" icon="el-icon-plus">新建文件夹</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1" type="primary" icon="el-icon-document">预览</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1" type="primary" icon="el-icon-download">下载</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1" type="primary" icon="el-icon-edit">更新</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1" type="primary" icon="el-icon-tickets">版本</el-button>
      <el-button v-if="showBtn.indexOf('1')!=-1" type="primary" icon="el-icon-edit-outline">重命名</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1 || showBtn.indexOf('1')!=-1 || showBtn.indexOf('3')!=-1" type="primary" icon="el-icon-delete" ref="del">删除</el-button>
      <el-button v-if="showBtn.indexOf('2')!=-1 || showBtn.indexOf('1')!=-1" type="primary" icon="el-icon-info">详情</el-button>
    <!--<span>{{showBtn}}</span>-->
    </div>
    <div class="action-wrap">
      <el-tooltip class="item" effect="dark" content="列表" placement="bottom">
        <div class="action-item" @click="typeShow('List')">
          <svg-icon icon-class="list" className="icon" />
        </div>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩略图" placement="bottom">
        <div class="action-item" @click="typeShow('Thumbnail')">
          <svg-icon icon-class="abbr" className="icon" />
        </div>
      </el-tooltip>
    </div>
    <breadcrumb></breadcrumb>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '../Breadcrumb/index'
export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  props: {
    isFolder: false,
    isFile: false,
    isOther: false
  },
  // computed: {
  //   showBtn() {
  //     return this.$store.state.folderNav
  //   }
  // },
  computed: {
    ...mapGetters([
      'showBtn',
      'folderNav'
    ])
  },
  methods: {
    typeShow(type) {
      this.$emit('list_type_toggle', type)
    },
    uploadFile() {
      this.$store.dispatch('ToggleUploadVisible')
    },
    refresh() {
      this.$store.dispatch('Refresh')
    }
  },
  mounted() {
    console.log(this.showBtn)
  }
}
</script>

<style lang="scss">
  .list-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fafafa;
    padding: 10px 20px 10px 20px;
    .list-btn {
      text-align: left;
      .el-button {
        padding: 6px 8px;
      }
    }
  }
  .action-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 28px;
      padding-right: 40px;
      .action-item {
        .icon {
          width: 24px;
          height: 24px;
          margin: 0 10px;
          cursor: pointer;
        }
      }
    }

</style>
