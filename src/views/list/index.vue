<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle"></list-header>
    <component :is="component" :FileList="fileList"></component>
    <upload-file></upload-file>
  </div>
</template>

<script>
import { getCategory } from '@/api/file'
import { mapGetters } from 'vuex'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
import UploadFile from '@/components/UploadFile'
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
    ListHeader
  },
  methods: {
    list_type_toggle(component) {
      this.component = component
    }
  },
  async mounted() {
    const CategoryInfo = await getCategory('-1')
    this.FileList = CategoryInfo.data
    console.log(CategoryInfo)
  }
}
</script>

<style lang="scss">

</style>
