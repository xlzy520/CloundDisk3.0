<template>
  <div class="list">
    <div class="hd">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="selectedData.length >= 1"
        @change="handleCheckAllChange"
        class="allCheck"
        :disabled="disabled">全选
      </el-checkbox>
    </div>
    <el-scrollbar tag="ul" style="height: 76vh">
      <el-checkbox-group v-model="selectedData" @change="handleCheckItemChange">
        <ul>
          <li v-for="(item, index) in fileList" :key="index">
            <div class="box"
                 @contextmenu.prevent="()=>{return false}"
                 :class="selectedData.indexOf(item) > -1 ? 'box-hover' : ''"
                 :title="item.fname"
                 @click="fileType(item)">
              <div @click.stop="() => {}">
                <el-checkbox :label="item"></el-checkbox>
              </div>
              <svg-icon v-if="imgIsLarge(item)" :icon-class="String(item.ffiletype)" className="icon"/>
              <img
                v-if="!imgIsLarge(item)"
                class="icon"
                width="100"
                height="100"
                :src="imgSrc(item)"/>
              <div v-if="item.isEditor">
                <rename-file type="Thumbnail"></rename-file>
              </div>
              <div class="fileName">
                <span v-show="!item.isEditor">{{item.fname}}</span>
              </div>
            </div>
          </li>
        </ul>
      </el-checkbox-group>
    </el-scrollbar>
    <div class="empty-block" v-if="!fileList.length">
      <span class="empty-text">暂无数据</span>
    </div>
  </div>
</template>

<script>
  import RenameFile from '@/components/RenameFile.vue';
  import fileType from '@/mixins/fileType';
  export default {
    mixins: [ fileType ],
    props: {
      fileList: {
        type: Array,
        required: true
      }
    },
    components: { RenameFile },
    data() {
      return {
        isIndeterminate: false,
        disabled: false
      };
    },
    methods: {
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
        this.$store.dispatch('SetSelectedData', this.selectedData);
        this.isIndeterminate = false;
      },
      handleCheckItemChange(value) {
        if (this.fileList[0].faothority === 'newFolder') {
          this.fileList.shift();
          this.selectedData = [];
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
    computed: {
      selectedData: {
        get() {
          return this.$store.getters.selectedData;
        },
        set(newValue) {
          this.$store.dispatch('SetSelectedData', newValue);
        }
      }
    },
    mounted() {
      const totalLength = this.fileList.length;
      const checkedDataLength = this.selectedData.length;
      if (totalLength === 0) {
        this.disabled = true;
      } else if (checkedDataLength > 0 && checkedDataLength < totalLength) {
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
    margin: auto;
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
      .allCheck {
        margin-left: 1.5vw;
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
            display: block !important;
          }
        }
        .box {
          width: 115px;
          height: 120px;
          border-radius: 6px;
          cursor: pointer;
          position: absolute;
          user-select: none;
          &:hover {
            background: #e3ecf76b;
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
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            span {
              display: inline-block;
              width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .icon {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    .empty-block {
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

  .box >>> .el-checkbox__inner {
    width: 18px !important;
    height: 18px !important;
  }

  .box >>> .el-checkbox__inner::after {
    height: 10px;
    left: 5px;
    width: 5px
  }
</style>
