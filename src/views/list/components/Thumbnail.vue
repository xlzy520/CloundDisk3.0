<template>
  <div class="list" v-loading.fullscreen.lock="fullLoading">
    <div class="list-header">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="selectedData.length >= 1"
        @change="handleCheckAllChange"
        class="all-check"
        :disabled="disabled">全选
      </el-checkbox>
    </div>
    <div class="list-content" v-if="fileList.length">
      <base-scrollbar>
        <el-checkbox-group v-model="selectedData" @change="handleCheckItemChange">
          <ul>
            <li v-for="(item, index) in fileList" :key="index">
              <div class="box"
                  @contextmenu.prevent="()=>{return false}"
                  :class="selectedData.indexOf(item) > -1 ? 'box-hover' : ''"
                  :title="item.fname"
                  @click.stop="fileType(item);clearCheck()">
                <div @click.stop>
                  <el-checkbox :label="item"></el-checkbox>
                </div>
                <svg-icon v-if="imgIsLarge(item)" :icon-class="String(item.ffiletype)" class-name="icon"/>
                <img v-else class="icon" :src="imgSrc(item)"/>
                <div v-if="item.isEditor">
                  <rename-file type="Thumbnail" @cancel-edit="() => $emit('cancel-edit')"
                  @confirm-edit="fileName => $emit('confirm-edit', fileName)"></rename-file>
                </div>
                <div v-else class="file-name">
                  <span>{{item.fname}}</span>
                </div>
              </div>
            </li>
          </ul>
        </el-checkbox-group>
      </base-scrollbar>
    </div>
    <div class="empty-block" v-if="!fileList.length">
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
  import RenameFile from '@/components/file/RenameFile.vue';
  import baseScrollbar from '@/components/base/baseScrollbar.vue';
  import fileType from '@/mixins/fileType';
  export default {
    mixins: [ fileType ],
    props: {
      fileList: {
        type: Array,
        required: true
      }
    },
    components: {
      RenameFile,
      baseScrollbar
    },
    computed: {
      selectedData: {
        get() {
          return this.$store.getters.selectedData;
        },
        set(newValue) {
          this.$store.dispatch('SetSelectedData', newValue);
        }
      },
      disabled() {
        return this.fileList.length < 1;
      }
    },
    data() {
      return {
        isIndeterminate: false,
      };
    },
    methods: {
      clearCheck() {
        this.handleCheckAllChange();
      },
      imgIsLarge(item) {
        if (item.ffiletype === 7) {
          return parseInt(item.fsize) > (1024 * 1024 * 10);
        }
        return true;
      },
      imgSrc(item) {
        return `/djcpsdocument/fileManager/downloadFile.do?id=${item.fcategoryid}`;
      },
      handleCheckAllChange(val) {
        this.selectedData = val ? this.fileList : [];
        this.isIndeterminate = false;
      },
      handleCheckItemChange(value) {
        if (this.fileList[0].faothority === 'newFolder') {
          this.fileList.shift();
          this.$store.dispatch('SetSelectedData', []);
        } else {
          this.$store.dispatch('SetSelectedData', value);
          const checkedCount = value.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileList.length;
          this.fileList.forEach(item => {
            if (item.isEditor !== undefined) {
              this.$set(item, 'isEditor', false);
            }
          });
        }
      }
    },
    mounted() {
      const totalLength = this.fileList.length;
      const checkedDataLength = this.selectedData.length;
      if (checkedDataLength > 0 && checkedDataLength < totalLength) {
        this.isIndeterminate = true;
      }
    }
  };
</script>
<style lang="scss">
  .list {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
</style>

<style scoped lang="scss">
  .list {
    position: relative;
    margin-top: 30px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    &-header {
      .all-check {
        margin-left: 20px;
      }
    }
    &-content {
      position: relative;
      display: flex;
      flex-grow: 1;
    }
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      text-align: center;
      li {
        margin: 0px 10px 20px 10px;
        .box {
          position: relative;
          width: 115px;
          height: 120px;
          border-radius: 6px;
          cursor: pointer;
          .el-checkbox {
            display: none;
            position: absolute;
            right: 6px;
            top: 6px;
            /deep/ .el-checkbox__label {
              display: none;
            }
            /deep/ .el-checkbox__inner {
              width: 18px;
              height: 18px;
              &::after {
                height: 10px;
                left: 5px;
                width: 5px;
              }
            }
          }
          &:hover {
            background: #e3ecf76b;
            .el-checkbox {
              display: block;
            }
          }
          &.box-hover {
            background: #F4F4F4;
            .el-checkbox {
              display: block;
            }
          }
          .file-name {
            display: inline-block;
            width: 100px;
            font-size: 14px;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      color: #909399;
    }
  }
  @media screen and (max-width: 1367px){
    .list{
      margin-top: 10px;
    }
  }
</style>
