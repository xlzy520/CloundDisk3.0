<template>
  <div class="admin-list">
    <list-header
      class="admin-list-header"
      @action="dispatchAction"
      :auth-list-header="authListHeader"
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
    <markdown-editor
      ref="md"
      v-if="visible==='mdEditor'"
      :doc-info="docInfo"
      @action="dispatchAction">
    </markdown-editor>
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
  import UploadFile from '@/components/file/UploadFile.vue';
  import DeleteFile from '@/components/file/DeleteFile.vue';
  import Detail from '@/components/file/Detail.vue';
  import VersionList from '@/components/file/VersionList.vue';
  import MoveFile from '@/components/file/MoveFile.vue';
  import MarkdownEditor from "@/components/file/MarkdownEditor";
  import ZipReader from '@/components/file/ZipReader.vue';
  import DingDing from "@/components/file/DingDing";
  import Share from '@/components/file/Share.vue';

  //API
  import fileService from '@/api/service/file';
  import request from '@/utils/request';
  import categoryService from '@/api/service/category';
  import authService from '@/api/service/auth';

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
        authListHeader: []
      };
    },
    computed: {
      ...mapGetters([
        'selectedData',
        'userData'
      ])
    },
    components: {
      DingDing,
      MarkdownEditor,
      ImgEditor: () => import('@/components/file/imgEditor/index.vue'),
      VersionList,
      Detail,
      UploadFile,
      Thumbnail,
      List,
      ListHeader,
      DeleteFile,
      MDEditor: () => import('@/components/file/MarkdownEditor.vue'),
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
          case 'relevance':
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
          case 'share':
            this.$refs[action].open();
            break;
          case 'assign':
            sessionStorage.obj = JSON.stringify(this.selectedData.map(v=> v.fcategoryid));
            // 点击分配权限按钮时 请求 getAuth接口查询 userList是否为空数组
            this.queryPermission();
            break;
          case 'rebuild':
            this.rebuild(this.selectedData[0].fcategoryid);
            break;
          default:
            break;
        }
      },
      // 重新生成rp预览地址
      rebuild(fcategoryId) {
        fileService.updateRpDocumentPreviewUrl({ fcategoryId }).then(res => {
          if (res.success) {
            var a = document.createElement("a"); //创建a标签
            let intime = +new Date();
            a.id = intime;
            a.setAttribute("href", res.data.previewUrl);
            a.setAttribute("target", "_blank");
            document.body.appendChild(a);
            a.click(); //执行当前对象
            setTimeout(() => {
              document.body.removeChild(document.getElementById(intime));
            }, 500);
          } else {
            this.$message1000(res.msg, 'error');
          }
        });
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
      createDownloadLink(filename, href) {
        const download = document.createElement('a');
        download.style.display = 'none';
        document.body.appendChild(download);
        download.download = filename;
        download.href = href;
        download.click();
        document.body.removeChild(download);
      },
      async downloadFile() {
        const idList = this.selectedData.map(item => item.fcategoryid);
        if (idList.length === 1) { //单文件下载
          const href = `/djcpsdocument/fileManager/downloadFile.do?id=${idList[0]}`;
          this.createDownloadLink(this.selectedData[0].fname, href);
        } else { //多文件压缩下载
          const res = await fileService.downloadZip(idList);
          if (res.size === 62) {
            this.$message1000('文件下载失败，存在一个文件或多个文件不存在', 'error');
          } else {
            const filename = this.selectedData[0].fname + '等多个文件.zip';
            const zipUrl = URL.createObjectURL(res);
            this.createDownloadLink(filename, zipUrl);
            setTimeout(()=>{
              URL.revokeObjectURL(zipUrl); //释放文件对象内存地址，使用0延迟完成异步释放
            }, 0);
          }
        }
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
      cancelEdit() {
        if (this.selectedData.length >= 1) {
          this.selectedData[0].isEditor = false;
        } else {
          this.tableList.shift();
          this.tableList[0].isEditor = false;
        }
      },
      queryPermission() {
        const fcategoryids = this.selectedData.map(item=> item.fcategoryid);
        authService.getAuthListByCategory({
          fcategoryid: fcategoryids
        }).then(res => {
          const isConfigured = res.data.userList.length > 0 ? 1 : 0;
          this.$router.push(`/index/authSettings?isConfigured=${isConfigured}`);
        });
      },
      getCategory(id = this.$route.query.dirid, refresh = false) {
        if (!id) id = -1;
        return categoryService.getCategory(id).then(res => {
          if (refresh) {
            this.$message1000('刷新成功', 'success');
          }
          const {tableList, navList, auth} = res;
          this.tableList = tableList;
          this.navList = navList;
          this.authListHeader = auth;
        });
      },
      // 统一登录门户登录
      ssoLogin() {
        if (this.userData.length === undefined) {
          if (location.search.indexOf('oncetoken') !== -1) {
            const oncetoken = location.search.substring(location.search.indexOf("=") + 1);
            request.get(`/sso/exchangeToken.do?oncetoken=${oncetoken}`).then(() => {
              location.search = ''; //移除url中携带的oncetoken和from
            });
          } else {
            // sso登录时第一次触发
            let redirect = this.$route.fullPath;
            console.log(this.$route);
            if (location.search.indexOf('from=sso') !== -1) {
              sessionStorage.setItem('from', 'sso');
              this.$store.dispatch('GetInfo', redirect);
            } else {
              //刷新时触发
              this.$store.dispatch('GetInfo', redirect);
              this.getCategory();
            }
          }
        } else {
          // 路由切换时触发，直接请求文件目录
          this.getCategory().then(() => {
            const {origin} = this.$route.query;
            if (origin === 'search') { //刚挂载时定位搜索结果所在位置
              this.findSearch();
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
    },
    //  路由参数变化请求不同的文件列表
    beforeRouteUpdate(to, from, next) {
      this.getCategory(to.query.dirid || 0).then(() => {
        next();
      });
      this.$store.dispatch('SetSelectedData', []);
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
