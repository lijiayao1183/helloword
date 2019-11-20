<template>
  <div class="container">
    <div class="edit-top">
      <div style="margin-left: 20px; width: 50px;float: left;">
          <span @click="back" style="color:#20a0ff;cursor: pointer">&lt;</span>
          <el-button type="text" @click="back">返回</el-button>
      </div>
      <span class="edit-title">{{title}}</span>
      <el-button v-show="!isEdit"
                 :disabled='isDisabledEditBtn'
                 type="text"
                 @click="edit">编辑通道
      </el-button>
    </div>
    <div class="edit-container">
      <el-form :model="data" ref="ruleForm" v-loading="loading" element-loading-text="拼命加载中" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="通道名称：">
	            <template v-if="isEdit" >
	              <el-input v-model="data.channelName" name="channelName"
	               :class="{'input': true, 'is-danger': errors.has('channelName') }"
	               data-vv-as="通道名称"
	               v-validate="nameExpression">
	              </el-input>
	              <span v-if="errors.has('channelName')" class="help is-danger">{{errors.first('channelName')}}</span>
	            </template>
                <span v-else>{{data.channelName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="通道描述：">
              <el-input v-if="isEdit" type="textarea" v-model="data.channelDesc"
              placeholder="非必填" name="channelDesc"></el-input>
              <span v-else>{{data.channelDesc}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备IP：">
	            <template v-if="isEdit" >
	              <el-input v-model="data.ip" name="ip"
	               :class="{'input': true, 'is-danger': errors.has('ip') }"
	               data-vv-as="设备IP"
	               v-validate="'required'">
	              </el-input>
	              <span v-if="errors.has('ip')" class="help is-danger">{{errors.first('ip')}}</span>
	            </template>
                <span v-else>{{data.ip}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备端口：">
	            <template v-if="isEdit" >
	              <el-input v-model="data.port" name="port"
	               :class="{'input': true, 'is-danger': errors.has('port') }"
	               data-vv-as="设备端口"
	               v-validate="portExpression">
	              </el-input>
	              <span v-if="errors.has('port')" class="help is-danger">{{errors.first('port')}}</span>
	            </template>
                <span v-else>{{data.port}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备用户名：">
	            <template v-if="isEdit" >
	              <el-input v-model="puserName"
	               :class="{'input': true, 'is-danger': puserNameError }"
	               data-vv-as="设备用户名"
	               @change="validatePuserNameError" @blur="validatePuserNameError"
	               v-validate="'required'">
	              </el-input>
	              <div v-if="puserNameError" class="el-form-item__error">请正确填写设备用户名</div>
	            </template>
                <span v-else>{{data.userName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isEdit">
          <el-col :span="8">
            <el-form-item label="设备密码：">
	            <el-input v-model="ppassword"
		           :class="{'input': true, 'is-danger': ppasswordError }"
		            data-vv-as="设备密码" type="password" auto-complete="new-password"
		            @change="validatePpasswordError" @blur="validatePpasswordError"
		            v-validate="'required'"></el-input>
		        <div v-if="ppasswordError" class="el-form-item__error">请正确填写设备密码</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-form-item label="传输协议：">
	            <template v-if="isEdit" >
	              <el-select v-model="data.channelType" placeholder="请选择"  name="channelType"
	               :class="{'input': true, 'is-danger': errors.has('channelType') }"
	               data-vv-as="传输协议"
	               v-validate="'required'">
	                <el-option
	                  v-for="item in channelTypeOptions"
	                  :key="item.value"
	                  :label="item.name"
	                  :value="item.value">
	                </el-option>
	              </el-select>
	              <span v-if="errors.has('channelType')" class="help is-danger">{{errors.first('channelType')}}</span>
	            </template>
                <span v-else>{{data.channelType}}</span>
            </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="推流地址：">
              <template v-if="isEdit">
                <el-input v-model="data.channelDest"  name="channelDest"
                  :class="{'input': true, 'is-danger': errors.has('channelDest') }"
	              data-vv-as="推流地址"
	              v-validate="'required'"
                ></el-input>
                <span v-if="errors.has('channelDest')" class="help is-danger">{{errors.first('channelDest')}}</span>
              </template>
              <span v-else>{{data.channelDest}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button type="primary" class="save-btn" @click="save" :loading="saving" v-show="isEdit">{{channelId === -1 ? "提交" : "保存"}}</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import api from '../scripts/api'
import {
  channelTypeOptions,
  detailData,
  createData
} from '../mock/mock.data'

import myLocalStorage from '../../../scripts/my-local-storage'
import moduleName from '../../../scripts/module-name'

let isDebug = false
export default {
  $validates: true,
  data () {
    return {
      channelTypeOptions: channelTypeOptions,
      channelId: parseInt(this.$route.params.id),
      catalogId: parseInt(this.$route.params.catalogId),
      initName: '',
      data: _.cloneDeep(detailData),
      isEdit: false,
      nameExpression: {
        rules: {
          required: true,
          nameExist: null
        }
      },
      puserNameError: false,
      ppasswordError: false,
      puserName: '',
      ppassword: '',
      portExpression: {
        rules: {
          required: true,
          lessThanNumberEquals: 1,
          moreThanNumberEquals: 65535,
          isInteger: true
        }
      }
    }
  },
  components: {
  },
  created () {
    this.init()
  },
  watch: {
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      saving: 'saving'
    }),
    isDisabledEditBtn () {
      return false
    },
    title () {
      return this.channelId === -1 ? '新建通道' : (this.isEdit ? '编辑通道' : '通道详情')
    }
  },
  methods: {
    validatePuserNameError () {
      this.puserNameError = !this.puserName || _.trim(this.puserName).length == 0
    },
    validatePpasswordError () {
      this.ppasswordError = !this.ppassword || _.trim(this.ppassword).length == 0
    },
    init () {
      this.nameExpression.rules.nameExist = this.validateChannelName

      if (this.channelId === -1) {
        this.isEdit = true
        this.data = _.cloneDeep(createData)
      } else {
        api.channel.detail(this.channelId).then(res => {
          this.data = res.data
          this.initName = res.data.channelName
          this.puserName = res.data.userName
          this.ppassword = res.data.passWord
        })
      }
    },
    back () {
      this.$router.push({
        path: '/channel-manage/list-info/' + this.catalogId
      })
    },
    edit () {
      this.isEdit = true
    },
    save () {
      this.validatePpasswordError()
      this.validatePuserNameError()
      this.$validator.validateAll().then(
        result => {
          if (result) {
            this.commit()
          }
        }
      )
    },
    commit () {
      this.data.catalogId = this.catalogId
      this.data.passWord = this.ppassword
      this.data.userName = this.puserName
      if (!isDebug) {
        if (this.channelId === -1) {
          api.channel.save(this.data).then(res => {
		            if (res.code == '0000') {
		                this.$message.success('创建成功')
		            	this.$router.back(-1)
		            } else if (res.msg) {
		                this.$message({
				          message: res.msg,
				          type: 'error'
				        })
		            }
		       }).catch(v => {
            this.$message({
			          message: '创建异常',
			          type: 'error'
			        })
          })
        } else {
	            api.channel.update(this.data).then(res => {
		            if (res.code == '0000') {
		                this.$message.success('更新成功')
		            	this.$router.back(-1)
		            } else if (res.msg) {
		                this.$message({
				          message: res.msg,
				          type: 'error'
				        })
		            }
		        }).catch(v => {
            this.$message({
			          message: '更新异常',
			          type: 'error'
			        })
          })
	        }
      } else {
        this.$router.push('/')
      }
    },
    validateChannelName (value) {
      if (this.channelId != -1 && value == this.initName) {
        return true
      }
      return api.ifChannelNameExist(encodeURIComponent(value)).then(
        res => {
          return res.data
        }, () => {
          return false
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.input.c-field-equation {
    border: 1px solid #bfcbd9;
    border-radius: 4px;
}
.input.c-field-equation.is-danger{
    border-color: #ff3860;
}
.includeFormula .textArea > .common-formulas > .inputor{
    border-radius: 4px;
}
  .container {
    box-sizing: border-box;
    & > div {
      background-color: #fff;
    }
  }

  .edit-top {
    border-bottom: 1px solid #e7e7e7;
    height: 37px;
    line-height: 37px;
    & > :last-child {
      float: right;
      margin-right: 30px;
    }
    .edit-title {
      width: 80px;
      float: left;
      margin-left: 30px;
      color: #48576a;
    }
  }

  .edit-container {
    height: calc(100% - 51px);
    padding: 20px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .save-btn {
    margin-top: 15px;
    margin-left: 100px;
  }

</style>
