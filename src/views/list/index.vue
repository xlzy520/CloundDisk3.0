<template>
  <div class="admin-list">
    <list-header
      class="admin-list-header"
      @action="dispatchAction"
      :nav-list="navList"></list-header>
    <component
      :is="isList"
      :file-list="tableList"
      @viewImg="viewImg"
      @md="openMD"
      @action="dispatchAction"
      @cancel-edit="cancelEdit"
      @confirm-edit="confirmEdit"
      @context-menu="showMenu"></component>
    <upload-file ref="upload" :nav-list="navList" @refresh="getCategory"></upload-file>
    <delete-file ref="delete" @refresh="getCategory"></delete-file>
    <detail ref="detail"></detail>
    <version-list ref="version" @md="openMD" @refresh="getCategory"></version-list>
    <md-editor ref="md"
               v-if="visible==='mdEditor'"
               :docInfo="docInfo"
               @close="dispatchAction('close')"
               @refresh="dispatchAction('textEdit')"></md-editor>
    <move-file ref="move" @refresh="getCategory"></move-file>
    <img-editor ref="img" v-if="visible==='img'" :img-config="imgConfig" @close="dispatchAction('close')"></img-editor>
    <zip-reader ref="zipReader" @action="dispatchAction"></zip-reader>
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
  import zipReader from '@/components/zipReader.vue';

  import fileService from '@/api/service/file';
  import request from '@/utils/request';
  import categoryService from '../../api/service/category';

  export default {
    name: 'index',
    data() {
      return {
        isList: 'List',
        visible: '', // 展示某个弹窗组件
        contextMenu: {}, //右键菜单
        imgConfig: {}, //  图片预览链接
        docInfo: {}, //markdown文件预览信息
        tableList: [],
        navList: [],
      };
    },
    computed: {
      ...mapGetters([
        'selectedData',
      ])
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
      MoveFile,
      zipReader
    },
    methods: {
      dispatchAction(action, values) {
        switch (action) {
          case 'refresh':
            this.getCategory(this.$route.query.dirid, true);
            break;
          case 'download':
            this.downloadFile();
            break;
          case 'version':case 'detail':
            this.$refs[action].requestData();
            this.$refs[action].visible = true;
            break;
          case 'upload': case 'delete':
            this.$refs[action].visible = true;
            break;
          case 'rename':
            this.$set(this.selectedData[0], 'isEditor', true);
            break;
          case 'copy':case 'move':case 'update':
            this.$refs.move.visible = true;
            this.$refs.move.type = action;
            break;
          case 'back':
            this.$store.dispatch('ToggleSearch', false);
            break;
          case 'List': case 'Thumbnail':
            this.isList = action;
            break;
          case 'newMD':
            this.docInfo = {};
            this.visible = 'mdEditor';
            break;
          case 'newFolder':
            this.newFolder();
            break;
          case 'close':
            this.visible = '';
            break;
          case 'textEdit':
            this.getCategory();
            if (this.$refs.version.visible) this.$refs.version.visible = false; //版本查看可以编辑文档，触发更新之后没有关闭版本窗口
            break;
          case 'zipReader':
            this.$refs.zipReader.openFrame(values);
            break;
          case 'viewImg':
            this.viewImg(values);
            break;
          default:
            break;
        }
      },
      newFolder() {
        this.tableList.unshift({
          faothority: 'newFolder',
          ffiletype: 1,
          fname: '新建文件夹',
          fsize: null
        });
        this.tableList[0].isEditor = true;
        this.$store.dispatch('SetSelectedData', []);
      },
      viewImg(values) {
        this.imgConfig = {
          url: values.url,
          name: values.name || ''
        };
        this.visible = 'img';
      },
      openMD(val) { //  打开markdown文件时先访问再判断是否打开窗口，默认为编辑
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
      downloadFile() {
        let download = document.createElement('a');
        download.download = this.selectedData[0].fname;
        download.style.display = 'none';
        download.href = `/djcpsdocument/fileManager/downloadFile.do?id=${this.selectedData[0].fcategoryid}`;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
      },
      confirmEdit(fileName) {
        const row = this.selectedData;
        if (row.length >= 1) { //  重命名
          fileService.renameFile({...row[0], newName: fileName}).then(res => {
            this.$message1000(res.msg, 'success');
            this.tableList[0].fname = fileName;
            this.tableList[0].isEditor = false;
          });
        } else {//新建文件夹
          fileService.addCategory(this.$route.query.dirid || 0, fileName).then(res => {
            this.$message1000(res.msg, 'success');
            this.getCategory(this.$route.query.dirid, false);
          }).catch(() => {
            this.tableList[0].isEditor = false;
            this.tableList.shift();
          });
        }
      },
      cancelEdit() {
        if (this.selectedData.length >= 1) {
          this.selectedData[0].isEditor = false;
        } else {
          this.tableList.shift();
          this.tableList[0].isEditor = false;
        }
      },
      showMenu(val) {
        this.contextMenu = val;
      },
      getCategory(id = this.$route.query.dirid, refresh = false) {
        if (!id) id = 0;
        return categoryService.getCategory(id).then(res => {
          if (refresh) {
            this.$message1000('刷新成功', 'success');
          }
          this.tableList = res.tableList;
          this.navList = res.navList;
        });
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
        this.getCategory().catch(err => {
          if (err.msg === "120") {
            // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
            sessionStorage.getItem('from') ? location.href = err.data.url : this.$router.push('/login');
          }
        });
      }
      // // 监听浏览器后退前进功能
      // window.addEventListener('popstate', () => {
      //   if (this.$route.query.dirid) this.getCategory();
      // }, false);
    },
    //  路由参数变化请求不同的文件列表
    beforeRouteUpdate(to, from, next) {
      console.time('切换目录用时：');
      console.time('请求接口用时：');
      this.getCategory(to.query.dirid).then(()=>{
        console.timeEnd('请求接口用时：');
        next();
        console.timeEnd('切换目录用时：');
      });
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
