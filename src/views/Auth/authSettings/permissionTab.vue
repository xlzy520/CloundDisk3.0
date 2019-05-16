<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar" v-loading="orgLoading">
      <div class="permission-content flex">
        <org-list :list-data="orgList" @org-change="orgChange" v-if="type === 'set'"></org-list>
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
      <el-button type="warning" @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>

import orgList from '../modules/orgList.vue';
import employeesList from '../modules/employeesList.vue';
import authType from '../modules/authType.vue';
import authService from '@/api/service/auth';
import baseScrollbar from '@/components/base/baseScrollbar.vue';

export default {
  name: 'permission-tab',
  props: {
    type: {
      type: String,
      default: 'edit' // 'edit' 'set'
    }
  },
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
      if (this.type === 'edit') {
        return this.authList.length === 0;
      }
      return this.checkedEmployeesList.length === 0;
    }
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
    getUserListByCategory(fcategoryid) {
      authService.getAuthListByCategory({fcategoryid}).then(res => {
        this.employeesList = res.data.userList;
      });
    },
    getfcategoryids() {
      return JSON.parse(sessionStorage.obj);
    },
    getOrgList() {
      authService.getOrgList().then(res => {
        this.orgList = res.data;
      });
    },
    orgChange(orgId) {
      this.orgLoading = true;
      authService.getExcludeUserInfoByOrgId(orgId, this.getfcategoryids()).then(res => {
        this.employeesList = res.data;
      }).finally(()=>{
        this.clear();
        this.orgLoading = false;
      });
    },
    save() {
      this.loading = true;
      const userList = this.checkedEmployeesList.map(item=> {
        for (const _item of this.employeesList) {
          if (item === _item.userId) {
            return _item;
          }
        }
      });
      authService.giveAuthToUser({
        auth: this.authList,
        fcategoryid: this.getfcategoryids(),
        userList: userList
      }).then(() => {
        this.$message1000("分配权限成功", 'success');
      }).finally(()=>{
        this.loading = false;
        this.clear();
        this.cancel();
      });
    },
    clear() {
      this.$refs.employeesList.reset();
      this.$refs.authTypes.reset();
    },
    cancel() {
      this.$router.back();
    },
    init() {
      this.$nextTick(()=>{
        if (this.type === 'edit') {
          this.getUserListByCategory(this.getfcategoryids());
        } else {
          this.getOrgList();
        }
      });
    },
    resetData() {
      this.clear();
      this.employeesList = [];
      this.checkedEmployeesList = [];
      this.authList = [];
      this.init();
    }
  },
  mounted() {
   this.init();
  },
};

</script>
<style lang="scss">
  .handler-box{
    text-align: center;
    margin: 0 50px 20px 0;
  }
</style>
