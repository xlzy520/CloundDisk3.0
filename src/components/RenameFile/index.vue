<template>
    <div class="rename-edit">
      <el-input size="small"
        v-model="selectedData[0].fname"
        placeholder="请输入内容"
        autofocus>
      </el-input>
      <span>
        <el-button type="primary" icon="el-icon-check" @click="confirmEdit(selectedData[0])"></el-button>
        <el-button type="primary" icon="el-icon-close" @click="cancelEdit(selectedData[0])"></el-button>
      </span>
    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { renameFile } from '@/api/file'
  export default {
    name: 'RenameFile',
    computed: {
      ...mapGetters([
        'selectedData'
      ])
    },
    methods: {
      async confirmEdit() {
        const row = this.selectedData
        // console.log('111')
        if (row.length === 1) {
          const editInfo = await renameFile(row[0].fcategoryid, row[0].fname)
          if (editInfo.success) {
            this.$message({
              message: '文件夹重命名成功',
              type: 'success'
            })
            row[0].isEditor = false
          } else {
            this.$message.error('文件夹重命名失败')
          }
          console.log(editInfo)
        }
      },
      cancelEdit() {
        if (this.selectedData.length === 1) {
          this.selectedData[0].isEditor = false
        }
      }
    }
  }
</script>

<style lang="scss">
  .rename-edit{
    .el-button{
      padding: 0;
    }
    .el-button--primary {
      background-color: #409eff61;
    }
    .el-input{
      width: 350px;
      margin-right: 10px;
    }
  }
</style>
