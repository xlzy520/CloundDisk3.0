<template>
  <div class="base-table">
    <el-table
      ref="baseTable"
      highlight-current-row
      :data="tableData"
      :stripe="stripe"
      v-loading="loading"
      @row-click="clickRow"
      @select="handleSelection"
      @select-all="selectAll"
      @selection-change="handleSelectionChange"
      @cell-dblclick="dblclickRow"
      @cell-click="clickCell"
      @row-contextmenu="showMenu">
      <el-table-column
        v-if="selection"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="col in columns"
        v-if="!col.hidden"
        :key="col.label"
        v-bind="col">
        <template slot-scope="scope" v-if="col.component">
          <component :is="col.component" v-bind="getComponentBind(scope, col)">
          </component>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total>pageSize"
      class="pagination"
      background
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
        const {formatter} = col;
        const v = formatter && formatter(row, col) || row[col.prop] || '';
        return text && text(v) || v;
      }
    };
  };
  export default {
    name: 'BaseTable',
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
      stripe: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
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
      isExcep: {
        type: Boolean,
        default: false,
      }
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
        this.$emit('change-page', val);
      },
      // 使用v-bind展开props到组件上
      getComponentBind({row, column, $index}, col) {
        return {row, col, column, $index};
      },
      clickRow(row) {
        if (this.isExcep) {
          return;
        }
        if (this.selection === 'list') {
          this.tableData.forEach(item => {
            this.toggleRowSelection(item, item.fcategoryid === row.fcategoryid);
          });
        } else {
          this.toggleRowSelection(row);
        }
      },
      toggleRowSelection(row, boolean) {
        this.$refs.baseTable.toggleRowSelection(row, boolean);
      },
      showMenu(row, column, event) {
        this.$emit('row-contextmenu', row, column, event);
      },
      dblclickRow(row) {
        this.$emit('cell-dblclick', row);
      },
      clickCell(row, column, cell, event) {
        this.$emit('cellclick', row, column, cell, event);
      },
      handleSelectionChange(select) {
        this.$emit('selection-change', select);
      },
      handleSelection(select) {
        this.$emit('selectchange', select);
      },
      selectAll(select) {
        this.$emit('selectAll', select);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/styles/pagination.scss";
  .base-table {
    width: 100%;
    /deep/ .double-row {
      background-color: #f6fdf3;
    }
    /deep/ .header-cell {
      background-color: #f4f5fb;
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
