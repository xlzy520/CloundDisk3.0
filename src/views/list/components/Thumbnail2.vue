<template>
  <div class="list">
    <div class="hd">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedData" @change="handleCheckItemChange">
      <ul>
        <li v-for="(item, index) in fileList" :key="index">
          <div class="box box-hover" @dblclick="nextDir(item.fcategoryid)">
            <div @dblclick.stop="() => {}"><el-checkbox :label="item"></el-checkbox></div>
            <svg-icon :icon-class="item.ffiletype === 1 ? 'folder' : 'markdown'" className="icon" />
            <span>{{item.fname}}</span>
          </div>
        </li>
      </ul>
    </el-checkbox-group>
    <div class="empty-block" v-if="!fileList.length && !loading"><span class="empty-text">暂无数据</span></div>
  </div>
</template>

<script>
  export default {
    props: {
      fileList: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        checkAll: false,
        checkedData: [],
        isIndeterminate: true
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkedData = val ? this.fileList : []
        this.isIndeterminate = false
      },
      handleCheckItemChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.fileList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileList.length
      }
    }
  }
</script>

<style scoped lang="scss">
  .list {
    width: 92%;
    margin: 20px auto;
    justify-content: center;
    min-height: 200px;
    .hd {
      .el-dropdown {
        margin-left: 20px;
        .el-icon-sort-down {
          padding: 0 6px;
        }
      }
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
            font-size: 14px;
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
        transform: translate(-50%, -50%);
        color: #909399;
      }
    }
  }
</style>

<style scoped>
  .box >>> .el-checkbox .el-checkbox__label {
    display: none;
  }
</style>
