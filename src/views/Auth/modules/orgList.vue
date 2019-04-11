<template>
  <div class="org-list">
    <p>组织列表</p>
    <base-scrollbar class="scroll-box">
      <el-radio-group
        v-model="orgId"
        @change="selectOrg">
        <el-radio v-for="(item, index) in listData"
                  :key="index"
                  :label="item.id">
          {{ item.oname }}
        </el-radio>
      </el-radio-group>
    </base-scrollbar>
  </div>
</template>

<script>
import baseScrollbar from '@/components/base/baseScrollbar.vue';

export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      orgId: '',
    };
  },
  components: {
    baseScrollbar
  },
  methods: {
    selectOrg() {
      this.$emit("org-change", this.orgId);
    },
  }
};

</script>
<style lang="scss">
.org-list {
  width: 220px;
  line-height: 40px;
  .scroll-box {
    height: 64vh;
    border: 1px solid #eee;
    margin-top: 10px;
  }
  .el-radio {
    width: 100%;
    line-height: 40px;
    padding-left: 20px;
    margin-right: 0;
  }
}
</style>
