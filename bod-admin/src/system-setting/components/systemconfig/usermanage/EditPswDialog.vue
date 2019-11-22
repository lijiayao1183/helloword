<template>
  <el-dialog id="save-dialog"
             :title="title"
             :visible="visible"
             size="tiny"
             :before-close="handleClose"
             :show-close="true">
    <el-form :model="resetPassForm" :rules="pswRules" ref="resetPassForm" label-width="100px">
      <el-form-item label="原密码" prop="oldpsw">
       	<el-input v-model="resetPassForm['oldpsw']" type="password" placeholder="请输入原密码" ></el-input>
	  </el-form-item>
	  <el-form-item label="新密码" prop="pass">
       	<el-input v-model="resetPassForm['pass']" type="password" placeholder="请输入新密码" ></el-input>
	  </el-form-item>
	  <el-form-item label="确认新密码" prop="checkPass">
       	<el-input v-model="resetPassForm['checkPass']" type="password" placeholder="请确认密码" ></el-input>
	  </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="runSave()">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
  import selectOptionMixin from '../../../../mixins/select-option.mixin';
  import UserApi from '@system/api/systemconfig/usermanage.api';
  import UserManageMock from '@system/mock/usersmanage.mock';

  import loginApi from '@system/../login/scripts/api';

  export default {
    props: {
      title: {
        type: String,
        default: '修改密码'
      },
      visible: Boolean
    },
    data() {
      return {
        resetPassForm:{
        	oldpsw: '',
            pass: '',
            checkPass: ''
        }
      }
    },
    created () {
    	this.pswRules = this.pswRules(this.resetPassForm);
    },
    beforeDestroy () {
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
          done();
           this.cancel();
      })
      .catch(_ => {});
      },
      cancel() {
        this.$emit('cancel');
      },
      runSave() {
      	this.$refs['resetPassForm'].validate((valid) => {
          if (valid) {
	        let params = {
	            'username': localStorage.getItem('admin_name'),
	            'password': this.resetPassForm.pass
	        }
	        this.$emit('savePsw', params);
          }
        });
      },
      pswRules(resetPassForm){
    	var checkPsw = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('密码不能为空'));
            }
            setTimeout(() => {
            	let params = {
                    'username': localStorage.getItem('admin_name'),
                    'password': value
                }
            	loginApi.login.post(params)
                .then((data) => {
                	let retCode = parseInt(data.code);
                    if (retCode === 200) {
                    	callback()
                    }else{
                    	callback('密码错误')
                    }
                })
                .catch(function () {
                    callback(new Error('服务异常'))
                })
            }, 1000);
        };

        var validateSamePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== resetPassForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
        };
        var validateIfInitPass = (rule, value, callback) => {
            if (value.match(/^1{6}$/)) {
              callback(new Error('不能使用初始化的缺省密码'))
              return
            }
            callback()
        };
    	return {
            oldpsw: [
             	{required: true, message: "请输入旧密码", trigger: 'blur'},
                {validator: checkPsw, trigger: 'blur'}
            ],
            pass: [
               {required: true, message: "请输入密码", trigger: 'blur'},
               {validator: validateIfInitPass, trigger: 'blur'}
             ],
             checkPass: [
               {required: true, message: "请输入确认密码", trigger: 'blur'},
               {validator: validateIfInitPass, trigger: 'blur'},
               {validator: validateSamePass, trigger: 'blur'}
             ]

        }
    }
    }
  }
</script>
<style lang="scss">
  #field-input-dialog {
    .el-select {
      width: 100%;
    }
  }
  .el-upload{
  	margin: 0 auto;
    display: block;
  }
  .el-upload-dragger{
  	margin: 0 auto;
  }
</style>
