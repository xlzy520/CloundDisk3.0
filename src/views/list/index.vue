<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle" @action="dispatchAction"></list-header>
    <component :is="component" :fileList="List"></component>
    <upload-file></upload-file>
    <delete-file></delete-file>
    <detail v-if="detailVisible" @closeDialog="closeDialog"></detail>
    <version-list v-if="versionVisible" @closeDialog="closeDialog"></version-list>
    <m-d-editor></m-d-editor>
    <move-file v-if="move.visible" :type="move.type" @closeDialog="closeDialog"></move-file>
    <img-editor v-if="imgEditor.visible"></img-editor>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Thumbnail from './components/Thumbnail'
  import List from './components/List'
  import ListHeader from './components/ListHeader'
  import UploadFile from '@/components/UploadFile'
  import DeleteFile from '@/components/DeleteFile'
  import Detail from '@/components/Detail'
  import VersionList from '@/components/VersionList'
  import MDEditor from '@/components/MDEditor'
  import MoveFile from '@/components/MoveFile'
  import ImgEditor from '@/components/imgEditor'
  // TODO 用事件冒泡的方式处理listHeader里的按钮
  export default {
    name: 'list',
    data() {
      return {
        component: 'List',
        detailVisible: false,
        versionVisible: false,
        move: {
          visible: false,
          type: 'upload'
        }
      }
    },
    computed: {
      ...mapGetters([
        'fileList',
        'searchList',
        'selectedData',
        'imgEditor'
      ]),
      List() {
        return this.$store.getters.hasSearch === false ? this.fileList : this.searchList.bookList
      }
    },
    components: {
      ImgEditor,
      VersionList,
      Detail,
      UploadFile,
      Thumbnail,
      List,
      ListHeader,
      DeleteFile,
      MDEditor,
      MoveFile
    },
    methods: {
      list_type_toggle(component) {
        this.component = component
      },
      closeDialog(component) {
        console.log(component)
        if (component === 'moveVisible') {
          this.move.visible = false
        } else {
          this[component] = false
        }
      },
      dispatchAction(action) {
        switch (action) {
          case 'refresh':
            this.refresh()
            break
          case 'upload':
            this.upload()
            break
          case 'rename':
            this.rename()
            break
          case 'copyTo':
            this.move = {
              visible: true,
              type: 'copy'
            }
            break
          case 'moveTo':
            this.move = {
              visible: true,
              type: 'move'
            }
            break
          case 'update':
            this.update()
            break
          case 'version':
            this.versionVisible = true
            break
          case 'delete':
            this.delete()
            break
          case 'detail':
            this.detailVisible = true
            break
          default:
            break
        }
      },
      typeShow(type) {
        this.$emit('list_type_toggle', type)
      },
      upload() {
        this.$store.dispatch('ToggleUploadVisible', 'upload')
      },
      update() {
        this.$store.dispatch('ToggleUploadVisible', 'update')
      },
      version() {
        this.$store.dispatch('ToggleVersionVisible')
      },
      refresh() {
        this.$store.dispatch('Refresh').then(res => {
          if (res.success) {
            this.$message1000('刷新成功', 'success')
          }
        })
      },
      delete() {
        this.$store.dispatch('ToggleDeleteVisible')
      },
      rename() {
        if (this.selectedData.length === 1) {
          this.$set(this.selectedData[0], 'isEditor', true)
        }
        this.$store.dispatch('RightTogglemenuVisible', [false])
      },
      newFolder() {
        this.$store.dispatch('Refresh').then(() => {
          this.fileList.unshift({
            faothority: 'newFolder',
            fcategoryid: null,
            fcategorystatus: 1,
            fcreatetime: null,
            ffiletype: 1,
            fname: '新建文件夹',
            foperator: null,
            foperatorid: null,
            fparentid: null,
            fsize: null,
            fsortorder: null,
            fupdateor: null,
            fupdatetime: null,
            rowid: null
          })
          this.$set(this.fileList[0], 'isEditor', true)
          this.$store.dispatch('SetSelectedData', [])
        })
      },
      downloadFile() {
        this.$refs.downloadBtn.href = `${process.env.UPLOAD_API}/djcpsdocument/fileManager/downloadFile.do?id=${this.selectedData[0].fcategoryid}`
        this.$refs.downloadBtn.download = this.selectedData[0].fname
      },
      downloadFile2() {
        this.downloadFile()
        this.$refs.downloadBtn.click()
      },
      back2FileList() {
        this.$store.dispatch('ToggleSearch', false)
      },
      handleCommand(command) {
        switch (command) {
          case 'newFolder':
            this.newFolder()
            break
          case 'newMarkdown':
            this.$store.dispatch('NewMarkdownFile')
            break
          default:
            return false
        }
      },
      copyTo() {
        this.$store.dispatch('ToggleMoveVisible', 'copy')
      },
      moveTo() {
        this.$store.dispatch('ToggleMoveVisible', 'move')
      }

    },
    async mounted() {
      this.$router.push({ path: `/list/index?`, query: { dirid: '0' }})
      this.$store.dispatch('GetCategory', this.$route.query.dirid)
      window.addEventListener('popstate', () => {
        if (this.$route.query.dirid) {
          this.$store.dispatch('GetCategory', this.$route.query.dirid)
        }
      }, false)
    }
  }
</script>

<style lang="scss">
  .el-scrollbar__thumb {
    background-color: rgba(64, 158, 255, .8);
  }
</style>
