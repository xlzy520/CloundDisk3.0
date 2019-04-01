<template>
  <div
    class="rename-edit"
    @click.stop.prevent
    @dblclick.stop.prevent
    @contextmenu.stop.prevent
    :class="{thumbEdit:type !== 'List'}">
    <el-input size="small"
              spellcheck="false"
              v-model="fileName"
              maxlength="50"
              @keyup.native="correctVal"
              placeholder="请输入内容"
              :style="{width:(type==='List'?'350px':'120px')}"
              @focus="selection($event)">
    </el-input>
    <span v-show="!correct && type === 'List'" class="fileNameTips">文件名中不能为空或包含/:*?"<>|等特殊字符</span>
    <el-button type="primary" icon="el-icon-check" @click="confirmEdit()"></el-button>
    <el-button type="primary" icon="el-icon-close" @click="cancelEdit()"></el-button>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';

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
        'selectedData'
      ])
    },

    data() {
      return {
        fileName: '',
        correct: false,
      };
    },
    methods: {
      correctVal() {
        this.correct = this.fileName.length === 0 ? false : (/^[^\\\\\\/:*?\s\\"<>|]+$/).test(this.fileName);
      },
      confirmEdit() {
        if (!(/^[^\\\\\\/:*?\s\\"<>|]+$/).test(this.fileName)) { //判断输入是否合法
          this.$message1000('文件名中不能包含空格/:*?"<>|等特殊字符', 'error');
          return false;
        }
        this.$emit('confirm-edit', this.fileName);
      },
      cancelEdit() {
        this.$emit('cancel-edit');
      },
      selection(event) {
        let dotIndex = this.fileName.lastIndexOf('.');
        if (this.selectedData[0]) {
          if (this.selectedData[0].ffiletype === 1) {
            dotIndex = this.selectedData[0].fname.length;
          }
          setTimeout(() => {
            event.target.selectionStart = 0;
            event.target.selectionEnd = dotIndex;
          }, 80);
        }
      }
    },
    mounted() {
      if (this.selectedData[0]) {
        this.fileName = this.selectedData[0].fname;
        this.correctVal();
      }
      document.querySelector('.rename-edit input').focus();
    }
  };
</script>

<style lang="scss">
  .rename-edit {
    .el-button {
      margin-top: 2px;
      padding: 4px 4px;
    }
    .el-button--primary {
      background-color: rgba(18, 150, 219, .6);
    }
    .el-input {
      input {
        font-size: 16px;
        /*&::selection{*/
        /*background-color: #dffff5;*/
        /*color: #e207ef;*/
        /*}*/
      }

      margin-right: 10px;
    }
  }

  .thumbEdit {
    position: absolute;
    width: 150px;
    top: 85px;
    left: -15px;
  }

  .fileNameTips {
    position: absolute;
    bottom: -7px;
    left: 10px;
    color: red;
    width: 300px;
    font-size: 10px;
  }
</style>
