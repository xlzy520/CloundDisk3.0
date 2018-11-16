<template>
  <div class="toplink">
    <div class="left">
      <i class="fa fa-home" style="font-size: 14px"></i>
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
        this.$router.push({ path: `/index/list?`, query: { dirid: fcategoryid }});
      }
    }
  };
</script>

<style lang="scss">
  .toplink {
    width: 100%;
    margin-top: 10px;
    font-size: 12px;
    color: #333;
    overflow: hidden;
    a, span {
      padding-right: 3px;
      padding-left: 3px;
    }
    a {
      color: #409eff;
      text-decoration: none;
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
