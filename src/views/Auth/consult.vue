<!--  -->
<template>
  <div>
    <base-scrollbar ref="scrollbar" class="scrollbar">
      <div class="flexBox">
        <list-checkbox title="员工列表" ref="ListCo" :list-data="listData2"></list-checkbox>
        <list-checkbox-two title="权限类型" ref="ListCt" :list-data="listData3" @auth-change="AuthChange"></list-checkbox-two>
      </div>
    </base-scrollbar>
    <div class="handlerBox">
      <el-button type="primary" @click="save" :disabled="isClick">保存</el-button>
      <el-button type="warning" @click="Quit">取消</el-button>
    </div>
  </div>
</template>

<script>
  import listCheckbox from './modules/listCheckbox.vue';
  import listCheckboxTwo from './modules/listCheckboxTwo.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';
  import authService from '@/api/service/auth.js';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    data () {
      return {
        isShowOrgList: "1",
        listData2: [],
        listData3: [
            {
            name: '查阅',
            fID: '0',
          },
          {
            name: '删除',
            fID: '1',
          },
          {
            name: '编辑',
            fID: '2',
          },
          {
            name: '下载',
            fID: '3',
          },
          {
            name: '上传',
            fID: '4',
          },
          {
            name: '新建',
            fID: '5',
          },
        ],
        Auths: [],
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
          }).join(",");
        },
        set: function() {}
      },
      isClick: function() {
        return !(this.Auths.length > 0 && this.$refs.ListCo.userList.length > 0);
      }
    },
    mounted() {
      this.getAuthListByCategory(this.fcategoryid);
    },
    methods: {
      AuthChange(arr) {
        this.Auths = arr;
      },
      assignAuth(auth) {
        this.Auths = auth;
        for (let i in auth) {
          if (auth[i] === "1") {
            this.$refs.ListCt.checkList.push(i);
          }
        }
      },
      getAuthListByCategory(fcategoryid) {
        authService.getAuthListByCategory(fcategoryid).then(res => {
          if (res.success) {
            this.listData2 = res.data.userList;
            this.$refs.ListCo.DupData = cloneDeep(this.listData2);
            // console.log(authArr);
            if (this.listData2.length > 0) {
              let authArr = this.listData2.map(v => { return v.auth; });
              // 员工列表 只有一人时
              if (this.listData2.length === 1) {
                this.$refs.ListCo.checkList = this.$refs.ListCo.DupData.map(v => {
                  return v.userId;
                });
                this.assignAuth(authArr[0]);
                return false;
              }
            }
            //   // 判断 auth数组是否存在和第一个元素 不同的元素
            //   let isEqual = !authArr.find(v => authArr[0].join() !== v.join());
            //   console.log(isEqual);
            //   // 只有 所有成员权限一致时
            //   if (isEqual) {
            //     this.assignAuth(authArr[0]);
            //   }
            // }
          }
        });
      },
      save() {
        let params = {
          auth: this.Auths,
          fcategoryid: this.fcategoryid,
          userList: this.$refs.ListCo.userList
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
        this.$refs.ListCo.checkList = [];
        this.$refs.ListCt.checkList = [];
      },
      Quit() {
        this.$router.go(-1);
      }
    }
  };

</script>
<style lang="scss" scoped>

</style>