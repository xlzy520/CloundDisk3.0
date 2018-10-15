<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-scrollbar style="height: 80vh" ref="elscrollbar">
      <el-table
        ref="multipleTable"
        :data="fileList"
        style="width: 100%"
        :row-style="highlightRow"
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
        @cell-dblclick="dblclickRow"
        @row-contextmenu="showMenu"
        >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" width="480px" prop="fname" sortable>
          <template slot-scope="scope">
            <div v-if="scope.row.isEditor">
             <rename-file type="List"></rename-file>
            </div>
            <div v-else="!scope.row.isEditor">
              <svg-icon :icon-class="String(scope.row.ffiletype)"></svg-icon>
              <span class="fileName"
                    @click.stop="fileType(scope.row)">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" sortable prop="fupdatetime" :formatter="formatterTime"></el-table-column>
        <el-table-column label="大小" :formatter="sizeFormatter" sortable :sort-method="sizeSort"></el-table-column>
        <el-table-column prop="foperator" label="创建者" v-if="!hasSearch"></el-table-column>
        <el-table-column label="所在目录" v-if="hasSearch" key="zhibi">
          <template slot-scope="scope">
            <span class="fileAddress" @click.stop="enterParentDic(scope.row)" :key="scope.row.fcategoryid">文件位置</span>
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
        rows: []
      }
    },
    components: { RenameFile },
    computed: {
      ...mapGetters([
        'selectedData', 'hasSearch'
      ])
    },
    methods: {
      sizeSort(a, b) {
        if (a.fsize && b.fsize) {
          a = Number(a.fsize.replace('B', ''))
          b = Number(b.fsize.replace('B', ''))
          return (a - b)
        }
      },
      fileType({ ffiletype, fcategoryid, fversionsign }) {
        switch (ffiletype) {
          case 1:
            this.$store.dispatch('GetCategory', fcategoryid)
            this.$store.dispatch('SetParentId', fcategoryid)
            if (this.$router.path !== '/list/index') {
              this.$router.push({ path: `/list/index?`, query: { dirid: fcategoryid }})
            }
            break
          case 2:
            this.$store.dispatch('GetDocInfo', { fcategoryid, fversionsign })
            break
          case 3:
            console.log(fcategoryid)
            // TODO office编辑之后，文件系统中未设置成最新版本
            window.open(`http://192.168.2.91:9528/#/office?id=${fcategoryid}&vid=${fversionsign}`)
            break
          case 4:
            window.open(`http://192.168.2.91:9528/#/office?id=${fcategoryid}&vid=${fversionsign}`)
            break
          case 5:
            window.open(`http://192.168.2.91:9528/#/office?id=${fcategoryid}&vid=${fversionsign}`)
            break
          case 6:
            window.open(`http://192.168.2.171:8081/djcpsdocument/fileManager/previewPdf.do?id=${fcategoryid}`)
            break
          case 7:
            this.$store.dispatch('ToggleImgEditor', fcategoryid)
            break
        }
      },
      handleSelectionChange(rows) {
        this.rows = rows
        if (this.fileList.length > 0) {
          if (this.fileList[0].faothority === 'newFolder') {
            this.fileList.shift()
            this.rows = []
          } else {
            this.$store.dispatch('SetSelectedData', rows)
            this.$store.dispatch('RightTogglemenuVisible', [false])
            this.fileList.forEach(item => {
              if (item.isEditor !== undefined) {
                this.$set(item, 'isEditor', false)
              }
            })
          }
        }
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
        this.fileType(row)
      },
      highlightRow({ row }) {
        if (this.rows.includes(row)) {
          return {
            'background-color': '#d4ecff'
          }
        }
      },
      sizeFormatter(row) {
        if (row.fsize !== null) {
          return formatSize(Number(row.fsize.replace('B', '')))
        }
      },
      async enterParentDic(searchObj) {
        await this.$store.dispatch('SetSelectedData', [searchObj])
        await this.$store.dispatch('ToggleSearch', false)
        await this.$store.dispatch('GetCategory', searchObj.fparentid).then((res) => {
          if (res.success) {
            const searchIndex = this.fileList.findIndex((item) => {
              return item.fcategoryid === searchObj.fcategoryid
            })
            if (searchIndex !== -1) {
              this.rows.push(searchIndex)
              this.$refs.multipleTable.toggleRowSelection(this.fileList[searchIndex])
              const elScrollBar = this.$refs['elscrollbar'].$refs['wrap']
              this.$nextTick(() => {
                elScrollBar.scrollTop = (53) * searchIndex
              })
            } else {
              this.$message1000('源文件未找到，文件可能已经被删除', 'info')
            }
          }
        })
      },
      formatterTime({ fupdatetime }) {
        if (fupdatetime) {
          return parseTime(fupdatetime)
        }
      },
      showMenu(row, event) {
        event.preventDefault()
        const x = event.clientX
        let y = ''
        if (event.clientY <= (window.innerHeight / 2)) {
          y = event.clientY
        } else {
          y = event.clientY - 273
        }
        if (this.selectedData.length <= 1) {
          this.clickRow(row)
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        }
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
    user-select: none;
    .fileName{
      cursor: pointer;
      line-height: 2;
      &:hover{
        color: #42b983;
      }
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
    .el-table--enable-row-hover .el-table__body tr:hover>td {
      background-color: #ecf5ff;
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

