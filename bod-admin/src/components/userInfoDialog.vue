<template>
<el-dialog id="userDialog" title="用户信息" :visible="userFormVisible" :show-close="false" size="small">
  <el-form label-width="80px" :model="user" ref="user" :rules="userRules">
        <el-form-item label="员工编号" prop="employeeId">
          <el-input v-model="user.employeeId" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="user.nickName" ></el-input>
        </el-form-item>
        <el-form-item label="手 机 号" prop="cellphone">
          <el-input v-model="user.cellphone" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" ></el-input>
        </el-form-item>
        <el-form-item v-if="updatePsw===false">
          <el-button type="primary" @click="updatePsws()">修改密码</el-button>
        </el-form-item>
  </el-form>
  <el-form label-width="80px" :model="pswForm" ref="pswForm" :rules="pswRule" v-if="updatePsw===true">
    <el-form-item  label="原密码" prop="oldPassword">
      <el-input type="password" v-model="pswForm.oldPassword" ></el-input>
    </el-form-item>
    <el-form-item  label="新密码" prop="password">
      <el-input type="password" v-model="pswForm.password" ></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="pswForm.confirmPassword" ></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="userFormVisibleCancel">取 消</el-button>
    <el-button type="primary" @click="updateInfo('user','pswForm')">确 定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss">
  #userDialog{
    .el-form-item .el-input{
      width: 80%;
    }
  }
</style>
<script>
import api from '../scripts/api'
import UserApi from '../system-setting/api/systemconfig/usermanage.api'
import bus from '../scripts/bus'
export default {
  props: {
    userFormVisible: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: {

      }
    },
    pswForm: {
      type: Object,
      default: {}
    }
  },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.pswForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (value == this.pswForm.oldPassword) {
        callback(new Error('不能与原密码重复'))
      } else {
        callback()
      }
    }
    var checkOldPass = (rule, value, callback) => {
      if (value == '111111') {
        callback(new Error('不能修改为初始密码'))
      } else {
        callback()
      }
    }
    return {
      validatePass: false,
      updatePsw: false,
      userRules: {
        employeeId: [
          {required: true, message: '请输入员工编号', trigger: 'blur' }
        ],
        nickName: [{required: true, message: '请输入名称', trigger: 'blur' }],
        cellphone: [{required: true, message: '请输入电话号码', trigger: 'blur' }],
        email: [{required: true, message: '请输入邮箱', trigger: 'blur' }]

      },
      pswRule: {
        oldPassword: [
          {validator: checkOldPass, trigger: 'blur'},
          {required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [{required: true, message: '请输入新密码', trigger: 'blur' }, {validator: validateNewPass, trigger: 'blur'}],
        confirmPassword: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    updateInfo (formName1, formName2) {
      this.$refs[formName1].validate((valid) => {
        if (this.updatePsw) {
          this.$refs[formName2].validate((valid1) => {
            if (valid && valid1) {
              bus.$emit('updateUserWithPsw')
            } else {
              return false
            }
          })
        } else {
          if (valid) {
            bus.$emit('updateUserSuccess')
          } else {
            return false
          }
        }
      })
    },
    updatePsws () {
      this.updatePsw = true
    },
    checkPass () {
      if (this.user.confirmPassword != this.user.password) {
        this.$message.error('密码不一致')
      } else if (this.user.confirmPassword.length <= 0) {
        this.$message('请确认密码')
      } else {
        this.validatePass = true
      }
    },
    userFormVisibleCancel () {
      bus.$emit('userFormVisibleCancel')
    }
  }
}
</script>
