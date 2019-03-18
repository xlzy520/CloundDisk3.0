<!--  -->
<template>
  <div class="AuthBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分配权限" name="1">
        <allot class="flexUp"></allot>
      </el-tab-pane>
      <el-tab-pane label="编辑权限" name="2">
        <consult class="flexUp"></consult>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import allot from './allot.vue';
import consult from './consult.vue';

export default {
  data () {
    return {
      activeName: '1',
    };
  },
  components: {
    allot,
    consult
  },
  created() {
    if (this.$route.query.isEdit === "1") {
      this.activeName = "2";
    }
  },
  beforeDestroy() {
    localStorage.obj = "";
  },
  computed: {
    fcategoryid: {
      get: function() {
        return JSON.parse(localStorage.obj).map(v => {
          return v.fcategoryid;
        }).join(",");
      },
      set: function() {}
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};

</script>
<style lang="scss">
  .AuthBox {
    width: 100%;
    box-sizing: border-box;
    padding-left: 20px;

    /deep/ .el-tabs {
      height: 100%;
    }

    /deep/ .el-tabs__content {
      height: calc(100%);
    }

    /deep/ .el-tab-pane {
      height: 100%;
    }
  }

  .flexUp {
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
  }

  .flexBox {
    display: flex;
  }
  .scrollbar {
    width: 1200px;
    flex-grow: 8 !important;
  }

  .handlerBox {
    flex: 1 1 12px;
  }

  .listCheckbox {
    width: 400px;
    line-height: 40px;

    .ScrollBox {
      width: 200px;
      height: 56vh;
      border: 1px solid #eee;
      margin-top: 10px;
    }

    li {
      border: 1px solid #fff;
      &.actived {
        background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
        border-radius: 10px;
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
