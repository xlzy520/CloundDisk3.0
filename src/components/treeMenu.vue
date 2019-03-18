<template>
  <el-tree
    :data="treeData"
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
  import categoryService from '@/api/service/category';
  export default {
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'childrenFolder',
          label: 'fname'
        },
        list: [],
      };
    },
    props: ['type'],
    methods: {
      handleNodeClick(data) {
        if (this.type === 'copyMove') {
          this.$emit('getFolderId', data); //移动复制文件时，传递文件夹ID
        } else if (this.type === 'sidebar') {
          this.$router.push({ path: '/index/list', query: { dirid: data.fcategoryid }});
        }
      },
      // 先清空节点，若有数据再展开
      nodeExpand(data, node) {
        node.childNodes = [];//清空节点，否则点击展开关闭再展开，子节点会重复push，数组长度翻倍
        categoryService.getCategory(data.fcategoryid).then(res=>{
          const folderMap = res.tableList.filter(item => item.ffiletype === 1);
          if (folderMap.length > 0) {
            folderMap.forEach((item)=>this.$refs.folderTree.append(item, node));
            node.childNodes.forEach((item) => {
              if (item.data.fsortorder === 1) {
                item.isLeaf = false;
              }
            });
          }
        });
      },
      getCategory(id = this.$route.query.dirid) {
        if (!id) id = -1;
        return categoryService.getCommonCategory().then(res => {
          // common字段 只在最外层
          if (res.common && res.common.length > 0) {
            for (const item of res.common) {
              if (item.fsortorder === 1) {
                item.childrenFolder = [{}];
              }
            }
            this.treeData = res.common;
          }
          if (res.auth && res.auth.length > 0) {
            this.$store.dispatch('SetAuthArr', res.auth);
          }
        });
      },
    },
    mounted() {
      this.getCategory();
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
  .el-tree{
    background-color: transparent;
    margin-bottom: 30px;
    /deep/ .el-tree-node{
      &__expand-icon{
        font-size: 18px;
        &:not(.is-leaf){
          color: #67c23a;
        }
      }
      &:focus>.el-tree-node__content,&__content:hover{
          background: linear-gradient(to right,rgba(249,213,191,.7),rgba(234,179,214,.8));
          color: #ffffff;
      }
    }
  }
  .custom-tree-node {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
</style>
