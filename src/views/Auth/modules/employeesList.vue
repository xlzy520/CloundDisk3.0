<template>
  <div class="list-checkbox flex">
    <div class="choice-box">
      <div class="list-checkbox-header">
        <span class="list-checkbox-title">员工列表</span>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          :disabled="isClick">全选</el-checkbox>
      </div>
      <div class="staff-box">
        <base-scrollbar class="scroll-box" :class="{ 'expand': listData.length > 30 }">
          <el-checkbox-group
            v-model="checkList"
            @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="item in listData"
              :class="{ active: item.hasAuth === '1' }"
              :label="item.userId"
              :key="item.userId"
              class="org-radio">
              {{ item.userName }}
            </el-checkbox>
          </el-checkbox-group>
        </base-scrollbar>
      </div>
    </div>
    <div class="employee-selected">
      <span>已选择员工：</span>
      <el-select
        v-model="checkList"
        multiple
        filterable
        reserve-keyword
        placeholder="请输入关键词"
        :loading="loading">
        <el-option
          v-for="item in listData"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import baseScrollbar from '@/components/baseScrollbar.vue';
import authService from '@/api/service/auth';
import { mapGetters } from "vuex";
// Todo 选择组织时，给员工列表增加loading
export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      checkList: [],
      checkAll: false,
      isIndeterminate: false,
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    isClick: function () {
      return this.listData.length === 0;
    },
    ...mapGetters([
      'groupNum'
    ])
  },
  mounted() {
    this.$store.dispatch('ChooseEmployee', this.checkList);
  },
  watch: {
    groupNum: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.checkList = [];
      }
    },
    checkList: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$store.dispatch('ChooseEmployee', this.checkList);
        if (this.checkList.length === this.listData.length) {
          this.checkAll = true;
        }
        if (this.checkList.length > 0) {
          this.searchThisCateWhoHavePer(this.checkList);
        }
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.listData.map(v => v.userId) : [];
      this.$forceUpdate();
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
      this.$store.dispatch('ChooseEmployee', this.checkList);
    },
    searchThisCateWhoHavePer(val) {
      const params = {
        fcategoryid: JSON.parse(localStorage.obj).map(v => {
          return v.fcategoryid;
        }).join(","),
        fuserList: val,
      };
      authService.searchThisCateWhoHavePer(params).then(res => {
        if (res.success) {
          if (res.data.length > 0) {
            // 搜索单个
            let authArr = res.data.map(v => {
              return v.auth;
            });
            // 判断二维数组中 是否有元素和第一个元素不相同，存在就为false，若只有一个元素，则true
            let isEqual = !authArr.find(v => authArr[0].join() !== v.join());
            if (isEqual) {
              this.transmit(authArr[0]);
            } else {
              this.transmit(new Array(6).fill(0));
            }
          }
        }
      });
    },
    transmit (auth) {
      let arr = [];
      for (let i in auth) {
        if (auth[i] === "1") {
          arr.push(i);
        }
      }
      this.$store.dispatch('SelectEmployee', arr);
    }
  }
};

</script>
<style lang="scss" scoped>
  .list-checkbox{
    width: 49vw;
  }
  .employee-selected{
    width: (300/650)* 49vw;
    display: flex;
    flex-direction: column;
  }
  .choice-box{
    width: (240/650)* 49vw;
    @extend .employee-selected
  }
  .staff-box {
    display: flex;
    justify-content: space-between;
    .scroll-box {
      width: 100%;
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      .org-radio {
        width: 50%;
      }
    }
  }
  /deep/ .el-select {
    margin-top: 10px;
  }
</style>
