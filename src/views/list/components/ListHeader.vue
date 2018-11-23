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
        <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-edit-outline" data-action="rename">重命名</el-button>
        <el-button type="primary" v-if="[2, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="copy">复制到</el-button>
        <el-button type="primary" v-if="[1, 2, 3, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="move">移动到</el-button>
        <a ref="downloadBtn" v-if="[2, 4].indexOf(isShow) > -1" class="el-button el-button--primary el-icon-download" @click="downloadFile">下载</a>
        <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-edit" data-action="update">更新</el-button>
        <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-tickets" data-action="version">版本</el-button>
        <el-button type="primary" v-if="[1, 2, 3, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="delete">删除</el-button>
        <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-info" data-action="detail">详情</el-button>
      </div>
      <ul id="menu-btn" v-show="menuVisible" :style="{top:(coordinate[2]+'px'),left:(coordinate[1]+'px')}">
        <li :class="{disabled:!([2, 4].indexOf(isShow)  > -1)}" @click="downloadFile2">下载</li>
        <li :class="{disabled:!([2, 4, 5].indexOf(isShow)  > -1)}" data-action="copy">复制到</li>
        <li :class="{disabled:!([1, 2, 3, 4, 5].indexOf(isShow)  > -1)}" data-action="move">移动到</li>
        <li :class="{disabled:!([2, 4].indexOf(isShow) > -1)}" data-action="update">更新</li>
        <li :class="{disabled:!([2, 4].indexOf(isShow)  > -1)}" data-action="version">版本</li>
        <li :class="{disabled:!([1, 2, 4].indexOf(isShow)  > -1)}" data-action="rename">重命名</li>
        <li :class="{disabled:!([1, 2, 3, 4, 5].indexOf(isShow) > -1)}" data-action="delete">删除</li>
        <li :class="{disabled:!([1, 2, 4].indexOf(isShow)  > -1)}" data-action="detail">详情</li>
      </ul>
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
    <breadcrumb></breadcrumb>
    <div class="back2FileList">
      <el-button type="success" plain size="mini" v-if="hasSearch" data-action="back2FileList">返回文件列表</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '../../../components/Breadcrumb.vue';
export default {
  name: 'ListHeader',
  components: { Breadcrumb },
  computed: {
    ...mapGetters([
      'selectedData',
      'fileList',
      'parentId',
      'hasSearch',
      'menuVisible',
      'coordinate'
    ]),
    isShow() {
      const folderCheckedCount = this.selectedData.filter(item => item.ffiletype === 1).length;
      const markdownCheckedCount = this.selectedData.filter(item => item.ffiletype === 2).length;
      if (this.selectedData.length > 1) {
        if (folderCheckedCount === 0) return 5;
        else return 3;
      } else if (this.selectedData.length === 1) {
        if (folderCheckedCount === 1) return 1;
        else if (markdownCheckedCount === 1) return 2;
        else return 4;
      }
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
    newFolder() {
      this.$store.dispatch('Refresh').then(() => {
        this.fileList.unshift({
          faothority: 'newFolder',
          ffiletype: 1,
          fname: '新建文件夹',
          fsize: null
        });
        this.$set(this.fileList[0], 'isEditor', true);
        this.$store.dispatch('SetSelectedData', []);
      });
    },
    downloadFile() {
      this.$refs.downloadBtn.href = `/djcpsdocument/fileManager/downloadFile.do?id=${this.selectedData[0].fcategoryid}`;
      this.$refs.downloadBtn.download = this.selectedData[0].fname;
    },
    downloadFile2() {
      this.downloadFile();
      this.$refs.downloadBtn.click();
    },
    handleCommand(command) {
      switch (command) {
        case 'newFolder': this.newFolder(); break;
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
    #menu-btn{
      list-style: none;
      background: #fbfcff;
      line-height: 30px;
      width: 100px;
      text-align: center;
      border-radius: 4px;
      box-shadow: 0 2px 5px #a9a7a7;
      color: #000000;
      position: fixed;
      z-index: 200;
      li{
        cursor: pointer;
        &:hover{
          background: rgba(10,193,41,.8);
          color: #fff;
        }
      }
      .disabled {
        color: #bbbbbb;
        pointer-events: none;
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

  .back2FileList{
    display: block;
    position: absolute;
    right: 50px;
    top: 45px;
  }
</style>
