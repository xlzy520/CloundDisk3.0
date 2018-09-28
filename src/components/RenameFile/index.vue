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
              :style="{width:(type==='List'?'350px':'120px')}"
              @focus="selection($event)">
    </el-input>
    <span v-show="!correct && type === 'List'" class="fileNameTips">文件名中不能为空或包含/:*?"<>|等特殊字符</span>
    <el-button type="primary" icon="el-icon-check" @click="confirmEdit()" :loading="loading"></el-button>
    <el-button type="primary" icon="el-icon-close" @click="cancelEdit()"></el-button>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { renameFile, addCategory } from '@/api/file'
  export default {
    name: 'RenameFile',
    props: {
      type: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'selectedData',
        'fileList'
      ]),
      value: {
        get() {
          return this.fileName
        },
        set(newValue) {
          if (!(/^[^\\\\\\/:*?\\"<>|]+$/).test(newValue)) {
            this.correct = false
          } else {
            this.correct = true
            this.fileName = newValue
          }
        }
      }
    },

    data() {
      return {
        fileName: '',
        correct: true,
        loading: false
      }
    },
    methods: {
      async confirmEdit() {
        this.loading = true
        const row = this.selectedData
        if (!(/^[^\\\\\\/:*?\\"<>|]+$/).test(this.fileName)) {
          this.$message1000('文件名中不能包含空格/:*?"<>|等特殊字符', 'error')
          return false
        } else if (row.length >= 1) {
          try {
            const editInfo = await renameFile(row[0].fcategoryid,
              row[0].fname,
              this.value,
              row[0].fparentid,
              row[0].ffiletype)
            if (editInfo.success) {
              this.loading = false
              this.$message1000('文件夹重命名成功', 'success')
              row[0].isEditor = false
              this.$set(this.selectedData[0], 'fname', this.value)
            }
          } catch (e) {
            this.loading = false
            row[0].isEditor = false
          }
        } else {
          try {
            const editInfo = await addCategory(this.$store.getters.parentId, this.value)
            if (editInfo.success) {
              this.loading = false
              this.$message1000('文件夹新建成功', 'success')
              this.$store.dispatch('Refresh')
            }
          } catch (e) {
            this.loading = false
            this.fileList[0].isEditor = false
            this.fileList.shift()
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
      margin-top: 2px;
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
    top: 85px;
    left: -15px;
  }
  .fileNameTips{
    position: absolute;
    bottom: -7px;
    left: 10px;
    color: red;
    width: 300px;
    font-size: 10px;
  }
</style>
