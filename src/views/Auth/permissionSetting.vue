<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar" v-loading="orgLoading">
      <div class="permission-content flex">
        <org-list :list-data="orgList" @org-change="orgChange"></org-list>
        <employees-list ref="employeesList" :list-data="employeesList"></employees-list>
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

import orgList from './modules/orgList.vue';
import employeesList from './modules/employeesList.vue';
import authType from './modules/authType.vue';
import authService from '@/api/service/auth';
import baseScrollbar from '@/components/baseScrollbar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'permission-setting',
  data () {
    return {
      orgList: [],
      employeesList: [],
      loading: false,
      orgLoading: false
    };
  },
  components: {
    orgList,
    employeesList,
    authType,
    baseScrollbar
  },
  computed: {
    isClick: function() {
      return !(this.authList.length > 0 && this.employee.length > 0);
    },
    ...mapGetters([
      'employee',
      'authList'
    ])
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    getfcategoryid() {
      return JSON.parse(sessionStorage.obj);
    },
    getOrgList() {
      authService.getOrgList().then(res => {
        this.orgList = res.data;
      });
    },
    orgChange(orgId) {
      this.orgLoading = true;
      authService.getExcludeUserInfoByOrgId(orgId, this.getfcategoryid()).then(res => {
        this.employeesList = res.data;
        // this.$refs.employeesList.DupData = res.data;
      }).finally(()=>{
        this.orgLoading = false;
      });
    },
    save() {
      let params = {
        auth: this.authList,
        fcategoryid: this.getfcategoryid(),
        userList: this.$refs.employeesList.userList
      };
      this.loading = true;
      authService.giveAuthToUser(params).then(() => {
        this.loading = false;
        this.clear();
        this.$message1000("分配权限成功", 'success');
      }).finally(()=>{
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
  }
};

</script>
<style lang="scss">

</style>
