<template>
  <div class="group-employee">
    <div class="group-employee-item">
      <label>组织列表：</label>
      <el-select v-model="groupNum"
                 filterable
                 size="medium"
                 placeholder="请选择"
                 @change="groupNumChange">
        <el-option v-for="item in groupList"
                   :key="item.id"
                   :label="item.oname"
                   :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="group-employee-item">
      <label>员工列表：</label>
      <el-select
        v-model="userId"
        filterable
        size="medium"
        :disabled="!groupNum"
        :loading="loading"
        @change="selectEmployee"
        placeholder="请选择">
        <el-option v-for="item in employeeList"
                   :key="item.userId"
                   :label="item.userName"
                   :value="item.userId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
  import pushService from '@/api/service/push';
  import authService from '@/api/service/auth';

  class AuthMan {
    groupList = [];
    employeeList = [];
    groupNum = "";
    userId = "";
  }
  export default {
    name: 'user-select',
    data() {
      return {
        loading: false,
        ...new AuthMan()
      };
    },
    mounted() {
      this.getOrgList();
    },
    methods: {
      getOrgList() {
        authService.getOrgList().then(res => {
          this.groupList = res.data;
        });
      },
      groupNumChange(val) {
        this.userId = "";
        pushService.getUserInfoByOrgId(val).then(res => {
          this.employeeList = res.data;
        });
      },
      selectEmployee(val) {
        this.$emit('post-userId', val);
      }
    }
  };

</script>
<style lang="scss" scoped>
  label{
    font-weight: normal;
  }
  .group-employee{
    display: flex;
    &-item:last-child{
      margin-left: 50px;
    }
  }
</style>
