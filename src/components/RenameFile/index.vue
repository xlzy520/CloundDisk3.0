<template>
  <div class="rename-edit" @click.stop="() => {}" :class="{thumbEdit:!(type === 'List')}">
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
            const editInfo = await renameFile(row[0].fcategoryid, this.value, row[0].fparentid, row[0].ffiletype)
            if (editInfo.success) {
              this.$message1000('文件夹重命名成功', 'success')
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
      this.value = this.selectedData[0].fname
      document.querySelector('.rename-edit input').focus()
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
  .thumbEdit{
    position: absolute;
    width: 150px;
    left: -15px;
  }
</style>
