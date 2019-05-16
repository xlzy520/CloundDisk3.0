<template>
  <div class="list-check flex-column">
    <div class="list-check-header">
      <span>权限类型</span>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        :disabled="radioDisabled">全选</el-checkbox>
    </div>
    <base-scrollbar class="scroll-box">
      <el-checkbox-group
        v-model="checkedAuthList"
        @change="handleCheckedItemsChange">
        <el-checkbox v-for="(item, index) in listData" :key="index"
                     class="org-radio" :label="item" :disabled="radioDisabled">{{ item }}</el-checkbox>
      </el-checkbox-group>
    </base-scrollbar>
  </div>
</template>

<script>
import baseScrollbar from '@/components/base/baseScrollbar.vue';

export default {
  props: {
    checkedEmployeesList: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      listData: ['查阅', '删除', '编辑', '下载', '上传', '新建'],
      checkedAuthList: [],
      checkAll: false,
      isIndeterminate: false,
      loading: false
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    radioDisabled() {
      const {length} = this.checkedEmployeesList;
      if (length === 0 || length > 1) {
        this.reset();
      }
      return length === 0;
    }
  },
  methods: {
    /**
     * 将[1,1,1]转换为['查阅', '删除']
     * @param auth
     */
    transform(auth) {
      auth.forEach((item, index)=>{
        if (item === '1') {
          this.checkedAuthList.push(this.listData[index]);
        }
      });
      this.checkAll = this.checkedAuthList.length === this.listData.length;
    },
    /**
     * 将['查阅', '删除']转换为[1,1,0]，并emit
     */
    unTransform() {
      const authListTransform = this.listData.map(v=>{
        const index = this.checkedAuthList.findIndex(item => v === item);
        if (index !== -1) {
          return '1';
        }
        return '0';
      });
      this.$emit('update-auth', authListTransform);
    },
    handleCheckAllChange(checkAll) {
      this.checkedAuthList = checkAll ? this.listData : [];
      this.isIndeterminate = false;
      this.unTransform();
    },
    handleCheckedItemsChange(val) {
      if (val.length > 0 && !val.includes("查阅")) {
        this.checkedAuthList.push('查阅');
      }
      const checkedCount = val.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
      this.unTransform();
    },
    reset() {
      this.checkedAuthList = [];
      this.checkAll = false;
      this.isIndeterminate = false;
    }
  }
};

</script>
<style lang="scss" scoped>
  .list-check{
    width: 240px;
  }
  .org-radio{
    width: calc(100% - 30px);
  }
</style>
