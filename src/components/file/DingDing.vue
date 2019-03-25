<template>
  <el-dialog
    title="钉钉群配置"
    :visible.sync="visible"
    @close="close"
    :close-on-click-modal="false"
    width="60vw">
    <el-card class="DD">
      <div class="DD_row">
        <label class="DD_label">请选择提醒类型：</label>
        <el-radio-group v-model="DDConfig.ftype" size="medium">
          <el-radio-button label="0">@指定人</el-radio-button>
          <el-radio-button label="1">@所有人</el-radio-button>
          <el-radio-button label="2">仅消息</el-radio-button>
        </el-radio-group>
      </div>
      <div class="DD_row DD_select" v-if="specificUser">
        <label class="DD_label">请选择员工：</label>
        <el-select v-model="userList" multiple filterable placeholder="请选择">
          <el-option
            v-for="item in allUserList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
          </el-option>
        </el-select>
      </div>
      <div class="DD_row">
        <label class="DD_label">钉钉群名称：</label>
        <div class="DD_input">
          <el-input
            v-model="DDConfig.dingGroupName"
            size="large"
            :disabled="fromRobotList"
            maxlength="40"></el-input>
          <div class="mar_left10">
            <el-button type="success" size="large" @click="openRobotsList">从已有机器人列表选择填充</el-button>
          </div>
        </div>
      </div>
      <div class="DD_row">
        <label class="DD_label">群机器人WebHook：</label>
        <div class="DD_input">
          <el-input
            v-model="DDConfig.dingWebHook"
            size="large"
            type="textarea"
            :rows="2"
            maxlength="200"
            :disabled="fromRobotList"></el-input>
        </div>
      </div>
      <div class="DD_row">
        <label class="DD_label">备注：</label>
        <div class="DD_input">
          <el-input v-model="DDConfig.remark" size="large" :disabled="fromRobotList" maxlength="100"></el-input>
        </div>
      </div>
      <div class="DD_row DD_submit">
        <div class="DD_input">
          <el-button type="success" size="large" @click="addFoldPushMan">提交</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="已有机器人列表"
      :visible.sync="robotsListVisible"
      custom-class="robot_list"
      width="60vw"
      append-to-body>
      <base-table
        stripe
        :table-data="robotList"
        :table-columns="robotListColumns">
      </base-table>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import BaseTable from "../base/baseTable";
  import dingDingPush from '@/api/service/DDPush';

  class DDConfig {
    dingGroupName = ''
    dingWebHook = ''
    flag = 0
    robotId = ''
    remark = ''
    ftype = '2'
  }

  export default {
    name: 'DingDing',
    components: {BaseTable},
    data() {
      return {
        visible: false,
        robotsListVisible: false,
        fromRobotList: false,
        submitType: 'create',
        allUserList: [],
        DDConfig: new DDConfig(),
        robotList: [],
        userList: [],
        robotListColumns: [
          {label: '群名称', prop: 'dingGroupName'},
          {label: 'WebHook地址', prop: 'dingWebHook', 'show-overflow-tooltip': true, width: 400},
          {label: '备注', prop: 'remark'},
          {label: '选择', width: 70, align: 'center',
            render: (h, {props: {row}}) => {
              return (
                <div class={`robot_check ${row.robotId === this.DDConfig.robotId ? 'robot_checked' : 'robot_unchecked'} `} onClick={this.fillRobotConfig.bind(this, row)}></div>
              );
            }},
        ]
      };
    },
    computed: {
      specificUser() {
        if (this.DDConfig.ftype === '0' && this.allUserList.length <= 0) {
          dingDingPush.getUserInfoByOrgId().then(res=>{
            this.allUserList = res.data;
          });
        }
        return this.DDConfig.ftype === '0';
      }
    },
    methods: {
      open() {
        const id = this.$store.getters.selectedData[0].fcategoryid;
        this.getDingConfigInfo(id).then(()=>{
          this.visible = true;
        });
      },
      close() {
        this.visible = false;
        this.DDConfig = new DDConfig();
        this.submitType = 'create';
        this.allUserList = [];
        this.fromRobotList = false;
      },
      openRobotsList() {
        dingDingPush.getRobotList().then(res=>{
          this.robotList = res.data;
        });
        this.robotsListVisible = true;
      },
      addFoldPushMan() {
        const foldId = this.$store.getters.selectedData[0].fcategoryid;
        const selectUserObjectList = this.allUserList.filter(item=>{
          for (const userItem of this.userList) {
            if (userItem === item.userId) {
              return userItem;
            }
          }
        });
        const values = {...this.DDConfig, foldId: foldId, userList: selectUserObjectList};
        if (this.submitType === 'create') {
          dingDingPush.addFoldPushMan(values).then(()=>{
            this.$message1000('配置成功', 'success');
          });
        } else {
          dingDingPush.updateFoldPushMan(values).then(()=>{
            this.$message1000('更新成功', 'success');
          });
        }
        this.close();
        this.$emit('action', 'refresh');
      },
      getDingConfigInfo(id) {
        return dingDingPush.getDingConfigInfo(id).then(res=>{
          if (res.data.dingCategoryId) {
            this.DDConfig = res.data;
            this.userList = res.data.userList.map(item=> item.userId);
            this.submitType = 'update';
            this.fromRobotList = true;
          }
        });
      },
      fillRobotConfig(row) {
        row.flag = 1;
        Object.assign(this.DDConfig, row);
        this.fromRobotList = true;
        setTimeout(()=>{
          this.robotsListVisible = false;
        }, 300);
      }
    },

  };
</script>

<style lang="scss" scoped>
  .mar_left10{
    margin-left: 10px;
  }
  .DD{
    &_row{
      line-height: 50px;
      display: flex;
      justify-content: flex-start;
    }
    &_label{
      width: 200px;
      font-size: 16px;
      font-weight: normal;
      color: #FF9966;
    }
    &_select{
      .el-select{
        flex-grow: 1;
      }
    }
    &_input{
      display: flex;
      flex-grow: 1;
      font-size: 14px;
      .el-textarea{
        font-family: Arial, "Heiti SC", "Microsoft Yahei";
        word-break: break-all;
      }
    }
    &_submit{
      .DD_input{
        justify-content: center;
        margin-top: 10px;
      }
    }
  }
  @media screen and (min-width: 1367px){
    .DD{
      &_label{
        width: 400px;
      }
    }
  }
  /deep/ .el-dialog__header {
    padding: 20px 20px 0 20px;
  }
  /deep/ .el-radio-group{
    line-height: 40px;
  }
</style>
<style lang="scss">
  .robot_check{
    width: 100%;
    height: 32px;
    background-size: 36px;
    background-repeat: no-repeat;
    background-position: 0;
  }
  .robot_checked{
    background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2300CCFF%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
  }
  .robot_unchecked{
    background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2300CCFF%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
  }
  .robot_list th{
    background-color: #f8f8f9;
    font-weight: normal;
    font-size: 16px;
  }
</style>
