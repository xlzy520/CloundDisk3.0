<template>
  <div class="admin-list">
    <list-header class="admin-list-header" @action="dispatchAction"></list-header>
    <List v-if="component" :fileList="List"></List>
    <thumbnail v-else :fileList="List"></thumbnail>
    <upload-file :visible="upload.visible" :type="upload.type" @closeDialog="closeDialog"></upload-file>
    <delete-file :visible="deleteVisible" @closeDialog="closeDialog"></delete-file>
    <detail v-if="detailVisible" @closeDialog="closeDialog"></detail>
    <version-list v-if="versionVisible" @closeDialog="closeDialog"></version-list>
    <m-d-editor></m-d-editor>
    <move-file v-if="move.visible" :type="move.type" @closeDialog="closeDialog"></move-file>
    <img-editor v-if="imgEditor.visible"></img-editor>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Thumbnail from './components/Thumbnail';
  import List from './components/List';
  import ListHeader from './components/ListHeader';
  import UploadFile from '@/components/UploadFile.vue';
  import DeleteFile from '@/components/DeleteFile.vue';
  import Detail from '@/components/Detail.vue';
  import VersionList from '@/components/VersionList.vue';
  import MoveFile from '@/components/MoveFile.vue';
  // TODO 用事件冒泡的方式处理listHeader里的按钮
  export default {
    name: 'admin-list',
    data() {
      return {
        component: true,
        detailVisible: false,
        versionVisible: false,
        move: {
          visible: false,
          type: 'upload'
        },
        deleteVisible: false,
        upload: {
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
      ImgEditor: ()=>import('@/components/ImgEditor/index.vue'),
      VersionList,
      Detail,
      UploadFile,
      Thumbnail,
      List,
      ListHeader,
      DeleteFile,
      MDEditor: ()=>import('@/components/MDEditor.vue'),
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
            this.upload = {
              visible: true,
              type: 'upload'
            };
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
            this.upload = {
              visible: true,
              type: 'update'
            };
            break;
          case 'version':
            this.versionVisible = true;
            break;
          case 'delete':
            this.deleteVisible = true;
            break;
          case 'detail':
            this.detailVisible = true;
            break;
          case 'back2FileList':
            this.$store.dispatch('ToggleSearch', false);
            break;
          case 'List':
            this.component = true;
            break;
          case 'Thumbnail':
            this.component = false;
            break;
          default:
            break;
        }
      },
      refresh() {
        this.$store.dispatch('Refresh').then(res => {
          if (res.success) {
            this.$message1000('刷新成功', 'success');
          }
        });
      },
      rename() {
        if (this.selectedData.length === 1) {
          this.$set(this.selectedData[0], 'isEditor', true);
        }
        this.$store.dispatch('RightTogglemenuVisible', [false]);
      }
    },
    async mounted() {
      if (this.$route.query.hasOwnProperty('dirid')) {
        this.$router.push({ path: this.$route.fullPath });
      } else {
        this.$router.push({ path: `/index/list?dirid=0` });
      }
      this.$store.dispatch('GetCategory', this.$route.query.dirid);
      window.addEventListener('popstate', () => {
        if (this.$route.query.dirid) {
          this.$store.dispatch('GetCategory', this.$route.query.dirid);
        }
      }, false);
    }
  };
</script>

<style lang="scss" scoped>
.admin-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  &-header {
    flex-shrink: 0;
  }
}
</style>
