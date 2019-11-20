<template>
  <div class="userinfo">
    <div class="userinfo-right">
      <div class="top">
        <el-row style="height:37px;">
          <div style="margin-left: 20px; width: 80px;float: left;">
            <span>个人信息</span>
          </div>
        </el-row>
      </div>
      <div class="bottom">
        <el-form class="userinfo-form" ref="userinfoForm" :model="userDataCopy" label-width="90px" :rules="userRules">
          <el-form-item label="账号:">
            <el-col :span="13">
              <span v-text="userDataCopy.account"></span>
            </el-col>
          </el-form-item>
          <el-form-item label="组织:">
            <el-col :span="13">
              <span v-text="userDataCopy.organName"></span>
            </el-col>
          </el-form-item>
          <el-form-item label="角色:">
            <el-col :span="13">
              <span v-text="userDataCopy.roleName"></span>
            </el-col>
          </el-form-item>
          <el-form-item label="员工编号:">
            <el-col :span="13">
              <span v-text="userDataCopy.employeeId"></span>
            </el-col>
          </el-form-item>
          <el-form-item label="姓名:">
          <el-col :span="13">
            <span v-text="userDataCopy.nickName"></span>
          </el-col>
        </el-form-item>
          <el-form-item label="手机号:" prop="cellphone">
            <el-col :span="13">
              <span v-if="isReadOnlyUserinfo" v-text="userDataCopy.cellphone"></span>
              <el-input v-else v-model="userDataCopy.cellphone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-col :span="13">
              <span v-if="isReadOnlyUserinfo" v-text="userDataCopy.email"></span>
              <el-input v-else v-model="userDataCopy.email"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="13">
              <template v-if="!isReadOnlyUserinfo">
                <el-button type="primary" @click="updateUserinfo('userinfoForm')"> 保存 </el-button>
                <el-button @click="cancelUserinfo('userinfoForm', true)"> 取消 </el-button>
              </template>
              <el-button v-else type="primary" @click="editUserinfo(false)"> 编辑 </el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import validateRules from '../../scripts/validate-rules'
export default {
  name: 'EditUserinfo',
  props: {
    userData: {
      type: Object,
      default () {
        return {}
      }
    },
    isReadOnlyUserinfo: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userRules: {
        cellphone: validateRules.isCellphoneNum,
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur' },
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userDataCopy () {
      return { ...this.userData }
    }
  },
  methods: {
    updateUserinfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('updateUserinfo', this.userDataCopy)
        } else {
          return false
        }
      })
    },
    cancelUserinfo (formName, val) {
      this.editUserinfo(val)
      this.userDataCopy.cellphone = this.userData.cellphone
      this.userDataCopy.email = this.userData.email
      // this.$refs[formName].validate()
      this.$refs[formName].resetFields()
      this.userDataCopy.cellphone = this.userData.cellphone
      this.userDataCopy.email = this.userData.email
    },
    editUserinfo (val) {
      this.$emit('changeUserinfoReadOnly', val)
    }
  }
}
</script>

<style lang="scss">
  .userinfo{
    height: 100%;
    .userinfo-right {
      .top {
        border-bottom: 1px solid #e7e7e7;
        height: 37px;
        line-height: 37px;
      }
    .bottom {
      .userinfo-form{
        margin: 18px 22px;
        .el-form-item.is-required .el-form-item__label:before{
          display: none;
        }
      }
      }
    }
  }

</style>
