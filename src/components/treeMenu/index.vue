<template>
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
    props: ['type'],
    computed: {
      ...mapGetters([
        'sidebar',
        'fileList',
        'selectedData'
      ])
    },
    methods: {
      handleNodeClick(data) {
        if (this.type === 'sidebar') {
          this.$store.dispatch('GetCategory', data.fcategoryid)
          this.$store.dispatch('SetParentId', data.fcategoryid)
        } else {
          this.$emit('getFolderid', data.fcategoryid)
        }
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


</style>
