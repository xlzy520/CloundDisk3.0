<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="permission-content flex">
        <employees-list
          ref="employeesList"
          :list-data="employeesList"
          @selct-change="selectedEmployeesList"></employees-list>
        <auth-type ref="authTypes"></auth-type>
      </div>
    </base-scrollbar>
    <div class="handler-box">
      <el-button type="primary" @click="save" :disabled="isClick" :loading="loading">保存</el-button>
      <el-button type="warning" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import employeesList from './modules/employeesList.vue';
  import authType from './modules/authType.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  import authService from '@/api/service/auth';
  import {mapGetters} from "vuex";

  export default {
    name: 'permission-edit',
    data() {
      return {
        checkedEmployeesList: [],
        employeesList: [],
        loading: false,
      };
    },
    components: {
      employeesList,
      authType,
      baseScrollbar
    },
    computed: {
      isClick: function () {
        return !(this.authList.length > 0 && this.employee.length > 0);
      },
      ...mapGetters([
        'authList',
        'employee'
      ])
    },
    methods: {
      getfcategoryids() {
        return JSON.parse(sessionStorage.obj);
      },
      assignAuth(auth) {
        this.$refs.authTypes.checkList.push(auth.filter(item => item === '1'));
      },
      getAuthListByCategory(fcategoryid) {
        authService.getAuthListByCategory({fcategoryid}).then(res => {
          this.employeesList = res.data.userList;
        });
      },
      selectedEmployeesList(list) {
        this.checkedEmployeesList = list;
      },
      save() {
        this.loading = true;
        const params = {
          auth: this.authList,
          fcategoryid: this.getfcategoryids(),
          userList: this.employeesList
        };
        authService.giveAuthToUser(params).then(() => {
          this.$message1000("分配权限成功", 'success');
        }).finally(() => {
          this.loading = false;
          this.clear();
          this.cancel();
        });
      },
      clear() {
        this.$refs.authTypes.checkList = [];
        this.$refs.employeesList.checkList = [];
      },
      cancel() {
        this.$router.back();
      }
    },
    mounted() {
      this.getAuthListByCategory(this.getfcategoryids());
    },
  };

</script>
<style lang="scss">
  .permission-content {
    justify-content: flex-start;
  }
  .handler-box{
    text-align: center;
    margin: 0 50px 20px 0;
  }
</style>
