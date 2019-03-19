<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="permission-content flex">
        <employees-list ref="employeesList" :list-data="employeesList"></employees-list>
        <auth-type ref="authTypes" :list-data="authTypes"></auth-type>
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
  import authData from './modules/authData.js';
  import { mapGetters } from "vuex";

  export default {
    name: 'permission-edit',
    data () {
      return {
        isShowOrgList: "1",
        employeesList: [],
        authTypes: authData.data,
        Auths: [],
        loading: false,
      };
    },
    components: {
      employeesList,
      authType,
      baseScrollbar
    },
    computed: {
      isClick: function() {
        return !(this.authList.length > 0 && this.employee.length > 0);
      },
      ...mapGetters([
        'authList',
        'employee'
      ])
    },
    methods: {
      getfcategoryids() {
        return JSON.parse(localStorage.obj).map(v => v.fcategoryid);
      },
      assignAuth(auth) {
        this.$refs.authTypes.checkList.push(auth.filter(item=> item === '1'));
      },
      getAuthListByCategory(fcategoryid) {
        authService.getAuthListByCategory({
          fcategoryid
        }).then(res => {
          if (res.success) {
            this.employeesList = res.data.userList;
            this.$refs.employeesList.DupData = JSON.parse(JSON.stringify(this.employeesList));
            if (this.employeesList.length > 0) {
              let authArr = this.employeesList.map(v => { return v.auth; });
              this.$refs.employeesList.checkList = this.$refs.employeesList.DupData.map(v => {
                return v.userId;
              });
              // 员工列表 只有一人时
              if (this.employeesList.length === 1) {
                this.assignAuth(authArr[0]);
                return false;
              }
              // 判断 auth数组是否存在和第一个元素 不同的元素
              let isEqual = !authArr.find(v => authArr[0].join() !== v.join());
              // 只有 所有成员权限一致时
              if (isEqual) {
                this.assignAuth(authArr[0]);
              }
            }
          }
        });
      },
      save() {
        this.loading = true;
        const params = {
          auth: this.authList,
          fcategoryid: this.getfcategoryids(),
          userList: this.$refs.employeesList.userList
        };
        authService.giveAuthToUser(params).then(() => {
          this.$message1000("分配权限成功", 'success');
        }).finally(()=>{
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

</style>
