
<template>
  <div class="listCheckbox">
    <p>{{ title }} </p>
    <div class="choicebox">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        :disabled="isClick">全选</el-checkbox>
      <base-scrollbar class="scroll-box">
        <ul>
          <el-checkbox-group
            v-model="checkList"
            @change="handleCheckedCitiesChange">
            <li v-for="(item, index) in listData"
              :key="index">
              <el-checkbox
                class="name"
                :label="item.fID"
                :key="item.fID"
                :id="item.fID"
                :disabled="isClick">{{ item.name }}</el-checkbox>
            </li>
          </el-checkbox-group>
        </ul>
      </base-scrollbar>
    </div>
  </div>
</template>

<script>
import baseScrollbar from '@/components/baseScrollbar.vue';
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
      checkAll: "",
      isIndeterminate: false,
      OrgId: '',
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    isClick: function () {
      return this.EMPLYOEE.length === 0;
    },
    authList: function () {
      let arr = new Array(6).fill(0);
      if (this.checkList.length === 0) {
        return new Array(6).fill(0);
      }
      let newArr = new Array(6).fill('').map((item, index) => index + 1);
      for (let i in newArr) {
        if (this.checkList.includes(i)) {
          arr[i] = 1;
        }
      }
      return arr;
    },
    ...mapGetters([
      'EMPLYOEE',
      'EMPLYOEEAUTH'
    ])
  },
  mounted() {
  },
  watch: {
    EMPLYOEE: function () {
      if (this.EMPLYOEE.length === 0) {
        this.checkList = [];
      }
    },
    EMPLYOEEAUTH: function () {
      this.checkList = this.EMPLYOEEAUTH;
      let checkedCount = this.checkList.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
      this.$store.dispatch('SelectAuth', this.authList);
    },
    checkList: function () {
      if (this.checkList.length === this.listData.length) {
        this.checkAll = true;
      }
    },
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.listData.map(v => v.fID) : [];
      this.$forceUpdate();
      this.isIndeterminate = false;
      this.$store.dispatch('SelectAuth', this.authList);
    },
    handleCheckedCitiesChange(value) {
      // 选中查阅外 其他按钮 且  无选中查阅按钮 ; 自动勾选查阅
      if (this.checkList.filter(v => v > 0).length > 0 && !this.checkList.find(v => v === "0")) {
        this.checkList.push("0");
      }
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
      this.$store.dispatch('SelectAuth', this.authList);
    },
  }
};

</script>
<style lang="scss" scoped>
</style>
