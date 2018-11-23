<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    @close="close"
    width="420px"
    custom-class="move-file">
    <div class="dialog-content">
      <base-scrollbar>
        <tree-menu v-if="dialogVisible" type="moveFile" @get-folderid="id = $event"></tree-menu>
      </base-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="this.type === 'move'" type="primary" @click="moveFile">确 定</el-button>
      <el-button v-else type="primary" @click="copyFile">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import treeMenu from '@/components/treeMenu';
  import fileService from '@/api/service/file.js';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  export default {
    name: 'MoveFile',
    components: {
      treeMenu,
      baseScrollbar
    },
    data() {
      return {
        dialogVisible: false,
        id: '',
        idList: [],
        type: 'move'
      };
    },
    computed: {
      title() {
        return this.type === 'move' ? '移动到' : '复制到';
      }
    },
    methods: {
      close() {
        this.restValues();
      },
      restValues() {
        this.dialogVisible = false;
        this.id = '';
        this.idList = [];
      },
      openFrame(rows, type = 'move') {
        this.idList = rows.map(item => item.fcategoryid);
        this.type = type;
        this.dialogVisible = true;
      },
      moveFile() {
        fileService.moveFile(this.idList, this.id, this.$route.query.dirid).then(() => {
          this.$message1000('文件移动成功', 'success');
          this.$emit('success');
          this.close();
          // this.$store.dispatch('Refresh');
        }).catch(() => {
          this.close();
        });
      },
      copyFile() {
        fileService.copyFile(this.idList, this.id).then(() => {
          this.$message1000('文件复制成功', 'success');
          this.$emit('success');
          this.close();
          // this.$store.dispatch('Refresh');
        }).catch(() => {
          this.close();
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
/deep/ .move-file{
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
  .dialog-content {
    position: relative;
    display: flex;
    height: 100%;
  }
}
</style>
