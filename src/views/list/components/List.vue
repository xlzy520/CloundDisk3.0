<template>
  <div class="file-content" ref="fileContent">
    <base-scrollbar ref="scrollbar">
      <base-table
        ref="baseTable"
        :selection="'list'"
        :table-data="fileList"
        :table-columns="tableColumns"
        @selection-change="handleSelectionChange"
        @cell-dblclick="dblclickRow"
        @row-contextmenu="showMenu">
      </base-table>
    </base-scrollbar>
  </div>
</template>

<script>
  import RenameFile from '@/components/RenameFile.vue';
  import { mapGetters } from 'vuex';
  import fileType from '@/mixins/fileType';
  import { formatSize, parseTime, sizeSort, nameSort} from '@/utils/index';
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
                return <RenameFile type="List" />;
              } else {
                return (
                  <div>
                    <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                    <span class="file-name" onClick={this.fileType.bind(this, row)}>{ row.fname }</span>
                  </div>
                );
              }
            }
          },
          {
            label: '修改时间',
            prop: 'fupdatetime',
            sortable: true,
            formater: (row, col) => parseTime(row[col.prop])
          },
          {
            label: '大小',
            prop: 'fsize',
            sortable: true,
            sortMethod: sizeSort,
            formater: (row, col) => {
              if (row.ffiletype !== 1) {
                return formatSize(Number(row[col.prop].replace('B', '')));
              }
              return '';
            }
          },
          {
            label: '创建者',
            prop: 'foperator',
            hide: this.hasSearch,
          },
          {
            label: '所在目录',
            hide: !this.hasSearch,
            render: (h, {props: {row}}) => {
              return (
                <span class="fileAddress" onClick={this.enterParentDic.bind(this, row)} key={row.fcategoryid}>文件位置</span>
              );
            }
          },
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
        'selectedData', 'hasSearch'
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
            this.$store.dispatch('RightTogglemenuVisible', [false]);
            this.fileList.forEach(item => {
              if (item.isEditor !== undefined) {
                this.$set(item, 'isEditor', false);
              }
            });
          }
        }
      },
      dblclickRow(row) {
        this.fileType(row);
      },
      async enterParentDic(searchObj) {
        await this.$store.dispatch('SetSelectedData', [searchObj]);
        await this.$store.dispatch('ToggleSearch', false);
        await this.$store.dispatch('GetCategory', searchObj.fparentid).then((res) => {
          if (res.success) {
            const searchIndex = this.fileList.findIndex(item => {
              return item.fcategoryid === searchObj.fcategoryid;
            });
            if (searchIndex !== -1) {
              this.rows.push(searchIndex);
              this.$refs.baseTable.toggleRowSelection(this.fileList[searchIndex]);
              const elScrollBar = this.$refs['scrollbar'].$refs['elscrollbar'].$refs['wrap'];
              this.$nextTick(() => {
                elScrollBar.scrollTop = (53) * searchIndex;
              });
            } else {
              this.$message1000('源文件未找到，文件可能已经被删除', 'info');
            }
          }
        });
      },
      showMenu({row, event}) {
        event.preventDefault();
        const x = event.clientX;
        let y = '';
        if (event.clientY <= (window.innerHeight / 2)) {
          y = event.clientY;
        } else {
          y = event.clientY - 273;
        }
        if (this.selectedData.length <= 1) {
          this.$refs.baseTable.clickRow(row);
        } else {
          this.$refs.baseTable.toggleRowSelection(row, true);
        }
        this.$store.dispatch('RightTogglemenuVisible', [true, x, y]);
        document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
          if (!document.getElementById('menu-btn').contains(e.target)) {
            this.$store.dispatch('RightTogglemenuVisible', [false]);
          }
        });
      },
    },
    mounted() {
      this.$store.dispatch('SetSelectedData', []);
    }
  };
</script>

<style lang="scss" scoped>
.file-content {
  position: relative;
  flex-grow: 1;
  display: flex;
  /deep/ .file-name{
    cursor: pointer;
    line-height: 2;
    user-select: none;
    &:hover{
      color: #42b983;
    }
  }
  /deep/ .fileAddress{
    color: #1296db;
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      text-decoration: none;
    }
  }
}
</style>

