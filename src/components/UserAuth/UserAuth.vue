<template>
  <div class="recycle-container">
    <div class="recycle-container-content">
      <base-scrollbar>
        <base-table
          :total="pagination.total"
          :page-no="pagination.currentPage"
          :page-size="pagination.size"
          :loading="loading"
          @change="changePage"
          :table-data="tableData"
          :table-columns="tableColumns">
        </base-table>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
  import categoryService from '@/api/service/category';
  import BaseTable from '@/components/baseTable.vue';
  import BaseScrollbar from '@/components/baseScrollbar.vue';

  export default {
    name: 'userAuth',
    data() {
      return {
        tableData: [],
        tableColumns: [
          {
            label: '名称',
            prop: 'fname',
            width: 480,
            sortable: true,
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={String(row.ffiletype)}/>
                  <span class="file-name">{row.fname}</span>
                </div>
              );
            }
          },
          {
            label: '查看',
            prop: 'fsize',
            sortable: true,
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.flook === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {
            label: '删除',
            prop: 'fsize',
            sortable: true,
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.fdel === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {
            label: '编辑',
            prop: 'fsize',
            sortable: true,
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.fedit === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {
            label: '下载',
            prop: 'fsize',
            sortable: true,
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.fdownload === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {
            label: '上传',
            prop: 'fsize',
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.fupload === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {
            label: '新建',
            prop: 'fsize',
            render(h, {props: {row}}) {
              return (
                <div>
                  <svg-icon iconClass={ row.fnew === "1" ? 'tick' : 'cross'}/>
                </div>
              );
            }
          },
          {label: '分享来源', prop: 'fusername'},
        ],
        loading: false,
        categoryIds: [],
        pagination: {
          currentPage: 1,
          total: 0,
          size: 20
        }
      };
    },
    components: {
      BaseTable,
      BaseScrollbar
    },
    methods: {
      changePage(val) {
        this.pagination.currentPage = val;
        this.searchThisUserHavePers();
      },
      searchThisUserHavePers() {
        this.loading = true;
        categoryService.searchThisUserHavePers(this.$route.query.userId).then(res => {
          this.tableData = res.data.list;
          //this.pagination.total = res.data.total;
        }).catch(() => {
          this.$message1000('获取回收站信息错误', 'error');
        }).finally(() => {
          this.loading = false;
          this.categoryIds = [];
        });
      },
    },
    created() {
      if (!this.$route.query.userId) {
        this.$router.push('/index/list');
      }
      this.searchThisUserHavePers();
    }
  };
</script>

<style lang="scss">
  @import "@/styles/mixin.scss";
  .recycle-container {
    @include flex_column;
    &-header {
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
    }
    &-content {
      @extend .recycle-container;
      .file-name {
        cursor: pointer;
        line-height: 1.5;
        user-select: none;
      }
    }
  }
</style>
