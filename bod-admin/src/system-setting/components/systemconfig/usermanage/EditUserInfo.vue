<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span @click="quit"
            style="color:#20a0ff;cursor: pointer">&lt;</span>
          <el-button type="text"
            @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>用户管理</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small"
            @click="submitForm('user')"
            class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
      <el-form label-width="80px"
        :model="user"
        ref="user"
        :rules="userRules">
        <div class="userTitle">配置账号</div>

        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="账号"
              prop="account">
              <el-input v-model="user.account"
                :disabled="currentPath==='editUser'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="组织"
              prop="organId">
              <el-select :disabled="currentPath==='editUser'"
                v-model="user.organId"
                placeholder="请选择" filterable>
                <el-option v-for="item in companies"
                  @click.native="changeOrgan"
                  :key="item.organId"
                  :label="item.name"
                  :value="item.organId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="角色"
              prop="roleId">
              <el-select v-model="user.roleId"
                placeholder="请选择"
                :disabled="!user.organId" filterable>
                <el-option v-for="item in roles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="userTitle">使用人信息</div>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="员工编号"
              prop="employeeId">
              <el-input v-model="user.employeeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="姓名"
              prop="nickName">
              <el-input v-model="user.nickName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="IP地址">
              <el-input v-model.trim="user.restrictedIp"
                placeholder="IP地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="手 机 号"
              prop="cellphone">
              <el-input v-model="user.cellphone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="邮箱"
              prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="有效日期"
              prop="effectiveDate"
              :editable="false"
              :rules="[
                {validator: validatorDate, trigger: 'blur'}
              ]">
              <el-date-picker v-model="user.effectiveDate"
                type="date"
                placeholder="有效日期"
                :picker-options="{disabledDate}">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import UserApi from '@system/api/systemconfig/usermanage.api'
import UserManageMock from '@system/mock/usersmanage.mock'

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
        birth: '',
        restrictedIp: '',
        effectiveDate: ''
      },
      userRules: {},
      existRuleItem: {},
      userInitAccount: '',
      companies: [],
      currentPath: '',
      roles: [],
      getUserPromise: null,
      getOrganPromise: null,
      timeout: null
    }
  },
  methods: {
    disabledDate (date) {
      return date <= +new Date() - 86400000
    },
    validatorDate (rule, value, callback) {
      if (value && (+new Date(value) < +new Date() - 86400000)) {
        callback(new Error('有效期已失效'))
      } else {
        callback()
      }
    },
    quit () {
      this.$router.push(this.backPath)
    },
    // 保存验证操作
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.user.effectiveDate) {
            this.user.effectiveDate = +new Date(this.user.effectiveDate)
          }
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
      this.user.roleId = null
      this.getRoles()
    },
    getRoles () {
      let url = '/api/organ/' + this.user.organId + '/roles?pageSize=0'
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
      if (this.getParam() == 'add') {
        this.$message('用户默认密码为：111111')
      }
      this.$router.push(this.backPath)
    },
    getParam () {
      let url = window.location.href
      if (url.indexOf('?') != -1) {
        let obj = url.substr(url.indexOf('?') + 1)
        let key = obj.substr(0, obj.indexOf('='))
        return key
      } else {
        return 0
      }
    },
    afterFailSave (err) {
      console.log(err)
      this.$message('用户保存失败')
    },
    checkAccout (rule, value, callback) {
      UserApi.checkIfExistAccout(value, this.user.userId = this.$route.params.id !== 'add' ? this.$route.params.id : '').then(
        (res) => {
          if (res && value !== this.userInitAccount) {
            callback(new Error('该账户已经存在，请更改账户名'))
          } else {
            callback()
          }
        }, (err) => {
          console.log(err)
          callback()
        }
      )
      //        clearTimeout(self.timeout)
      //        self.timeout = setTimeout(
      //          function () {
      //            clearTimeout(self.timeout)
      //            if (self.user.userId && value === self.userInitAccount) {
      //              callback()
      //              return
      //            }
      //            UserApi.checkIfExistAccout(value,self.user.userId).then(
      //              (res) => {
      //                if (res && value !== self.userInitAccount) {
      //                  callback(new Error('该账户已经存在，请更改账户名'))
      //                } else {
      //                  callback()
      //                }
      //              }, (err) => {
      //                console.log(err)
      //                callback()
      //              }
      //            )
      //          }, 500)
    }
  },
  created () {
    if (this.$route.params.id !== 'add') {
      this.currentPath = 'editUser'
    }
    // 根据路由信息赋值userId
    this.user.userId = this.$route.params.id !== 'add' ? this.$route.params.id : ''
    this.existRuleItem = { validator: this.checkAccout, trigger: 'blur' }
    this.userRules = UserManageMock.userRules()
    this.userRules.account.push(this.existRuleItem)
    UserApi.getOrganForRole().then(
      (data) => {
        if (!this.user.organId) { // 默认选中第一个组织
          let defaultCheckOrgan = _.first(data)
          if (defaultCheckOrgan) {
            this.user.organId = defaultCheckOrgan.organId
            this.getRoles()
          }
        }
        this.companies = data
      }, () => {

      }
    )
    if (this.user.userId) {
      UserApi.getUserById(this.user.userId).then(
        (data) => {
          this.user = data
          this.userInitAccount = this.user.account
          this.getRoles()
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

  .edit-info-bottom > .el-form {
    padding: 20px 20px;

    .el-form-item.is-required .el-form-item__label:before {
      content: none;
    }

    .el-form-item.is-required .el-form-item__label:after {
      content: "*";
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

    #condition-region .el-form {
      padding: 0px 0px;
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
