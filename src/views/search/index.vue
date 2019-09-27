<template>
  <div class="search-container" v-loading.fullscreen.lock="fullLoading">
    <div class="search-container-content">
      <base-scrollbar>
        <base-table
          :total="pagination.total"
          :page-no="pagination.currentPage"
          :page-size="pagination.size"
          @change-page="changePage"
          :table-data="tableData"
          :table-columns="tableColumns">
        </base-table>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
  import { formatSize, parseTime, sizeSort, nameSort} from '@/utils/index';
  import baseTable from '../../components/base/baseTable.vue';
  import baseScrollbar from '../../components/base/baseScrollbar.vue';
  import fileType from '@/mixins/fileType';
  import fileService from '@/api/service/file';

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
            formatter: (row) => {
              if (row.fupdatetime) {
                return parseTime(row.fupdatetime);
              }
              return '';
            }
          },
          {
            label: '大小',
            prop: 'fsize',
            sortable: true,
            sortMethod: sizeSort,
            formatter: (row) => {
              if (row.ffiletype !== 1) {
                return formatSize(row.fsize);
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
                <span class="file-address" onClick={this.goParent.bind(this, row)}
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
      async getSearchList(query) {
        query = query ? query : this.$route.query;
        this.fullLoading = true;
        const {value, full} = query;
        const { currentPage } = this.pagination;
        try {
          const searchList = full
            ? await fileService.getFullTextSearchResult(value, currentPage)
              : await fileService.getSearchResult(value, currentPage);
          this.pagination = {
            currentPage: searchList.data.curPage,
            total: searchList.data.recordCount,
            size: 20
          };
          this.tableData = searchList.data.bookList;
          if (this.tableData.length === 0) {
            this.$message1000('搜索成功,搜索结果为空', 'info');
          } else {
            this.$message1000('搜索成功', 'success');
          }
        } finally {
          this.fullLoading = false;
        }
      },
      //搜索页返回文件列表页
      goParent(row) {
        this.$router.push(`/index/list?dirid=${row.fparentid}&origin=search&searchId=${row.fcategoryid}`);
      }
    },
    mounted() {
      this.getSearchList();
    },
    beforeRouteUpdate(to, from, next) {
      this.$nextTick(() => {
        this.getSearchList(to.query).then(()=>{
          next();
        });
      });
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
    /deep/ &-content {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .file-address{
        cursor: pointer;
        color: #1296dc;
        &:hover{
          text-decoration: underline;
        }
      }
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
