<template>
  <div class="list-head" @click="click">
    <div class="file-action">
      <div class="list-btn">
        <el-button type="primary" icon="el-icon-refresh" data-action="refresh-tip">刷新</el-button>
        <el-button type="primary" icon="el-icon-upload" data-action="upload" v-if="authArr[4] === '1'">上传</el-button>
        <el-dropdown type="primary" @command="handleCommand" v-if="authArr[5] === '1'">
          <el-button type="primary" icon="el-icon-plus">新建<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="newFolder">文件夹</el-dropdown-item>
            <el-dropdown-item divided command="newMarkdown">Markdown</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template v-for="item in actionConfig">
          <el-button type="primary" v-if="actionArray.find(key => key === item.value)" :icon="item.icon" :data-action="item.value">{{ item.label }}</el-button>
        </template>
      </div>
    </div>
    <div class="action-wrap">
      <div class="item">
        <div class="action-item" data-action="List" title="列表">
          <svg-icon icon-class="list" class-name="icon" />
        </div>
      </div>
      <div class="item">
        <div class="action-item" data-action="Thumbnail" title="缩略图">
          <svg-icon icon-class="abbr" class-name="icon" />
        </div>
      </div>
    </div>
    <breadcrumb :nav-list="navList"></breadcrumb>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '../../../components/Breadcrumb.vue';
import actionConfig from './ListHeaderConfig.js';

// 计算按钮显示与否
function calc(limitsArr, actionArr) {
  if (limitsArr.length === 0) {
    return [];
  }
  switch (limitsArr[1]) {
    case "0":
      actionArr = actionArr.filter(v => v !== 'delete');
      break;
  }
  switch (limitsArr[2]) {
    case "0":
      actionArr = actionArr.filter(v => !['copy', 'move', 'rename', 'update'].includes(v));
      break;
  }
  switch (limitsArr[3]) {
    case "0":
      actionArr = actionArr.filter(v => v !== 'download');
      break;
  }
  return actionArr;
}

export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  props: {
    navList: {
      type: Array
    }
  },
  data () {
    return {
      actionConfig: actionConfig,
      limitsArr: []
    };
  },
  computed: {
    ...mapGetters([
      'selectedData',
      'userData',
      'authArr'
    ]),
    // 计算应显示哪些按钮
    actionArray() {
      // 选中的文件夹个数
      const folderCheckedCount = this.selectedData.filter(item => item.ffiletype === 1).length;
      // 最终权限
      //["查阅", "删除", "编辑", "下载", "上传", "新建"]
      if (this.selectedData.length === 0) {
        this.limitsArr = [];
      } else {
        if (this.selectedData[0].hasOwnProperty("auth")) {
          if (this.selectedData.length > 1) {
            this.limitsArr = this.selectedData.map(v => { return v.auth; }).reduce((a, b)=>{
              /**
               * 取选择的两个目标文件的权限，如有不同，以无权限代替
               */
              return a.map((item, index) => {
                if (item !== b[index]) {
                  return '0';
                }
                return item;
              });
            });
          } else {
            this.limitsArr = this.selectedData[0].auth;
          }
        }
      }
      // 用户是否为管理员
      const isAdmin = this.userData.utype > 0;
      let actionArr;
      // 多个被选中
      if (this.selectedData.length > 1) {
        actionArr = folderCheckedCount === 0 ? ['copy', 'move', 'delete', 'download', 'share'] : ['move', 'delete', 'share'];
        actionArr = calc(this.limitsArr, actionArr);
        if (isAdmin) {
          actionArr = actionArr.concat("assign");
        }
      // 单个被选中
      } else if (this.selectedData.length === 1) {
        actionArr = folderCheckedCount === 1 ? ['rename', 'move', 'delete', 'detail', 'share']
          : ['rename', 'copy', 'move', 'download', 'update', 'version', 'delete', 'detail', 'share'];
        actionArr = calc(this.limitsArr, actionArr);
        if (isAdmin) {
          actionArr = actionArr.concat("assign");
        }
        if (isAdmin && folderCheckedCount === 1) {
          actionArr = actionArr.concat("dingDing");
        }
      } else {
        actionArr = [];
      }
      this.$store.dispatch('changeActionArray', actionArr);
      return actionArr;
    }
  },
  methods: {
    click({ target }) {
      const action = target.getAttribute('data-action') ||
        target.parentElement.getAttribute('data-action') ||
        target.parentElement.parentElement.getAttribute('data-action');
      if (action) {
        this.$emit('action', action);
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'newFolder':
          this.$emit('action', 'newFolder');
          break;
        case 'newMarkdown':
          this.$emit('action', 'newMD');
          break;
        default: return false;
      }
    }
  }
};
</script>

<style lang="scss">
  .list-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fafafa;
    padding: 10px 20px 10px 20px;
    .list-btn {
      text-align: left;
      .el-button {
        padding: 6px 8px;
      }
      @media screen and (max-width: 1367px){
        .el-button {
          padding: 3px 4px;
        }
      }
      .el-dropdown{
        margin: 0 10px;
      }
    }
  }
  .action-wrap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 28px;
      padding-right: 40px;
      .action-item {
        .icon {
          width: 24px;
          height: 24px;
          margin: 0 10px;
          cursor: pointer;
        }
      }
    }
  @media screen and (max-width: 1367px){
    .action-wrap {
      height: 24px;
    }
  }
</style>
