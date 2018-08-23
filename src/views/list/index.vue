<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle"></list-header>
    <component :is="component" :fileList="fileList"></component>
    <upload-file></upload-file>
    <delete-file></delete-file>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail2'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
import UploadFile from '@/components/UploadFile'
import DeleteFile from '@/components/DeleteFile'
export default {
  name: 'list',
  data() {
    return {
      component: 'List'
    }
  },
  computed: {
    ...mapGetters([
      'fileList'
    ])
  },
  components: {
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
    this.$store.dispatch('GetCategory', '-1')
    console.log(1)
  }
}
</script>

<style lang="scss">

</style>
