<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container"
        :toggle-click="toggleSideBar"
        :is-active="sidebar.opened"
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
      <div class="search_wrap"  @focus="showSwitch($event)" @blur="showSwitch($event)">
        <el-switch
          v-show="inputHover"
          class="switch-search"
          v-model="query.full"
          active-color="#13ce66"
          active-text="全文搜索">
        </el-switch>
        <md-input
          icon="search"
          name="search"
          @focus="showSwitch"
          @blur="showSwitch"
          v-model="query.value"
          title="请输入搜索关键词"
          placeholder="请输入关键词，回车搜索"
          :maxlength="maxlength"
          :key-enter-function="getSearchResult">
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
              <span class="name">主页</span>
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              <span class="name">{{name}}</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided v-if="isAdmin">
            <span class="name" @click="view">查询权限</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span class="name" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <share ref="share"></share>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger.vue';
import MdInput from '@/components/MDinput.vue';
import Share from '@/components/UserAuth/ShareDialog.vue';

export default {
  name: 'Navbar',
  components: {
    MdInput,
    Hamburger,
    Share
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'utype',
    ]),
    isAdmin: function() {
      return this.utype > 0;
    },
  },
  data() {
    return {
      query: {
        full: false,
        value: ''
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
      this.$store.dispatch('LogOut').then(()=>{
        this.$message1000('注销成功。', 'success');
      }).finally(()=>{
        this.$router.push('/login');
        //location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    view() {
      this.$refs.share.openDialog();
    },
    getSearchResult() {
      const searchQuery = this.query.full ? this.query : {query: this.query.value};
      this.$router.push({path: '/index/search', query: searchQuery});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0 !important;
  .hamburger-container {
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
    .switch-search{
      float: left;
      margin-top: 15px;
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

.user-dropdown {
  line-height: 20px;
  /deep/ .el-dropdown-menu__item {
    padding: 0;
  }

  /deep/ .el-dropdown-menu__item--divided:before {
    margin: 0;
  }

  .name {
    display: block;
    padding: 0 20px;
  }
}
</style>

