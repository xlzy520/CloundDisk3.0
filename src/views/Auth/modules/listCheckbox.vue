<!--  -->
<template>
  <div class="listCheckbox">
    <p>{{ title }} 
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </p>
    <div class="choicebox">
      <el-select
        v-model="checkList"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading">
        <el-option
          v-for="item in DupData"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId">
        </el-option>
      </el-select>
      <base-scrollbar class="ScrollBox">
        <ul>
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <li v-for="(item, index) in listData" :key="index" :class="{ actived: item.hasAuth === '1' }">
              <el-checkbox :label="item.userId" :key="item.userId" :id="item.userId" class="name">{{ item.userName }}</el-checkbox>
            </li>
          </el-checkbox-group>
        </ul>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
import eventBus from '@/plugins/eventBus.js';
import baseScrollbar from '@/components/baseScrollbar.vue';
import cloneDeep from 'lodash/cloneDeep';
import authService from '@/api/service/auth.js';

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
  data () {
    return {
      checkList: [],
      checkAll: false,
      isIndeterminate: true,
      GroupNum: '',
      loading: false,
      DupData: []
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    userList: function() {
      return this.listData.filter(v => {
        return this.checkList.indexOf(v.userId) > -1;
      }).map(v => {
        return {
          userId: v.userId,
          userName: v.userName
        };
      });
    },
    fcategoryid: {
      get: function() {
        return JSON.parse(localStorage.obj).map(v => {
          return v.fcategoryid;
        }).join(",");
      },
      set: function() {}
    },
  },
  mounted() {
    eventBus.$on("GroupNum-change", (val) => {
      this.GroupNum = val;
    });
    this.$emit("member-change", this.checkList);
  },
  watch: {
    GroupNum: function(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.checkList = [];
      };
    },
    checkList: function(newVal, oldVal) {
      if (oldVal !== newVal) {
        eventBus.$emit("member-change", newVal);
        this.$emit("member-change", this.checkList);
        if (this.checkList.length === this.listData.length) {
          this.checkAll = true;
        }
        if (this.checkList.length > 0) {
          this.searchThisCateWhoHavePer(this.checkList);
        }
      };
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
      this.$emit("member-change", this.checkList);
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.DupData = this.DupData.filter(item => {
            return item.userName.indexOf(query) > -1;
          });
        }, 200);
      } else {
        this.DupData = cloneDeep(this.listData);
      }
    },
    searchThisCateWhoHavePer(val) {
      const params = {
        fcategoryid: this.fcategoryid,
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
      eventBus.$emit("privilege-change", arr);
    }
  }
};

</script>
<style lang="scss" scoped>
  .listCheckbox {
    padding-left: 60px; 
  }
</style>