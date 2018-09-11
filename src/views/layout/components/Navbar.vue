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
      <md-input
        icon="search"
        name="search"
        v-model="queryString"
        title="请输入搜索关键词"
        placeholder="请输入关键词,回车搜索"
        :maxlength="maxlength"
        :keyEnterFunction="getSearchResult">
      </md-input>
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
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import MdInput from '@/components/MDinput'
import { Loading } from 'element-ui'
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
      queryString: '',
      maxlength: 30
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getSearchResult() {
      const loadingSearch = Loading.service({ fullscreen: true })
      this.$store.dispatch('SetSearchList', this.queryString).then(res => {
        loadingSearch.close()
      }).catch(res => {
        loadingSearch.close()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .nav__logo{
    display: inline-block;
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
  .search {
    position: absolute;
    bottom: 1vh;
    right: 10vw;
    width: 268px;
    height: 36px;
    padding: 2px 2px 2px 2px;
    background-color: rgba(165, 165, 165, .12);
    border-radius: 6px;
    font-size: 12px;
    z-index: 10;
    .searchform {
      background-color: #fff;
      background-color: hsla(0, 0%, 100%, .88);
      display: block;
      height: 32px;
      border-radius: 4px;
      transition: background-color .2s;
      .search-keyword {
        float: left;
        width: 200px;
        outline: none;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        border: 0;
        padding: 0 12px;
        background-color: transparent;
        font-size: 12px;
        color: #222;
        overflow: hidden;
      }
      .search-submit {
        position: absolute;
        display: block;
        right: 0;
        width: 48px;
        height: 32px;
        border: 0;
        outline: none;
        background-color: transparent;
        font-size: 21px;
        cursor: pointer;
        color: #00a5db;
        &:hover {
          color: #ff4e8e;
        }
      }
    }
  }
  .material-input__component{
    position: absolute;
    top: 22%;
    right: 22%;
    margin-top: 0;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
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

