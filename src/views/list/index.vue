<template>
  <div>
    <div class="hd">
      <div class="topbt">
        <el-button type="primary" size="mini" icon="el-icon-refresh">刷新</el-button>
        <el-button type="primary" size="mini" icon="el-icon-upload">上传文件</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus">新建文件夹</el-button>
        <el-button type="primary" size="mini" icon="el-icon-document">预览</el-button>
        <el-button type="primary" size="mini" icon="el-icon-download">下载</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit">更新</el-button>
        <el-button type="primary" size="mini" icon="el-icon-tickets">版本</el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit-outline">重命名</el-button>
        <el-button type="primary" size="mini" icon="el-icon-delete">删除</el-button>
        <!--<el-button type="primary" size="mini">外部链接</el-button>-->
        <el-button type="primary" size="mini" icon="el-icon-info">详情</el-button>
      </div>
      <div class="action-wrap">
        <el-tooltip class="item" effect="dark" content="列表" placement="bottom">
          <div class="action-item" @click="showList">
            <svg-icon icon-class="list" className="icon" />
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩略图" placement="bottom">
          <div class="action-item" @click="showThumbnail">
            <svg-icon icon-class="abbr" className="icon" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <component :is="component" :list="list"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
export default {
  name: 'list',
  data() {
    return {
      component: 'Thumbnail'
    }
  },
  components: {
    Thumbnail,
    List
  },
  computed: {
    ...mapGetters([
      'list'
    ])
  },
  methods: {
    showList() {
      this.component = 'List'
    },
    showThumbnail() {
      this.component = 'Thumbnail'
    }
  },
  mounted() {
    this.$store.dispatch('GetCategory', '1002')
  }
}
</script>

<style scoped lang="scss">
.hd {
  display: flex;
  justify-content: space-between;
  width: 92%;
  margin: 10px auto 0;
  .topbt {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 48px;
  }
  .action-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    .action-item {
      .icon {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
