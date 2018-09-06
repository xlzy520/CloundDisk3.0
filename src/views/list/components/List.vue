<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-scrollbar style="height: 80vh">
      <el-table
        ref="multipleTable"
        :data="fileList"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        :row-style="highlightRow"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
        @cell-dblclick="dblclickRow"
        @row-contextmenu="showMenu">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" width="480px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditor">
             <rename-file type="List"></rename-file>
            </div>
            <div v-else="!scope.row.isEditor">
              <svg-icon :icon-class="String(scope.row.ffiletype)"></svg-icon>
              <span class="fileName"
                    @click.stop="fileType(scope.row.ffiletype,scope.row.fcategoryid)">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" sortable prop="fupdatetime" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="fsize" label="大小" :formatter="sizeFormatter"></el-table-column>
        <el-table-column prop="foperator" label="创建者" v-if="!hasSearch"></el-table-column>
        <el-table-column label="所在目录" v-if="hasSearch" key="zhibi">
          <template slot-scope="scope">
            <span class="fileAddress" @click="enterParentDic(scope.row)" :key="scope.row.fcategoryid">文件位置</span>
          </template>
        </el-table-column>
      </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import RenameFile from '@/components/RenameFile'
  import { mapGetters } from 'vuex'
  import { formatSize, parseTime } from '@/utils/index'
  export default {
    name: 'List',
    props: {
      fileList: {
        require: true,
        type: Array
      }
    },
    data() {
      return {
        selectRow: []
      }
    },
    components: { RenameFile },
    computed: {
      ...mapGetters([
        'selectedData', 'hasSearch'
      ])
    },
    methods: {
      fileType(type, fcategoryid) {
        switch (type) {
          case 1:
            this.$store.dispatch('GetCategory', fcategoryid)
            this.$store.dispatch('SetParentId', fcategoryid)
            break
          case 2:
            this.$message({
              message: '只可以对markdown文件进行预览编辑哦 ',
              type: 'warning',
              duration: 1000
            })
            break
          case 3:
            this.$store.dispatch('GetDocInfo', fcategoryid)
            break
        }
      },
      handleSelectionChange(rows) {
        this.$store.dispatch('GetSelectedData', rows)
        this.$store.dispatch('RightTogglemenuVisible', [false])
        this.fileList.forEach(item => {
          if (item.isEditor !== undefined) {
            this.$set(item, 'isEditor', false)
          }
        })
        this.selectRow = []
        rows.forEach((item, index) => {
          this.selectRow.push(this.fileList.indexOf(item))
        })
      },
      clickRow(row) {
        this.fileList.forEach(item => {
          if (item.fcategoryid === row.fcategoryid) {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          } else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
          }
        })
      },
      dblclickRow(row) {
        this.fileType(row.ffiletype, row.fcategoryid)
      },
      highlightRow({ row, rowIndex }) {
        if (this.selectRow.includes(rowIndex)) {
          return {
            'background-color': '#ecf5ff'
          }
        }
      },
      sizeFormatter(row) {
        if (row.fsize !== null) {
          return formatSize(Number(row.fsize.replace('B', '')))
        }
      },
      enterParentDic(searchObj) {
        event.stopPropagation()
        this.$store.dispatch('GetCategory', searchObj.parentId)
        console.log(searchObj)
        this.$store.dispatch('GetSelectedData', searchObj)
        this.$store.dispatch('ToggleSearch', false)
      },
      formatterTime(row, column) {
        return parseTime(row.fupdatetime)
      },
      showMenu(row) {
        event.preventDefault()
        const x = event.clientX
        let y = ''
        if (event.clientY <= (window.innerHeight / 2)) {
          y = event.clientY
        } else {
          y = event.clientY - 213
        }
        this.clickRow(row)
        this.$store.dispatch('RightTogglemenuVisible', [true, x, y])
        document.getElementsByTagName('body')[0].addEventListener('click', (e) => {
          if (!document.getElementById('menu-btn').contains(e.target)) {
            this.$store.dispatch('RightTogglemenuVisible', [false])
          }
        })
      }
    },
    async mounted() {
      this.selectedData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    watch: {
    }
  }
</script>

<style lang="scss">
  .file-content {
    width: 100%;
    min-width: 980px;
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
      background-color: #ecf5ff;
    }
  }
  .fileName{
    cursor: pointer;
    line-height: 2;
    &:hover{
      color: #42b983;
    }
  }
  .cell .svg-icon{
    width: 2em;
    height: 2em;
    float: left;
  }
  .fileAddress{
    color: #1296db;
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      text-decoration: none;
    }
  }

</style>

