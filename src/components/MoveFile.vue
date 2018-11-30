<template>
  <el-dialog
    :title="type === 'move' ? '移动到' : '复制到'"
    :visible.async="true"
    v-if="visible"
    @close="close"
    width="420px"
    custom-class="move-file"
  >
    <el-scrollbar style="height: 100%">
      <tree-menu type="copyMove" @getFolderId="getFolderId" ></tree-menu>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="moveFile">确 定</el-button>
    <el-button @click="close">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex';
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
    methods: {
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
            this.$emit('refresh');
          }).finally(() => {
            this.close();
          });
        } else {
          fileService.copyFile(this.idList, this.id).then(() => {
            this.$message1000('文件复制成功', 'success');
            this.$emit('refresh');
          }).finally(() => {
            this.close();
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  .move-file{
    height: 290px;
    padding: 0 12px;
    .el-button {
      padding: 8px 12px;
    }
    .el-dialog__body{
      border: 1px solid #ddd;
      height: 185px;
    }
    .el-dialog__header {
      padding: 15px 20px 10px;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

</style>
