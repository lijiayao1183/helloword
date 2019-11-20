<template>
  <div id="userinfo-manage" class="continer">
    <div class="top-nav-bar">
      <top-navbar></top-navbar>
    </div>
    <div class="main-container"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <div class="userinfo-left-nav-bar">
        <left-navbar :navData="LeftNavbarData"></left-navbar>
      </div>
      <div class="content-container">
        <router-view :userData="userData"
                     @updateUserinfo="updateUserinfo"
                     :isReadOnlyUserinfo="isReadOnlyUserinfo"
                     @changeUserinfoReadOnly="changeUserinfoReadOnly"
                     :isReadOnlyUserPwd="isReadOnlyUserPwd"
                     @changeUserPwdReadOnly="changeUserPwdReadOnly"
                     @updateUserPwd="updateUserPwd"
        ></router-view>
        <el-dialog
          title="退出提示"
          :visible.sync="logoutDialogVisible"
          width="20%"
          :show-close=false
          :close-on-click-modal=false
          >
          <span>修改成功，请退出重新登录</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="logoutHandle">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import TopNavbar from '../components/TopNavBar'
import LeftNavbar from './components/LeftNavbar'
import LeftNavbarData from './mock/left-navbar.mock'
import { mapGetters } from 'vuex'
import MyLocalStorage from '../scripts/my-local-storage'
import ModuleName from '../scripts/module-name'
import UserApi from './api/userinfo.api'
import url from '../scripts/url'
export default {
  name: 'app',
  data () {
    return {
      LeftNavbarData: LeftNavbarData,
      userData: {
        account: '',
        organName: '',
        roleName: '',
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
      isReadOnlyUserinfo: true,
      isReadOnlyUserPwd: false,
      logoutDialogVisible: false
    }
  },
  components: {
    'top-navbar': TopNavbar,
    'left-navbar': LeftNavbar
  },
  created () {
    this.getUserinfo()
  },
  methods: {
    getUserinfo () {
      this.userName = MyLocalStorage.getItem(ModuleName.USER_INFO.MODULE_NAME, ModuleName.USER_INFO.USER_NAME)
      this.userData.nickName = localStorage.getItem('admin_name')
      if (this.userData.nickName) {
        UserApi.getUserByUserName(this.userData.nickName).then(
          (data) => {
            this.userData.account = data.account
            this.userData.organName = data.organName
            this.userData.roleName = data.roleName
            this.userData.userId = data.userId
            this.userData.employeeId = data.employeeId
            this.userData.nickName = data.nickName
            this.userData.cellphone = data.cellphone
            this.userData.email = data.email
          }, (err) => {
            console.log(err)
            //              this.$message.error('用户信息加载失败');
          }
        )
      }
    },
    updateUserinfo (userinfo) {
      UserApi.updateUserInfo(userinfo).then(data => {
        if (data.code === '1') {
          this.isReadOnlyUserinfo = true
          this.$message.success('保存成功！')
        }
      }).catch(err => {

      })
    },
    updateUserPwd (PwdInfo) {
      const data = this.composeApiData(PwdInfo)
      UserApi.updatePsw(data).then(result => {
        if (result.code == '013') {
          this.$message.error('密码错误！')
        } else if (result.code === '1') {
          this.logoutDialogVisible = true
          // this.$message.success('保存成功！')
          // setTimeout(() => {
          //   UserApi.logout().then(() => {
          //     window.location.href = `${url.rootPath}/html/login.html?link=${window.location.pathname}`
          //   }).catch(() => {
          //   })
          // }, 3000);
        }
      }).catch(err => {

      })
    },
    composeApiData (PwdInfo) {
      const data = {
        userId: this.userData.userId,
        oldPassword: PwdInfo.oldPassword,
        newPassword: PwdInfo.password
      }
      return data
    },
    changeUserinfoReadOnly (status) {
      this.isReadOnlyUserinfo = status
    },
    changeUserPwdReadOnly (status) {
      this.isReadOnlyUserPwd = status
    },
    logoutHandle () {
      UserApi.logout().then(() => {
        this.logoutDialogVisible = false
        window.location.href = `${url.rootPath}/html/login.html?link=${window.location.pathname}`
      }).catch(() => {
      })
    }
  },
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  }
}
</script>

<style lang="scss">
  @import "../assets/sass/common/common";
  #userinfo-manage{
    height: calc(100%);
    width: 100%;
    .main-container {
      .userinfo-left-nav-bar{
        height: 100%;
        float: left;
        width: 240px;
        box-sizing: border-box;
      }
      .content-container{
        height: 100%;
        float: left;
        width: calc(100% - 240px);
        box-sizing: border-box;
        .el-dialog.el-dialog--small{
          width: 300px;
          text-align: center;
          .el-dialog__body{
             width: 237px;
           }
        }
      }
    }
  }
</style>
