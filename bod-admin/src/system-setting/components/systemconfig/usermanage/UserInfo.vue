<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>我的信息</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('user')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
      <el-form label-width="80px" :model="user" ref="user" :rules="userRules">
        <el-row :gutter="30">
            <el-col :span="7">
              <el-form-item label="员工编号" prop="employeeId">
                <el-input v-model="user.employeeId" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="姓名" prop="nickName">
                <el-input v-model="user.nickName" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="7">
              <el-form-item label="手 机 号" prop="cellphone">
                <el-input v-model="user.cellphone" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email" ></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
        	<div style="float: left;margin-right: 20px;">
	          <el-button size="small"  @click="updatePsw()" class="right">修改密码</el-button>
	        </div>
        </el-row>
      </el-form>
    </div>

    <!----修改密码--->
    <psw-dialog ref="pswDialog"
               :visible="isShowPswDialog"
               @cancel="isShowPswDialog=false"
               @savePsw="savePsw">
    </psw-dialog>
  </div>
</template>
<script>
import MyLocalStorage from '@system/../scripts/my-local-storage'
import ModuleName from '@system/../scripts/module-name'
import UserApi from '@system/api/systemconfig/usermanage.api'
import UserManageMock from '@system/mock/usersmanage.mock'
import loginApi from '@system/../login/scripts/api'

import PswDialog from './EditPswDialog.vue'

export default {
  data () {
    return {
      backPath: '/user_manage',
      formularExpress: [],
      user: {
        userId: '',
        account: '',
        organId: null,
        roleId: null,
        employeeId: '',
        nickName: '',
        cellphone: '',
        email: '',
        password: '111111',
        qq: '',
        latestTime: '',
        latestIp: '',
        author: '',
        status: 1,
        birth: ''
      },
      userRules: {},
      existRuleItem: {},
      userInitAccount: '',
      companies: [],
      roles: [],
      getUserPromise: null,
      getOrganPromise: null,
      timeout: null,
      isShowPswDialog: false
    }
  },
  components: {
    'psw-dialog': PswDialog
  },
  watch: {
    $route (to, from) {
      if (to.query.notFromUserName == false) {
        console.log(to.query.notFromUserName)
      }
    }
  },
  methods: {
    updatePsw () {
    	this.isShowPswDialog = true
    },
    savePsw (params) {
    	loginApi.resetPassword(params.username, params.password).then(
        res => {
          this.isShowPswDialog = false
          this.$alert('密码重置成功，请重新登录', '提示', {
            confirmButtonText: '确定',
            type: 'info',
            callback: action => {
              this.ifLogin = true
            }
          })
        }, (err) => {
          console.log(err)
        }
      )
    },
    quit () {
      this.$router.push(this.backPath)
    },
    // 保存验证操作
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doneSaveOrUpdate()
        }
      })
    },
    doneSaveOrUpdate () {
      let payload = Object.assign({}, this.user)
      if (this.user.userId) {
        UserApi.updateUser(payload).then(
          (data) => {
            if (data.code === '1') {
              this.afterSuccessSave()
              return
            }
            this.afterFailSave(data.masg)
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      } else {
        delete payload.userId
        UserApi.saveUser(payload).then(
          (data) => {
            if (data.code === '1') {
              this.afterSuccessSave()
              return
            }
            this.afterFailSave(data.masg)
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      }
    },
    changeOrgan (rule) {
      if (!rule) {
        this.user.roleId = null
      }
      let url = '/api/organ/' + this.user.organId + '/roles?status=1&pageSize=0'
      UserApi.getRolesByOrganId(url).then(
        (data) => {
          this.roles = data.list
        }, (err) => {
          console.log(err)
          this.$message('角色信息加载失败')
        }
      )
    },
    afterSuccessSave () {
      this.$message('用户保存成功')
      //      this.$router.push(this.backPath);
      window.history.go(-1)
    },
    afterFailSave (err) {
      console.log(err)
      this.$message('用户保存失败')
    },
    checkAccout (rule, value, callback) {
      let self = this
      clearTimeout(self.timeout)
      self.timeout = setTimeout(
        function () {
          clearTimeout(self.timeout)
          if (self.user.userId && value === self.userInitAccount) {
            callback()
            return
          }
          UserApi.checkIfExistAccout(value).then(
            (res) => {
              if (res && value !== self.userInitAccount) {
                callback(new Error('该账户已经存在，请更改账户名'))
              } else {
                callback()
              }
            }, (err) => {
              console.log(err)
              callback()
            }
          )
        }, 500)
    }
  },
  created () {
    // 根据路由信息赋值userId
    this.user.userName = localStorage.getItem('admin_name')
    this.existRuleItem = { validator: this.checkAccout, trigger: 'change' }
    this.userRules = UserManageMock.userRules()
    this.userRules.account.push(this.existRuleItem)
    UserApi.getOrganForRole().then(
      (data) => {
        this.companies = data
      }, () => {

      }
    )
    if (this.user.userName) {
      UserApi.getUserByUserName(this.user.userName).then(
        (data) => {
          this.user = data
          this.userInitAccount = this.user.account
          this.changeOrgan(true)
        }, (err) => {
          console.log(err)
          //          this.$message('用户信息加载失败')
        }
      )
    }
  }
}
</script>
<style lang="scss">
  $container-left: 78px;
  $container-bottom: 50px;
  $btn-container-bottom: 8px;
  #edit-info {
    height: 100%;
    .edit-info-top {
      border-bottom: 1px solid $split-color;
      height: $action-btn-container-height;
      line-height: $action-btn-container-height;
      .el-button--small {
        margin-top: 3px;
      }
      span {
        font-size: 14px;
      }
    }
    .el-tabs__header .el-tabs__nav-wrap {
      right: 0px;
    }

    .edit-info-bottom >.el-form {
	    padding: 20px 20px;

	    .el-form-item.is-required .el-form-item__label:before {
	      content: none;
	    }

	    .el-form-item.is-required .el-form-item__label:after {
	      content: '*';
	      color: $require-text-color;
	      margin-right: 4px;
	      font-size: 12px;
	    }

	    .el-form-item__label {
	      text-align: left;
	    }
	}
    .edit-info-bottom {
      margin: 0px 0px;
      height: calc(100% - 38px);
      overflow-y: auto;
      overflow-x: hidden;

      #condition-region .el-form{
      	padding:  0px 0px;
      }
      .equals-container {
        text-align: center;
        position: relative;
        top: 5px;
      }
      .el-select {
        width: 100%;
      }
      .condition-container {
        position: relative;
        left: $container-left;
        bottom: $container-bottom;
        .btn-container {
          position: relative;
          bottom: $btn-container-bottom;
        }
        .el-form-item__content {
          margin-left: 0 !important;
        }
        .el-form {
          padding: 0;
        }
      }
    }
  }
</style>
