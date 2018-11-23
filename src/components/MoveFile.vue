<template>
  <div class="move-file">
    <base-dialog ref="dialog" :title="title" @comfirm="confirm" @close="close">
      <div class="move-file-content">
        <base-scrollbar>
          <tree-menu v-if="opened" type="moveFile" @get-folderid="id = $event"></tree-menu>
        </base-scrollbar>
      </div>
      <!-- <div slot="footer" class="move-file-footer">
        <el-button type="primary" @click="type === 'move' ? moveFile($event) : copyFile($event)">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div> -->
    </base-dialog>
  </div>
  <!-- <el-dialog
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
      <el-button type="primary" @click="type === 'move' ? moveFile($event) : copyFile($event)">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog> -->
</template>

<script>
  import treeMenu from '@/components/treeMenu';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  import baseDialog from '@/components/baseDialog.vue';
  import categoryService from '@/api/service/category.js';
  export default {
    name: 'move-file',
    components: {
      treeMenu,
      baseScrollbar,
      baseDialog
    },
    data() {
      return {
        opened: false,
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
      confirm() {
        this.type === 'move' ? this.moveFile() : this.copyFile();
      },
      restValues() {
        this.opened = false;
        this.id = '';
        this.idList = [];
        this.$refs.dialog.dialogVisible = false;
      },
      openFrame(rows, type = 'move') {
        this.idList = rows.map(item => item.fcategoryid);
        this.type = type;
        this.opened = true;
        this.$refs.dialog.dialogVisible = true;
      },
      moveFile() {
        categoryService.moveFile(this.idList, this.id, this.$route.query.dirid).then(() => {
          this.$message1000('文件移动成功', 'success');
          this.$emit('success');
          this.close();
          // this.$store.dispatch('Refresh');
        }).catch(() => {
          this.close();
        });
      },
      copyFile() {
        categoryService.copyFile(this.idList, this.id).then(() => {
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
.move-file {
  &-content {
    display: flex;
    height: 185px;
    width: 400px;
    padding: 16px;
    border: 1px solid #ddd;
  }
}
// /deep/ .move-file{
//   height: 290px;
//   padding: 0 12px;
//   .el-button {
//     padding: 8px 12px;
//   }
//   .el-dialog__body{
//     border: 1px solid #ddd;
//     height: 185px;
//   }
//   .el-dialog__header {
//     padding: 15px 20px 10px;
//   }
//   .dialog-content {
//     position: relative;
//     display: flex;
//     height: 100%;
//   }
// }
</style>
