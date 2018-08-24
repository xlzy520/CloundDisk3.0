<template>
  <div>
    <div class="fullsearch-top">
      <div class="left">
        关键词“<span style="color: #a00;">{{word}}</span>”的搜索结果
        <a href="javascript:void(0)" class="clear-search" v-on:click="clearTable">清空搜索结果</a>
      </div>
      <div class="right">
        <a href="javascript:void(0)" v-on:click="backFileList">返回文件列表</a>
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
          <div class="title"><img v-bind:src="fileIcon(scope.row.fileName, scope.row.fileType)"><span
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
          <a href="javascript:void(0)" v-on:click="jumpFileList(scope.row.parentId)">文件位置</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Bus from './bus.js'
  import axios from 'axios'
  import { getFileExtendName } from '../common.js'

  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  var qs = require('qs')
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
        var that = this

        that.tableData = []
        that.emptyTxt = '请稍候...'
        var token = sessionStorage.getItem('token')
        axios.post('/app/file/fullsearch', qs.stringify({
          token: token,
          word: that.word
        })).then(function(response) {
          // console.log(response)
          that.emptyTxt = '暂无数据'
          if (response.data.status !== '0') {
            if (response.data.code !== '205') {
              that.$message({
                message: '服务器错误',
                type: 'error',
                duration: 3000
              })
            }
            return
          }
          that.tableData = response.data.files
          if (that.tableData == null) {
            that.tableData = []
          }
          if (that.tableData.length > 0) {
            Bus.hasSearchData = true
          }
        }).catch(function(response) {
          // console.log(response);
          that.$message({
            message: '无法连接服务器',
            type: 'error',
            duration: 3000
          })
          that.emptyTxt = '暂无数据'
        })
      },

      clearTable() {
        this.tableData = []
        Bus.hasSearchData = false
        Bus.$emit('clearSearchWord')
      },

      backFileList() {
        Bus.$emit('jumpFileList', -1)
      },

      jumpFileList(id) {
        Bus.$emit('jumpFileList', id)
      },

      fileIcon(fileName, fileType) {
        if (fileType === 1) {
          return require('../assets/icon/fold.png')
        }
        const fileExtend = getFileExtendName(fileName)
        if (fileExtend.length === 0) {
          return require('../assets/icon/file.png')
        }
        if (Bus.icons.indexOf(fileExtend) === -1) {
          return require('../assets/icon/file.png')
        }
        return require('../assets/icon/' + fileExtend + '.png')
      }
    },

    mounted() {
      var that = this
      Bus.$on('fullSearch2', function() {
        Bus.hasSearchData = false
        that.emptyTxt = '请稍候...'
        setTimeout(function() {
          that.searchWord()
        }, 300)
      })
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
