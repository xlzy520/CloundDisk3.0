<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle" v-show="component!=='search'"></list-header>
    <component :is="component" :fileList="fileList"></component>
    <upload-file></upload-file>
    <delete-file/>
    <detail v-if="selectedData.length===1"></detail>
    <version-list v-if="selectedData.length===1"></version-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail2'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
import UploadFile from '@/components/UploadFile'
import DeleteFile from '@/components/DeleteFile'
import Detail from '@/components/Detail/index'
import VersionList from '@/components/VersionList/index'
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
      'selectedData'
    ])
  },
  components: {
    VersionList,
    Detail,
    UploadFile,
    Thumbnail,
    List,
    ListHeader,
    DeleteFile
  },
  methods: {
    list_type_toggle(component) {
      this.component = component
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
