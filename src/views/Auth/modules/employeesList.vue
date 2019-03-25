<template>
  <div class="list-checkbox flex" v-loading="loading">
    <div class="choice-box">
      <div class="list-checkbox-header">
        <span class="list-checkbox-title">员工列表</span>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          :disabled="checkAllDisabled">全选</el-checkbox>
      </div>
      <div class="staff-box">
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
    </div>
    <div class="employee-selected">
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
import baseScrollbar from '@/components/baseScrollbar.vue';
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
  }
};

</script>
<style lang="scss" scoped>
  .list-checkbox{
    width: 49vw;
  }
  .employee-selected{
    width: (300/650)* 49vw;
    display: flex;
    flex-direction: column;
  }
  .choice-box{
    width: (240/650)* 49vw;
    @extend .employee-selected
  }
  .staff-box {
    display: flex;
    justify-content: space-between;
    .scroll-box {
      width: 100%;
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      .org-radio {
        width: 50%;
      }
    }
  }
  /deep/ .el-select {
    margin-top: 10px;
  }
</style>
