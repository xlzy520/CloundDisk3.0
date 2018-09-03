<template>
  <!--<el-scrollbar wrapClass="scrollbar-wrapper">-->
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
      <el-scrollbar style="display: inline-block">
        <el-tree
          style="display: inline-block;min-width: 13vw"
          :data="data"
          :props="defaultProps"
          ref="folderTree"
          :indent="10"
          :expand-on-click-node="false"
          @node-expand="nodeExpand"
          @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{node,data}" :title="node.label">
          <svg-icon  icon-class="1"></svg-icon>
          <span>{{ node.label }}</span>
        </span>
        </el-tree>
      </el-scrollbar>

      <!--<sidebar-item -->
        <!--v-for="route in routes" -->
        <!--:key="route.name" -->
        <!--:item="route" -->
        <!--:base-path="route.path">-->
      <!--</sidebar-item>-->
    </el-menu>
  <!--</el-scrollbar>-->
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getCategory } from '@/api/file'
  import SidebarItem from './SidebarItem'

  export default {
    data() {
      return {
        data: [
          {
            fname: '研发中心',
            fcategoryid: '0',
            childrenFolder: [{}]
          }
        ],
        defaultProps: {
          children: 'childrenFolder',
          label: 'fname'
        }
      }
    },
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'sidebar',
        'fileList'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
      handleNodeClick(data) {
        this.$store.dispatch('GetCategory', data.fcategoryid)
        this.$store.dispatch('SetParentId', data.fcategoryid)
      },
      async nodeExpand(data, node) {
        let arr = await getCategory(data.fcategoryid)
        arr = arr.data.tableList
        node.childNodes = []
        if (arr.length >= 1) {
          for (const item of this.CreateFolderObj(arr)) {
            this.$refs.folderTree.append(item, node)
          }
          node.childNodes.map((item) => {
            if (item.data.fsortorder === 1) {
              item.isLeaf = false
            }
          })
        }
      },
      getFolder(arr) {
        return arr.filter((item) => {
          return item.ffiletype === 1
        })
      },
      CreateFolderObj(arr) {
        const folderArr = this.getFolder(arr)
        folderArr.map((item) => {
          Object.defineProperties(item, { 'childrenFolder': { value: [], writable: true }})
        })
        return folderArr
      }
    }
  }
</script>

<style lang="scss">
  @import "@/styles/variables.scss";
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
  .logo + .el-scrollbar .el-scrollbar__wrap{
    width: 13vw;
    height: 91vh;
    margin-right: 0!important;
    overflow-y: hidden;
    & + .el-scrollbar__bar.is-horizontal{
      height: 1.5vh;
      .el-scrollbar__thumb{
        background-color: rgba(64,158,255,.8);
        height: 1.5vh;
      }
    }
  }

</style>
