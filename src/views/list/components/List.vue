<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-table
        ref="multipleTable"
        :data="fileList"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" sortable width="480px">
          <template slot-scope="scope">
            <div v-show="scope.row.isEditor" class="rename-edit">
              <el-input size="small" v-model="scope.row.fname" placeholder="请输入内容" ></el-input>
              <span>
                <el-button type="primary" icon="el-icon-check"></el-button>
                <el-button type="primary" icon="el-icon-close"></el-button>
              </span>
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
    </div>
  </div>
</template>

<script>
  // import { getCategory } from '@/api/file'
  import { mapGetters } from 'vuex'
  export default {
    name: 'List',
    props: {
      fileList: {
        require: true,
        type: Array
      }
    },
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
  .rename-edit{
    .el-button{
      padding: 0;
    }
    .el-button--primary {
      background-color: #409eff61;
    }
    .el-input{
      width: 350px;
      margin-right: 10px;
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

</style>

