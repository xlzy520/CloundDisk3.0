<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle" @action="dispatchAction"></list-header>
    <component :is="component" :fileList="List"></component>
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
        },
        deleteVisible: false,
        upload: {
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
        switch (component) {
          case 'moveVisible':
            this.move.visible = false
            break
          case 'uploadVisible':
            this.upload.visible = false
            break
          default:
            this[component] = false
            break
        }
      },
      dispatchAction(action) {
        switch (action) {
          case 'refresh':
            this.refresh()
            break
          case 'upload':
            this.upload = {
              visible: true,
              type: 'upload'
            }
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
            this.upload = {
              visible: true,
              type: 'update'
            }
            break
          case 'version':
            this.versionVisible = true
            break
          case 'delete':
            this.deleteVisible = true
            break
          case 'detail':
            this.detailVisible = true
            break
          default:
            break
        }
      },
      refresh() {
        this.$store.dispatch('Refresh').then(res => {
          if (res.success) {
            this.$message1000('刷新成功', 'success')
          }
        })
      },
      rename() {
        if (this.selectedData.length === 1) {
          this.$set(this.selectedData[0], 'isEditor', true)
        }
        this.$store.dispatch('RightTogglemenuVisible', [false])
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
