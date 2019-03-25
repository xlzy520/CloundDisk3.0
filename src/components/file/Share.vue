<template>
  <div>
    <base-dialog
      ref="baseDialog"
      title="将分享该目录或者文件给指定人"
      width="40vw"
      @close="close"
      @confirm="confirm"
      :submit-disabled="!memberId.length > 0"
      :submit-loading="loading">
      <el-form label-position="left"
        label-width="80px"
        class="form-box">
        <el-form-item label="组织列表">
          <el-select v-model="orgId"
            filterable
            placeholder="请选择"
            @change="orgIdChange"
            class="pull-down">
            <el-option v-for="item in groupList"
              :key="item.id"
              :label="item.oname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工列表">
          <el-select v-model="memberId"
            filterable
            multiple
            :disabled="!orgId"
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
import baseDialog from '../base/baseDialog.vue';
import pushService from '@/api/service/push';
import authService from '@/api/service/auth.js';
import fileService from '@/api/service/fileShare.js';
import { mapGetters } from 'vuex';

class ShareMan {
  groupList = []
  employeeList = []
  orgId = ""
  memberId = []
}
export default {
  data() {
    return {
      loading: false,
      ...new ShareMan()
    };
  },
  components: {
    baseDialog
  },
  computed: {
    ...mapGetters([
      'selectedData',
    ])
  },
  methods: {
    getOrgList() {
      authService.getOrgList().then(res => {
        this.groupList = res.data;
      });
    },
    orgIdChange(val) {
      this.memberId = [];
      pushService.getUserInfoByOrgId(val).then(res => {
        this.employeeList = res.data;
      });
    },
    open() {
      this.getOrgList();
      this.$refs.baseDialog.dialogVisible = true;
    },
    // 点击分享按钮
    confirm() {
      this.loading = true;
      const fcategoryIds = this.selectedData.map(item => item.fcategoryid);
      const userList = this.employeeList.filter(v => {
        return this.memberId.indexOf(v.userId) > -1;
      }).map(v => {
        return {
          userId: v.userId,
          userName: v.userName
        };
      });
      fileService.shareFile({
        fcategoryids: fcategoryIds,
        userList: userList,
      }).then(() => {
        this.$message1000("分享文件成功", 'success');
      }).finally(()=>{
        this.loading = false;
        this.close();
      });
    },
    close() {
      Object.assign(this, new ShareMan());
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
