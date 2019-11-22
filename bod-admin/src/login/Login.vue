<template lang="pug">
  div.login-container
    div#login-box
      div.login-left
        img(src="./assets/img/wm_home.png" alt="" style="width: 400px;border-radius: 10px;")
      div.login-right
        div.login-title {{formTitle}}
        div.login-form-box
          el-form.login-form(v-if="ifLogin"  :model="loginForm" :rules="loginRules" ref="loginForm" @keyup.enter.native="login" auto-complete="off")
            el-form-item(prop="username")
              el-input(v-model="loginForm.username" placeholder="请输入账号" auto-complete="off" key="uName" name="uName")
            el-form-item(prop="password")
              el-input(type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" key="uPwd" name="uPwd")
            el-form-item.login-btn
              el-button(type="primary" @click="login('loginForm')" :loading="saving") {{formTitle}}
          el-form.login-form(v-else :model="resetPassForm" :rules="resetPassRules" ref="resetPassForm" @keyup.enter.native="resetPass('resetPassForm')")
            el-form-item(prop="pass")
              el-input(type="password" v-model="resetPassForm.pass" placeholder="密码")
            el-form-item(prop="checkPass")
              el-input(type="password" v-model="resetPassForm.checkPass" placeholder="请确认密码")
            el-form-item.login-btn
              el-button(type="primary" @click="resetPass('resetPassForm')") {{formTitle}}
</template>
<script>
import api from './scripts/api'
import commonApi from '../scripts/api'
import MsgInfo from './scripts/msg-info'

let url = require('../scripts/url')
import myLocalStorage from '../scripts/my-local-storage'
import moduleName from '../scripts/module-name'
import resourceCodeMap from '../scripts/module-name-resource-code-map'
import { mapGetters } from 'vuex'

export default {
  data() {
    return { 
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      resetPassForm: {
        pass: '',
        checkPass: ''
      },
      resetPassRules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 18, message: '请输入8-18个字符', trigger: 'blur' },
          { validator: this.validateIfInitPass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: this.validateSamePass, trigger: 'blur' }
        ]
      },
      ifLogin: true,
      isShuzunta: url.isShuzunta()
    }
  },
  computed: {
    ...mapGetters({
      saving: 'saving'
    }),
    formTitle() {
      if (this.ifLogin) {
        return '登录'
      }
      return '重置密码'
    }
  },
  methods: {
    login: function() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          api.login.post(this.loginForm).then((data) => {
            if (data.code === '011') {
              this.$alert('密码为缺省设置，需要重置密码', '提示', {
                confirmButtonText: '确定',
                type: 'info',
                callback: action => {
                  this.ifLogin = false
                }
              })
            }
            let retCode = parseInt(data.code)
            if (retCode === 200) {
              commonApi.resource.getUserResourceCodes().then((codes) => {
                this.initLocalStorage(data, codes)
                if (codes.length === 0) {
                  this.$message({ type: 'warning', message: '请联系管理员为您开通权限!' })
                } else {
                  this.successRetrieve(codes)
                }
              })
            }
            else if (retCode != 11) {
              this.$message({ type: 'warning', message: data.msg })
            }
          })
          if (this.loginForm.password == '111111') {
            this.loginForm.password = ''
          }
        }
      })
    },
    resetPass(ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          api.resetPassword(this.loginForm.username, this.resetPassForm.pass).then(
            res => {
              this.$alert('密码重置成功，请重新登录', '提示', {
                confirmButtonText: '确定',
                type: 'info',
                callback: action => {
                  // this.loginForm.username="";
                  // this.loginForm.password="";
                  this.ifLogin = true

                  return
                }
              })
            }, (err) => {
              console.log(err)
            }
          )
        }
      })
    },
    validateSamePass(rule, value, callback) {
      if (value !== this.resetPassForm.pass) {
        callback(new Error('两次输入密码不一致，请重新输入'))
      } else {
        callback()
      }
    },
    validateIfInitPass(rule, value, callback) {
      if (value === this.loginForm.username) {
        return callback(new Error('密码不能与账户名相同'))
      }
      let level = 0
      if (/[a-z]/.test(value)) {
        level++
      }
      if (/[A-Z]/.test(value)) {
        level++
      }
      if (/\d/.test(value)) {
        level++
      }
      if (/[^a-zA-Z\d]/.test(value)) {
        level++
      }
      if (level < 3) {
        callback(new Error('密码必须为大小写字母、数字、特殊字符至少3种组合'))
      } else {
        callback()
      }
    },
    initLocalStorage(data, resourceCodes) { 
      myLocalStorage.clear()
      myLocalStorage.mergeItem(moduleName.USER_INFO.MODULE_NAME, moduleName.USER_INFO.USER_NAME, data.data)
      myLocalStorage.mergeItem(moduleName.SYSTEM.MODULE_NAME, moduleName.SYSTEM.RESOURCES_CODES, resourceCodes)
      // 添加当前用户账户名到localstorage
      localStorage.setItem('admin_name', this.loginForm.username)
    },
    successRetrieve(codes) {
      let link = url.getQueryParams().link || url.login.defaultLink
      let htmlName = this.getLinkHtmlName(link)
      let linkCode = resourceCodeMap[htmlName]
      if (codes.indexOf(linkCode) === -1) {
        link = this.getFirstPermissionUrl(codes)
      }
      window.location.href = link
    },
    getLinkHtmlName(link) {
      let result = link.split(/[\\/\\.]/)
      return result[result.length - 2]
    },
    getFirstPermissionUrl(codes) {
      let first = ''
      for (let htmlName in resourceCodeMap) {
        if (codes.indexOf(resourceCodeMap[htmlName]) > -1) {
          first = htmlName
          break
        }
      }
      return `${url.rootPath}/html/${first}.html`
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
}

#login-box {
  width: 856px;
  height: 300px;
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -458px;
  margin-top: -196px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid #dbdbdb;

  .login-left {
    float: left;
  }

  .login-right {
    float: left;
    width: 370px;
    margin-left: 30px;
  }

  .login-title {
    font-size: 16px;
    color: #63b5ea;
    margin-bottom: 34px;
    border-bottom: 1px solid #dedede;
    height: 40px;
  }
  .el-form-item__content {
    line-height: 50px;
  }
  .login-btn {
    margin-top: 30px;
  }
  .login-btn button {
    width: 100%;
    height: 45px;
  }
}
</style>
