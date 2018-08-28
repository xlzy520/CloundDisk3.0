<template>
  <div class="list">
    <div class="hd">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="disabled">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedData" @change="handleCheckItemChange">
      <el-scrollbar tag="ul" style="height: 80vh">
      <ul>
        <li v-for="(item, index) in fileList" :key="index">
          <div class="box" :class="selectedData.indexOf(item) > -1 ? 'box-hover' : ''" @dblclick="fileType(item.ffiletype,item.fcategoryid)">
            <div @dblclick.stop="() => {}"><el-checkbox :label="item"></el-checkbox></div>
            <svg-icon :icon-class="item.ffiletype" className="icon" />
            <div v-show="item.isEditor">
              <rename-file v-if="selectedData.length >= 1" type="Thumbnail"></rename-file>
            </div>
            <div class="fileName">
              <span v-show="!item.isEditor">{{item.fname}}</span>
            </div>
          </div>
        </li>
      </ul>
      </el-scrollbar>
    </el-checkbox-group>
    <div class="empty-block" v-if="!fileList.length"><span class="empty-text">暂无数据</span></div>
  </div>
</template>

<script>
  import RenameFile from '@/components/RenameFile'
  import { mapGetters } from 'vuex'
  export default {
    props: {
      fileList: {
        type: Array,
        required: true
      }
    },
    components: { RenameFile },
    data() {
      return {
        checkAll: false,
        checkedData: [],
        isIndeterminate: false,
        disabled: false
      }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkedData = val ? this.fileList : []
        this.$store.dispatch('GetSelectedData', this.checkedData)
        this.isIndeterminate = false
      },
      handleCheckItemChange(value) {
        this.$store.dispatch('GetSelectedData', value)
        const checkedCount = value.length
        this.checkAll = checkedCount === this.fileList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileList.length
      },
      fileType(type, fcategoryid) {
        switch (type) {
          case 1:
            this.$store.dispatch('GetCategory', fcategoryid).then(() => {
              this.handleCheckItemChange()
            })
            this.$store.dispatch('SetParentId', fcategoryid)
            break
          case 2:
            this.$store.dispatch('TogglePreviewVisible')
            // this.$store.dispatch('GetDocInfo')
            break
        }
      }
    },
    computed: mapGetters([
      'selectedData'
    ]),
    mounted() {
      this.checkedData = this.selectedData
      const totalLength = this.fileList.length
      const checkedDataLength = this.checkedData.length
      if (totalLength === 0) {
        this.disabled = true
      } else if (checkedDataLength > 0 && checkedDataLength < totalLength) {
        this.isIndeterminate = true
      } else if (totalLength === checkedDataLength) {
        this.checkAll = true
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
    overflow: hidden;
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
          width: 115px;
          height: 140px;
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
          .fileName {
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
    .el-scrollbar__wrap {
      overflow-x: hidden;
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
