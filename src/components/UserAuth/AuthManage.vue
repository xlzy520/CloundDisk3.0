
<template>
  <div>
    <base-dialog
      ref="baseDialog"
      title="权限管理"
      width="40vw"
      @close="close"
      @confirm="confirm"
      :submit-disabled="!userId.length > 0"
      :submit-loading="loading"
      :is-click="isClick">
      <el-form
        label-position="left"
        label-width="80px"
        class="form-box">
        <el-form-item label="组织列表">
          <el-select v-model="groupNum"
            filterable
            placeholder="请选择"
            @change="groupNumChange"
            class="pull-down">
            <el-option v-for="item in groupList"
              :key="item.id"
              :label="item.oname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工列表">
          <el-select
            v-model="userId"
            filterable
            :disabled="!groupNum"
            class="pull-down"
            placeholder="请选择">
            <el-option v-for="item in employeeList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script>
import baseDialog from '../baseDialog.vue';
import pushService from '@/api/service/push';
import authService from '@/api/service/auth';
import { mapState } from 'vuex';

class AuthMan {
  groupList = []
  employeeList = []
  groupNum = ""
  userId = []
}
export default {
  data() {
    return {
      loading: false,
      ...new AuthMan()
    };
  },
  components: {
    baseDialog
  },
  computed: mapState({
    fcategoryid: state => state.file.selectedData.map(v => {
      return v.fcategoryid;
    }).join(","),
    userList: function () {
      return this.employeeList.filter(v => {
        return this.userId.indexOf(v.userId) > -1;
      }).map(v => {
        return {
          userId: v.userId,
          userName: v.userName
        };
      });
    },
    isClick: function () {
      return !(this.groupNum && this.userId.length > 0);
    }
  }),
  mounted() {
    this.getOrgList();
  },
  methods: {
    getOrgList() {
      authService.getOrgList().then(res => {
        this.groupList = res.data;
      });
    },
    groupNumChange(val) {
      this.userId = "";
      pushService.getUserInfoByOrgId(val).then(res => {
        this.employeeList = res.data;
      });
    },
    openDialog() {
      this.$refs.baseDialog.dialogVisible = true;
    },
    confirm() {
      this.$router.push(`/index/userAuth?userId=${this.userId}`);
      this.close();
    },
    close() {
      Object.assign(this, new AuthMan());
      this.$refs.baseDialog.dialogVisible = false;
    },
  }
};

</script>
<style lang="scss" scoped>
.form-box {
  padding: 20px;
  .pull-down {
    width: 80%;
  }
}
</style>
