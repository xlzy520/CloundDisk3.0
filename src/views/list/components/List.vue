<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-table
        ref="multipleTable"
        :data="FileList"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}">

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="名称" sortable width="480px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.ffiletype===1? 'folder':scope.row.ffiletype"></svg-icon>
            <span v-if="scope.row.fparentid"
                  class="fileName"
                  @click="nextDir(scope.row.fcategoryid)">{{ scope.row.fname }}</span>
            <span v-else="!scope.row.fparentid"
                  class="fileName"
                  @click="seeDir(scope.row.fcategoryid)">{{ scope.row.fname }}</span>
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
  import { getCategory } from '@/api/file'

  export default {
    name: 'List',
    props: {
      FileList: {
        require: true,
        type: Array
      }
    },
    methods: {
      // 点击获取下一级文件列表
      async nextDir(fcategoryid) {
        const CategoryInfo = await getCategory(fcategoryid)
        this.FileList = CategoryInfo.data
      },
      // 点击预览
      seeDir(fcategoryid) {

      }
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

