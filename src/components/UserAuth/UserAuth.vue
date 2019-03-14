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
          :loading="loading"
          @change="changePage"
          @cellclick="modify"
          @selectAll="selectAll"
          @selectchange="handleSelectionChange"

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
          size: 20
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
    watch: {
      $route(to, from) {
        this.searchThisUserHavePers();
      }
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
          this.tmpData = JSON.parse(JSON.stringify(this.tableData));
          //this.pagination.total = res.data.total;
        }).catch(() => {
          this.$message1000('获取回收站信息错误', 'error');
        }).finally(() => {
          this.loading = false;
          this.categoryIds = [];
        });
      },
      // 点击 表格前的复选框
      handleSelectionChange(rows) {
        this.$store.dispatch("SaveData", rows);
        if (rows.length == 0) {
          this.tableData = JSON.parse(JSON.stringify(this.tmpData))
        }
      },
      // 手动勾选全选
      selectAll(rows) {
        this.$store.dispatch("SaveData", rows);
        if (rows.length == 0) {
          this.tableData = JSON.parse(JSON.stringify(this.tmpData))
        } 
      },
      modify(row, column, cell, event) {
        if (this.authData.length > 0) {
          let arr = this.authData.map(v => {
            return v.fcategoryid;
          })

          if (arr.indexOf(row.fcategoryid) > -1 ){
            let elem = this.tableData.filter(v => {
              return v.fcategoryid == row.fcategoryid
            })[0];
            let tmp = elem[column.property];

            elem[column.property] = tmp == "1" ? "0" : "1";
            console.log(elem)
          }
        }
      },
      save () {
        const params = {
          fuserid: this.$route.query.userId
        }
        params.authList = this.authData.map(v => {
          v.auth = new Array(6).fill(0);
          if (v.flook == "1") {
            v.auth[0] = 1
          }
          if (v.del == "1") {
            v.auth[1] = 1
          }
          if (v.fedit == "1") {
            v.auth[2] = 1
          }
          if (v.fdownload == "1") {
            v.auth[3] = 1
          }
          if (v.fnew == "1") {
            v.auth[4] = 1
          }
          if (v.fupload == "1") {
            v.auth[5] = 1
          }
          return {
            auth: v.auth,
            fcategoryid: v.fcategoryid
          };
        });
        console.log(params);
      },
      Delete() {
        const params = {
          fuserid: this.$route.query.userId
        }
        params.fcategoryid = this.authData.map(v => {
          return v.fcategoryid
        }).join(",");
        console.log(params);
      },
      cancel() {
        this.$refs.WTable.$children[0].clearSelection();
        this.tableData = JSON.parse(JSON.stringify(this.tmpData))
        this.$store.dispatch("SaveData", []);        
      },
    },
    created() {
      if (!this.$route.query.userId) {
        this.$router.push('/index/list');
      }
      this.searchThisUserHavePers();
    },
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
