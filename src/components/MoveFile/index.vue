<template>
  <el-dialog
    :title="title"
    :visible.sync="move.visible"
    width="420px"
    custom-class="move-file"
  >
    <el-scrollbar style="height: 100%">
      <tree-menu type="moveFile" @getFolderid="getFolderid"></tree-menu>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
    <el-button v-if="moveType" type="primary" @click="moveFile">确 定</el-button>
    <el-button v-if="!moveType" type="primary" @click="copyFile">确 定</el-button>
    <el-button @click="closeMove">取 消</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import treeMenu from '@/components/treeMenu/index'
  import { moveFile, copyFile } from '@/api/file'
  export default {
    name: 'MoveFile',
    components: { treeMenu },
    data() {
      return {
        id: '',
        idList: []
      }
    },
    computed: {
      moveVisible: {
        get() {
          return this.$store.state.file.move.visible
        },
        set() {
          this.$store.dispatch('ToggleMoveVisible')
          this.$store.dispatch('Refresh')
        }
      },
      ...mapGetters([
        'selectedData',
        'move'
      ]),
      title() {
        return this.move.type === 'move' ? '移动到' : '复制到'
      },
      moveType() {
        return this.move.type === 'move'
      }
    },
    methods: {
      closeMove() {
        this.$store.dispatch('ToggleMoveVisible')
      },
      getFolderid(data) {
        this.id = data
      },
      async moveFile() {
        moveFile(this.idList, this.id).then(moveInfo => {
          this.$message1000('文件移动成功', 'success')
          this.$store.dispatch('ToggleMoveVisible')
          this.$store.dispatch('Refresh')
        }).catch(() => {
          this.$store.dispatch('ToggleMoveVisible')
          // this.$store.dispatch('Refresh')
        })
      },
      async copyFile() {
        copyFile(this.idList, this.id).then(copyInfo => {
          this.$message1000('文件复制成功', 'success')
          this.$store.dispatch('ToggleMoveVisible')
          this.$store.dispatch('Refresh')
        }).catch(() => {
          this.$store.dispatch('ToggleMoveVisible')
          // this.$store.dispatch('Refresh')
        })
      }
    },
    mounted() {
      this.selectedData.forEach(item => {
        this.idList.push(item.fcategoryid)
      })
    }
  }
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
