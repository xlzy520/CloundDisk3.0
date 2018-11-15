<template>
  <div class="toplink">
    <div class="left">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACLklEQVR4nO3WT4iMcRzH8dcuJW1te+IgeyBb2yp7QFG7NstB+VdyUFiJ2dpycHBSRBJKtDdTkji4rcSuP1kX/x1cyMXFQUgpiY02HH6/ybOzM7szz8xqaT41Nb/v9/l+n/d8n8/v+Q011fSfqQ4ymUza+gbswWrcwXmMJPKzcRGNidgb9OY3ymazYGZaEjTjGpbE9UbswCa8j7F52FqgdhxQTvUpYVbgaQImp+Ux3p6ybyqg7biHuYnY68T3+bgvTGxKgepwHJcwK8Z+4RBacCSuCd4awP5ygUr1UAMuY3Mi9g09uCp45xhe4YJg5nr0lQtUyoSa8SAP5i06cBdDwk4axC2swrtyQUoFKmTeZ1iGr3iCNTG+Nq4/C+Z+Xm2gQua9gk4sxmMsyqtpiVCtwgQHqgFUzLyHsQ0Z4TE1FenZFPO7sQUnClxzoBhQvqmLmXeXYN5zEWgyzUA/2rBPMHvWnx94KuYy+JEsTE6omHk7MYzbJcIk1RvrbqAbHxO5HsEScwoBLVXcvCMx11UmTE5dgq8+CWZ/mcitjPdpywfaqbB52/EIC1LC5LRQ2AStws4dTOSaBa+NATqIF8aatw/XjT2pK1Fj7LcXG3A2xh/iZD7QF+F90oGjMXZa+sO3mOpj35/CsdKN9fieuyC5yz7Ez9/UcH6g2hOoWJX8QYN1BWJDlTSsFOhmhfXjNO0eWQ1oMv1TQKNTdM8J+04E1D9ZcQqN4kyVe9ZU0/TWbwc+bHv5dNe2AAAAAElFTkSuQmCC">
      <template v-for="(item, index) in folderNav">
        <span v-if="index===navNum -1">{{item.fname}}</span>
        <a href="javascript:void(0)" @click="jumpFolder(item.fcategoryid)" v-if="index!==navNum -1">{{item.fname}}</a>
        <i v-if="index!==navNum -1" class="el-icon-arrow-right" style="color:#aaa"></i>
      </template>
    </div>
    <div class="right">
      <a href="javascript:void(0)" v-if="false">返回搜索结果</a>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'Breadcrumb',
    computed: {
      ...mapGetters([
        'folderNav'
      ]),
      navNum() {
        return this.folderNav.length;
      }
    },
    methods: {
      jumpFolder(fcategoryid) {
        this.$store.dispatch('SetSelectedData', []);
        this.$store.dispatch('GetCategory', fcategoryid);
        this.$store.dispatch('SetParentId', fcategoryid);
        this.$store.dispatch('ToggleSearch', false);
        this.$router.push({ path: `/list/index?`, query: { dirid: fcategoryid }});
      }
    }
  };
</script>

<style lang="scss">
  .toplink {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 2px;
    font-size: 12px;
    color: #333;
    overflow: hidden;
    .left {
      float: left;
      img {
        height: 18px;
        padding-right: 0;
        vertical-align: -23%;
      }
      a, span {
        padding-right: 3px;
        padding-left: 3px;
      }
      a {
        color: #409eff;
        text-decoration: none;
      }
    }
    .el-breadcrumb {
      line-height: 20px;
    }
    .breadcrumb_home_icon {
      float: left;
      height: 19px;
      padding-right: 4px;
    }
  }
</style>
