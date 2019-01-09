<template>
  <div class="img-editor">
    <el-dialog
      :visible="true"

      :close-on-click-modal="true"
      :show-close="false"
      width="100vw">
      <header class="header">
        <span class="title">Photo Editor</span>
        <img-navbar :data="data" @change="change"></img-navbar>
      </header>
      <main class="main">
        <editor ref="editor" :data="data"></editor>
      </main>
    </el-dialog>
  </div>
</template>

<script>
  import 'cropperjs/dist/cropper.css';
  import Editor from './Editor';
  import ImgNavbar from './ImgNavbar';

  export default {
    name: 'ImgEditor',
    props: ['img-config'],
    data() {
      return {
        data: {
          cropped: false,
          cropping: false,
          loaded: true,
          name: this.imgConfig.name,
          previousUrl: '',
          type: '',
          url: this.imgConfig.url
        }
      };
    },
    components: {
      Editor, ImgNavbar
    },
    methods: {
      change(action) {
        const {editor} = this.$refs;
        switch (action) {
          case 'crop':
            editor.crop();
            break;
          case 'clear':
            editor.clear();
            break;
          case 'restore':
            editor.restore();
            break;
          case 'remove':
            editor.reset();
            break;
          case 'close':
            this.$emit('action', 'close');
            break;
          default:
        }
      }
    }
  };
</script>

<style lang="scss">
  .img-editor {
    .el-dialog {
      margin-top: 0 !important;
      background: unset;
      box-shadow: unset;
    }
    .el-dialog__header {
      padding: 0;
    }
    .header {
      height: 3rem;
      overflow: hidden;
      padding-left: 1rem;
      padding-right: 1rem;
      position: relative;
      z-index: 1;
    }
    @media (min-width: 768px) {
      .header {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }
    .title {
      color: #fff;
      display: block;
      float: left;
      font-size: 1.125rem;
      line-height: 3rem;
    }
    .main {
      height: 90vh;
      bottom: 0;
      left: 0;
      position: absolute;
      right: 0;
      top: 5vh;
    }
  }
</style>
