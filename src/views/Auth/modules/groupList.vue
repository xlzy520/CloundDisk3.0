<template>
  <div class="group-list">
    <p>组织列表</p>
    <base-scrollbar class="scroll-box">
      <el-radio-group
        v-model="groupNum"
        class="group"
        @change="choice">
        <el-radio v-for="(item, index) in listData"
                  :key="index"
                  :tabindex="false"
                  :label="item.id"
                  class="org-radio">{{ item.oname }}</el-radio>
      </el-radio-group>
    </base-scrollbar>
  </div>
</template>

<script>
import baseScrollbar from '@/components/baseScrollbar.vue';

export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      groupNum: '',
    };
  },
  components: {
    baseScrollbar
  },
  methods: {
    choice(id) {
      this.groupNum = id;
      this.$store.dispatch('ChooseGroup', this.groupNum);
      this.$emit("group-change", this.groupNum);
    },
  }
};

</script>
<style lang="scss">
.group-list {
  width: 210px;
  line-height: 40px;
  .scroll-box {
    height: 64vh;
    border: 1px solid #eee;
    margin-top: 10px;
  }
  .org-radio {
    width: 100%;
    line-height: 40px;
    padding-left: 30px;
    margin-left: 0;
  }
}
</style>
