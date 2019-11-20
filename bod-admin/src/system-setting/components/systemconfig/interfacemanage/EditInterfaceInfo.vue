<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer;" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>接口配置</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('interface')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
        <el-form label-width="80px" :model="interface" ref="interface" :rules="interfaceRules">
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="名称" prop="name">
	              <el-input v-model="interface.name" ></el-input>
	            </el-form-item>
	          </el-col>
	        </el-row>
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="组织名称" prop="organId">
	              <el-select v-model="interface.organId" placeholder="请选择" @change="selectOrgan" :disabled="!isEdit" filterable>
	                <el-option
	                  v-for="item in companies"
	                  :key="item.token"
	                  :label="item.name"
	                  :value="item.organId">
	                </el-option>
	              </el-select>
	            </el-form-item>
	          </el-col>
	        </el-row>
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="TOKEN" prop="token">
	              <el-input v-model="interface.token" :disabled="true"></el-input>
	            </el-form-item>
	          </el-col>
	        </el-row>
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="接口URL" prop="url">
	              <el-input v-model="interface.url" ></el-input>
	            </el-form-item>
	          </el-col>
	        </el-row>
	    </el-form>
    </div>
  </div>
</template>
<script>
import InterfacesApi from '@system/api/systemconfig/interfacemanage.api'
import InterfacesManageMock from '@system/mock/interfacemanage.mock'
import UsersApi from '@system/api/systemconfig/usermanage.api'

export default {
  data () {
    return {
      backPath: '/interface_manage',
      interface: {
        id: '',
        name: '',
        code: '',
        status: 1,
        token: '',
        organId: ''
      },
      interfaceRules: {},
      timeout: null,
      companies: [],
      isEdit: this.$route.params.id === 'add'
    }
  },
  methods: {
  	quit () {
      this.$router.push(this.backPath)
    },
    selectOrgan (value, rule, callback) {
      let company = _.find(this.companies, {organId: value})

      if (company) {
      	this.interface.token = company.token
      }
    },
    // 保存验证操作
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doneSave()
        }
      })
    },
    doneSave () {
      let payload = Object.assign({}, this.interface)
      if (this.interface.id) {
        InterfacesApi.updateInterface(payload).then(
          (data) => {
            if (data.code == -3) {
              this.$message.warning(data.msg)
            } else {
              this.afterSuccessSave()
            }
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      } else {
        delete payload.id
        InterfacesApi.saveInterface(payload).then(
          (data) => {
            if (data.code == -3) {
              this.$message.warning(data.msg)
            } else {
              this.afterSuccessSave()
            }
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      }
    },
    afterSuccessSave () {
      this.$message('接口保存成功')
      this.$router.push(this.backPath)
    },
    afterFailSave (err) {
      this.$message('接口保存失败')
    }
  },
  created () {
    // 根据路由信息赋值roleId
    this.interface.id = this.$route.params.id !== 'add' ? this.$route.params.id : ''
    this.interfaceRules = InterfacesManageMock.interfaceRules()
    if (this.interface.id) {
      InterfacesApi.getInterfaceById(this.interface.id).then(
        (data) => {
          this.interface = data
          this.interface.id = this.interface.id.toString()
        }, (err) => {
          this.$message('接口信息加载失败')
        }
      )
    }
    if (this.$route.params.id === 'add') {
	    InterfacesApi.getOrgans().then(
	      (data) => {
	        this.companies = data
	      }, () => {
	        this.$message('加载公司数据失败')
	      }
	    )
    } else {
    	UsersApi.getOrgans().then(
	      (data) => {
	        this.companies = data.list
	      }, () => {
	        this.$message('加载公司数据失败')
	      }
	    )
    }
  }
}
</script>
<style lang="scss" scoped>
.userTitle {
    line-height: 36px;
    border-bottom: 1px dashed #dedede;
    margin-bottom: 15px;
}
.el-dialog__footer {
    text-align: center;
}
</style>
