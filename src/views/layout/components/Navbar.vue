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
        <router-link to="/index/userManagement" class="nav-router-text auth" v-if="isAdmin">权限管理</router-link>
        <router-link to="/index/record"  v-if="false" class="nav-router-text record">操作记录</router-link>
      </div>
      <div class="search-replace" @click="searchDisplay" v-if="!searchVisible">
        <i class="fa fa-search search-replace-icon" title="搜索"></i>
      </div>
      <transition name="slide-fade">
        <div class="search-wrap" v-if="searchVisible">
          <el-switch
            class="switch-search"
            v-model="query.full"
            active-color="#13ce66"
            active-text="全文搜索">
          </el-switch>
          <md-input
            icon="search"
            name="search"
            v-model="query.value"
            title="请输入搜索关键词"
            placeholder="请输入关键词，回车搜索"
            :maxlength="30"
            :key-enter-function="getSearchResult">
          </md-input>
        </div>
      </transition>
      <el-dropdown class="avatar-container" trigger="click"  @command="handleDropDownCommand">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="'https://oa.djcps.com/DJOA/'+userData.userIco">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>{{userData.userName}}</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided command="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger.vue';
import MdInput from '@/components/MDinput.vue';

export default {
  name: 'Navbar',
  components: {
    MdInput,
    Hamburger,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userData'
    ]),
    isAdmin() {
      return this.userData.utype > 0;
    },
  },
  data() {
    return {
      query: {
        full: false,
        value: ''
      },
      searchVisible: false
    };
  },
  methods: {
    searchDisplay() {
      this.searchVisible = true;
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar');
    },
    handleDropDownCommand(cmd) {
      if (cmd === 'logout') this.logout();
    },
    logout() {
      this.$store.dispatch('LogOut').then(()=>{
        this.$message1000('注销成功。', 'success');
      }).finally(()=>{
        this.$router.push('/login');
        //location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    getSearchResult() {
      const searchQuery = this.query.full ? this.query : {value: this.query.value};
      searchQuery.time = Date.now();
      this.$router.push({path: '/index/search', query: searchQuery});
    }
  }
};
</script>

<style lang="scss">
.navbar {
  display: flex;
  height: 50px;
  line-height: 50px;
  .hamburger-container {
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
    display: flex;
    align-items: center;
    &__img{
      margin-right: 5px;
    }
    &__title{
      font-size: 20px;
    }
  }
  .nav-router{
    color: #9e9e9e;
    font-size: 18px;
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
  .search-replace{
    position: absolute;
    right: 10%;
    cursor: pointer;
    &-icon{
      font-size: 24px;
      height: 50px;
      line-height: 50px;
      background-image: -webkit-gradient(linear, left 0, right 0, from(rgb(4, 154, 255)), to(rgb(109, 216, 187)));
      -webkit-background-clip: text; /*必需加前缀 -webkit- 才支持这个text值 */
      -webkit-text-fill-color: transparent; /*text-fill-color会覆盖color所定义的字体颜色： */
    }
  }
  .search-wrap{
    display: flex;
    position: absolute;
    right: 15%;
    .material-input__component{
      width: 225px;
      margin-top: 5px;
    }
    .switch-search{
      margin-top: 15px;
    }
  }
  .avatar-container {
    position: absolute;
    right: 60px;
    .avatar-wrapper {
      cursor: pointer;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .el-icon-caret-bottom {
        position: absolute;
        top: 12px;
        font-size: 24px;
        color: #4cbdf0;
      }
    }
  }
}
.slide-fade-enter-active{
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(20px);
  opacity: 0;
}
</style>

