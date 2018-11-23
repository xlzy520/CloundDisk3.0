<template>
  <div class="admin-list">
    <list-header :nav-list="navList" :selected="selected" class="admin-list-header" @new-folder="newFolder" @action="dispatchAction"></list-header>
    <list
      ref="baseList"
      v-if="isList"
      v-model="selected"
      :file-list="tableList"
      @cancel-edit="cancelEdit"
      @confirm-edit="confirmEdit">
    </list>
    <thumbnail
      v-else
      v-model="selected"
      :file-list="tableList"
      @cancel-edit="cancelEdit"
      @confirm-edit="confirmEdit">
    </thumbnail>
    <upload-file ref="upload" :nav-list="navList" @upload-success="getCategory(null, false)"></upload-file>
    <delete-file ref="deleteFile" @delete-success="deleteSuccess"></delete-file>
    <detail ref="detail"></detail>
    <version-list ref="version"></version-list>
    <md-editor></md-editor>
    <move-file ref="moveFrame" @success="getCategory(null, false)"></move-file>
    <img-editor v-if="imgEditor.visible"></img-editor>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Thumbnail from './components/Thumbnail.vue';
  import List from './components/List.vue';
  import ListHeader from './components/ListHeader.vue';
  import UploadFile from '@/components/UploadFile.vue';
  import DeleteFile from '@/components/DeleteFile.vue';
  import Detail from '@/components/Detail.vue';
  import VersionList from '@/components/VersionList.vue';
  import MoveFile from '@/components/MoveFile.vue';
  import MdEditor from '@/components/MDEditor.vue';
  import ImgEditor from '@/components/ImgEditor/index.vue';
  import categoryService from '../../api/service/category.js';
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
        },
        tableList: [],
        navList: [],
        selected: [],
        hasSearch: this.$store.getters.hasSearch,
      };
    },
    computed: {
      ...mapGetters([
        // 'fileList',
        'searchList',
        // 'selectedData',
        'imgEditor'
      ]),
      // List() {
      //   return this.$store.getters.hasSearch === false ? this.fileList : this.searchList.bookList;
      // }
    },
    components: {
      MdEditor,
      ImgEditor,
      VersionList,
      Detail,
      UploadFile,
      Thumbnail,
      List,
      ListHeader,
      DeleteFile,
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
            // this.refresh();
            this.getCategory();
            break;
          case 'upload':
            this.$refs.upload.openFrame(this.selected[0]);
            break;
          case 'rename':
            this.rename();
            break;
          case 'copyTo':
            this.move = {
              visible: true,
              type: 'copy'
            };
            this.$refs.moveFrame.openFrame(this.selected, 'copy');
            break;
          case 'moveTo':
            this.move = {
              visible: true,
              type: 'move'
            };
            this.$refs.moveFrame.openFrame(this.selected);
            break;
          case 'update':
            this.$refs.upload.openFrame(this.selected[0], 'update');
            break;
          case 'version':
            this.$refs.version.openFrame(this.selected[0]);
            break;
          case 'delete':
            this.$refs.deleteFile.openFrame(this.selected);
            break;
          case 'detail':
            this.$refs.detail.openFrame(this.selected[0]);
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
      clearSelection() {
        if (this.isList) this.$refs.baseList.clearSelection();
        else this.selected = [];
      },
      newFolder() {
        this.clearSelection();
        this.tableList.unshift({
          faothority: 'newFolder',
          ffiletype: 1,
          fname: '新建文件夹',
          fsize: null,
          isEditor: true
        });
        // this.$set(this.tableList[0], 'isEditor', true);
      },
      deleteSuccess() {
        this.clearSelection();
        this.getCategory();
      },
      refresh() {
        this.$store.dispatch('Refresh').then(res => {
          if (res.success) {
            this.$message1000('刷新成功', 'success');
          }
        });
      },
      confirmEdit(fileName) {
        if (this.selected.length === 0) {
          categoryService.addCategory(this.$route.query.dirid, fileName).then(res => {
            this.$message1000(res.msg, 'success');
            this.getCategory(this.$route.query.dirid, false);
          });
        } else {
          categoryService.renameFile({ ...this.selected[0], newName: fileName }).then(res => {
            this.$message1000(res.msg, 'success');
            this.selected[0].fname = fileName;
          });
        }
        this.selected[0].isEditor = false;
      },
      cancelEdit() {
        if (this.selected.length === 0) {
          this.tableList.shift(0);
        } else {
          this.selected[0].isEditor = false;
        }
      },
      getCategory(id, refresh = true) {
        if (refresh) this.tableList = [];
        let dirid = id || this.$route.query.dirid;
        categoryService.getCategory(dirid).then(res => {
          this.tableList = res.tableList;
          this.navList = res.navList;
        });
      },
      rename() {
        this.$set(this.selected[0], 'isEditor', true);
        // if (this.selectedData.length === 1) {
        //   this.$set(this.selectedData[0], 'isEditor', true);
        // }
        this.$store.dispatch('RightTogglemenuVisible', [false]);
      }
    },
    watch: {
      $route(to) {
        if (!to.query.dirid) return;
        this.selected = [];
        this.getCategory(to.query.dirid);
      }
    },
    mounted() {
      if (!this.hasSearch) {
        if (this.$route.query.dirid) {
          this.getCategory();
          // this.$router.push({ path: this.$route.fullPath });
        } else {
          this.$router.push({ path: `/index/list`, query: { dirid: '0' } });
        }
      }
      // this.getCategory('0');
      // this.$store.dispatch('GetCategory', this.$route.query.dirid);
      // window.addEventListener('popstate', () => {
      //   console.log('12312in');
      //   if (this.$route.query.dirid) {
      //     this.$store.dispatch('GetCategory', this.$route.query.dirid);
      //   }
      // }, false);
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
