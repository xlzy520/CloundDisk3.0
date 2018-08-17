<template>
  <div class="list">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div :class="['box', item.checked ? 'box-hover' : '']">
          <el-checkbox v-model="item.checked"></el-checkbox>
          <a href="#">
            <svg-icon :icon-class="item.type ? 'folder' : 'markdown'" className="icon" />
          </a>
          <span><a href="#">文件夹</a></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
  .list {
    width: 92%;
    margin: 20px auto;
    justify-content: center;
    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      text-align: center;
      li {
        width: 115px;
        height: 140px;
        margin: 0 10px;
        .box-hover {
          background: #F4F4F4;
          .el-checkbox {
            display: block!important;
          }
        }
        .box {
          position: absolute;
          &:hover {
            background: #F4F4F4;
            .el-checkbox {
              display: block;
            }
          }
          .el-checkbox {
            display: none;
            position: absolute;
            right: 6px;
            top: 6px;
          }
          span {
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
          }
          .icon {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }
</style>
