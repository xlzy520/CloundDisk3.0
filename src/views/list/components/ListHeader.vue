<template>
  <div class="list-head" @click="click">
    <div class="file-action">
      <div class="list-btn">
        <el-button type="primary" icon="el-icon-refresh" data-action="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-upload" data-action="upload">上传</el-button>
        <el-dropdown type="primary" @command="handleCommand">
          <el-button type="primary" icon="el-icon-plus">新建<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="newFolder">文件夹</el-dropdown-item>
            <el-dropdown-item divided command="newMarkdown">Markdown</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template v-for="item in actionConfig">
          <el-button type="primary" v-if="actionArray.find(ket => ket === item.value)" :icon="item.icon" :data-action="item.value">{{ item.label }}</el-button>
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
    <div class="back">
      <el-button type="success" plain size="mini" v-if="hasSearch" data-action="back">返回文件列表</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '../../../components/Breadcrumb.vue';
import actionConfig from './listHeaderConfig.js';
export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  props: {
    contextMenu: {
      type: Object,
      default: function () {
        return {visible: false, x: 0, y: 0};
      }
    },
    navList: {
      type: Array
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
      'hasSearch',
    ]),
    actionArray() {
      const folderCheckedCount = this.selectedData.filter(item => item.ffiletype === 1).length;
      if (this.selectedData.length > 1) {
        return folderCheckedCount === 0 ? ['copy', 'move', 'delete']
          : ['move', 'delete'];
      } else if (this.selectedData.length === 1) {
        return folderCheckedCount === 1 ? ['rename', 'move', 'delete', 'detail']
          : ['rename', 'copy', 'move', 'download', 'update', 'version', 'delete', 'detail'];
      } else {
        return [];
      }
    }
  },
  //  尽量
  watch: {
    actionArray() {
      this.$store.dispatch('changeActionArray', this.actionArray);
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

  .back{
    display: block;
    position: absolute;
    right: 50px;
    top: 45px;
  }
</style>
