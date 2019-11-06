<template>
  <div class="login-container">
    <canvas id="cvs_bg" width="1443" height="596"></canvas>
    <canvas id="cvs_key"></canvas>
    <el-form class="login-form" auto-complete="on" status-icon :model="loginForm" :rules="loginRules" ref="loginForm"
      label-position="left">
      <h3 class="title">东经云盘</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <i class="fa fa-user"></i>
          <!--<svg-icon icon-class="user" />-->
        </span>
        <el-input
          name="username"
          type="text"
          spellcheck="false"
          v-model.trim="loginForm.username"
          auto-complete="on"
          maxlength="30"
          clearable
          placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container svg-container_login">
          <i class="fa fa-lock"></i>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          spellcheck="false"
          @keyup.enter.native="handleLogin"
          v-model.trim="loginForm.password"
          maxlength="30"
          clearable
          auto-complete="on"
          placeholder="请输入密码" />
        <span class="show-pwd" @click="showPwd"><i :class="['fa',eye]"></i></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-button" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {autoRun} from '@/utils/keyDown';
  import {CanvasAnimate} from '@/utils/canvasLogin';
  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: process.env.VUE_APP_USERNAME,
          password: process.env.VUE_APP_USER_PASSWORD
        },
        loginRules: {
          username: [
            {required: true, trigger: 'blur'},
            {min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change'}
          ],
          password: [
            {required: true, trigger: 'blur'},
            {min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change'}
          ]
        },
        loading: false,
        eye: 'fa-eye-slash',
        pwdType: 'password',
        redirect: undefined
      };
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = '';
          this.eye = 'fa-eye';
        } else {
          this.pwdType = 'password';
          this.eye = 'fa-eye-slash';
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || '/index/list' });
              this.$message1000('登录成功', 'success');
            }).catch(() => {
              this.loading = false;
              // this.$router.push({ path: '/' }) //  跳过后台验证
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query.redirect;
        },
        immediate: true
      }
    },
    mounted() {
      const canvasAnimate = new CanvasAnimate(document.getElementById('cvs_bg'), { length: 100, clicked: true, moveon: true });
      canvasAnimate.Run();
      autoRun();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 90px auto;
      z-index: 3;
      .login-button{
        width: 100%;
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      user-select: none;
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    #cvs_bg,#cvs_key{
      position: absolute;
    }
    #cvs_bg{
      z-index: 1
    }
  }
</style>
