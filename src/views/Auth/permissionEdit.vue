<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scroll-bar">
      <div class="permission-content flex">
        <employees-list
          ref="employeesList"
          :list-data="employeesList"
          @post-auth="getAuthByOne"
          @select-change="selectedEmployeesList"></employees-list>
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
  import employeesList from './modules/employeesList.vue';
  import authType from './modules/authType.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  import authService from '@/api/service/auth';

  export default {
    name: 'permission-edit',
    data() {
      return {
        checkedEmployeesList: [],
        employeesList: [],
        loading: false,
        authList: []
      };
    },
    components: {
      employeesList,
      authType,
      baseScrollbar
    },
    computed: {
      saveDisabled() {
        return this.authList.length === 0;
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
      getfcategoryids() {
        return JSON.parse(sessionStorage.obj);
      },
      getUserListByCategory(fcategoryid) {
        authService.getAuthListByCategory({fcategoryid}).then(res => {
          this.employeesList = res.data.userList;
        });
      },
      selectedEmployeesList(list) {
        this.checkedEmployeesList = list;
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
        }).finally(() => {
          this.loading = false;
          this.clear();
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
    },
    mounted() {
      this.getUserListByCategory(this.getfcategoryids());
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
