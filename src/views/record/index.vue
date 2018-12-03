<template>
  <div class="record-wrap">
    <div class="record-filter">
      <el-form :inline="true">
        <el-form-item label="时间筛选:">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型:">
          <el-select v-model="operationType" placeholder="请选择">
            <el-option
              v-for="item in operationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作者：">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="record-content">
      <el-scrollbar class="height100">
        <el-table
          :data="tableData" stripe>
          <el-table-column prop="fupdatetime" label="操作时间" width="240"></el-table-column>
          <el-table-column prop="foperator" label="操作者" width="120"></el-table-column>
          <el-table-column prop="foperationtype" label="操作类型" width="120" :formatter="formatterType"></el-table-column>
          <el-table-column prop="fname" label="操作对象" width="240" :formatter="formatterObj"></el-table-column>
          <el-table-column prop="fevent" label="详情" :formatter="formatterDetail"></el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import recordService from '@/api/service/record.js';

  export default {
    name: 'index',
    data() {
      return {
        tableData: [],
        time: '',
        operationType: '',
        operationOptions: [
          { label: '上传文件', value: 1 },
          { label: '下载文件', value: 2 },
          { label: '名称修改', value: 3 },
          { label: '文档移动', value: 4 },
          { label: '文档复制', value: 5 },
          { label: '文件删除', value: 6 },
          { label: '文件夹新增', value: 7 },
          { label: '文件更新上传', value: 8 },
          { label: '回收站恢复', value: 9 },
          { label: '回收站删除', value: 10 },
          { label: '上传文件夹', value: 11 }
        ]
      };
    },
    methods: {
      async getRecord() {
        try {
          const res = await recordService.getAllOperationRecord();
          this.tableData = res.data;
        } catch (e) {
          this.$message1000(e.message, 'error');
        }
      },
      formatterType({ foperationtype }) {
        return this.operationOptions[foperationtype - 1].label;
      },
      formatterObj({ fname, fevent }) {
        const urlJson = JSON.parse(fevent);
        const fidArr = Object.keys(urlJson);
        const { length } = fidArr;
        return (
          <router-link to={`/list/index?dirid=${fidArr[length - 1]}`} class='record-fileName'>{fname}</router-link>
        );
      },
      // formatterDetail(rows) {
      //   // const {fupdatetime, foperator, foperationtype, fname, fid, fevent } = rows
      // },
      onSubmit() {

      }
    },
    mounted() {
      this.getRecord();
    }
  };
</script>

<style lang="scss">
  @import "@/styles/variables.scss";

  .record-wrap {
    padding: 20px 20px 0 20px;
    box-shadow: 12px 2px 12px 12px #888888;
    .record-filter {
      padding: 0 15px;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 220px !important;
      }
      .el-range-separator {
        padding: 0;
        width: 8%;
      }
    }
    .record-content {
      padding: 5px;
      .record-fileName{
        color: #00a5db;
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-scrollbar__thumb {
        background-color: $scrollbarBlue !important;
      }
    }
  }
</style>
