<template>
  <div
    class="rename-edit"
    @click.stop="() => {}"
    @dblclick.stop="()=>{}"
    @contextmenu.stop="()=>{}"
    :class="{thumbEdit:!(type === 'List')}">
    <el-input size="small"
              spellcheck="false"
              v-model.trim="value"
              placeholder="请输入内容"
              :style="{width:(type==='List'?'350px':'90px')}"
              @focus="selection($event)">
    </el-input>
    <el-button type="primary" icon="el-icon-check" @click="confirmEdit()"></el-button>
    <el-button type="primary" icon="el-icon-close" @click="cancelEdit()"></el-button>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { renameFile, addCategory } from '@/api/file'
  export default {
    name: 'RenameFile',
    props: ['type'],
    computed: {
      ...mapGetters([
        'selectedData',
        'fileList'
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
            const editInfo = await renameFile(row[0].fcategoryid, this.value, row[0].fparentid, row[0].ffiletype)
            if (editInfo.success) {
              this.$message1000('文件夹重命名成功', 'success')
              row[0].isEditor = false
              this.$set(this.selectedData[0], 'fname', this.value)
            }
          } catch (e) {
            row[0].isEditor = false
          }
        } else {
          try {
            const editInfo = await addCategory(this.$store.getters.parentId, this.value)
            if (editInfo.success) {
              this.$message1000('文件夹新建成功', 'success')
              this.$store.dispatch('Refresh')
            }
          } catch (e) {
            this.fileList[0].isEditor = false
          }
        }
      },
      cancelEdit() {
        if (this.selectedData.length >= 1) {
          this.selectedData[0].isEditor = false
        } else {
          this.fileList.shift()
          this.$set(this.fileList[0], 'isEditor', false)
        }
      },
      selection(event) {
        const dotIndex = this.value.lastIndexOf('.')
        setTimeout(function() {
          event.target.selectionStart = 0
          event.target.selectionEnd = dotIndex
        }, 80)
      }
    },
    mounted() {
      if (this.selectedData[0]) {
        this.value = this.selectedData[0].fname
      }
      document.querySelector('.rename-edit input').focus()
    }
  }
</script>

<style lang="scss">
  .rename-edit{
    .el-button{
      padding: 4px 4px;
    }
    .el-button--primary {
      background-color: rgba(18,150,219,.6);
    }
    .el-input{
      input{
        font-size: 16px;
        /*&::selection{*/
          /*background-color: #dffff5;*/
          /*color: #e207ef;*/
        /*}*/
      }

      margin-right: 10px;
    }
  }
  .thumbEdit{
    position: absolute;
    width: 150px;
    left: -15px;
  }
</style>
