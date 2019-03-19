<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="permission-content flex">
        <list-checkbox title="员工列表" ref="ListCo" :list-data="employeesList"></list-checkbox>
        <list-checkbox-two title="权限类型" ref="ListCt" :list-data="authTypes"></list-checkbox-two>
      </div>
    </base-scrollbar>
    <div class="handler-box">
      <el-button type="primary" @click="save" :disabled="isClick" :loading="loading">保存</el-button>
      <el-button type="warning" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
  import listCheckbox from './modules/listCheckbox.vue';
  import listCheckboxTwo from './modules/listCheckboxTwo.vue';
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
      listCheckboxTwo,
      listCheckbox,
      baseScrollbar
    },
    computed: {
      isClick: function() {
        return !(this.authList.length > 0 && this.EMPLYOEE.length > 0);
      },
      ...mapGetters([
        'authList',
        'EMPLYOEE'
      ])
    },
    methods: {
      getfcategoryids() {
        return JSON.parse(localStorage.obj).map(v => v.fcategoryid);
      },
      assignAuth(auth) {
        this.$refs.ListCt.checkList.push(auth.filter(item=> item === '1'));
      },
      getAuthListByCategory(fcategoryid) {
        authService.getAuthListByCategory({
          fcategoryid
        }).then(res => {
          if (res.success) {
            this.employeesList = res.data.userList;
            this.$refs.ListCo.DupData = JSON.parse(JSON.stringify(this.employeesList));
            if (this.employeesList.length > 0) {
              let authArr = this.employeesList.map(v => { return v.auth; });
              this.$refs.ListCo.checkList = this.$refs.ListCo.DupData.map(v => {
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
          userList: this.$refs.ListCo.userList
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
        this.$refs.ListCt.checkList = [];
        this.$refs.ListCo.checkList = [];
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
