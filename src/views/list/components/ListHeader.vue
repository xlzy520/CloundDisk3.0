<template>
  <div class="list-head" @click="click">
    <div class="file-action">
      <div class="list-btn">
        <el-button type="primary" icon="el-icon-refresh" data-action="refresh-tip">刷新</el-button>
        <el-button type="primary" icon="el-icon-upload" data-action="upload" v-if="authListHeader[4] === '1'">上传</el-button>
        <el-dropdown type="primary" @command="handleCommand" v-if="authListHeader[5] === '1'">
          <el-button type="primary" icon="el-icon-plus">新建<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="newFolder">文件夹</el-dropdown-item>
            <el-dropdown-item divided command="newMarkdown">Markdown</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template v-for="item in actionConfig">
          <el-button type="primary" v-if="actionArray.find(key => key === item.value)" :icon="item.icon" :data-action="item.value">{{ item.label }}</el-button>
        </template>
        <el-dropdown type="primary" @command="handleCommand" v-if="isRpShow" trigger="click">
          <el-button type="primary">RP操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="relevance">关联HTML</el-dropdown-item>
            <el-dropdown-item divided command="rebuild" v-show="isEnableBuild">
              重新生成预览地址
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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

export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  props: {
    navList: {
      type: Array
    },
    authListHeader: {
      type: Array,
    }
  },
  data () {
    return {
      actionConfig: actionConfig,
    };
  },
  computed: {
    ...mapGetters([
      'selectedData',
      'userData'
    ]),
    isRpShow() {
      return this.selectedData.length === 1 && this.selectedData[0].ffiletype === 12;
    },
    isEnableBuild() {
      return this.selectedData[0].fsize.slice(0, -1) < 6 * 1024 * 1024;
    },
    // 计算应显示哪些按钮
    actionArray() {
      // 选中的文件夹个数
      const {length: folderCheckedCount } = this.selectedData.filter(item => item.ffiletype === 1);
      const {length: selectedLength } = this.selectedData;
      // 最终权限
      //["查阅", "删除", "编辑", "下载", "上传", "新建"]
      const ownerAuth = this.getOwnerAuth(selectedLength); //根据选择文件数量设置当前拥有的权限
      const isAdmin = this.userData.utype > 0; //用户是否为管理员
      let actionArr;
      // 多个被选中
      if (selectedLength > 0) {
        if (selectedLength === 1) {
          actionArr = folderCheckedCount === 1 ? ['rename', 'move', 'delete', 'detail', 'share']
            : ['rename', 'copy', 'move', 'download', 'update', 'version', 'delete', 'detail', 'share'];
          if (isAdmin && folderCheckedCount === 1) {
            actionArr.push("dingDing");
          }
        } else {
          actionArr = folderCheckedCount === 0 ? ['copy', 'move', 'delete', 'download', 'share'] : ['move', 'delete', 'share'];
        }
        actionArr = this.calcAuth(ownerAuth, actionArr);
        if (isAdmin) actionArr.push("assign");
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
        case 'relevance':
          this.$emit('action', 'relevance');
          break;
        case 'rebuild':
          this.$emit('action', 'rebuild');
          break;
        default: return false;
      }
    },
    getOwnerAuth(length) {
      if (length === 0) {
        return [];
      } else if (length === 1) {
        return this.selectedData[0].auth;
      } else {
        return this.selectedData.map(v => v.auth).reduce((a, b)=>{
          return a.map((item, index) => {
            if (item !== b[index]) { //取选择的两个目标文件的权限，如有不同，以无权限代替
              return '0';
            }
            return item;
          });
        });
      }
    },
    calcAuth(ownerAuth, actionArr) {
      if (ownerAuth.length === 0) {
        return [];
      }
      if (ownerAuth[1] === '0') {
        actionArr = actionArr.filter(v => v !== 'delete');
      }
      if (ownerAuth[2] === '0') {
        actionArr = actionArr.filter(v => !['copy', 'move', 'rename', 'update'].includes(v));
      }
      if (ownerAuth[3] === '0') {
        actionArr = actionArr.filter(v => v !== 'download');
      }
      return actionArr;
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
