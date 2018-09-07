<template>
  <div class="markdown">
    <el-dialog
      :visible.sync="preview.visible"
      :modal-append-to-body="true"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="80vw">
      <div class="previewFile">
        <el-button @click="closeMkdown" class="close-mkdown">关闭</el-button>
        <el-button @click="fileEdit" class="file-edit" v-show="isEditMk">编辑</el-button>
        <el-button @click="saveFile" class="file-edit" v-show="!isEditMk">保存</el-button>
      </div>
      <div class="viewport">
        <div class="list-detail">
          <div class="detail">
            <mavon-editor
              ref="md"
              v-model="docValue.file"
              :toolbars="toolbars"
              :externalLink="externalLink"
              codeStyle="monokai-sublime"
              :scrollStyle="true"
              :subfield="isField"
              :defaultOpen="isPreview"
              :toolbarsFlag="barsFlag"
              @imgAdd="imgAdd"
            />
          </div>
          <!--</div>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import '@/styles/markdown.css'
  import { updateMarkdown } from '@/api/file'
  export default {
    name: 'MDEditor',
    computed: {
      ...mapGetters([
        'docValue',
        'selectedData'
      ]),
      preview: {
        get() {
          if (this.$store.getters.preview.type === 'create') {
            this.isField = true
            this.barsFlag = true
            this.isEditMk = false
          }
          return this.$store.getters.preview
        },
        set() {
          this.$store.dispatch('TogglePreviewVisible')
        }
      }
    },
    data() {
      return {
        disabled: false,
        isField: false, // 是否双栏
        isPreview: 'preview', // 预览或编辑
        barsFlag: false, // 是否显示工具栏
        isEditMk: true,
        externalLink: {
          hljs_css: false,
          katex_css: false, // `false`表示禁用自动加载，它也可以是个函数，如果它是个函数，那么这个函数应该返回一个可访问的`katex`的css路径字符串
          // 我们没有设置`katex_js`, `hljs_js`, `hljs_lang`, `markdown_css`， `mavon-editor`会认为它的值为`true`，它会默认使用`cdnjs`相关外链加载
          katex_js: false,
          markdown_css: false,
          hljs_js: function() {
            // 这是你的hljs文件路径
            return 'https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js'
          }
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
      }
    },
    methods: {
      closeMkdown() {
        this.$store.dispatch('TogglePreviewVisible')
        this.isField = false
        this.barsFlag = false
        this.isEditMk = true
      },
      fileEdit() {
        this.isField = true
        this.barsFlag = true
        this.isEditMk = false
      },
      async saveFile() {
        const markdownData = new FormData()
        markdownData.append('fparentid', this.$store.getters.parentId)
        if (!this.docValue.name) {
          this.$prompt('请输入文件名', '文件名', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[^\\\\\\/:*?\\"<>|]+$/,
            center: true,
            inputErrorMessage: '文件名中不能包含\/:*?"<>|等特殊字符'
          }).then(({ value }) => {
            this.docValue.name = value + '.md'
            const markdownFile = new File([this.docValue.file], this.docValue.name)
            markdownData.append('file', markdownFile)
            updateMarkdown(markdownData).then((res) => {
              if (res.success) {
                this.$message1000('文档新建成功。', 'success')
                this.closeMkdown()
                this.$store.dispatch('Refresh')
              } else {
                this.docValue.name = null
                this.$message1000('文档新建失败。', 'error')
              }
            })
          }).catch(() => {
            this.$message1000('取消输入。', 'info')
          })
        } else {
          const markdownFile = new File([this.docValue.file], this.docValue.name)
          markdownData.append('file', markdownFile)
          markdownData.append('fcategoryid', this.docValue.id)
          this.$prompt('请输入更新描述', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(({ value }) => {
            if (value === null) {
              markdownData.append('fremarks', '')
              updateMarkdown(markdownData).then((res) => {
                if (res.success) {
                  this.$message1000('文档保存成功。', 'success')
                  this.closeMkdown()
                  this.$store.dispatch('Refresh')
                } else {
                  this.$message1000('文档保存失败。', 'error')
                }
              })
            }
          }).catch(() => {
            this.$message1000('取消输入。', 'info')
          })
        }
      },
      async imgAdd(pos, $file) {
        var formdata = new FormData()
        formdata.append('file', $file)
        formdata.append('fparentid', '1')
        const imgInfo = await updateMarkdown(formdata)
        this.$refs.md.$img2Url(pos, '/api_zhq/djcpsdocument/fileManager/downloadFile.do?id=' + imgInfo.data.id)
      }
    },
    async mounted() {
      if (this.selectedData.length >= 1) {
        this.value = this.docValue
      }
      if (this.preview.type === 'create') {
        console.log(1)
      }
    }
  }
</script>
<style lang="scss">
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.scss";
  /*@import "@/styles/code.scss";*/

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
  .v-note-wrapper .v-note-panel.shadow{border-radius: 5px}
  .previewFile{
    margin:-100px 30px;
    /*position: relative;*/
    .el-button{
      float: right;
      margin-right: 10px;
    }
    .close-mkdown{
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
