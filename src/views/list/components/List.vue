<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-scrollbar style="height: 80vh">
      <el-table
        ref="multipleTable"
        :data="fileList"
        style="width: 100%"
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        @row-click="clickRow">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" sortable width="480px">
          <template slot-scope="scope">
            <div v-show="scope.row.isEditor">
             <rename-file v-if="selectedData.length >= 1" type="List"></rename-file>
            </div>
            <div v-show="!scope.row.isEditor">
              <svg-icon :icon-class="String(scope.row.ffiletype)"></svg-icon>
              <span class="fileName"
                    @click.stop="fileType(scope.row.ffiletype,scope.row.fcategoryid)">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" sortable prop="fupdatetime" :formatter="formatterTime"></el-table-column>
        <el-table-column prop="fsize" label="大小" sortable :formatter="sizeFormatter"></el-table-column>
        <el-table-column prop="foperator" label="创建者" v-if="!hasSearch"></el-table-column>
        <el-table-column label="所在目录" v-if="hasSearch" key="zhibi">
          <template slot-scope="scope">
            <span class="fileAddress" @click="enterParentDic(scope.row.fparentid)" :key="scope.row.fcategoryid">文件位置</span>
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
            this.$store.dispatch('TogglePreviewVisible')
            console.log(fcategoryid)
            this.$store.dispatch('GetDocInfo', fcategoryid)
            break
        }
      },
      handleSelectionChange(rows) {
        this.$store.dispatch('GetSelectedData', rows)
        this.fileList.forEach(item => {
          if (item.isEditor !== undefined) {
            this.$set(item, 'isEditor', false)
          }
        })
      },
      clickRow(row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      sizeFormatter(row) {
        if (row.fsize !== null) {
          return formatSize(Number(row.fsize.replace('B', '')))
        }
      },
      enterParentDic(parentId) {
        event.stopPropagation()
        this.$store.dispatch('GetCategory', parentId)
        this.$store.dispatch('ToggleSearch', false)
      },
      formatterTime(row, column) {
        return parseTime(row.fupdatetime)
      }
    },
    mounted() {
      this.selectedData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
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
    &:hover{
      text-decoration: none;
    }
  }

</style>

