<template>
  <div class="recycle-container">
    <div class="recycle-container-header">
      <div v-show="authData.length > 0">
        <el-button size="medium" type="success" @click="save" icon="el-icon-refresh">保存</el-button>
        <el-button size="medium" type="warning" @click="cancel" icon="el-icon-delete">取消</el-button>
        <el-button size="medium" type="danger" @click="Delete" icon="el-icon-delete">删除</el-button>
      </div>
    </div>
    <div class="recycle-container-content">
      <base-scrollbar>
        <base-table
          ref="WTable"
          :total="pagination.total"
          :page-no="pagination.currentPage"
          :page-size="pagination.size"
          :is-excep="true"
          :loading="loading"
          @change-page="changePage"
          @cellclick="modify"
          @select-all="selectAll"
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
  import BaseTable from '@/components/baseTable.vue';
  import BaseScrollbar from '@/components/baseScrollbar.vue';
  import { mapGetters } from 'vuex';

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
            prop: 'flook',
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
            prop: 'fdel',
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
            prop: 'fedit',
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
            prop: 'fdownload',
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
        categoryIds: [],
        pagination: {
          currentPage: 1,
          total: 0,
          size: 40
        },
        tmpData: [],
      };
    },
    components: {
      BaseTable,
      BaseScrollbar
    },
    computed: {
      ...mapGetters([
        'authData'
      ]),
    },
    methods: {
      changePage(val) {
        this.pagination.currentPage = val;
        this.searchThisUserHavePersByPage();
      },
      searchThisUserHavePersByPage(id = this.$route.query.userId) {
        this.loading = true;
        const params = {
          fuserid: id
        };
        params.pageSize = this.pagination.size;
        params.pageNum = this.pagination.currentPage;
        categoryService.searchThisUserHavePersByPage(params).then(res => {
          this.tableData = res.data.list;
          this.tmpData = JSON.parse(JSON.stringify(this.tableData));
          this.pagination.total = +res.data.total;
        }).catch(() => {
          this.$message1000('获取信息错误', 'error');
        }).finally(() => {
          this.loading = false;
          this.categoryIds = [];
        });
      },
      // 点击 表格前的复选框
      handleSelectionChange(rows) {
        this.$store.dispatch("SaveData", rows);
        if (rows.length === 0) {
          this.tableData = JSON.parse(JSON.stringify(this.tmpData));
        }
      },
      // 手动勾选全选
      selectAll(rows) {
        this.$store.dispatch("SaveData", rows);
        if (rows.length === 0) {
          this.tableData = JSON.parse(JSON.stringify(this.tmpData));
        }
      },
      modify(row, column) {
        if (this.authData.length > 0) {
          let arr = this.authData.map(v => {
            return v.fcategoryid;
          });

          if (arr.indexOf(row.fcategoryid) > -1) {
            let elem = this.tableData.filter(v => {
              return v.fcategoryid === row.fcategoryid;
            })[0];
            let tmp = elem[column.property];

            elem[column.property] = tmp === "1" ? "0" : "1";
            console.log(elem);
            if (elem.fdel === "1" || elem.fedit === "1" || elem.fdownload === "1" || elem.fnew === "1" || elem.fupload === "1") {
              elem.flook = "1";
            }

            if (elem.fdel === "0" && elem.fedit === "0" && elem.fdownload === "0" && elem.fnew === "0" && elem.fupload === "0") {
              elem.flook = "0";
            }
          }
        }
      },
      save () {
        const params = {
          fuserid: this.$route.query.userId
        };
        params.authList = this.authData.map(v => {
          v.auth = new Array(6).fill(0);
          if (v.flook === "1") {
            v.auth[0] = 1;
          }
          if (v.fdel === "1") {
            v.auth[1] = 1;
          }
          if (v.fedit === "1") {
            v.auth[2] = 1;
          }
          if (v.fdownload === "1") {
            v.auth[3] = 1;
          }
          if (v.fnew === "1") {
            v.auth[4] = 1;
          }
          if (v.fupload === "1") {
            v.auth[5] = 1;
          }
          return {
            auth: v.auth,
            fcategoryid: v.fcategoryid
          };
        });
        console.log(params);
        authService.updateUserAuth(params).then(res => {
          if (res.success) {
            this.$store.dispatch("SaveData", []);
            this.$refs.WTable.$children[0].clearSelection();
            this.searchThisUserHavePersByPage();
          }
        });
      },
      Delete() {
        const params = {
          fuserid: this.$route.query.userId
        };
        params.fcategoryid = this.authData.map(v => {
          return v.fcategoryid;
        }).join(",");
        authService.delUserAuth(params).then(res => {
          if (res.success) {
            this.$store.dispatch("SaveData", []);
            this.$refs.WTable.$children[0].clearSelection();
            this.searchThisUserHavePersByPage();
          }
        });
      },
      cancel() {
        this.$refs.WTable.$children[0].clearSelection();
        this.tableData = JSON.parse(JSON.stringify(this.tmpData));
        this.$store.dispatch("SaveData", []);
      },
    },
    created() {
      if (!this.$route.query.userId) {
        this.$router.push('/index/list');
      }
      this.searchThisUserHavePersByPage();
    },
    //  路由参数变化请求不同的文件列表
    beforeRouteUpdate(to, from, next) {
      this.searchThisUserHavePersByPage(to.query.userId);
      next();
    },
    beforeDestroy() {
      this.$store.dispatch("SaveData", []);
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
