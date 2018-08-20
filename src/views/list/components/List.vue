<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="file-list">
      <el-table ref="multipleTable" :data="tableData" style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" sortable width="480px">
          <template slot-scope="scope">
            <span v-if="scope.row.fparentid"
                  @click="nextDir(scope.row.fcategoryid)">{{ scope.row.fcategoryname }}</span>
            <span v-else="!scope.row.fparentid"
                  @click="seeDir(scope.row.fcategoryid)">{{ scope.row.fcategoryname }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="fupdatetime" label="修改时间" sortable width="165"></el-table-column>-->
        <el-table-column label="修改时间" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.fupdatetime.split(':').slice(0,-1).join(':') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" sortable></el-table-column>
        <el-table-column prop="creator" label="创建者"></el-table-column>
        <el-table-column prop="describe" label="描述"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { getCategory } from '@/api/file'

  export default {
    name: 'fileList',
    data() {
      return {
        tableData: []
      }
    },
    // 初始获取顶层文件列表
    async mounted() {
      const CategoryInfo = await getCategory('1002')
      this.tableData = CategoryInfo.data.listCategory
      console.log(CategoryInfo)
    },
    methods: {
      // 点击获取下一级文件列表
      async nextDir(fcategoryid) {
        const CategoryInfo = await getCategory(fcategoryid)
        this.tableData = CategoryInfo.data.listCategory
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
</style>

