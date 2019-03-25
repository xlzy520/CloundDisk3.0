<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar" v-loading="orgLoading">
      <div class="permission-content flex">
        <org-list :list-data="orgList" @org-change="orgChange"></org-list>
        <employees-list ref="employeesList"
                        @post-auth="getAuthByOne"
                        @select-change="selectedEmployeesList"
                        :list-data="employeesList"></employees-list>
        <auth-type ref="authTypes"
                   @update-auth="updateAuth"
                   :checkedEmployeesList="checkedEmployeesList"></auth-type>
      </div>
    </base-scrollbar>
    <div class="handler-box">
      <el-button type="primary" @click="save" :disabled="saveDisabled" :loading="loading">保存</el-button>
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

export default {
  name: 'permission-setting',
  data () {
    return {
      orgList: [],
      employeesList: [],
      checkedEmployeesList: [],
      authList: [],
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
    saveDisabled() {
      return this.checkedEmployeesList.length === 0;
    }
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    updateAuth(auth) {
      this.authList = auth;
    },
    getAuthByOne(auth) {
      this.authList = auth;
      this.$refs.authTypes.transform(auth);
    },
    selectedEmployeesList(list) {
      this.checkedEmployeesList = list;
    },
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
      }).finally(()=>{
        this.orgLoading = false;
      });
    },
    save() {
      const userList = this.checkedEmployeesList.map(item=> {
        for (const _item of this.employeesList) {
          if (item === _item.userId) {
            return _item;
          }
        }
      });
      let params = {
        auth: this.authList,
        fcategoryid: this.getfcategoryid(),
        userList: userList
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
      this.$refs.authTypes.checkedAuthList = [];
      this.$refs.employeesList.checkedEmployeesList = [];
    },
    cancel() {
      this.$router.back();
    }
  }
};

</script>
<style lang="scss">

</style>
