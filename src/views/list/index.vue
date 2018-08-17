<template>
  <div>
    <div class="hd">
      <div class="action-wrap">
        <el-tooltip class="item" effect="dark" content="列表" placement="bottom">
          <div class="action-item" @click="showList">
            <svg-icon icon-class="list" className="icon" />
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩略图" placement="bottom">
          <div class="action-item" @click="showThumbnail">
            <svg-icon icon-class="list2" className="icon" />
          </div>
        </el-tooltip>
      </div>
    </div>
    <component :is="component" :list="list"></component>
  </div>
</template>

<script>
import request from '@/utils/request'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
export default {
  name: 'list',
  data() {
    return {
      component: 'Thumbnail',
      list: [
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false }
      ]
    }
  },
  components: {
    Thumbnail,
    List
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
    request({
      url: '/api_py/djcpsdocument/category/getCategory.do',
      method: 'post'
    }).then((data) => {
      console.log(data)
    })
  }
}
</script>

<style scoped lang="scss">
.hd {
  .action-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    padding-right: 80px;
    .action-item {
      .icon {
        width: 32px;
        height: 32px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
