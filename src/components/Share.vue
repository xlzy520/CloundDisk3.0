<!--  -->
<template>
  <div>
    <base-dialog
      ref="baseDialog"
      title="您将分享该目录或者文件给指定分享人"
      width="40vw"
      @close="close"
      @comfirm="comfirm"
      :is-click="isClick"
      :loading="isClick">
      <el-form label-position="left"
        label-width="80px"
        class="FormBox">
        <el-form-item label="组织列表">
          <el-select v-model="orgId"
            filterable
            placeholder="请选择"
            @change="orgIdChange"
            class="pulldown">
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
            :loading="loading"
            class="pulldown"
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
import baseDialog from './baseDialog.vue';
import pushService from '@/api/service/push.js';
import authService from '@/api/service/auth.js';
import fileService from '@/api/service/fileShare.js';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      list: [],
      groupList: [],
      employeeList: [],
      orgId: "",
      memberId: [],
    };
  },
  components: {
    baseDialog
  },
  computed: mapState({
    fcategoryid: state => state.file.selectedData.map(v => {
      return v.fcategoryid;
    }).join(","),
    fcateList: function () {
      return this.fcategoryid.split(",").map(v => {
        return {
          fcategoryid: v
        };
      });
    },
    userList: function () {
      return this.Employeelist.filter(v => {
        return this.memberId.indexOf(v.userId) > -1;
      }).map(v => {
        return {
          userId: v.userId,
          userName: v.userName
        };
      });
    },
    isClick: function () {
      return !(this.orgId && this.memberId.length > 0);
    }
  }),
  mounted() {
    this.getOrgList();
  },
  watch: {},
  methods: {
    getOrgList() {
      authService.getOrgList().then(res => {
        if (res.success) {
          this.groupList = res.data;
        }
      });
    },
    orgIdChange(val) {
      this.memberId = [];
      pushService.getUserInfoByorgId(val).then(res => {
        if (res.success) {
          this.employeeList = res.data;
        }
      });
    },
    openDialog() {
      this.$refs.baseDialog.dialogVisible = true;
    },
    // 点击分享按钮
    comfirm() {
      const params = {
        fcategoryid: this.fcateList,
        userList: this.userList,
      };

      fileService.shareFile(params).then(res => {
        if (res.success) {
          this.$message1000("分享文件成功", 'success');
          this.close();
        } else {
          this.$message1000(res.data.msg, 'error');
        }
      });
    },
    close() {
      this.orgId = "";
      this.memberId = "";
      this.$refs.baseDialog.dialogVisible = false;
    },
  }
};

</script>
<style lang="scss" scoped>
.FormBox {
  padding: 20px;

  .pulldown {
    width: 80%;
  }
}
</style>
