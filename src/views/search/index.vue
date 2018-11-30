<template>
  <div class="search-container">
    <div class="search-container-content">
      <base-scrollbar>
        <base-table
          :total="pagination.total"
          :pageNo="pagination.currentPage"
          :pageSize="pagination.size"
          @changePage="changePage"
          :table-data="tableData"
          :table-columns="tableColumns">
        </base-table>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request';
  import { formatSize, parseTime, sizeSort, nameSort} from '@/utils/index';
  import baseTable from '../../components/baseTable.vue';
  import baseScrollbar from '../../components/baseScrollbar.vue';
  import fileType from '@/mixins/fileType';

  export default {
    name: 'Search',
    data() {
      return {
        tableData: [],
        tableColumns: [
          {
            label: '名称',
            prop: 'fname',
            width: 480,
            'show-overflow-tooltip': true,
            sortable: true,
            sortMethod: nameSort,
            render: (h, {props: {row}}) => {
                return (
                  <div>
                    <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                    <span class="file-name" onClick={this.fileType.bind(this, row)}>{row.fname}</span>
                  </div>
                );
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
            hide: this.hasSearch,
          },
          {
            label: '所在目录',
            render: (h, {props: {row}}) => {
              return (
                <span class="fileAddress" onClick={this.enterParentDic.bind(this, row)}
                      key={row.fcategoryid}>文件位置</span>
              );
            }
          },
        ],
        loading: false,
        pagination: {
          currentPage: 1,
          total: 0,
          size: 20
        }
      };
    },
    mixins: [fileType],
    components: {
      baseTable,
      baseScrollbar
    },
    methods: {
      changePage(val) {
        this.pagination.currentPage = val;
        this.getSearchList();
      },
      getSearchList() {
        this.loading = true;
        request.get('./static/search.json', this.$route.query.keyword).then(res=>{
          this.pagination = {
            currentPage: res.data.curPage,
            total: res.data.recordCount,
            size: 20
          };
          this.tableData = res.data.bookList;
        });
        // recycleService.getRecycleList(this.pagination.currentPage).then(res => {
        //   this.tableData = res.data.result;
        //   this.pagination.total = res.data.total;
        // }).catch(() => {
        //   this.$message1000('获取回收站信息错误', 'error');
        // }).finally(() => {
        //   this.loading = false;
        // });
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
      }, //搜索页返回文件列表页
    },
    mounted() {
      this.getSearchList();
    }
  };
</script>

<style lang="scss" scoped>
  .search-container {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    &-button {
      padding: 10px 20px;
      & > div {
        display: inline-block;
      }
      &-right {
        float: right;
      }
    }
    &-content {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    /deep/ .file-name {
      cursor: pointer;
      line-height: 2;
      user-select: none;
      &:hover{
        color: #42b983;
      }
    }
  }
</style>
