<!--  -->
<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="flexBox">
        <list-checkbox title="员工列表" ref="ListCo" :list-data="Employeeslist"></list-checkbox>
        <list-checkbox-two title="权限类型" ref="ListCt" :list-data="authTypes"></list-checkbox-two>
      </div>
    </base-scrollbar>
    <div class="handlerBox">
      <el-button type="primary" @click="save" :disabled="isClick" :loading="isloading">保存</el-button>
      <el-button type="warning" @click="Quit">取消</el-button>
    </div>
  </div>
</template>

<script>
  import listCheckbox from './modules/listCheckbox.vue';
  import listCheckboxTwo from './modules/listCheckboxTwo.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  import authService from '@/api/service/auth.js';
  import authData from './modules/authData.js';
  import { mapGetters } from "vuex";

  export default {
    data () {
      return {
        isShowOrgList: "1",
        Employeeslist: [],
        authTypes: authData.data,
        Auths: [],
        isloading: false,
      };
    },
    components: {
      listCheckboxTwo,
      listCheckbox,
      baseScrollbar
    },
    computed: {
      fcategoryid: {
        get: function() {
          return JSON.parse(localStorage.obj).map(v => {
            return v.fcategoryid;
          });
        },
        set: function() {}
      },
      isClick: function() {
        return !(this.authList.length > 0 && this.EMPLYOEE.length > 0);
      },
      ...mapGetters([
        'authList',
        'EMPLYOEE'
      ])
    },
    mounted() {
      this.getAuthListByCategory(this.fcategoryid);
    },
    methods: {
      assignAuth(auth) {
        for (let i in auth) {
          if (auth[i] === "1") {
            this.$refs.ListCt.checkList.push(i);
          }
        }
      },
      getAuthListByCategory(fcategoryid) {
        const params = {
          fcategoryid
        };
        authService.getAuthListByCategory(params).then(res => {
          if (res.success) {
            this.Employeeslist = res.data.userList;
            this.$refs.ListCo.DupData = JSON.parse(JSON.stringify(this.Employeeslist));
            if (this.Employeeslist.length > 0) {
              let authArr = this.Employeeslist.map(v => { return v.auth; });
              this.$refs.ListCo.checkList = this.$refs.ListCo.DupData.map(v => {
                return v.userId;
              });
              // 员工列表 只有一人时
              if (this.Employeeslist.length === 1) {
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
        let params = {
          auth: this.authList,
          fcategoryid: this.fcategoryid.join(","),
          userList: this.$refs.ListCo.userList
        };
        this.isloading = true;

        authService.giveAuthToUser(params).then(() => {
          this.isloading = false;
          this.clear();
          this.$message1000("分配权限成功", 'success');
          setTimeout(() => {
            this.Quit();
          }, 50);
        });
      },
      clear() {
        this.$refs.ListCt.checkList = [];
        this.$refs.ListCo.checkList = [];
      },
      Quit() {
        this.$router.go(-1);
      }
    }
  };

</script>
<style lang="scss" scoped>

</style>