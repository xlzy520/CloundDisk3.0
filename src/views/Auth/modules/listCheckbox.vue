<!--  -->
<template>
  <div class="listCheckbox">
    <p>{{ title }}
      <el-checkbox 
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        :disabled="isClick">全选</el-checkbox>
    </p>
    <div class="choicebox">
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
      <div class="staffBox">
        <base-scrollbar class="ScrollBox">
          <ul>
            <el-checkbox-group 
              v-model="checkList"
              @change="handleCheckedCitiesChange">
              <li 
                v-for="(item, index) in preData"
                :key="index"
                :class="{ actived: item.hasAuth === '1' }">
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
        <base-scrollbar class="ScrollBox" v-if="supplyData.length > 0">
          <ul>
            <el-checkbox-group 
              v-model="checkList"
              @change="handleCheckedCitiesChange">
              <li 
                v-for="(item, index) in supplyData"
                :key="index"
                :class="{ actived: item.hasAuth === '1' }">
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
    },
    title: {
      type: String,
      default: ""
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
    preData: function() {
      return this.listData.length > 30 ? this.listData.slice(0, 30) : this.listData;
    },
    supplyData: function() {
      return this.listData.length > 30 ? this.listData.slice(30, this.listData.length - 1) : [];
    },
    isClick: function () {
      return this.listData.length === 0;
    },
    ...mapGetters([
      'GroupNum'
    ])
  },
  mounted() {
    this.$store.dispatch('ChooseEmplyoee', this.checkList);
  },
  watch: {
    GroupNum: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.checkList = [];
      }
    },
    checkList: function (newVal, oldVal) {
      if (oldVal !== newVal) {
        this.$store.dispatch('ChooseEmplyoee', this.checkList);
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
      this.$store.dispatch('ChooseEmplyoee', this.checkList);
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
      this.$store.dispatch('SelectEmplyoee', arr);
    }
  }
};

</script>
<style lang="scss" scoped>
  .staffBox {
    width: 80%;
    display: flex;
    justify-content: space-between;
  }
  .listCheckbox {
    width: 800px;
    padding-left: 60px;

    /deep/ .el-select {
      width: 80%;
    }
  }
</style>
