<template>
  <div class="login-container">
    <el-form
      ref="loginFormEl"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          系统登录
        </h3>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          ref="password"
          placeholder="密码"
          name="password"
          auto-complete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>

      <div style="position:relative">
        <div class="tips">
          <span>账号 : admin</span>
          <span>密码 : 随便填</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            账号 : editor
          </span>
          <span>密码 : 随便填</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog = true">
          第三方登录
        </el-button>
      </div>
    </el-form>

    <el-dialog title="第三方登录" :visible.sync="showDialog">
      本地不能模拟，请结合自己业务进行模拟！！！
      <br />
      <br />
      <br />
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { isValidUsername } from '@/utils/validate'
import SocialSign from './socialSignIn.vue'
import { Route } from 'vue-router'
import { ElForm } from 'element-ui/types/form'
import { ElInput } from 'element-ui/types/input'
import { UserModule } from '@/store/modules/user'

const validateUsername = (rule, value: string, callback) => {
  if (!isValidUsername(value)) {
    callback(new Error('Please enter the correct user name'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value: string, callback) => {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'))
  } else {
    callback()
  }
}

@Component({
  name: 'Login',
  components: {
    SocialSign
  }
})
export default class Login extends Vue {
  $refs!: {
    loginFormEl: ElForm
    username: ElInput
    password: ElInput
  }

  private loginForm = {
    username: 'admin',
    password: '1111111'
  }

  private loginRules = {
    username: [
      {
        required: true,
        trigger: 'blur',
        validator: validateUsername
      }
    ],
    password: [
      {
        required: true,
        trigger: 'blur',
        validator: validatePassword
      }
    ]
  }

  private passwordType: string = 'password'
  private loading: boolean = false
  private showDialog: boolean = false
  private capsTooltip: boolean = false
  private redirect: string | undefined = undefined

  // watch
  @Watch('$route', {
    immediate: true
  })
  private onRouteChange(route: Route) {
    this.redirect = route.query && (route.query.redirect as string)
  }

  private mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  }

  private checkCapslock({ shiftKey = '', key = '' } = {}) {
    if (key && key.length === 1) {
      if ((shiftKey && key >= 'a' && key <= 'z') || (!shiftKey && key >= 'A' && key <= 'Z')) {
        this.capsTooltip = true
      } else {
        this.capsTooltip = false
      }
    }
    if (key === 'CapsLock' && this.capsTooltip === true) {
      this.capsTooltip = false
    }
  }

  private showPwd(): void {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
  }

  private handleLogin(): void {
    this.$refs.loginFormEl.validate(async valid => {
      if (valid) {
        this.loading = true
        await UserModule.LoginByUsername(this.loginForm)
        this.$router.push({
          path: this.redirect || '/'
        })
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import './style.less';
</style>
