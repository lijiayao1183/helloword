<template>
  <div class="userPwd">
    <div class="userPwd-right">
      <div class="top">
        <el-row style="height:37px;">
          <div style="margin-left: 20px; width: 80px;float: left;">
            <span>修改密码</span>
          </div>
        </el-row>
      </div>
      <div class="bottom">
        <el-form class="userPwd-form"
          ref="userPwd"
          :model="userPwd"
          label-width="90px"
          :rules="PwdRule">
          <el-form-item label="原密码:"
            prop="oldPassword">
            <el-col :span="13">
              <input name="password" autocomplete="new-password" style="width: 0;border:0;float: left;">
              <el-input type="password" auto-complete="new-password"
                v-model="userPwd.oldPassword"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码:"
            prop="password">
            <el-col :span="13">
              <input name="password" autocomplete="new-password" style="width: 0;border:0;float: left;">
              <el-input type="password" auto-complete="new-password"
                v-model="userPwd.password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="重复新密码:"
            prop="confirmPassword">
            <el-col :span="13">
              <input name="password" autocomplete="new-password" style="width: 0;border:0;float: left;">
              <el-input type="password" auto-complete="new-password"
                v-model="userPwd.confirmPassword"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="13">
              <el-button type="primary"
                @click="updateUserPwd('userPwd')"> 保存 </el-button>
              <!--<el-button @click=""> 取消 </el-button>-->
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditPwdinfo",
  props: ['userData'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'));
      } else if (value !== this.userPwd.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    var validateIfInitPass = (rule, value, callback) => {
      if(value===this.userData.account) {
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
      } else if (value === this.userPwd.oldPassword&& rule.field.indexOf('password')>-1) {
        callback(new Error('新密码不能与原密码相同'))
      } else {
        callback()
      }
    }
    return {
      validatePass: false,
      userPwd: {},
      PwdRule: {
        // 原密码只校验不为空
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
          // { min: 8, max: 18, message: '请输入8-18个字符', trigger: 'blur' },
          // { validator: validateIfInitPass, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, max: 18, message: '请输入8-18个字符', trigger: 'blur' },
          { validator: validateIfInitPass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    updateUserPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('updateUserPwd', this.userPwd)
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.userPwd {
  height: 100%;
  .userPwd-right {
    .top {
      border-bottom: 1px solid #e7e7e7;
      height: 37px;
      line-height: 37px;
    }
    .bottom {
      .userPwd-form {
        margin: 35px 35px;
        .el-form-item.is-required .el-form-item__label:before {
          display: none;
        }
      }
    }
  }
}
</style>

