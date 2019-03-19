<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="permission-content flex">
        <group-list :list-data="groupList" @groupnum-change="OrgIdChange"></group-list>
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

import groupList from './modules/groupList.vue';
import employeesList from './modules/employeesList.vue';
import authType from './modules/authType.vue';
import authService from '@/api/service/auth';
import baseScrollbar from '@/components/baseScrollbar.vue';
import authData from './modules/authData.js';
import { mapGetters } from 'vuex';

export default {
  name: 'permission-setting',
  data () {
    return {
      groupList: [],
      employeesList: [],
      authTypes: authData.data,
      loading: false,
    };
  },
  components: {
    groupList,
    employeesList,
    authType,
    baseScrollbar
  },
  computed: {
    fcategoryid: {
      get: function() {
        return JSON.parse(localStorage.obj).map(v => {
          return v.fcategoryid;
        }).join(",");
      },
      set: function() {}
    },
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
    getOrgList() {
      authService.getOrgList().then(res => {
        if (res.success) {
          this.groupList = res.data;
          for (const item of this.groupList) {
            item['isSelected'] = false;
          }
        }
      });
    },
    OrgIdChange(val) {
      authService.getExcludeUserInfoByOrgId(val, this.fcategoryid).then(res => {
        if (res.success) {
          this.employeesList = res.data;
          this.$refs.employeesList.DupData = res.data;
        }
      });
    },
    save() {
      let params = {
        auth: this.authList,
        fcategoryid: this.fcategoryid,
        userList: this.$refs.employeesList.userList
      };
      this.loading = true;

      authService.giveAuthToUser(params).then(res => {
        this.loading = false;
        this.clear();
        this.$message1000("分配权限成功", 'success');
        setTimeout(() => {
          this.Quit();
        }, 50);
      });
    },
    clear() {
      this.$refs.authTypes.checkList = [];
      this.$refs.employeesList.checkList = [];
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};

</script>
<style lang="scss">

</style>
