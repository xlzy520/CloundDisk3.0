<template>
  <el-dialog
    :title="type === 'move' ? '移动到' : '复制到'"
    :visible.async="true"
    v-if="visible"
    @close="close"
    width="25%"
    custom-class="move-file">
    <el-scrollbar class="height100">
      <tree-menu ref="tree" type="copyMove" @getFolderId="getFolderId"></tree-menu>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="moveFile">确 定</el-button>
    <el-button @click="close">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
  import categoryService from '@/api/service/category';
  import treeMenu from '@/components/treeMenu';
  import fileService from '@/api/service/file';
  export default {
    name: 'MoveFile',
    components: { treeMenu },
    data() {
      return {
        visible: false,
        type: 'move',
        id: '',
        idList: []
      };
    },
    computed: {
      ...mapGetters([
        'selectedData'
      ])
    },
    watch: {
      visible: function() {
        if (this.visible) {
          this.getCategory();
        }
      }
    },
    methods: {
      getCategory(id = -1) {
        return categoryService.getCategory(id).then(res => {
          // common字段 只在最外层
          if (res.common && res.common.length > 0) {
            let Arr = res.common;
            for (let i in Arr) {
              if (Arr[i].fsortorder === 1) {
                Arr[i].childrenFolder = [{}];
              }
            }
            this.$refs.tree.data = Arr;
          }
        });
      },
      close() {
        this.visible = false;
      },
      getFolderId(data) {
        this.id = data.fcategoryid;
      },
      moveFile() {
        this.selectedData.forEach(item => {
          this.idList.push(item.fcategoryid);
        });
        if (this.type === 'move') {
          fileService.moveFile(this.idList, this.id).then(() => {
            this.$message1000('文件移动成功', 'success');
            this.$emit('action', 'refresh');
          }).finally(() => {
            this.close();
          });
        } else {
          fileService.copyFile(this.idList, this.id).then(() => {
            this.$message1000('文件复制成功', 'success');
            this.$emit('action', 'refresh');
          }).finally(() => {
            this.close();
          });
        }
        this.idList = [];
      }
    }
  };
</script>

<style lang="scss">
  .height100{
    height: 100%;
  }
  .move-file{
    padding: 0 12px;
    .el-button {
      padding: 8px 12px;
    }
    .el-dialog__body{
      border: 1px solid #ddd;
      height: 200px;
    }
    .el-dialog__header {
      padding: 15px 20px 10px;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

</style>
