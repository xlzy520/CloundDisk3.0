<template>
  <div class="file-content clearfix" ref="fileContent">
    <div class="list-head">
      <div class="list-btn">
        <el-button type="primary" icon="el-icon-refresh">刷新</el-button>
        <el-button type="primary" icon="el-icon-upload">上传文件</el-button>
        <el-button type="primary" icon="el-icon-plus">新建文件夹</el-button>
        <el-button type="primary" icon="el-icon-document">预览</el-button>
        <el-button type="primary" icon="el-icon-download">下载</el-button>
        <el-button type="primary" icon="el-icon-edit">更新</el-button>
        <el-button type="primary" icon="el-icon-tickets">版本</el-button>
        <el-button type="primary" icon="el-icon-edit-outline">重命名</el-button>
        <el-button type="primary" icon="el-icon-delete">删除</el-button>
        <el-button type="primary" icon="el-icon-info">详情</el-button>
      </div>
      <div class="list-crumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">公司文件</el-breadcrumb-item>
          <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
          <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
          <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
        </el-breadcrumb>
      </div>
    </div>
    <div class="file-list">
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名称" sortable width="480px" >
          <template slot-scope="scope">
            <span v-if="scope.row.fparentid"  @click="nextDir(scope.row.fcategoryid)">{{ scope.row.fcategoryname }}</span>
            <span v-else="!scope.row.fparentid"  @click="seeDir(scope.row.fcategoryid)">{{ scope.row.fcategoryname }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="fupdatetime" label="修改时间" sortable width="165"></el-table-column>-->
        <el-table-column label="修改时间" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.fupdatetime.split(':').slice(0,-1).join(':') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" sortable ></el-table-column>
        <el-table-column prop="creator" label="创建者" ></el-table-column>
        <el-table-column prop="describe" label="描述" ></el-table-column>
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
      this.tableData = CategoryInfo.data.data
      console.log(CategoryInfo)
    },
    methods: {
      // 点击获取下一级文件列表
      async nextDir(fcategoryid) {
        const CategoryInfo = await getCategory(fcategoryid)
        this.tableData = CategoryInfo.data.data
      },
      // 点击预览
      seeDir(fcategoryid) {

      }
    }
  }
</script>

<style lang="scss">
  .file-content{
    width: 100%;
    min-width: 980px;
    .list-head{
      background: #ccc9c921;
      padding: 20px;
      .list-btn {
        text-align: left;
        .el-button {
          padding: 6px 8px;
        }
      }
      .list-crumb{
        margin-top: 15px;
      }
    }
  }
</style>

