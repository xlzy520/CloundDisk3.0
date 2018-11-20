<template>
  <div class="base-table">
    <el-table
      ref="baseTable"
      :data="tableData"
      highlight-current-row
      @row-click="clickRow"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
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
        v-bind="getColBind(col)"
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
  </div>
</template>
<script>
//为无component列创建一个component
const defaultComponent = function() {
  return {
    functional: true,
    render(h, { props: { row, col }, _v: text }) {
      const { formater } = col;
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
    tableRowClassName(row, index) {
      if (index % 2 === 1) {
        return 'gray-row';
      }
      return '';
    },
    getColBind(col) {
      const bind = Object.assign({}, col);
      delete bind.render;
      return bind;
    },
    getCptBind({ row, column, $index }, col) {
      let index = $index;
      const props = { row, col, column, index };
      return props;
    },
    clickRow(row) {
      if (this.selection === 'list') {
        this.tableData.forEach(item => {
          item.fcategoryid === row.fcategoryid
            ? this.$refs.baseTable.toggleRowSelection(row, true)
            : this.$refs.baseTable.toggleRowSelection(item, false);
        });
      } else {
        this.$refs.baseTable.toggleRowSelection(row);
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
  .gray-row {
    background-color: #f4f5fb;
  }
}
</style>