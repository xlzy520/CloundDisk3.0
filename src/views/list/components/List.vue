<template>
  <div class="file-content" ref="fileContent" v-loading.fullscreen.lock="fullLoading">
    <base-scrollbar ref="scrollbar">
      <base-table
        ref="baseTable"
        :selection="'list'"
        :table-data="fileList"
        :table-columns="tableColumns"
        @selection-change="handleSelectionChange"
        @cell-dblclick="fileType"
        @row-contextmenu="showMenu">
      </base-table>
    </base-scrollbar>
  </div>
</template>

<script>
  import RenameFile from '@/components/file/RenameFile.vue';
  import {mapGetters} from 'vuex';
  import fileType from '@/mixins/fileType';
  import {formatSize, parseTime, sizeSort, nameSort} from '@/utils/index';
  import baseTable from '@/components/base/baseTable.vue';
  import baseScrollbar from '@/components/base/baseScrollbar.vue';

  export default {
    name: 'List',
    mixins: [fileType],
    props: {
      fileList: {
        require: true,
        type: Array
      }
    },
    data() {
      return {
        rows: [],
        tableColumns: [
          {
            label: '名称',
            prop: 'fname',
            width: 480,
            sortable: true,
            sortMethod: nameSort,
            render: (h, {props: {row}}) => {
              if (row.isEditor) {
                return <RenameFile type="List" onCancel-edit={() => this.$emit('cancel-edit')}
                        onConfirm-edit={fileName => this.$emit('confirm-edit', fileName)} />;
              } else if (row.isBindingDingRobot === '1') {
                return (
                  <div class="flex">
                    <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                    <img src="/img/robot.png" class="robot_img"/>
                    <span class="file-name" onClick={this.fileType.bind(this, row)} title={row.fname}>{row.fname}</span>
                  </div>
                );
              } else {
                return (
                  <div class="flex">
                    <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                    <span class="file-name" onClick={this.fileType.bind(this, row)} title={row.fname}>{row.fname}</span>
                  </div>
                );
              }
            }
          },
          {
            label: '修改时间',
            prop: 'fupdatetime',
            sortable: true,
            formatter: (row) => parseTime(row.fupdatetime)
          },
          {
            label: '大小',
            prop: 'fsize',
            sortable: true,
            sortMethod: sizeSort,
            formatter: row => {
              if (row.ffiletype !== 1 && row.fsize !== null && row.fsize) {
                return formatSize(row.fsize);
              }
              return '';
            }
          },
          {
            label: '创建者',
            prop: 'foperator'
          }
        ],
      };
    },
    components: {
      RenameFile,
      baseTable,
      baseScrollbar
    },
    computed: {
      ...mapGetters([
        'selectedData'
      ])
    },
    methods: {
      // 点击 表格前的复选框
      handleSelectionChange(rows) {
        this.rows = rows;
        if (this.fileList.length > 0) {
          if (this.fileList[0].faothority === 'newFolder') {
            this.fileList.shift();
            this.rows = [];
          } else {
            this.$store.dispatch('SetSelectedData', rows);
            this.$emit('action', 'context-menu', {visible: false});
            this.fileList.forEach(item => {
              if (item.isEditor !== undefined) {
                this.$set(item, 'isEditor', false);
              }
            });
          }
        }
      },
      // 注意element 版本
      showMenu(row, column, event) {
        event.preventDefault();
        this.$refs.baseTable.clickRow(row);
        let contextMenu = document.querySelector('.context-container');
        contextMenu.style.display = 'block';
        contextMenu.style.top = `${event.y > window.innerHeight * 2 / 3 ? event.y - contextMenu.clientHeight : event.y}px`;
        contextMenu.style.left = `${event.x}px`;
      },
      closeMenu(event) {
        let contextMenu = document.querySelector('.context-container');
        if (contextMenu && event.target.className !== 'context-menu-button') {
          contextMenu.style.display = 'none';
        }
      }
    },
    destroyed() {
      window.removeEventListener('mousemove', this.closeMenu);
    },
    mounted() {
      for (let item of this.selectedData) {
        this.$refs.baseTable.toggleRowSelection(item, true);
      }
      window.addEventListener("click", this.closeMenu);
    }
  };
</script>

<style lang="scss" scoped>
  .file-content {
    display: flex;
    flex-grow: 1;
    /deep/ .file-name {
      cursor: pointer;
      line-height: 2;
      user-select: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &:hover {
        color: #42b983;
      }
    }
    /deep/ .fileAddress {
      color: #1296db;
      text-decoration: underline;
      cursor: pointer;
      &:hover {
        text-decoration: none;
      }
    }
    /deep/ .robot_img {
      position: absolute;
      top: 4px;
      left: 26px;
      width: 18px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
</style>

