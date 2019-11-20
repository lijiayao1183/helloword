<template lang="pug">
  div#top-nav-bar
    el-dialog(:visible.sync="logOutVisible" title="退出提示" size="tiny" :show-close="false" :close-on-click-modal="false")
      span(style="color:black;") 退出重新登录
      span(slot="footer" class="dialog-footer")
        el-button(@click="logOutVisibles" type="primary") 确定
    user-info-dialog(:pswForm="pswForm" :user="userData" :userFormVisible="userFormVisible" v-if="userFormVisible")
    el-menu(theme='light' mode='horizontal' :default-active='defaultActive')
      el-row
        el-col(:span='13')
          span.project-title 视频监控报警
      el-row.row-position-absolte(type="flex" class="row-bg" justify="end")
        el-col.float-right(:span='20')
          el-menu-item(v-for='(item,index) in navData', :key='item.path', :index='item.path' )
            a(:href="item.path") {{item.name}}
          span |
        el-col.align-center(:span='1' class='nav-right-operator' :class='[defaultActive === "/static/html/userinfo-manage.html"? "is-active": ""]')
          el-badge(:is-dot="applyNum.hasRemind" class="dot")
            el-button(type='text' size='small')
               a(:href='userURL' style='cursor:pointer')
                 i(class='iconfont iconstyle') &#xe629;
        el-col.align-center(:span='1' class='nav-right-operator')
          el-button(type='text' size='small')
             a(:href='helperURL' target='_blank' style='cursor:pointer')
               i(class='iconfont iconstyle') &#xe62c;
        el-col.align-center(:span='1' class='nav-right-operator')
          el-button(type='text' @click='loginOut')
            i(class='iconfont iconstyle') &#xe626;
</template>
<script type="text/babel">
import MyLocalStorage from '../scripts/my-local-storage'
import ModuleName from '../scripts/module-name'
import TopNavBar from '../mock/top-nav-bar.mock'
import resourceCodeMap from '../scripts/module-name-resource-code-map'
import axios from '../scripts/axios'
import api from '../scripts/api'
import userInfoDialog from './userInfoDialog.vue'
import bus from '../scripts/bus'
import UserApi from './../system-setting/api/systemconfig/usermanage.api'

let url = require('../scripts/url')

export default {
  data () {
    return {
      logOutVisible: false,
      userFormVisible: false,
      userData: {
        userId: '',
        employeeId: '',
        nickName: '',
        cellphone: '',
        email: ''
      },
      pswForm: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      navData: [],
      userName: '',
      isUserinfo: false,
      defaultActive: null,
      helperURL: '../lib/resources/BOD产品手册.pdf',
      userURL: `${url.rootPath}/html/userinfo-manage.html`,
      applyNum: {
        hasRemind: false
      }
    }
  },
  created () {
    // this.getApplyNum()
    bus.$on('applyNumChange', this.getApplyNum)
    bus.$on('updateUserSuccess', () => {
      api.user.updateUserInfo(this.userData).then(() => {
        this.handleUpdateUserInfoSuccess()
      })
    })

    bus.$on('updateUserWithPsw', () => {
      let pswData = {
        newPassword: this.pswForm.password,
        oldPassword: this.pswForm.oldPassword,
        userId: this.userData.userId
      }
      axios.all([
        api.psw.updatePsw(pswData),
        api.user.updateUserInfo(this.userData)
      ]).then((data) => {
        if (data[0].code == '013') {
          this.$message.error('密码错误！')
        } else if (data[0].code == '1' && data[1].code == '1') {
          this.handleUpdateUserInfoSuccess()
          let that = this
          setTimeout(() => {
            that.logOutVisible = true
          }, 3000)
        }
      })
    })

    bus.$on('userFormVisibleCancel', () => {
      this.userFormVisible = false
      this.pswForm.oldPassword = ''
      this.pswForm.password = ''
      this.pswForm.confirmPassword = ''
    })
    this.navData = TopNavBar
    this.setDefaultActive()
    this.userName = MyLocalStorage.getItem(ModuleName.USER_INFO.MODULE_NAME, ModuleName.USER_INFO.USER_NAME)
    this.userData.nickName = localStorage.getItem('admin_name')
    if (this.userData.nickName) {
      UserApi.getUserByUserName(this.userData.nickName).then(
        (data) => {
          this.userData.userId = data.userId
          this.userData.employeeId = data.employeeId
          this.userData.nickName = data.nickName
          this.userData.cellphone = data.cellphone
          this.userData.email = data.email

          this.userName = MyLocalStorage.getItem(ModuleName.USER_INFO.MODULE_NAME, ModuleName.USER_INFO.USER_NAME)

          MyLocalStorage.mergeItem(ModuleName.USER_INFO.MODULE_NAME, ModuleName.USER_INFO.ACC_INFO, data.roleId)
        }, (err) => {
          console.log(err)
        }
      )
    }
  },
  methods: {
    getApplyNum () {
    },
    handleUpdateUserInfoSuccess () {
      this.userName = this.userData.nickName
      const itemKey = ModuleName.USER_INFO.USER_NAME
      const item = JSON.stringify({[itemKey]: this.userName})
      localStorage.setItem(ModuleName.USER_INFO.MODULE_NAME, item)
      this.$message.success('保存成功！')
      this.userFormVisible = false
    },
    logOutVisibles () {
      this.logOutVisible = false
      this.loginOut()
    },
    // gotoInfo: function () {
    //   // this.userFormVisible = true
    //
    // },
    loginOut: function () {
      api.login.put().then(() => {
        window.location.href = `${url.rootPath}/html/login.html?link=${window.location.pathname}`
      }).catch(() => {
      })
    },
    setDefaultActive () {
      this.defaultActive = window.location.pathname
      let codes = MyLocalStorage.getItem(ModuleName.SYSTEM.MODULE_NAME, ModuleName.SYSTEM.RESOURCES_CODES)
      let link = this.successRetrieve(codes)
      // todo:没有任何权限时，暂时跳转到登录页面，后期需要添加无权限页面
      if (_.isEmpty(link)) {
        window.location.href = `${url.rootPath}/html/login.html`
      } else if (this.defaultActive !== link) {
        window.location.href = link
      }
    },
    successRetrieve (codes) {
      let link = window.location.pathname
      let htmlName = this.getLinkHtmlName(link)
      let linkCode = resourceCodeMap[htmlName]
      if (codes.indexOf(linkCode) === -1 && linkCode !== 'userinfoManage') {
        link = this.getFirstPermissionUrl(codes)
      }
      return link
    },
    getLinkHtmlName (link) {
      let result = link.split(/[\\/\\.]/)
      return result[result.length - 2]
    },
    getFirstPermissionUrl (codes) {
      let first = ''
      for (let htmlName in resourceCodeMap) {
        if (codes.indexOf(resourceCodeMap[htmlName]) > -1) {
          first = htmlName
          break
        }
      }
      if (_.isEmpty(first)) {
        return ''
      } else {
        return `${url.rootPath}/html/${first}.html`
      }
    }
  },
  components: {
    'user-info-dialog': userInfoDialog
  }
}
</script>
<style lang="scss">
  @import "../assets/icon/iconfont.css";

  $line-height: 45px;
  $font-color: #fff;
  $full-height: 100%;
  #top-nav-bar {
    font-size: 14px;
    height: $line-height;
    line-height: $line-height;
    .dot{
      sup{
        top: 14px;
      }
    }
    .yuetai {
      width: 140px;
      margin-top: 3px;
    }
    .project-title {
      position: relative;
      left: 10px;
      bottom: 0px;
      font-size: 18px;
      color: #e2f2ff;
    }
    span {
      color: $font-color;
    }
    .el-menu {
      padding-left: 40px;
      height: $full-height;
      background-color: #3E8FEB;
      .el-menu-item {
        height: $full-height;
        line-height: $line-height;
        padding:0;
        color: $font-color;
        &:hover, &.is-active {
          background-color: #287BDD;
        }
        a {
          height: 100%;
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
          display: inherit;
          color: inherit;
          cursor: pointer;
        }
      }
      .el-button--text {
        color: $font-color;
      }
      .el-row {
        height: $full-height;
        .el-col {
          height: $full-height;
        }
      }
    }
    .row-position-absolte {
      position: absolute;
      width: 100%;
      top: 0;
      right: 0;
      .nav-right-operator{
        &:hover, &.is-active {
          background-color: #287BDD;
        }
      }
      i.iconstyle{
        font-size: 16px;
        color: white;
      }
    }
    .float-right {
      display: flex;
      justify-content: flex-end;
    }
    .align-center {
      text-align: center;
    }
  }
</style>
