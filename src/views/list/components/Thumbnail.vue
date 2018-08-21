<template>
  <div class="list">
    <div class="hd">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="disabled">全选</el-checkbox>
    </div>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <div :class="['box', item.checked ? 'box-hover' : '']" @dblclick="nextDir(item.fcategoryid)">
          <el-checkbox v-model="item.checked" @change="handleCheckItemChange"></el-checkbox>
          <svg-icon :icon-class="item.ffiletype === 1 ? 'folder' : 'markdown'" className="icon" />
          <span>{{item.fname}}</span>
        </div>
      </li>
    </ul>
    <div class="empty-block" v-if="!fileList.length"><span class="empty-text">暂无数据</span></div>
  </div>
</template>

<script>
export default {
  name: 'Thumbnail',
  props: {
    fileList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      list: [],
      checkAll: false,
      isIndeterminate: false,
      disabled: false
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.list.forEach(item => { item.checked = val })
      this.isIndeterminate = false
      const totalLength = this.list.length
      const folderCheckedCount = this.list.filter(item => (item.ffiletype === 1 && item.checked)).length
      const fileCheckedCount = this.list.filter(item => item.ffiletype === 2 && item.checked).length
      this.$emit('change_the_function', totalLength, folderCheckedCount, fileCheckedCount)
    },
    handleCheckItemChange() {
      const totalLength = this.list.length
      const checkedCount = this.list.filter(item => item.checked).length
      this.checkAll = checkedCount === totalLength && totalLength > 0
      this.disabled = totalLength === 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < totalLength
      const folderCheckedCount = this.list.filter(item => (item.ffiletype === 1 && item.checked)).length
      const fileCheckedCount = this.list.filter(item => item.ffiletype === 2 && item.checked).length
      this.$emit('change_the_function', totalLength, folderCheckedCount, fileCheckedCount)
    },
    nextDir(fcategoryid) {
      this.$store.dispatch('GetCategory', fcategoryid).then(() => {
        this.handleCheckItemChange()
      })
    }
  },
  mounted() {
    this.$store.dispatch('GetCategory', '1002').then(() => {
      this.list = this.fileList
      this.handleCheckItemChange()
    })
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
    .empty-block {
      position: relative;
      min-height: 60px;
      text-align: center;
      width: 100%;
      height: 100%;
      .empty-text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        color: #909399;
      }
    }
  }
</style>
