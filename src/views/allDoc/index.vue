<template>
  <div class="viewport">
    <div class="list-detail">
      <div class="list"></div>
      <div class="detail-container">
        <div class="detail">
          <detail-header></detail-header>
          <mavon-editor
            v-show="false"
            v-model="value"
            :toolbars="toolbars"
            :externalLink="externalLink"
            codeStyle="monokai-sublime"
            :scrollStyle="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/styles/markdown.css'
  import { getDocInfo } from '@/api/documentation'
  import DetailHeader from '@/components/DetailHeader'
  export default {
    name: 'AllDoc',
    components: { DetailHeader },
    data() {
      return {
        value: '',
        externalLink: {
          hljs_css: function(css) {
            // 这是你的代码高亮配色文件路径
            return 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/' + css + '.min.css'
          },
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
          save: true, // 保存（触发events中的save事件）
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
    async mounted() {
      const docInfo = await getDocInfo('20180815_RD_MARKDOWN_NFwyw')
      this.value = docInfo.data.file
    }
  }
</script>
<style lang="scss">
  @import "@/styles/mixin.scss";
  @import "@/styles/variables.scss";
  .viewport{
   @include absolute;
    min-width: 520px;
    z-index: 2;
    .list-detail{
      @include absolute;
      .list{
        position: relative;
        width: 342px;
        height: 100%;
        border-right: 1px solid #e0e1e5;
        background-color: #eee;
      }
      .detail-container{
        @include absolute;
        left: 281px;
        .detail{
          @include absolute;
          background-color: #eee;
          .v-note-wrapper.markdown-body{
            height: 83vh;
          }
        }
      }
    }
  }
  .v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-thumb{
    background-color: $scrollbarBlue!important;
  }
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-thumb,
  .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-thumb{
    background-color: $scrollbarGreen!important;
  }
</style>
