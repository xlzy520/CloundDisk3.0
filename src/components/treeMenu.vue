<template>
    <el-tree
      :data="data"
      :props="defaultProps"
      ref="folderTree"
      :indent="10"
      :expand-on-click-node="false"
      @node-expand="nodeExpand"
      @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{node, data}" :title="node.label">
          <svg-icon icon-class="1"></svg-icon>
          <span>{{ node.label }}</span>
        </span>
    </el-tree>
</template>

<script>
  import { mapGetters } from 'vuex';
  import categoryService from '@/api/service/category';

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
      };
    },
    props: ['type'],
    computed: {
      ...mapGetters([
        'sidebar',
        'selectedData'
      ])
    },
    methods: {
      handleNodeClick(data) {
        if (this.type === 'copyMove') {
          this.$emit('getFolderId', data); //移动复制文件时，传递文件夹ID
        }
        if (this.type === 'sidebar') {
          this.$router.push({ path: '/index/list', query: { dirid: data.fcategoryid }});
        }
      },
      async nodeExpand(data, node) {
        const arr = await categoryService.getCategory(data.fcategoryid);
        let folderItems = arr.tableList;
        node.childNodes = [];
        if (folderItems.length > 0) {
          let temp = folderItems.filter(item => item.ffiletype === 1);
          for (const item of temp) {
            this.$refs.folderTree.append(item, node);
          }
          node.childNodes.forEach((item) => {
            if (item.data.fsortorder === 1) {
              item.isLeaf = false;
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .el-tree{
    background-color: transparent;
    /deep/ .el-tree-node{
      &__expand-icon{
        font-size: 18px;
        &:not(.is-leaf){
          color: #67c23a;
        }
      }
    }
    .el-tree-node:focus>.el-tree-node__content, .el-tree-node__content:hover{
      background-color: rgba(145, 212, 143, .4);
      color: #ffffff;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    .svg-icon {
      width: 2em;
      height: 2em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
      margin-right: 0;
    }
  }
</style>
