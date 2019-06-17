<template>
  <div class="markdown">
    <el-dialog
      :visible="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-loading.fullscreen.lock="fullscreenLoading"
      width="80vw">
      <div class="previewFile">
        <el-button @click="closeMDEditor" class="close-md-editor">关闭</el-button>
        <el-button @click="isEditMk?fileEdit(true):saveFile()" class="file-edit">{{isEditMk?'编辑':'保存'}}</el-button>
      </div>
      <div class="viewport">
        <div class="list-detail">
          <div class="detail">
            <mavon-editor
              ref="md"
              v-model="content"
              :toolbars="toolbars"
              :external-link="externalLink"
              :scroll-style="true"
              :subfield="isField"
              default-open="preview"
              :toolbars-flag="barsFlag"
              @imgAdd="imgAdd"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import '@/styles/markdown.css';
  import fileService from '@/api/service/file';
  export default {
    name: 'md-editor',
    props: {
      'docInfo': {
        type: Object
      }
    },
    computed: {
      ...mapGetters([
        'selectedData'
      ])
    },
    data() {
      return {
        content: '',
        disabled: false,
        fullscreenLoading: false,
        isField: true, // 是否双栏
        barsFlag: true, // 是否显示工具栏
        isEditMk: false,
        externalLink: {
          hljs_css: false,
          katex_css: false, // `false`表示禁用自动加载，它也可以是个函数，如果它是个函数，那么这个函数应该返回一个可访问的`katex`的css路径字符串
          // 我们没有设置`katex_js`, `hljs_js`, `hljs_lang`, `markdown_css`， `mavon-editor`会认为它的值为`true`，它会默认使用`cdnjs`相关外链加载
          katex_js: false,
          markdown_css: false,
          hljs_js: false
        },
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: false, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      };
    },
    methods: {
      closeMDEditor() {
        this.$emit('action', 'close');
        this.fileEdit(false);
      },
      fileEdit(isFileEdit) {
        this.isField = isFileEdit;
        this.barsFlag = isFileEdit;
        this.isEditMk = !isFileEdit;
      },
      saveFile() {
        const {id, fversionsign, name} = this.docInfo;
        const markdownData = new FormData();
        markdownData.append('fparentid', this.$route.query.dirid || 0);
        if (!this.docInfo.name) {
          this.$prompt('请输入文件名', '文件名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[^\\\\\\/:*?\s\\"<>|]+$/,
            inputValidator: function(val) {
              if (val.length > 49) return '文件名不能超过50字符！';
            },
            center: true,
            inputErrorMessage: '文件名中不能为空或包含/:*?"<>|等特殊字符',
          }).then(({ value }) => {
            this.fullscreenLoading = true;
            const markdownFile = new File([this.content], value + '.md');
            markdownData.append('file', markdownFile);
            fileService.updateMarkdown(markdownData).then(() => {
              this.$message1000('文档新建成功。', 'success');
              this.closeMDEditor();
              this.$emit('action', 'textEdit');
            }).finally(()=>{
              this.fullscreenLoading = false;
            });
          }).catch(() => {});
        } else {
          const markdownFile = new File([this.content], name);
          markdownData.append('file', markdownFile);
          markdownData.append('fcategoryid', id);
          markdownData.append('fversionsign', fversionsign);
          this.$prompt('请输入更新描述', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            inputValidator: function(val) {
              if (val === '') return false;
              if (val.length > 49) return '更新描述不能超过500字符！';
            },
            inputErrorMessage: '更新描述不能为空'
          }).then(({ value }) => {
            this.fullscreenLoading = true;
            value = value === null ? '' : value;
            markdownData.append('fremarks', value);
            fileService.updateMarkdown(markdownData).then(() => {
              this.$message1000('文档更新成功。', 'success');
              this.closeMDEditor();
              this.$emit('action', 'textEdit');
            }).catch(() => {
              this.$message1000('文档更新失败。', 'error');
            }).finally(()=>{
              this.fullscreenLoading = false;
            });
          }).catch(() => {});
        }
      },
      async imgAdd(pos, $file) {
        const formData = new FormData();
        formData.append('file', $file);
        formData.append('fparentid', '1');
        console.log(2);
        const imgInfo = await fileService.updateMarkdown(formData);
        console.log(imgInfo, 'imgInfo ===========>');
        this.$refs.md.$img2Url(pos, '/djcpsdocument/fileManager/downloadFile.do?id=' + imgInfo.data.id);
      }
    },
    mounted() {
      if (this.docInfo.type) {
        this.content = this.docInfo.content;
        this.fileEdit(false);
      } else {
        this.content = '';
      }
    }
  };
</script>
<style lang="scss">
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.scss";

  .markdown .el-dialog{
    margin-top: 8vh!important;
  }
  .viewport {
    @include absolute;
    min-width: 520px;
    z-index: 2;
    .list-detail {
      @include absolute;
      .list {
        position: relative;
        width: 342px;
        height: 100%;
        border-right: 1px solid #e0e1e5;
        background-color: #eee;
      }
      .detail {
        @include absolute;
        background-color: #eee;
        .markdown-body.v-note-wrapper {
          height: 90vh;
        }
      }
    }
  }
  .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-thumb {
    background-color: $scrollbarBlue !important;
  }
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-thumb,
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-thumb {
    background-color: $scrollbarGreen !important;
  }
  .v-note-wrapper .v-note-panel.shadow {
    border-radius: 5px
  }
  .previewFile {
    margin: -100px 30px;
    .el-button {
      float: right;
      margin-right: 10px;
    }
  }
  .v-note-wrapper .v-note-panel.shadow{
    border-radius: 5px
  }
  .previewFile{
    margin:-100px 30px;
    /*position: relative;*/
    .el-button{
      float: right;
      margin-right: 10px;
    }
    .close-md-editor{
      position: fixed;
      top: 150px;
      right: 56px;
    }
    .file-edit{
      position: fixed;
      top: 100px;
      right: 56px;
    }
  }
</style>
