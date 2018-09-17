<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle"></list-header>
    <!--<iframe-->
      <!--src="http://192.168.12.237/we/wordeditorframe.aspx?WOPISrc=http://192.168.12.23:8081/djcpsdocument/wopi/files/683e1061a8af46529a88b9164ec95f69"-->
      <!--width="100%"-->
      <!--height="600"-->
    <!--&gt;-->
    <!--</iframe>-->
    <component :is="component" :fileList="List"></component>
    <upload-file></upload-file>
    <delete-file></delete-file>
    <detail v-if="detailVisible"></detail>
    <version-list v-if="versionVisible"></version-list>
    <m-d-editor></m-d-editor>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
import UploadFile from '@/components/UploadFile'
import DeleteFile from '@/components/DeleteFile'
import Detail from '@/components/Detail'
import VersionList from '@/components/VersionList'
import MDEditor from '@/components/MDEditor'
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
      'versionVisible'
    ]),
    List() {
      return this.$store.getters.hasSearch === false ? this.fileList : this.searchList.bookList
    }
  },
  components: {
    VersionList,
    Detail,
    UploadFile,
    Thumbnail,
    List,
    ListHeader,
    DeleteFile,
    MDEditor
  },
  methods: {
    list_type_toggle(component) {
      this.component = component
    }
  },
  async mounted() {
    if (this.$router.history.current.query.fcategoryid) {
      this.$store.dispatch('GetCategory', this.$router.history.current.query.fcategoryid)
    } else {
      this.$store.dispatch('GetCategory', '0')
    }
  }
}
</script>

<style lang="scss">
  .el-scrollbar__thumb{
    background-color: rgba(64,158,255,.8);
  }
</style>
