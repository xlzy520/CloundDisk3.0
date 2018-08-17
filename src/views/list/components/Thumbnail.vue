<template>
  <div class="list">
    <div class="hd">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div :class="['box', item.checked ? 'box-hover' : '']">
          <el-checkbox v-model="item.checked" @change="handleCheckItemChange"></el-checkbox>
          <a href="#">
            <svg-icon :icon-class="item.type ? 'folder' : 'file-markdown-fill'" className="icon" />
          </a>
          <h3><a href="#">文件夹</a></h3>
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
    return {
      checkAll: false,
      isIndeterminate: false
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.list.forEach(item => { item.checked = val })
      this.isIndeterminate = false
    },
    handleCheckItemChange(val) {
      const checkedCount = this.list.filter(item => item.checked).length
      this.checkAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
    }
  }
}
</script>

<style scoped lang="scss">
  .list {
    width: 92%;
    margin: 20px auto;
    justify-content: center;
    .hd {
      line-height: 48px;
    }
    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      text-align: center;
      li {
        width: 115px;
        height: 150px;
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
          h3 {
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
