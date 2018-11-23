<template>
  <div class="toplink">
    <i class="fa fa-home"></i>
    <template v-for="(item, index) in navList">
      <span v-if="index === navList.length -1">{{item.fname}}</span>
      <a @click="jumpFolder(item.fcategoryid)" v-if="index !== navList.length -1">{{item.fname}}</a>
      <i v-if="index !== navList.length -1" class="el-icon-arrow-right"></i>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    props: {
      navList: {
        type: Array,
        default: []
      }
    },
    methods: {
      jumpFolder(fcategoryid) {
        this.$store.dispatch('SetSelectedData', []);
        // this.$store.dispatch('GetCategory', fcategoryid);
        this.$store.dispatch('SetParentId', fcategoryid);
        this.$store.dispatch('ToggleSearch', false);
        this.$router.push({ path: '/index/list', query: { dirid: fcategoryid }});
      }
    }
  };
</script>

<style lang="scss" scoped>
.toplink {
  width: 100%;
  margin-top: 10px;
  font-size: 12px;
  color: #333;
  a, span {
    padding: 0 3px;
  }
  a {
    color: #409eff;
    text-decoration: none;
  }
  .fa-home {
    font-size: 14px;
  }
  .el-icon-arrow-right {
    color: #aaa;
  }
}
</style>
