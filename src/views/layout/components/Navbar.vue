<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container"
               :toggleClick="toggleSideBar"
               :isActive="sidebar.opened"
    title="展开侧边栏">
    </hamburger>
    <div class="nav__logo" v-show="!sidebar.opened">
      <img src="@/assets/logo/logo.png" width="36" height="36" class="nav__logo__img">
      <span class="nav__logo__title">东经云盘</span>
    </div>
    <div class="nav-router">
      <router-link to="/index/recycle" class="nav-router-text recycle">回收站</router-link>
      <router-link to="/index/record"  v-if="false" class="nav-router-text record">操作记录</router-link>
    </div>
    <!--<form action="www.baidu.com" enctype="multipart/form-data" method="post">-->
      <!--<input type="hidden" name="type" value="1"/>-->
      <!--<input id="dir" type="file" name="file" webkitdirectory mozdirectory onchange="haha(this)"/>-->
      <!--<input id="uploadDir" type="submit" value="提交文件夹">-->
    <!--</form>-->
    <div class="search_wrap"  @focus="showSwitch($event)"
         @blur="showSwitch($event)">
      <el-switch
        v-show="inputHover"
        style="float: left;margin-top: 15px;"
        v-model="query.fullTextBoolean"
        active-color="#13ce66"
        active-text="全文搜索">
      </el-switch>
      <md-input
        icon="search"
        name="search"
        @focus="showSwitch"
        @blur="showSwitch"
        v-model="query.queryString"
        title="请输入搜索关键词"
        placeholder="请输入关键词，回车搜索"
        :maxlength="maxlength"
        :keyEnterFunction="getSearchResult">
      </md-input>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="'https://oa.djcps.com/DJOA/'+avatar">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            主页
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            {{name}}
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">注销</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger.vue';
import MdInput from '@/components/MDinput.vue';
import { Loading } from 'element-ui';
export default {
  components: {
    MdInput,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  data() {
    return {
      query: {
        fullTextBoolean: false,
        queryString: ''
      },
      maxlength: 30,
      inputHover: false
    };
  },
  methods: {
    showSwitch(event) {
      if (event.type === 'focus') {
        this.inputHover = event.target.className === 'material-input' || event.target.className === 'search_wrap';
      } else {
        this.inputHover = !(event.target.className === 'material-input' || event.target.className === 'search_wrap');
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    getSearchResult() {
      const loadingSearch = Loading.service({ fullscreen: true });
      this.$store.dispatch('SetSearchList', this.query).then(() => {
        loadingSearch.close();
        if (this.$route.name === '回收站') {
          this.$router.push({ path: '/index/list' });
        }
      }).catch(() => {
        loadingSearch.close();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    &:hover{
      animation: hamburger-spin infinite 1s linear;
    }
    @keyframes hamburger-spin {
      0% {transform: rotate(0deg);}
      25% {transform: rotate(45deg);}
      50% {transform: rotate(0deg);}
      75% {transform: rotate(-45deg);}
      100% {transform: rotate(0deg);}
    }
  }
  .nav__logo{
    float: left;
    &__img{
      float: left;
      margin-top: 5px;
      margin-right: 5px;
    }
    &__title{
      float: right;
      font-size: 20px;
    }
  }
  .nav-router{
    color: #9e9e9e;
    font-size: 18px;
    float: left;
    cursor: pointer;
    .nav-router-text{
      margin-left: 30px;
      padding: 0 10px;
      &:hover{
        color: #8b80db;
      }
    }
    .router-link-active{
      color: #1296db;
    }
  }
  .search_wrap{
    position: absolute;
    right: 15%;
    .material-input__component{
     float: left;
      width: 225px;
      margin-top: 5px;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    top: 0;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

