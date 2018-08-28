<template>
  <div class="rename-edit">
    <el-input size="small"
              v-model="value"
              placeholder="请输入内容"
              :style="{width:(type=='List'?'350px':'60px')}"
              clearable
              autofocus>
    </el-input>
    <span>
        <el-button type="primary" icon="el-icon-check" @click="confirmEdit()"></el-button>
        <el-button type="primary" icon="el-icon-close" @click="cancelEdit()"></el-button>
      </span>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { renameFile } from '@/api/file'
  export default {
    name: 'RenameFile',
    props: ['type'],
    computed: {
      ...mapGetters([
        'selectedData'
      ])
    },

    data() {
      return {
        value: ''
      }
    },
    methods: {
      async confirmEdit() {
        const row = this.selectedData
        if (row.length >= 1) {
          try {
            const editInfo = await renameFile(row[0].fcategoryid, this.value, row[0].fparentid)
            if (editInfo.success) {
              this.$message({
                message: '文件夹重命名成功',
                type: 'success'
              })
              row[0].isEditor = false
              this.$set(this.selectedData[0], 'fname', this.value)
            }
          } catch (e) {
            row[0].isEditor = false
          }
        }
      },
      cancelEdit() {
        if (this.selectedData.length >= 1) {
          this.selectedData[0].isEditor = false
        }
      }
    },
    mounted() {
      this.value = this.selectedData[0].fname
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
      margin-right: 10px;
    }
  }
</style>
