<template>
  <div class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
  import categoryService from '@/api/service/category';
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
            for (let i in res.common) {
              if (res.common[i].fsortorder === 1) {
                res.common[i].childrenFolder = [{}];
              }
            }
            sessionStorage.sider = JSON.stringify(res.common);
          }

          if (res.auth && res.auth.length > 0) {
            this.$store.dispatch('SetAuthArr', res.auth);
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
