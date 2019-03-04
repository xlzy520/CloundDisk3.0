<template>
  <div class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
  import categoryService from '@/api/service/category';
  import eventBus from '@/plugins/eventBus.js';
  export default {
    name: 'AppMain',
    mounted() {
      this.getCategory();
    },
    methods: {
      getCategory(id = this.$route.query.dirid) {
        if (!id) id = -1;
        return categoryService.getCategory(id).then(res => {
          // common字段 只在最外层
          if (res.common && res.common.length > 0) {
            eventBus.$emit("Category", res.common);
          }
        });
      },
    }
  };
</script>

<style lang="scss">
.app-main {
  position: relative;
  flex-grow: 1;
  display: flex;
}
</style>
