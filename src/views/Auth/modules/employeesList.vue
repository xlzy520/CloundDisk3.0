<template>
  <div class="list-check employee-list" v-loading="loading">
    <div class="employee-wrap flex-column">
      <div class="list-check-header">
        <span>员工列表</span>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          :disabled="checkAllDisabled">全选</el-checkbox>
      </div>
      <base-scrollbar class="scroll-box">
        <el-checkbox-group
          v-model="checkedEmployeesList"
          @change="employeesChange">
          <el-checkbox
            v-for="item in listData"
            :class="{ active: item.hasAuth === '1' }"
            :label="item.userId"
            :key="item.userId"
            class="org-radio">
            {{ item.userName }}
          </el-checkbox>
        </el-checkbox-group>
      </base-scrollbar>
    </div>
    <div class="employee-selected flex-column">
      <span>已选择员工：</span>
      <el-select
        v-model="checkedEmployeesList"
        multiple
        filterable
        reserve-keyword
        @change="employeesChange"
        placeholder="请输入姓名">
        <el-option
          v-for="item in listData"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import baseScrollbar from '@/components/base/baseScrollbar.vue';
import authService from '@/api/service/auth';

export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      checkedEmployeesList: [],
      checkAll: false,
      isIndeterminate: false,
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    checkAllDisabled() {
      return this.listData.length === 0;
    }
  },
  methods: {
    handleCheckAllChange(checkAll) {
      this.checkedEmployeesList = checkAll ? this.listData.map(v => { return v.userId; }) : [];
      if (this.checkedEmployeesList.length === 1) {
        this.searchThisCateWhoHavePer(this.checkedEmployeesList);
      }
      this.isIndeterminate = false;
      this.$emit('select-change', this.checkedEmployeesList);
    },
    employeesChange(val) {
      const { length } = val;
      if (length === 1) {
        this.searchThisCateWhoHavePer(this.checkedEmployeesList);
      }
      this.checkAll = length === this.listData.length;
      this.isIndeterminate = length > 0 && length < this.listData.length;
      this.$emit('select-change', this.checkedEmployeesList);
    },
    searchThisCateWhoHavePer(userList) {
      this.loading = true;
      authService.searchThisCateWhoHavePer({
        fcategoryid: JSON.parse(sessionStorage.obj),
        fuserList: userList,
      }).then(res => {
        this.$emit('post-auth', res.data.auth);
      }).finally(()=>{
        this.loading = false;
      });
    },
    reset() {
      this.checkedEmployeesList = [];
      this.checkAll = false;
      this.isIndeterminate = false;
    }
  }
};

</script>
<style lang="scss">
  .list-check{
    width: 49vw;
  }
  .employee-selected{
    width: (300/650)* 49vw;
  }
  .employee-wrap{
    width: (240/650)* 49vw;
  }
  .scroll-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-shadow: 3px 2px 7px 0 #e1e8e8;
    .el-checkbox-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }
    .org-radio {
      width: 40%;
    }
  }
  /deep/ .el-select {
    margin-top: 10px;
  }
</style>
