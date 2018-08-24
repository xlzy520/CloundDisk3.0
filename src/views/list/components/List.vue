<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-scrollbar style="height: 80vh">
      <el-table
        ref="multipleTable"
        :data="fileList"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" sortable width="480px">
          <template slot-scope="scope">
            <div v-show="scope.row.isEditor">
             <rename-file v-if="selectedData.length >= 1"></rename-file>
            </div>
            <div v-show="!scope.row.isEditor">
              <svg-icon :icon-class="scope.row.ffiletype===1? 'folder': 'markdown'"></svg-icon>
              <span v-if="scope.row.ffiletype === 1"
                    class="fileName"
                    @click="nextDir(scope.row.fcategoryid)">{{ scope.row.fname }}</span>
              <span v-else="scope.row.ffiletype === 2"
                    class="fileName"
                    @click="seeDir(scope.row.fcategoryid)">{{ scope.row.fname }}</span>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="fupdatetime" label="修改时间" sortable width="165"></el-table-column>-->
        <el-table-column label="修改时间" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 1px">{{ scope.row.fupdatetime.split(':').slice(0,-1).join(':') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" sortable></el-table-column>
        <el-table-column prop="foperator" label="创建者"></el-table-column>
        <el-table-column prop="describe" label="描述"></el-table-column>
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
      // 点击获取下一级文件列表
      nextDir(fcategoryid) {
        this.$store.dispatch('GetCategory', fcategoryid)
        this.$store.dispatch('SetParentId', fcategoryid)
      },
      // 点击预览
      seeDir(fcategoryid) {

      },
      handleSelectionChange(rows) {
        this.$store.dispatch('GetSelectedData', rows)
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
  .cell .svg-icon{
    width: 2em;
    height: 2em;
    float: left;
  }

</style>

