<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle"></list-header>
    <component :is="component" :fileList="List"></component>
    <upload-file></upload-file>
    <delete-file></delete-file>
    <detail v-if="detailVisible"></detail>
    <version-list v-if="versionVisible"></version-list>
    <m-d-editor></m-d-editor>
    <move-file v-if="move.visible"></move-file>
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
// TODO 用时间冒泡的方式处理listHeader里的按钮
export default {
  name: 'list',
  data() {
    return {
      component: 'List'
    }
  },
  computed: {
    ...mapGetters([
      'fileList',
      'searchList',
      'selectedData',
      'detailVisible',
      'versionVisible',
      'move',
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
  .el-scrollbar__thumb{
    background-color: rgba(64,158,255,.8);
  }
</style>
