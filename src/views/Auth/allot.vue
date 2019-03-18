<!--  -->
<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="flexBox">
        <list-radio title="组织列表" :list-data="Grouplist" @groupnum-change="OrgIdChange"></list-radio>
        <list-checkbox title="员工列表" ref="listco" :list-data="Employeeslist" @member-change="MemberChange"></list-checkbox>
        <list-checkbox-two title="权限类型" ref="listct" :list-data="authTypes" @auth-change="AuthChange"></list-checkbox-two>
      </div>
    </base-scrollbar>
    <div class="handlerBox">
      <el-button type="primary" @click="save" :disabled="isClick" :loading="isClick">保存</el-button>
      <el-button type="warning" @click="Quit">取消</el-button>
    </div>
  </div>
</template>

<script>

import listRadio from './modules/listRadio.vue';
import listCheckbox from './modules/listCheckbox.vue';
import listCheckboxTwo from './modules/listCheckboxTwo.vue';
import authService from '@/api/service/auth.js';
import baseScrollbar from '@/components/baseScrollbar.vue';
import authData from './modules/authData.js';

export default {
  data () {
    return {
      Grouplist: [],
      Employeeslist: [],
      authTypes: authData.data,
      Auths: [],
      Members: []
    };
  },
  components: {
    listRadio,
    listCheckbox,
    listCheckboxTwo,
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
      return !(this.Auths.length > 0 && this.Members.length > 0);
    }
  },
  mounted() {
    this.getOrgList();
  },
  methods: {
    AuthChange(Auths) {
      this.Auths = Auths;
    },
    MemberChange(Members) {
      this.Members = Members;
    },
    getOrgList() {
      authService.getOrgList().then(res => {
        if (res.success) {
          this.Grouplist = res.data;
          for (let i in this.Grouplist) {
            this.Grouplist[i]['isSelected'] = false;
          }
        }
      });
    },
    OrgIdChange(val) {
      authService.getExcludeUserInfoByOrgId(val, this.fcategoryid).then(res => {
        if (res.success) {
          this.Employeeslist = res.data;
          this.$refs.listco.DupData = res.data;
        }
      });
    },
    save() {
      let params = {
        auth: this.Auths,
        fcategoryid: this.fcategoryid,
        userList: this.$refs.listco.userList
      };

      authService.giveAuthToUser(params).then(res => {
        if (res.success) {
          this.clear();
          this.$message1000("分配权限成功", 'success');
          setTimeout(() => {
            this.Quit();
          }, 50);
        }
      });
    },
    clear() {
      this.$refs.listco.checkList = [];
      this.$refs.listct.checkList = [];
    },
    Quit() {
      this.$router.go(-1);
    }
  }
};

</script>
<style lang="scss" scoped>
  
</style>