<template>
  <div class="base-table">
    <el-table
      ref="baseTable"
      highlight-current-row
      :data="tableData"
      @row-click="clickRow"
      @selection-change="handleSelectionChange"
      @cell-dblclick="dblclickRow"
      @row-contextmenu="showMenu">
      <el-table-column
        v-if="selection"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column v-for="col in columns"
                       v-if="!col.hide"
                       :key="col.label"
                       v-bind="col"
                       align="left"
                       header-align="left">
        <template slot-scope="scope"
                  v-if="col.component">
          <component :is="col.component"
                     v-bind="getCptBind(scope, col)">
          </component>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total>pageSize"
      class="pagination"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-size="pageSize"
      prev-text="上一页"
      next-text="下一页"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  //为无component列创建一个component
  const defaultComponent = function () {
    return {
      functional: true,
      render(h, {props: {row, col}, _v: text}) {
        const {formater} = col;
        const v = formater && formater(row, col) || row[col.prop] || '';
        return text && text(v) || v;
      }
    };
  };
  export default {
    name: 'base-table',
    props: {
      //是否有选择框
      selection: {
        type: String,
        default: ''
      },
      //表格数据
      tableData: {
        type: Array,
        default: []
      },
      //表格头部配置
      tableColumns: {
        type: Array,
        default: []
      },
      total: {
        type: Number,
        default: 0
      },
      //当前页码
      pageNo: {
        type: Number,
        default: 1
      },
      //当前页数据最多展示数量
      pageSize: {
        type: Number,
        default: 15
      },
    },
    data() {
      return {
        //处理后的表头数据
        columns: []
      };
    },
    mounted() {
      //处理表头数据
      this.columns = this.tableColumns.map(col => {
        let temp = defaultComponent();
        if (col.render) {
          temp.render = col.render;
        }
        return {
          ...col,
          component: temp
        };
      });
    },
    methods: {
      handleCurrentChange(val) {
        this.$emit('changePage', val);
      },
      getCptBind({row, column, $index}, col) {
        let index = $index;
        const props = {row, col, column, index};
        return props;
      },
      clickRow(row) {
        if (this.selection === 'list') {
          this.tableData.forEach(item => {
            item.fcategoryid === row.fcategoryid
              ? this.toggleRowSelection(row, true)
              : this.toggleRowSelection(item, false);
          });
        } else {
          this.toggleRowSelection(row);
        }
      },
      toggleRowSelection(row, boolean) {
        this.$refs.baseTable.toggleRowSelection(row, boolean);
      },
      showMenu(row, event) {
        this.$emit('row-contextmenu', {row, event});
      },
      dblclickRow(row) {
        this.$emit('cell-dblclick', row);
      },
      handleSelectionChange(select) {
        this.$emit('selection-change', select);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .base-table {
    width: 100%;
    /deep/ .double-row {
      background-color: #f6fdf3;
    }
    /deep/ .header-cell {
      background-color: #f4f5fb;
    }
    /deep/ .pagination.el-pagination {
      text-align: center;
      padding: 20px 20px;
      .btn-next, .btn-prev {
        background: #f7f7f7;
        border-radius: 2px;
        font-weight: normal;
        padding: 0 8px;
      }
      .btn-next{
        margin-left: 5px;
      }
      button:disabled {
        background: #f7f7f7;
      }
      button:disabled:hover {
        color: #c0c4cc;
        background: #f7f7f7;
        cursor: not-allowed;
      }
      button:hover, .el-pager li:hover {
        background: #1886e3;
        color: #d8d8d8;
      }
    }
    /deep/ .el-pager li {
      font-weight: lighter;
      border-radius: 2px;
      color: #4d4d4d;
      background: #f7f7f7;
      margin-left: 5px;
    }
  }
</style>
