<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="rgba(145,212,143,.5)"
      text-color="#063873"
      active-text-color="#409EFF"
    >
      <div class="logo" v-show="!isCollapse">
        <img src="@/assets/logo/logo.png" width="36" height="36" class="logo__img">
        <span class="logo__title">东经云盘</span>
      </div>
      <el-tree
        :data="data"
        :props="defaultProps"
        :indent="10"
        :expand-on-click-node="false"
        @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{node,data}">
          <svg-icon  icon-class="folder"></svg-icon>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <!--<sidebar-item -->
        <!--v-for="route in routes" -->
        <!--:key="route.name" -->
        <!--:item="route" -->
        <!--:base-path="route.path">-->
      <!--</sidebar-item>-->
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    data() {
      return {
        data: [
          {
            label: '研发中心',
            children: [{
              icon: 'hahahah',
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
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
    },
    methods: {
      handleNodeClick(data) {
        console.log(data)
      }
    }
  }
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    .svg-icon {
      width: 2em!important;
      height: 2em!important;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
      margin-right: 0!important;
    }
  }

  .logo {
    display: inline-block;
    margin: 15px 0 15px -10px;
    cursor: default;
    text-align: center;
    width: 100%;
    line-height: 1;
    vertical-align: middle;
    &__img {
      margin-right: 5px;
      vertical-align: middle;
    }
    &__title {
      font-size: 24px;
      color: #31ba78;
      vertical-align: middle;
    }
  }
</style>
