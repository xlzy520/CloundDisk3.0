<!--  -->
<template>
  <div class="listRadio">
    <p>{{ title }}</p>
    <el-select
      v-model="GroupNum"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
      :remote-method="remoteMethod"
      @change="choice"
      :loading="loading">
      <el-option
        v-for="item in listData"
        :key="item.id"
        :label="item.oname"
        :value="item.id">
      </el-option>
    </el-select>
    <base-scrollbar class="ScrollBox">
      <ul>
        <el-radio-group v-model="GroupNum" class="group" @change="choice">
          <li v-for="(item, index) in listData" :key="index">
            <el-radio :label="item.id" :key="item.id" :id="item.id" class="name">{{ item.oname }}</el-radio>
          </li>
        </el-radio-group>
      </ul>
    </base-scrollbar>
  </div>
</template>

<script>
import bus from '@/plugins/eventBus.js';
import debounce from 'lodash/debounce';
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
      GroupNum: '',
      loading: false,
    };
  },
  components: {
    baseScrollbar
  },
  computed: {},
  watch: {
    GroupNum: function(val) {
      this.Emitter(val);
    }
  },
  methods: {
    DebounceChoice: debounce(function(item) {
      this.choice(item);
    }, 100),
    choice(id) {
      this.GroupNum = id;
      this.$emit("GroupNum-change", this.GroupNum);
    },
    binding() {
      this.$emit("GroupNum-change", this.GroupNum);
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.GroupNum = this.listData.filter(item => {
          return item.oname.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
        })[0].id;
        this.binding();
      } else {
        this.GroupNum = "";
      }
    },
    Emitter(val) {
      bus.$emit('GroupNum-change', val);
    }
  }
};

</script>
<style lang="scss" scoped>
  .listRadio {
    width: 200px;
    line-height: 40px;

    .ScrollBox {
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
        background-color: #409EFF;
      }

      &.isSelected {
        color: #fff;
        background-color: #409EFF;
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