<template>
  <div id="edit-organ-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer;" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;line-height:34px;margin-left:30px;color:#48576a;">
          <span>组织管理</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('organ')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
      <el-form label-width="80px" :model="organ" ref="organ" :rules="organRules">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="名称" prop="name">
              <el-input v-model="organ.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="代号" prop="code">
              <el-input v-model="organ.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import OrgansApi from '@system/api/systemconfig/organmanage.api'
  import OrgansManageMock from '@system/mock/organmanage.mock'
  import ResponseUtils from '../../../../scripts/response-utils';
  export default {
    data() {
      return {
        backPath: '/organ_manage',
        organ: {
          organId: '',
          name: '',
          code: '',
          author: '',
          birth: '',
          email: '',
          status: 1,
          telephone: '',
          token: ''
        },
        copiedOrganName: '',
        copiedOrganCode:'',
        organRules: {},
        timeout: null
      }
    },
    methods: {
      quit() {
        this.$router.push(this.backPath)
      },
      // 保存验证操作
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.doneSave()
          }
        })
      },
      doneSave() {
        let payload = Object.assign({}, this.organ)
        if (this.organ.organId) {
          OrgansApi.updateOrgan(payload).then(
            (data) => {
              this.$router.push(this.backPath)
            }, (error) => {
              ResponseUtils.showErrorMessage(error, '组织保存失败');
            }
          )
        } else {
          delete payload.organId
          OrgansApi.saveOrgan(payload).then(
            (data) => {
              this.$router.push(this.backPath)
            }, (error) => {
              ResponseUtils.showErrorMessage(error, '组织保存失败');
            }
          )
        }
      },
      checkOrgan(rule, value, callback) {
        let self = this
        self.timeout = setTimeout(
          function () {
            if (self.organ.organId && value === self.copiedOrganName) {
              callback()
              return
            }
            OrgansApi.exitName(value,self.$route.params.id !== 'add' ? self.$route.params.id : '').then(
              (res) => {
                if (res && value !== self.copiedOrganName) {
                  callback(new Error('该组织名称已经存在，请更改'))
                } else {
                  callback()
                }
              }, (err) => {
                console.log(err)
                callback()
              }
            )
          }, 200)
      },
      checkOrganCode(rule, value, callback){
        let self = this
        self.timeout = setTimeout(
          function () {
            if (self.organ.organId && value === self.copiedOrganCode) {
              callback()
              return
            }
            OrgansApi.isHasOrganCode(value,self.$route.params.id ==='add' ? '' : self.$route.params.id).then(
              (res) => {
                if (res) {
                  callback(new Error('该组织代号已经存在，请更改'))
                } else {
                  callback()
                }
              }, (err) => {
                console.log(err)
                callback()
              }
            )
          }, 200)
      }
    },
    created() {
      // 根据路由信息赋值roleId
      this.organ.organId = this.$route.params.id !== 'add' ? this.$route.params.id : ''
      this.organRules = OrgansManageMock.organRules()
      this.organRules.code.push({
        validator: this.checkOrganCode, trigger: 'change'
      })
      this.organRules.name.push(
        {validator: this.checkOrgan, trigger: 'change'}
      )
      if (this.organ.organId) {
        OrgansApi.getOrganById(this.organ.organId).then(
          (data) => {
            this.organ = data
            this.organ.organId = this.organ.organId.toString()
            this.copiedOrganName = this.organ.name
            this.copiedOrganCode = this.organ.code
          }, (err) => {
            console.log(err)
            this.$message('组织信息加载失败')
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
  #edit-organ-info{
    .edit-info-bottom{
      margin-left: 20px;
    }
  }

  .el-dialog__footer {
    text-align: center;
  }
</style>
