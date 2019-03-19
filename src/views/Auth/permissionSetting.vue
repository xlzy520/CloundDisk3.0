<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="permission-content flex">
        <list-radio title="组织列表" :list-data="Grouplist" @groupnum-change="OrgIdChange"></list-radio>
        <list-checkbox title="员工列表" ref="ListCo" :list-data="Employeeslist"></list-checkbox>
        <list-checkbox-two title="权限类型" ref="ListCt" :list-data="authTypes"></list-checkbox-two>
      </div>
    </base-scrollbar>
    <div class="handler-box">
      <el-button type="primary" @click="save" :disabled="isClick" :loading="isloading">保存</el-button>
      <el-button type="warning" @click="cancel">取消</el-button>
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
import { mapGetters } from 'vuex';

export default {
  name: 'permission-setting',
  data () {
    return {
      Grouplist: [],
      Employeeslist: [],
      authTypes: authData.data,
      isloading: false,
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
          this.Grouplist = res.data;
          for (const item of this.Grouplist) {
            item['isSelected'] = false;
          }
        }
      });
    },
    OrgIdChange(val) {
      authService.getExcludeUserInfoByOrgId(val, this.fcategoryid).then(res => {
        if (res.success) {
          this.Employeeslist = res.data;
          this.$refs.ListCo.DupData = res.data;
        }
      });
    },
    save() {
      let params = {
        auth: this.authList,
        fcategoryid: this.fcategoryid,
        userList: this.$refs.ListCo.userList
      };
      this.isloading = true;

      authService.giveAuthToUser(params).then(res => {
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
    cancel() {
      this.$router.go(-1);
    }
  }
};

</script>
<style lang="scss">

</style>
