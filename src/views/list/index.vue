<template>
  <div class="admin-list">
    <list-header class="admin-list-header" @action="dispatchAction"></list-header>
    <list v-if="isList" :file-list="List"></list>
    <thumbnail v-else :file-list="List"></thumbnail>
    <upload-file ref="upload"></upload-file>
    <delete-file ref="delFile"></delete-file>
    <detail v-if="detailVisible" @closeDialog="closeDialog"></detail>
    <version-list v-if="versionVisible" @closeDialog="closeDialog"></version-list>
    <md-editor></md-editor>
    <move-file v-if="move.visible" :type="move.type" @closeDialog="closeDialog"></move-file>
    <img-editor v-if="imgEditor.visible"></img-editor>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Thumbnail from './components/Thumbnail';
  import List from './components/List';
  import ListHeader from './components/ListHeader';
  import UploadFile from '@/components/UploadFile.vue';
  import DeleteFile from '@/components/DeleteFile.vue';
  import Detail from '@/components/Detail.vue';
  import VersionList from '@/components/VersionList.vue';
  import MoveFile from '@/components/MoveFile.vue';
  import MdEditor from "../../components/MDEditor";

  import request from '@/utils/request';
  // TODO 用事件冒泡的方式处理listHeader里的按钮
  export default {
    name: 'index',
    data() {
      return {
        isList: true,
        detailVisible: false,
        versionVisible: false,
        move: {
          visible: false,
          type: 'upload'
        }
      };
    },
    computed: {
      ...mapGetters([
        'fileList',
        'searchList',
        'selectedData',
        'imgEditor'
      ]),
      List() {
        return this.$store.getters.hasSearch === false ? this.fileList : this.searchList.bookList;
      }
    },
    components: {
      MdEditor,
      ImgEditor: () => import('@/components/ImgEditor/index.vue'),
      VersionList,
      Detail,
      UploadFile,
      Thumbnail,
      List,
      ListHeader,
      DeleteFile,
      MDEditor: () => import('@/components/MDEditor.vue'),
      MoveFile
    },
    methods: {
      closeDialog(component) {
        switch (component) {
          case 'moveVisible':
            this.move.visible = false;
            break;
          case 'uploadVisible':
            this.upload.visible = false;
            break;
          default:
            this[component] = false;
            break;
        }
      },
      dispatchAction(action) {
        switch (action) {
          case 'refresh':
            this.refresh();
            break;
          case 'upload':
            this.$refs.upload.visible = true;
            break;
          case 'rename':
            this.rename();
            break;
          case 'copyTo':
            this.move = {
              visible: true,
              type: 'copy'
            };
            break;
          case 'moveTo':
            this.move = {
              visible: true,
              type: 'move'
            };
            break;
          case 'update':
            this.$refs.upload.type = 'update';
            this.$refs.upload.visible = true;
            break;
          case 'version':
            this.versionVisible = true;
            break;
          case 'delete':
            this.$refs.delFile.visible = true;
            break;
          case 'detail':
            this.detailVisible = true;
            break;
          case 'back2FileList':
            this.$store.dispatch('ToggleSearch', false);
            break;
          case 'List':
            this.isList = true;
            break;
          case 'Thumbnail':
            this.isList = false;
            break;
          default:
            break;
        }
      },
      refresh() {
        this.$store.dispatch('Refresh').then(() => {
          this.$message1000('刷新成功', 'success');
        });
      },
      rename() {
        if (this.selectedData.length === 1) {
          this.$set(this.selectedData[0], 'isEditor', true);
        }
        this.$store.dispatch('RightTogglemenuVisible', [false]);
      },
      signIn() {
        this.$store.dispatch('GetInfo');
        this.$store.dispatch('GetCategory', this.$route.query.dirid || '0');
      }
    },
    async mounted() {
      if (location.search.indexOf('from') !== -1) {
        sessionStorage.setItem('from', 'sso'); // 如果来自统一登录平台，保存标志
      }
      if (location.search.indexOf('oncetoken') !== -1) { //如果oncetoken存在，就拿去请求网盘token，然后获取个人信息
        if (this.$store.getters.name.length === 0) {
          const oncetoken = location.search.substring(location.search.indexOf("=") + 1);
          request.get(`/djcpsdocument/sso/exchangeToken.do?oncetoken=${oncetoken}`)
          .then(() => {
            this.signIn();
          });
        } else {
          this.signIn();
        }
      } else {
        this.$store.dispatch('GetCategory', this.$route.query.dirid || '0').catch(err => {
          if (err.msg === "120") {
            // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
            sessionStorage.getItem('from') ? location.href = err.data.url : this.$router.push('/login');
          }
        });
      }

      window.addEventListener('popstate', () => {
        if (this.$route.query.dirid) {
          this.$store.dispatch('GetCategory', this.$route.query.dirid || '0');
        }
      }, false);
    }
  };
</script>

<style lang="scss" scoped>
  .admin-list {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    &-header {
      flex-shrink: 0;
    }
  }
</style>
