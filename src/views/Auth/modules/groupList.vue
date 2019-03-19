<template>
  <div class="group-list">
    <p>组织列表</p>
    <el-select
      v-model="groupNum"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      @change="choice"
      :loading="loading">
      <el-option
        v-for="item in listData"
        :key="item.id"
        :label="item.oname"
        :value="item.id">
      </el-option>
    </el-select>
    <base-scrollbar class="scroll-box">
      <ul>
        <el-radio-group
          v-model="groupNum"
          class="group"
          @change="choice">
          <li
            v-for="(item, index) in listData"
            :key="index">
            <el-radio :label="item.id"
              :key="item.id"
              :id="item.id"
              class="name">
              {{ item.oname }}
            </el-radio>
          </li>
        </el-radio-group>
      </ul>
    </base-scrollbar>
  </div>
</template>

<script>
import baseScrollbar from '@/components/baseScrollbar.vue';

export default {
  props: {
    listData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      groupNum: '',
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  methods: {
    choice(id) {
      this.groupNum = id;
      this.$store.dispatch('ChooseGroup', this.groupNum);
      this.$emit("groupnum-change", this.groupNum);
    },
  }
};

</script>
<style lang="scss">
.group-list {
  width: 200px;
  line-height: 40px;

  .scroll-box {
    height: 56vh;
    border: 1px solid #eee;
    margin-top: 10px;
  }

  li {
    line-height: 40px;

    &.el-radio__input {
      display: none !important;
    }

    &.is-checked {
      color: #fff;
      background-color: #409eff;
    }

    &.isSelected {
      color: #fff;
      background-color: #409eff;
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
