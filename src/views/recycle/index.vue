<template>
  <div class="recycle-container">
    <div class="recycle-btns clearfix">
      <div class="recycle-btns-left" v-show="selected.length > 0">
        <el-button size="medium" @click="revert" icon="el-icon-refresh">还原</el-button>
        <el-button size="medium" @click="realDelete" icon="el-icon-delete">删除</el-button>
      </div>
      <div class="recycle-btns-right" :style="selected.length > 0? '': 'float: left'">
        <el-button size="medium" @click="clearRecycle" icon="el-icon-delete">清空回收站</el-button>
      </div>
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
        <el-table-column label="名称" width="480" prop="fname">
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
import { getRecycleList, recycleRecover, recycleDelete } from '@/api/recycle'
import { formatSize, parseTime } from '@/utils/index'
export default {
  name: 'Recycle',
  data() {
    return {
      recycleData: [],
      loading: false,
      selected: [],
      categoryids: []
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
      this.categoryids = []
      this.selected.forEach(item => {
        this.categoryids.push(item.fcategoryid)
      })
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
        recycleRecover(this.categoryids).then(res => {
          if (res.success === true) {
            this.$message1000('还原成功', 'success')
            window.location.reload()
          }
        }).catch(() => {
          this.$message1000('还原失败', 'error')
        })
      }).catch(() => {
        this.$message1000('已取消还原', 'info')
      })
    },
    realDelete() {
      this.$confirm('文件删除后将无法恢复，您确认要彻底删除所选文件吗？', '彻底删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleDelete(this.categoryids).then(res => {
          if (res.success === true) {
            this.$message1000('删除成功', 'success')
            window.location.reload()
          }
        }).catch(() => {
          this.$message1000('删除失败', 'error')
        })
      }).catch(() => {
        this.$message1000('已取消删除', 'info')
      })
    },
    clearRecycle() {
      this.categoryids = []
      this.recycleData.forEach(item => {
        this.categoryids.push(item.fcategoryid)
      })
      this.$confirm('清空回收站？', '清空回收站', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        recycleDelete(this.categoryids).then(res => {
          if (res.success === true) {
            this.$message1000('清空成功', 'success')
            window.location.reload()
          }
        }).catch(() => {
          this.$message1000('清空失败', 'error')
        })
      }).catch(() => {
        this.$message1000('已取消清空', 'info')
      })
    }
  },
  mounted() {
    this.RecycleList()
  }
}
</script>

<style lang="scss">
  .recycle-container{
    padding: 14px 24px 0 24px;
    .recycle-btns{
      padding: 5px 0;
      .recycle-btns-left{
        float: left;
      }
      .recycle-btns-right{
        float: right;
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
      background-color: #ecf5ff;
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
    .fileName {
      cursor: pointer;
      line-height: 2;
    }
  }

</style>
