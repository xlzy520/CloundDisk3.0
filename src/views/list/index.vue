<template>
  <div>
    <list-header @list_type_toggle="list_type_toggle"></list-header>
    <component :is="component" :list="list"></component>
  </div>
</template>

<script>
import { getCategory } from '@/api/file'
import Thumbnail from './components/Thumbnail'
import List from './components/List'
import ListHeader from '@/components/ListHeader'
export default {
  name: 'list',
  data() {
    return {
      component: 'List',
      list: [
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 1, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false },
        { type: 0, checked: false }
      ]
    }
  },
  components: {
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
    const CategoryInfo = await getCategory('1002')
    console.log(CategoryInfo)
  }
}
</script>

<style lang="scss">

</style>
