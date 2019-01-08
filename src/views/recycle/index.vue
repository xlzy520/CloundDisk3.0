<template>
  <div class="recycle-container">
    <div class="recycle-container-header">
      <div v-show="selected.length > 0">
        <el-button size="medium"  type="success" @click="revert" icon="el-icon-refresh">还原</el-button>
        <el-button size="medium" type="danger" @click="Delete" icon="el-icon-delete">删除</el-button>
      </div>
      <el-button size="medium" type="warning" @click="clear" icon="el-icon-delete">清空回收站</el-button>
    </div>
    <div class="recycle-container-content">
      <base-scrollbar>
        <base-table
          :total="pagination.total"
          :page-no="pagination.currentPage"
          :page-size="pagination.size"
          @change-page="changePage"
          :selection="'recycle'"
          :table-data="tableData"
          :table-columns="tableColumns"
          @selection-change="selectChange">
        </base-table>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
import recycleService from '@/api/service/recycle';
import { formatSize, parseTime, sizeSort } from '@/utils/index';
import BaseTable from '@/components/baseTable.vue';
import BaseScrollbar from '@/components/baseScrollbar.vue';
export default {
  name: 'Recycle',
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
                <svg-icon iconClass={String(row.ffiletype)}></svg-icon>
                <span class="file-name">{ row.fname }</span>
              </div>
            );
          }
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
            return null;
          }
        },
        {
          label: '删除时间',
          prop: 'fupdatetime',
          sortable: true,
          formatter: (row) => row.fupdatetime.replace('.0', '') },
        { label: '创建人', prop: 'foperator' },
        { label: '删除人', prop: 'fupdateor' },
      ],
      loading: false,
      selected: [],
      categoryids: [],
      pagination: {
        currentPage: 1,
        total: 0,
        size: 20
      }
    };
  },
  components: {BaseTable, BaseScrollbar},
  methods: {
    changePage(val) {
      this.pagination.currentPage = val;
      this.recycleList();
    },
    recycleList() {
      this.loading = true;
      recycleService.getRecycleList(this.pagination.currentPage).then(res=>{
        this.tableData = res.data.result;
        this.pagination.total = res.data.total;
      }).catch(()=>{
        this.$message1000('获取回收站信息错误', 'error');
      }).finally(()=>{
        this.loading = false;
      });
    },
    selectChange(select) {
      this.selected = select;
      this.categoryids = this.selected.map(item => item.fcategoryid);
    },
    revert() {
      this.$confirm('确认还原选中的文件？', '确认还原', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        recycleService.recycleRecover(this.categoryids).then(() => {
          this.$message1000('还原成功', 'success');
          this.recycleList();
        }).catch(() => {
          this.$message1000('还原失败', 'error');
        });
      });
    },
    Delete() {
      this.$confirm('文件删除后将无法恢复，您确认要彻底删除所选文件吗？', '彻底删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleService.recycleDelete(this.categoryids).then(() => {
          this.$message1000('删除成功', 'success');
          this.recycleList();
        }).catch(() => {
          this.$message1000('删除失败', 'error');
        });
      });
    },
    clear() {
      this.$confirm('清空回收站？', '清空回收站', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleService.recycleDelete(this.tableData.map(item => item.fcategoryid)).then(() => {
          this.$message1000('清空成功', 'success');
          this.recycleList();
        }).catch(() => {
          this.$message1000('清空失败', 'error');
        });
      });
    }
  },
  mounted() {
    this.recycleList();
  }
};
</script>

<style lang="scss" scoped>
.recycle-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &-header {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
  }
  &-content {
   @extend .recycle-container
  }
  /deep/ .file-name {
    cursor: pointer;
    line-height: 1.5;
    user-select: none;
  }
}
</style>
