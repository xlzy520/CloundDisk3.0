<!--  -->
<template>
  <div>
    <base-dialog ref="baseDialog" title="您将分享该目录或者文件给指定分享人" width="40vw" @close="close" @comfirm="Debouncecomfirm" :is-click="isClick">
      <el-form label-position="left" label-width="80px" class="FormBox">
        <el-form-item label="组织列表">
          <el-select v-model="OrgID" placeholder="请选择" @change="OrgIdChange" class="pulldown">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.oname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工列表">
          <el-select 
            v-model="MemberID" 
            filterable 
            multiple
            :disabled="!OrgID"
            :remote-method="remoteMethod"
            :loading="loading" 
            class="pulldown"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in options2"
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
import debounce from 'lodash/debounce';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      loading: false,
      list: [],
      options: [],
      options2: [],
      OrgID: "",
      MemberID: [],
    };
  },
  components: {
    baseDialog
  },
  computed: mapState({
    fcategoryid: state => state.file.selectedData.map(v => {
      return v.fcategoryid;
    }).join(","),
    fcateList: function() {
      return this.fcategoryid.split(",").map(v => {
        return {
          fcategoryid: v
        };
      });
    },
    userList: function() {
      return this.options2.filter(v => {
        return this.MemberID.indexOf(v.userId) > -1;
      }).map(v => {
        return {
          userId: v.userId,
          userName: v.userName
        };
      });
    },
    isClick: function() {
      return !(this.OrgID && this.MemberID.length > 0);
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
          this.options = res.data;
        }
      });
    },
    OrgIdChange(val) {
      this.MemberID = [];
      pushService.getUserInfoByOrgId(val).then(res => {
        if (res.success) {
          this.options2 = res.data;
        }
      });
    },
    openDialog() {
      this.$refs.baseDialog.dialogVisible = true;
    },
    Debouncecomfirm: debounce(function() {
      this.comfirm();
    }, 500),
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
      this.OrgID = "";
      this.MemberID = "";
      this.$refs.baseDialog.dialogVisible = false;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options2 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options2 = [];
      }
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