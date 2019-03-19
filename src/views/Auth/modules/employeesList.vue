<template>
  <div class="list-checkbox">
    <p>员工列表
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        :disabled="isClick">全选</el-checkbox>
    </p>
    <div class="choice-box">
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
      <div class="staff-box">
        <base-scrollbar class="scroll-box" :class="{ 'expand': listData.length > 30 }">
          <ul>
            <el-checkbox-group
              v-model="checkList"
              @change="handleCheckedCitiesChange">
              <li
                v-for="(item, index) in listData"
                :key="index"
                :class="{ active: item.hasAuth === '1' }">
                <el-checkbox
                  :label="item.userId"
                  :key="item.userId"
                  :id="item.userId"
                  class="name">
                  {{ item.userName }}
                </el-checkbox>
              </li>
            </el-checkbox-group>
          </ul>
        </base-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import baseScrollbar from '@/components/baseScrollbar.vue';
import authService from '@/api/service/auth';
import { mapGetters } from "vuex";

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
    userList: {
      get: function () {
        return this.listData.filter(v => {
          return this.checkList.indexOf(v.userId) > -1;
        }).map(v => {
          return {
            userId: v.userId,
            userName: v.userName
          };
        });
      },
      set: function() { }
    },
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
  .staff-box {
    width: 80%;
    display: flex;
    justify-content: space-between;
  }
  .list-checkbox {
    width: 600px;
    padding-left: 30px;

    /deep/ .el-select {
      width: 80%;
    }

    .scroll-box {
      width: 50%;

      &.expand {
        width: 100%;

        ul {
          width: 100%;

          /deep/ .el-checkbox-group {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
          }
        }

        li {
          width: 50%;
        }
      }
    }
  }

</style>
