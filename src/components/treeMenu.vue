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
      getCommonCategory() {
        categoryService.getCommonCategory().then(res=>{
          const commonCategory = res.data;
          if (commonCategory && commonCategory.length > 0) {
            for (const item of commonCategory) {
              if (item.fsortorder === 1) {
                item.childrenFolder = [{}];
              }
            }
            this.treeData = commonCategory;
          }
        });
      }
    },
    mounted() {
      // todo 通过标志判断减少不必要的一次请求，当已经登录，又通过统一登录平台登录，会带上from=sso，导致跳转时多请求一次
      if (location.search.indexOf('oncetoken') === -1){
        //此判断为统一登录过程中，页面跳转所带的标志，尽量减少跳转过程中请求不必要的接口
        this.getCommonCategory();
      }
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
