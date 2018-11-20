<template>
  <div class="recycle-container">
    <div class="recycle-container-button">
      <div class="recycle-container-button-left" v-show="selected.length > 0">
        <el-button size="medium" @click="revert" icon="el-icon-refresh">还原</el-button>
        <el-button size="medium" @click="realDelete" icon="el-icon-delete">删除</el-button>
      </div>
      <div :class="{'recycle-container-button-right': selected.length > 0}">
        <el-button size="medium" @click="clearRecycle" icon="el-icon-delete">清空回收站</el-button>
      </div>
    </div>
    <div class="recycle-container-content">
      <base-scrollbar>
        <base-table
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
import { getRecycleList, recycleRecover, recycleDelete } from '@/api/recycle';
import { formatSize, parseTime, sizeSort } from '@/utils/index';
import baseTable from '../../components/baseTable.vue';
import baseScrollbar from '../../components/baseScrollbar.vue';
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
          formater: (row, col) => formatSize(Number(row[col.prop].replace('B', '')))
        },
        {
          label: '删除时间',
          prop: 'fupdatetime',
          sortable: true,
          formater: (row, col) => parseTime(row[col.prop]) },
        { label: '创建人', prop: 'foperator' },
        { label: '删除人', prop: 'fupdateor' },
      ],
      loading: false,
      selected: [],
      categoryids: [],
    };
  },
  components: {
    baseTable,
    baseScrollbar
  },
  methods: {
    async RecycleList() {
      this.loading = true;
      this.tableData = [];
      try {
        let tableList = await getRecycleList();
        this.tableData = tableList.data;
      } catch (e) {
        this.$message1000('获取回收站信息错误', 'error');
      } finally {
        this.loading = false;
      }
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
        recycleRecover(this.categoryids).then(() => {
          this.$message1000('还原成功', 'success');
          this.RecycleList();
        }).catch(() => {
          this.$message1000('还原失败', 'error');
        });
      });
    },
    realDelete() {
      this.$confirm('文件删除后将无法恢复，您确认要彻底删除所选文件吗？', '彻底删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleDelete(this.categoryids).then(() => {
          this.$message1000('删除成功', 'success');
          this.RecycleList();
        }).catch(() => {
          this.$message1000('删除失败', 'error');
        });
      });
    },
    clearRecycle() {
      this.$confirm('清空回收站？', '清空回收站', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleDelete(this.tableData.map(item => item.fcategoryid)).then(() => {
          this.$message1000('清空成功', 'success');
          this.RecycleList();
        }).catch(() => {
          this.$message1000('清空失败', 'error');
        });
      });
    }
  },
  mounted() {
    this.RecycleList();
  }
};
</script>

<style lang="scss" scoped>
.recycle-container {
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
  }
}
</style>
