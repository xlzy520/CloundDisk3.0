<template>
  <div>
    <div class="fullsearch-top">
      <div class="left">
        关键词“<span style="color: #a00;">{{word}}</span>”的搜索结果
        <a href="javascript:void(0)" class="clear-search" @click="clearTable">清空搜索结果</a>
      </div>
      <div class="right">
        <a href="javascript:void(0)" @click="backFileList">返回文件列表</a>
      </div>
      <div class="clearfix"></div>
    </div>
    <el-table
      :data="tableData"
      :height="tHeight+40"
      cell-class-name="fullsearch-cell"
      :empty-text="emptyTxt"
      stripe
      style="width: 100%">
      <el-table-column
        label="名称">
        <template slot-scope="scope">
          <div class="title"><img :src="fileIcon(scope.row.fileName, scope.row.fileType)"><span
            v-html="scope.row.fileName"></span></div>
          <div class="abstract"><span v-html="scope.row.abstract"></span></div>
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        width="160">
        <template slot-scope="scope">
          {{scope.row.edittime | time}}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="文件大小">
        <template slot-scope="scope">
                    <span v-if="scope.row.fileType==2">
                        {{scope.row.size | fileSize}}
                    </span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @:click="jumpFileList(scope.row.parentId)">文件位置</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: ['word', 'tHeight'],
    name: 'FullSearch',
    data() {
      return {
        tableData: [],
        emptyTxt: '暂无数据'
      }
    },

    methods: {
      searchWord() {
        this.tableData = []
        this.emptyTxt = '请稍候...'
      },

      clearTable() {
        this.tableData = []
      },

      backFileList() {

      },

      jumpFileList(id) {

      }
    }
  }
</script>

<style>
  .fullsearch-top {
    height: 36px;
    background: #fafafa;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    line-height: 36px;
  }

  .fullsearch-top .left {
    float: left;
    font-size: 12px;
    padding-left: 10px;
  }

  .fullsearch-top .left .clear-search {
    margin-left: 10px;
    color: #409eff;
    text-decoration: none;
  }

  .fullsearch-top .left .clear-search:hover {
    text-decoration: underline;
  }

  .fullsearch-top .right {
    width: 100px;
    float: right;
  }

  .fullsearch-top .right a {
    color: #a00;
    text-decoration: none;
    font-size: 12px;
  }

  .fullsearch-top .right a:hover {
    text-decoration: underline;
  }

  .fullsearch-top .clearfix {
    clear: both;
  }

  .fullsearch-cell a {
    font-size: 14px;
    text-decoration: none;
    color: #409eff;
  }

  .fullsearch-cell a:hover {
    text-decoration: underline;
  }

  .fullsearch-cell img {
    width: 16px;
    vertical-align: -10%;
    padding-right: 5px;
  }

  .fullsearch-cell .title {
    color: #333;
    font-size: 16px;
  }

  .fullsearch-cell .abstract {
    font-size: 12px;
    color: #888;
    text-indent: 21px;
  }
</style>
