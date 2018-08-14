<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="logo" v-show="!isCollapse">
        <img src="@/assets/logo/logo.png" width="36" height="36" class="logo__img">
        <span class="logo__title">东经云盘</span>
      </div>
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
  .logo{
    display: inline-block;
    margin: 15px 0 15px -10px;
    cursor: default;
    text-align: center;
    width: 100%;
    line-height: 1;
    vertical-align: middle;
    &__img{
      margin-right: 5px;
      vertical-align: middle;
    }
    &__title{
      font-size: 24px;
      color: #31ba78;
      vertical-align: middle;
    }
  }
</style>
