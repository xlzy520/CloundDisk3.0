<template>
  <div class="admin-list" v-loading.fullscreen.lock="fullScreenLoading">
    <list-header
      class="admin-list-header"
      @action="dispatchAction"
      :nav-list="navList"></list-header>
    <component
      ref="fileList"
      :is="isList"
      :file-list="tableList"
      @action="dispatchAction"
      @cancel-edit="cancelEdit"
      @confirm-edit="confirmEdit"></component>
    <upload-file ref="upload" :nav-list="navList" @action="dispatchAction"></upload-file>
    <delete-file ref="delete" @action="dispatchAction"></delete-file>
    <detail ref="detail"></detail>
    <version-list ref="version" @action="dispatchAction"></version-list>
    <md-editor
      ref="md"
      v-if="visible==='mdEditor'"
      :doc-info="docInfo"
      @action="dispatchAction">
    </md-editor>
    <move-file ref="move" @action="dispatchAction"></move-file>
    <img-editor ref="img" v-if="visible==='img'" :img-config="imgConfig" @action="dispatchAction"></img-editor>
    <zip-reader ref="zipReader" @action="dispatchAction"></zip-reader>
    <ding-ding ref="dingDing" @action="dispatchAction"></ding-ding>
    <share ref="share" @action="dispatchAction"></share>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  //组件
  import Thumbnail from './components/Thumbnail';
  import List from './components/List';
  import ListHeader from './components/ListHeader';
  import UploadFile from '@/components/UploadFile.vue';
  import DeleteFile from '@/components/DeleteFile.vue';
  import Detail from '@/components/Detail.vue';
  import VersionList from '@/components/VersionList.vue';
  import MoveFile from '@/components/MoveFile.vue';
  import MdEditor from "@/components/MDEditor";
  import ZipReader from '@/components/ZipReader.vue';
  import DingDing from "@/components/DingDing";
  import Share from '@/components/ShareDialog.vue';

  //API
  import fileService from '@/api/service/file';
  import request from '@/utils/request';
  import categoryService from '@/api/service/category';
  import authService from '@/api/service/auth';

  // methods
  import eventBus from '@/plugins/eventBus';

  export default {
    name: 'index',
    data() {
      return {
        isList: 'List',
        visible: '', // 展示某个弹窗组件
        imgConfig: {}, //  图片预览链接
        docInfo: {}, //markdown文件预览信息
        tableList: [],
        navList: [],
        fullScreenLoading: false
      };
    },
    computed: {
      ...mapGetters([
        'selectedData',
      ]),
      fcategoryid: {
        get: function() {
          return this.selectedData.map(v => {
            return v.fcategoryid;
          }).join(",");
        },
        set: function() {}
      },
    },
    components: {
      DingDing,
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
      ZipReader,
      Share
    },
    methods: {
      dispatchAction(action, values) {
        switch (action) {
          case 'refresh':
            this.getCategory();
            break;
          case 'refresh-tip':
            this.getCategory(this.$route.query.dirid, true);
            break;
          case 'download':
            this.downloadFile();
            break;
          case 'version':
          case 'detail':
            this.$refs[action].requestData();
            this.$refs[action].visible = true;
            break;
          case 'delete':
            this.$refs[action].visible = true;
            break;
          case 'rename':
            this.$set(this.selectedData[0], 'isEditor', true);
            break;
          case 'copy':
          case 'move':
            this.$refs.move.visible = true;
            this.$refs.move.type = action;
            break;
          case 'upload':
          case 'update':
            this.$refs.upload.visible = true;
            this.$refs.upload.type = action;
            break;
          case 'List':
          case 'Thumbnail':
            this.isList = action;
            break;
          case 'newMD':
            this.docInfo = {};
            this.visible = 'mdEditor';
            break;
          case 'openMD':
            this.openMD(values);
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
            this.imgConfig = {url: values.url, name: values.name || ''};
            this.visible = 'img';
            break;
          case 'dingDing':
            this.$refs[action].open();
            break;
          case 'assign':
            localStorage.obj = JSON.stringify(this.selectedData);
            // 点击分配权限按钮时 请求 getAuth接口查询 userList是否为空数组
            this.QueryPermission(this.fcategoryid);
            break;
          case 'share':
            this.$refs[action].openDialog();
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
      openMD({fcategoryid, fversionsign, fname}) { //  打开markdown文件时先访问再判断是否打开窗口，默认为编辑
        fileService.downloadFile(fcategoryid).then(res => {
          this.docInfo = {
            type: 'view',
            fversionsign: fversionsign,
            name: fname,
            id: fcategoryid,
            content: res,
          };
          this.visible = 'mdEditor';
        });
      },
      async downloadFile() {
        this.fullScreenLoading = true;
        let download = document.createElement('a');
        download.style.display = 'none';
        document.body.appendChild(download);
        const idList = this.selectedData.map(item => item.fcategoryid);
        if (idList.length === 1) { //单文件下载
          download.download = this.selectedData[0].fname;
          download.href = `/djcpsdocument/fileManager/downloadFile.do?id=${idList[0]}`;
        } else { //多文件压缩下载
          download.download = this.selectedData[0].fname + '等多个文件.zip';
          const res = await fileService.downloadZip(idList);
          const zipUrl = URL.createObjectURL(res);
          download.href = zipUrl;
          setTimeout(()=>{
            URL.revokeObjectURL(zipUrl); //释放文件对象内存地址，使用0延迟完成异步释放
          }, 0);
        }
        download.click();
        this.fullScreenLoading = false;
        document.body.removeChild(download);
      },
      confirmEdit(fileName) {
        const row = this.selectedData;
        if (row.length > 0) { //  重命名
          fileService.renameFile({...row[0], newName: fileName}).then(res => {
            this.$message1000(res.msg, 'success');
            row[0].fname = fileName;
            row[0].isEditor = false;
          });
        } else {//新建文件夹
          categoryService.addCategory(this.$route.query.dirid || 0, fileName).then(res => {
            this.$message1000(res.msg, 'success');
            this.getCategory(this.$route.query.dirid, false);
          }).catch(() => {
            this.tableList[0].isEditor = false;
            this.tableList.shift();
          });
        }
      },
      QueryPermission(data) {
        authService.getAuthListByCategory(data).then(res => {
          const isEdit = res.data.userList.length > 0 ? 1 : 0;
          this.$router.push(`/index/auth?isEdit=${isEdit}`);
        });
      },
      cancelEdit() {
        if (this.selectedData.length >= 1) {
          this.selectedData[0].isEditor = false;
        } else {
          this.tableList.shift();
          this.tableList[0].isEditor = false;
        }
      },
      getCategory(id = this.$route.query.dirid, refresh = false) {
        if (!id) id = -1;
        return categoryService.getCategory(id).then(res => {
          if (refresh) {
            this.$message1000('刷新成功', 'success');
          }
          this.tableList = res.tableList;
          this.navList = res.navList;

          if (id === -1 && res.tableList.length === 0) {
            this.tableList = res.common;
          }

          if (res.common && res.common.length > 0) {
            eventBus.$emit("Category", res.common);
          }

          if (res.auth && res.auth.length > 0) {
            this.$store.dispatch('SetAuthArr', res.auth);
          }
        });
      },
      signIn() {
        this.$store.dispatch('GetInfo');
        this.getCategory();
      },
      // 统一登录平台
      ssoLogin() {
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
          this.getCategory().then(() => {
            const {origin} = this.$route.query;
            if (origin === 'search') { //刚挂载时定位搜索结果所在位置
              this.findSearch();
            }
          }).catch(err => {
            if (err.msg === "120") {
              // 判断来源，如果来自统一登录平台，则根据120跳转，否则跳转到系统本身的登录界面
              sessionStorage.getItem('from') ? location.href = err.data.url : this.$router.push('/login');
            }
          });
        }
      },
      // 搜索结果定位
      findSearch() {
        const searchIndex = this.tableList.findIndex(item => item.fcategoryid === this.$route.query.searchId);
        if (searchIndex !== -1 && this.isList === 'List') {
          this.$nextTick(() => {
            const tableRowHeight = document.querySelector('.el-table__row').clientHeight;
            this.$refs.fileList.$refs.baseTable.toggleRowSelection(this.tableList[searchIndex], true);
            const elScrollBar = this.$refs.fileList.$refs['scrollbar'].$refs['elscrollbar'].$refs['wrap'];
            elScrollBar.scrollTop = tableRowHeight * searchIndex;
          });
        } else {
          this.$message1000('源文件未找到，文件可能已经被删除', 'info');
        }
      }
    },
    mounted() {
      this.ssoLogin();
      // 监听浏览器后退前进功能
      // window.addEventListener('popstate', () => {
      //   if (this.$route.query.dirid) this.getCategory();
      // }, false);
    },
    //  路由参数变化请求不同的文件列表
    beforeRouteUpdate(to, from, next) {
      this.getCategory(to.query.dirid || 0).then(() => {
        next();
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
