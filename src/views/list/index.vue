<template>
  <div class="admin-list">
    <list-header
      class="admin-list-header"
      @action="dispatchAction"
      :nav-list="navList"
      @open-dir="openDir"
      :contextMenu="contextMenu"></list-header>
    <list
      v-if="isList"
      :file-list="tableList"
      @viewImg="viewImg"
      @md="openMD"
      @open-dir="openDir"
      @context-menu="showMenu"></list>
    <thumbnail v-else :file-list="tableList" @viewImg="viewImg" @md="openMD" @context-menu="showMenu"></thumbnail>
    <upload-file ref="upload" :nav-list="navList" :parentId="parentId" @refresh="dispatchAction('updateList')"></upload-file>
    <delete-file ref="delete" @refresh="dispatchAction('updateList')"></delete-file>
    <detail ref="detail"></detail>
    <version-list ref="version" @md="openMD"></version-list>
    <md-editor ref="md" v-if="visible==='mdEditor'" :docInfo="docInfo" @close="close"></md-editor>
    <move-file ref="move"></move-file>
    <img-editor ref="img" v-if="visible==='img'" :imgUrl="imgUrl" @close="close"></img-editor>
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

  import fileService from '@/api/service/file';
  import request from '@/utils/request';
  import categoryService from '../../api/service/category';

  export default {
    name: 'index',
    data() {
      return {
        isList: true,
        visible: '', // 展示某个弹窗组件
        contextMenu: {}, //右键菜单
        imgUrl: '', //  图片预览链接
        docInfo: {}, //markdown文件预览信息
        tableList: [],
        navList: [],
        selected: [],
        parentId: '0'
      };
    },
    computed: {
      ...mapGetters([
        'searchList',
        'selectedData',
      ]),
      // List() {
      //   return this.$store.getters.hasSearch === false ? this.fileList : this.searchList.bookList;
      // }
    },
    components: {
      MdEditor,
      ImgEditor: () => import('@/components/imgEditor/index.vue'),
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
      dispatchAction(action) {
        switch (action) {
          case 'updateList':
            this.getCategory(this.$route.query.dirid, false);
            break;
          case 'refresh':
            this.getCategory(this.$route.query.dirid, true);
            break;
          case 'version':
          case 'detail':
            this.$refs[action].requestData();
            this.$refs[action].visible = true;
            break;
          case 'upload':
          case 'delete':
            this.$refs[action].visible = true;
            break;
          case 'rename':
            this.rename();
            break;
          case 'copy':
          case 'move':
            this.$refs.move.visible = true;
            this.$refs.move.type = action;
            break;
          case 'update':
            this.$refs.upload.type = 'update';
            this.$refs.upload.visible = true;
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
          case 'newMD':
            this.docInfo = {};
            this.visible = 'mdEditor';
            break;
          default:
            break;
        }
      },
      close() {
        this.visible = '';
      },
      openDir(id) {
        this.getCategory(id);
        this.parentId = id;
      },
      viewImg(id) {
        this.imgUrl = `/djcpsdocument/fileManager/downloadFile.do?id=${id}`;
        this.visible = 'img';
      },
      openMD(val) { //  打开markdown文件时先访问再判断是否打开窗口，默认为编辑
        console.log(val);
        fileService.getDocInfo(val.fcategoryid).then(res => {
          this.docInfo = {
            type: 'view',
            fversionsign: val.fversionsign,
            name: res.data.name,
            id: res.data.id,
            content: res.data.file,
          };
          this.visible = 'mdEditor';
        });
      },
      showMenu(val) {
        this.contextMenu = val;
      },
      getCategory(id = this.$route.query.dirid, refresh = false) {
        if (!id) id = 0;
        categoryService.getCategory(id).then(res => {
          if (refresh) {
            this.$message1000('刷新成功', 'success');
          }
          this.tableList = res.tableList;
          this.navList = res.navList;
        });
      },
      rename() {
        if (this.selectedData.length === 1) {
          this.$set(this.selectedData[0], 'isEditor', true);
        }
        this.contextMenu.visible = false;
      },
      signIn() {
        this.$store.dispatch('GetInfo');
        this.getCategory();
      }
    },
    mounted() {
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
        categoryService.getCategory(this.$route.query.dirid || 0).then(res => {
          this.tableList = res.tableList;
          this.navList = res.navList;
        }).catch(err => {
          if (err.msg === "120") {
            // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
            sessionStorage.getItem('from') ? location.href = err.data.url : this.$router.push('/login');
          }
        });
      }
      // 监听浏览器后退前进功能
      window.addEventListener('popstate', () => {
        if (this.$route.query.dirid) this.getCategory();
      }, false);
    },
    //  路由参数变化请求不同的文件列表
    beforeRouteUpdate(to, from, next) {
      this.getCategory(to.query.dirid);
      next();
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
