<template>
  <div class="list">
    <div class="hd">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="disabled">全选</el-checkbox>
    </div>
    <ul>
      <li v-for="(item, index) in FileList" :key="index">
        <div :class="['box', item.checked ? 'box-hover' : '']" @dblclick="nextDir(item.fcategoryid)">
          <el-checkbox v-model="item.checked" @change="handleCheckItemChange"></el-checkbox>
          <svg-icon :icon-class="item.ffiletype === 1 ? 'folder' : 'markdown'" className="icon" />
          <span>{{item.fname}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  props: {
    FileList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      disabled: false
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.FileList.forEach(item => { item.checked = val })
      this.isIndeterminate = false
    },
    handleCheckItemChange(val) {
      const checkedCount = this.FileList.filter(item => item.checked).length
      this.checkAll = checkedCount === this.FileList.length && this.FileList.length > 0
      this.disabled = this.FileList.length === 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.FileList.length
    },
    nextDir(fcategoryid) {
      this.$store.dispatch('GetCategory', fcategoryid).then(() => {
        this.handleCheckItemChange()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .list {
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
          a{
            display: block;
          }
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
