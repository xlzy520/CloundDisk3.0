<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle" :isFolder="isFolder" :isFile="isFile" :isOther="isOther"></list-header>
    <component :is="component" :fileList="fileList" @change_the_function="change_the_function"></component>
    <upload-file></upload-file>
    <detail></detail>
    <version-list></version-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
import UploadFile from '@/components/UploadFile'
import Detail from '@/components/Detail/index'
import VersionList from '@/components/VersionList/index'
export default {
  name: 'list',
  data() {
    return {
      component: 'List',
      isFolder: false,
      isFile: false,
      isOther: false
    }
  },
  computed: {
    ...mapGetters([
      'fileList'
    ])
  },
  components: {
    VersionList,
    Detail,
    UploadFile,
    Thumbnail,
    List,
    ListHeader
  },
  methods: {
    list_type_toggle(component) {
      this.component = component
    },
    change_the_function(totalLength, folderCheckedCount, fileCheckedCount) {
      console.log(totalLength, folderCheckedCount, fileCheckedCount)
      if (totalLength === (folderCheckedCount + fileCheckedCount) &&
        totalLength > 0 || folderCheckedCount &&
        fileCheckedCount || folderCheckedCount > 1 || fileCheckedCount > 1) {
        this.isFolder = false
        this.isFile = false
        this.isOther = true
      } else if (folderCheckedCount && !fileCheckedCount) {
        this.isFolder = true
        this.isFile = false
        this.isOther = false
      } else if (fileCheckedCount && !folderCheckedCount) {
        this.isFolder = false
        this.isFile = true
        this.isOther = false
      } else {
        this.isFolder = false
        this.isFile = false
        this.isOther = false
      }
    }
  },
  async mounted() {
    this.$store.dispatch('GetCategory', '0')
    console.log(1)
  }
}
</script>

<style lang="scss">

</style>
