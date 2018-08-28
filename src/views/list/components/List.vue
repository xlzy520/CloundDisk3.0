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
              <svg-icon :icon-class="scope.row.ffiletype===1? 'folder': 'markdown'"></svg-icon>
              <span class="fileName"
                    @click="fileType(scope.row.ffiletype,scope.row.fcategoryid)">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 1px">{{ scope.row.fupdatetime.split(':').slice(0,-1).join(':') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fsize" label="大小" sortable></el-table-column>
        <el-table-column prop="foperator" label="创建者"></el-table-column>
      </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import RenameFile from '@/components/RenameFile'
  import { mapGetters } from 'vuex'
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
        'selectedData'
      ])
    },
    methods: {
      fileType(type, fcategoryid) {
        switch (type) {
          case 1:
            event.stopPropagation()
            this.$store.dispatch('GetCategory', fcategoryid)
            this.$store.dispatch('SetParentId', fcategoryid)
            break
          case 2:
            event.stopPropagation()
            this.$store.dispatch('TogglePreviewVisible')
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
        if (row.isEditor === true) {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        } else {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
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
  }
  .fileName{
    cursor: pointer;
    line-height: 2;
    &:hover{
      color: #42b983;
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .cell .svg-icon{
    width: 2em;
    height: 2em;
    float: left;
  }

</style>

