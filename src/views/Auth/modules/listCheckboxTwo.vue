<!--  -->
<template>
  <div class="listCheckbox">
    <p>{{ title }} </p>
    <div class="choicebox">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="isClick">全选</el-checkbox>
      <base-scrollbar class="ScrollBox">
        <ul>
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <li v-for="(item, index) in listData" :key="index">
              <el-checkbox class="name" :label="item.fID" :key="item.fID" :id="item.fID" :disabled="isClick">{{ item.name }}</el-checkbox>
            </li>
          </el-checkbox-group>
        </ul>
      </base-scrollbar>
    </div>
    
  </div>
</template>

<script>
import bus from '@/plugins/eventBus.js';
import baseScrollbar from '@/components/baseScrollbar.vue';

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
      MemberList: [],
      checkList: [],
      checkAll: '',
      isIndeterminate: true,
      OrgId: '',
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  computed: {
    isClick: function() {
      return this.MemberList.length === 0;
    },
    authList: function() {
      let arr = [0, 0, 0, 0];
      if (this.checkList.length === 0) {
        return [0, 0, 0, 0];
      }

      if (this.checkList.includes("0")) {
        arr[0] = 1;
      }

      if (this.checkList.includes("1")) {
        arr[1] = 1;
      }

      if (this.checkList.includes("2")) {
        arr[2] = 1;
      }

      if (this.checkList.includes("3")) {
        arr[3] = 1;
      }
      return arr;
    }
  },
  mounted() {
    bus.$on("privilege-change", (newVal) => {
      this.checkList = newVal;
    });
    bus.$on("member-change", (newVal) => {
      this.MemberList = newVal;
    });
    this.$emit("auth-change", this.authList);
  },
  watch: {
    MemberList: function() {
      if (this.MemberList.length === 0) {
        this.checkList = [];
      }
    },
    checkList: function() {
      if (this.checkList.length === this.listData.length) {
        this.checkAll = true;
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.listData.map(v => v.fID) : [];
      this.$forceUpdate();
      this.isIndeterminate = false;
      this.$emit("auth-change", this.authList);
    },
    handleCheckedCitiesChange(value) {
      if (this.checkList.includes("1") || this.checkList.includes("2") || this.checkList.includes("3")) {
        if (!this.checkList.includes("0")) {
          this.checkList.push("0");
        }
      }
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
      this.$emit("auth-change", this.authList);
    },
  }
};

</script>
<style lang="scss" scoped>
  .listCheckbox {
    width: 400px;
    line-height: 40px;

    .ScrollBox {
      width: 200px;
      height: 400px;
      border: 1px solid #eee;
      margin-top: 10px;
    }

    li {

      &.actived {
        background-color: blue;
      }

      .name {
        width: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        height: 100%;
      }
    }
  }
</style>