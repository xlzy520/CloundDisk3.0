<template>
  <div class="recycle-container">
    <div class="recycle-btns" v-show="selected">
      <el-button size="medium" @click="realDelete">删除</el-button>
      <el-button size="medium" @click="revert">还原</el-button>
    </div>
    <el-scrollbar style="height: 83vh">
      <el-table
        ref="recycleTable"
        :data="recycleData"
        :row-style="highlightRow"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
        v-loading="loading" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" width="480px" prop="fname">
          <template slot-scope="scope">
            <div>
              <svg-icon :icon-class="String(scope.row.ffiletype)"></svg-icon>
              <span class="fileName">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="大小" prop="fsize" :formatter="sizeFormatter"></el-table-column>
        <el-table-column label="删除时间" prop="fupdatetime" :formatter="formatterTime"></el-table-column>
        <el-table-column label="创建人" prop="foperator"></el-table-column>
        <el-table-column label="删除人" prop="fupdateor"></el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
import { getRecycleList } from '@/api/recycle'
import { formatSize, parseTime } from '@/utils/index'
export default {
  name: 'Recycle',
  data() {
    return {
      recycleData: [],
      loading: false,
      selected: []
    }
  },
  methods: {
    async RecycleList() {
      this.loading = true
      try {
        const recycleList = await getRecycleList()
        this.recycleData = recycleList.data
      } catch (e) {
        this.$message1000('获取回收站信息错误', 'error')
      } finally {
        this.loading = false
      }
    },
    formatterTime(row) {
      if (row.fupdatetime) {
        return parseTime(row.fupdatetime)
      }
    },
    sizeFormatter(row) {
      if (row.fsize !== null) {
        return formatSize(Number(row.fsize.replace('B', '')))
      }
    },
    highlightRow({ row, rowIndex }) {
      if (this.selected.includes(row)) {
        return {
          'background-color': '#d4ecff'
        }
      }
    },
    handleSelectionChange(rows) {
      this.selected = rows
    },
    clickRow(row) {
      this.$refs.recycleTable.toggleRowSelection(row)
    },
    revert() {
      this.$confirm('确认还原选中的文件？', '确认还原', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$message1000('还原成功', 'success')
      }).catch(() => {
        this.$message1000('已取消还原', 'info')
      })
    },
    realDelete() {
      console.log(555)
    }
  },
  mounted() {
    this.RecycleList()
  }
}
</script>

<style lang="scss">
  .recycle-container{
    padding: 18px 24px 0 24px;
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }

</style>
