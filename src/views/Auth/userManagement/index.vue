<template>
  <div class="recycle-container">
    <div class="recycle-container-header">
      <user-select ref="authManage" @post-userId="setUserId"></user-select>
      <div v-show="selectedAuthData.length > 0">
        <el-button size="medium" type="success" @click="save">保存</el-button>
        <el-button size="medium" type="warning" @click="cancel">取消</el-button>
        <el-button size="medium" type="danger" @click="deleteAuth">删除</el-button>
      </div>
    </div>
    <div class="recycle-container-content">
      <base-scrollbar>
        <base-table
          ref="authTable"
          :total="pagination.total"
          :page-no="pagination.currentPage"
          :page-size="pagination.size"
          :is-excep="true"
          :loading="loading"
          @change-page="changePage"
          @cellclick="modifyAuth"
          @select-all="handleSelectionChange"
          @selectchange="handleSelectionChange"
          :selection="'list'"
          :table-data="tableData"
          :table-columns="tableColumns">
        </base-table>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
  import categoryService from '@/api/service/category';
  import authService from '@/api/service/auth';
  import BaseTable from '@/components/base/baseTable.vue';
  import BaseScrollbar from '@/components/base/baseScrollbar.vue';
  import userSelect from './userSelect.vue';

  export default {
    name: 'UserManagement',
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
            prop: 'flook',
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
            prop: 'fdel',
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
            prop: 'fedit',
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
            prop: 'fdownload',
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
            prop: 'fupload',
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
            prop: 'fnew',
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
        pagination: {
          currentPage: 1,
          total: 0,
          size: 10
        },
        selectedAuthData: [],
        userId: ''
      };
    },
    components: {
      BaseTable,
      BaseScrollbar,
      userSelect
    },
    methods: {
      setUserId(val) {
        this.pagination.currentPage = 1;
        this.userId = val;
        this.getAuthTable();
      },
      changePage(val) {
        this.pagination.currentPage = val;
        this.getAuthTable();
      },
      getAuthTable() {
        this.loading = true;
        categoryService.searchThisUserHavePersByPage({
          fuserid: this.userId,
          pageSize: this.pagination.size,
          pageNum: this.pagination.currentPage
        }).then(res => {
          const { list, total } = res.data;
          this.tableData = list;
          this.pagination.total = Number(total);
          if (list.length === 0) {
            this.$message1000('数据为空', 'info');
          }
        }).catch(() => {
          this.$message1000('获取信息错误', 'error');
        }).finally(() => {
          this.loading = false;
        });
      },
      // 点击 表格前的复选框
      handleSelectionChange(rows) {
        this.selectedAuthData = rows;
      },
      modifyAuth(row, column) {
        if (this.selectedAuthData.length > 0) {
          const arr = this.selectedAuthData.map(v => v.fcategoryid);
          if (arr.includes(row.fcategoryid)) {
            row[column.property] = row[column.property] === "1" ? "0" : "1";
            const authMap = ['fdel', 'fedit', 'fdownload', 'fnew', 'fupload'];
            if (authMap.some(v => row[v] === '1')) {
              row.flook = "1";
            }
            if (authMap.every(v => row[v] === '0')) {
              row.flook = "0";
            }
          }
        }
      },
      save () {
        const authMap = ['flook', 'fdel', 'fedit', 'fdownload', 'fnew', 'fupload'];
        const authList = this.selectedAuthData.map(v => {
          const auth = authMap.map(authType=> v[authType].toString());
          return {
            auth: auth,
            fcategoryid: v.fcategoryid
          };
        });
        authService.updateUserAuth({
          fuserid: this.userId,
          authList: authList
        }).then(() => {
          this.selectedAuthData = [];
          this.getAuthTable();
        });
      },
      deleteAuth() {
        authService.delUserAuth({
          fuserid: this.userId,
          fcategoryid: this.selectedAuthData.map(v => v.fcategoryid)
        }).then(() => {
          this.selectedAuthData = [];
          this.getAuthTable();
        });
      },
      cancel() {
        this.$refs.authTable.$children[0].clearSelection();
        this.selectedAuthData = [];
        this.getAuthTable();
      },
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
