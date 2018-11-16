<template>
  <div class="list-head" @click="click">
    <div class="file-action">
      <div class="list-btn">
        <el-button type="primary" icon="el-icon-refresh" data-action="refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-upload" data-action="upload">上传</el-button>
        <el-dropdown type="primary" @command="handleCommand">
          <el-button type="primary"><i class="el-icon-plus"></i>&nbsp新建<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="newFolder">文件夹</el-dropdown-item>
            <el-dropdown-item divided command="newMarkdown">Markdown</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-edit-outline" data-action="rename">重命名</el-button>
        <el-button type="primary" v-if="[2, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="copyTo">复制到</el-button>
        <el-button type="primary" v-if="[1, 2, 3, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="moveTo">移动到</el-button>
        <a
          class="el-button el-button--primary"
          v-if="[2,4].indexOf(isShow) > -1"
          icon="el-icon-download"
          @click="downloadFile"
          ref="downloadBtn"><i class="el-icon-download"></i>下载</a>
        <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-edit" data-action="update">更新</el-button>
        <el-button type="primary" v-if="[2, 4].indexOf(isShow) > -1" icon="el-icon-tickets" data-action="version">版本</el-button>
        <el-button type="primary" v-if="[1, 2, 3, 4, 5].indexOf(isShow) > -1" icon="el-icon-delete" data-action="delete">删除</el-button>
        <el-button type="primary" v-if="[1, 2, 4].indexOf(isShow) > -1" icon="el-icon-info" data-action="detail">详情</el-button>
      </div>
      <ul id="menu-btn" v-show="menuVisible" :style="{top:(coordinate[2]+'px'),left:(coordinate[1]+'px')}">
        <li :class="{disabled:!([2, 4].indexOf(isShow)  > -1)}" @click="downloadFile2">下载</li>
        <li :class="{disabled:!([2, 4, 5].indexOf(isShow)  > -1)}" data-action="copyTo">复制到</li>
        <li :class="{disabled:!([1, 2, 3, 4, 5].indexOf(isShow)  > -1)}" data-action="moveTo">移动到</li>
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
          <svg-icon icon-class="list" className="icon" />
        </div>
      </div>
      <div class="item">
        <div class="action-item" data-action="Thumbnail" title="缩略图">
          <svg-icon icon-class="abbr" className="icon" />
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
      const fileCheckedCount = this.selectedData.filter(item => item.ffiletype === 2).length;
      const previewCheckedCount = this.selectedData.filter(item => item.ffiletype !== 1 && item.ffiletype !== 2).length;
      if (this.selectedData.length > 1) {
        if (folderCheckedCount === 0) {
          return 5;
        } else {
          return 3;
        }
      } else if (folderCheckedCount === 1 && fileCheckedCount === 0) {
        return 1;
      } else if (folderCheckedCount === 0 && fileCheckedCount === 1) {
        return 2;
      } else if (folderCheckedCount === 0 && fileCheckedCount === 0 && previewCheckedCount === 1) {
        return 4;
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
          fcategoryid: null,
          fcategorystatus: 1,
          fcreatetime: null,
          ffiletype: 1,
          fname: '新建文件夹',
          foperator: null,
          foperatorid: null,
          fparentid: null,
          fsize: null,
          fsortorder: null,
          fupdateor: null,
          fupdatetime: null,
          rowid: null
        });
        this.$set(this.fileList[0], 'isEditor', true);
        this.$store.dispatch('SetSelectedData', []);
      });
    },
    downloadFile() {
      this.$refs.downloadBtn.href = `${process.env.UPLOAD_API}/djcpsdocument/fileManager/downloadFile.do?id=${this.selectedData[0].fcategoryid}`;
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
          this.$store.dispatch('NewMarkdownFile');
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
      box-shadow: 0px 2px 5px #a9a7a7;
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
