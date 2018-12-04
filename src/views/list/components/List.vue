<template>
  <div class="file-content" ref="fileContent">
    <base-scrollbar ref="scrollbar">
      <base-table
        v-loading.fullscreen.lock="fullLoading"
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
  import RenameFile from '@/components/RenameFile.vue';
  import {mapGetters} from 'vuex';
  import fileType from '@/mixins/fileType';
  import {formatSize, parseTime, sizeSort, nameSort} from '@/utils/index';
  import baseTable from '@/components/baseTable.vue';
  import baseScrollbar from '@/components/baseScrollbar.vue';

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
                return <RenameFile type="List"
                                   onCancel-edit={() => this.$emit('cancel-edit')}
                                   onConfirm-edit={fileName => this.$emit('confirm-edit', fileName)}/>;
              } else {
                return (
                  <div>
                    <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                    <span class="file-name" onClick={this.fileType.bind(this, row)}>{row.fname}</span>
                  </div>
                );
              }
            }
          },
          {
            label: '修改时间',
            prop: 'fupdatetime',
            sortable: true,
            formatter: (row, col) => parseTime(row[col.prop])
          },
          {
            label: '大小',
            prop: 'fsize',
            sortable: true,
            sortMethod: sizeSort,
            formatter: (row, col) => {
              if (row.ffiletype !== 1) {
                return formatSize(Number(row[col.prop].replace('B', '')));
              }
              return '';
            }
          },
          {
            label: '创建者',
            prop: 'foperator',
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
      showMenu({row, event}) {
        event.preventDefault();
        this.$refs.baseTable.clickRow(row);
        let rightMenu = document.querySelector('.app-wrapper-right-menu');
        rightMenu.style.display = 'block';
        rightMenu.style.top = `${event.y > window.innerHeight * 2 / 3 ? event.y - rightMenu.clientHeight : event.y}px`;
        rightMenu.style.left = `${event.x}px`;
      },
      closeMenu(event) {
        let rightMenu = document.querySelector('.app-wrapper-right-menu');
        if (rightMenu && event.target.className !== 'right-menu-button') {
          rightMenu.style.display = 'none';
        }
      },
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
    position: relative;
    flex-grow: 1;
    display: flex;
    /deep/ .file-name {
      cursor: pointer;
      line-height: 2;
      user-select: none;
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
    &-menu {
      position: absolute;
    }
  }
</style>

