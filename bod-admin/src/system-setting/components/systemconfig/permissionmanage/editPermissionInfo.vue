<template>
  <div id="list-info">
    <div class="action-btn-container">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer;" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div class="save">
          <el-button size="small" type="primary" v-if="!isReadOnly&&!isEdit" @click="submitForm('approval')" class="right">保存</el-button>
          <el-button size="small" type="primary" v-if="isEdit" @click="submitFormEdit('approval')" class="right">保存</el-button>
          <el-button size="small" type="primary" v-if="isReadOnly" @click="update" class="right">编辑</el-button>
        </div>
      </el-row>
    </div>
    <div class="field-value-content">
      <el-form label-width="80px" :model="approval" ref="approval" :rules="approvalRules">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="审批权限" prop="name">
              <el-input v-model="approval.name" :disabled="isReadOnly" placeholder="请输入审批权限名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="权限等级" prop="level">
              <el-input v-model="approval.level" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="授权账户" prop="userIds">
              <el-tag
                class="elTag"
                v-if="isReadOnly"
                v-for="tag in userOptinos"
                type="primary"
                size="medium"
                :key="tag.userId">
                {{tag.account}}（{{tag.nickName}}）
              </el-tag>
              <el-select
                v-if="!isReadOnly"
                v-model="approval.userIds" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in userInfos"
                  :key="item.userId"
                  :label="item.account+'('+item.nickName+')'"
                  :value="item.userId">
                  <span style="float: left">{{ item.account }}</span>
                  <span class="selectRightSpan">{{ item.nickName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import validateRules from '../../../../scripts/validate-rules'
  import PermissionManageApi from '@system/api/systemconfig/permissionmanage.api'
  export default {
    data() {
      return {
        userOptinos:[],
        approval: {
          name:"",
          level:"",
          userIds:[]
        },
        approvalRules:{},
        isReadOnly: true,
        isEdit:false,
        rowDetail: {},
        nameStr:[],
        userInfos:[]
      }
    },
    methods: {
      submitForm:function (formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if(valid){
            let userIdMap = _.cloneDeep(this.approval)
            PermissionManageApi.saveData(userIdMap).then((data) =>{
              if(data.code=="1"){
                this.$router.push('/permission_manage')
              }
            })
          }
        });
      },
      submitFormEdit:function (formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if(valid){
            let userIdMap = _.cloneDeep(this.approval)
            userIdMap['id'] = this.$route.params.id
            PermissionManageApi.editData(userIdMap).then((data) =>{
              if(data.code=="1"){
                this.$router.push('/permission_manage')
              }
            }).catch((res)=>{
              this.$message.warning(res.response.data.error.message)
            })
          }
        });
      },
      quit:function () {
        this.$router.go(-1);
      },
      organRules () {
        let _this = this
        let validateName = _.cloneDeep(validateRules.name)
        validateName.push({
          validator: (rule, value, callback) => {
            if (value && _this.nameStr.indexOf(value) != -1) {
              callback(new Error('审批权限重复'))
            } else {
              callback()
            }
          }, trigger: 'blur'
        })
        return {
          name: validateName,
          userIds: [{type:'array', required: true, message: '不能为空', trigger: 'change'}]
        }
      },
      update(){
        this.isReadOnly = false
        this.isEdit = true
      },
      getUsers(){
        PermissionManageApi.getUsers().then((data) =>{
          this.userInfos = _.filter(data.list,function (item) {
            return item.status == 1
          })
        })
      }
    },
    created(){
      this.nameStr = sessionStorage.getItem('nameStr').split(',')
      this.approvalRules = this.organRules()
      if(this.$route.params.id!='0'){
        this.rowDetail = JSON.parse(sessionStorage.getItem(this.$route.params.id))
        this.approval.name = this.rowDetail.name
        this.approval.userIds = _.map(this.rowDetail.userInfos,'userId')
        this.approval.level = this.rowDetail.level
        this.userOptinos = this.rowDetail.userInfos
      }else{
        this.isReadOnly = false
        this.approval.level = this.$route.query.level- 0 + 1
      }
      this.getUsers()
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
  .save{
    float: right;
    margin-right: 20px;
    margin-top: 5px;
  }
  .el-select{
    width: 100%;
  }
  .elTag{
    display: inline-block;
    margin-right:8px;
  }
  .selectRightSpan{
    float: right;
    color: #8492a6;
    font-size: 12px;
    margin-right: 25px
  }
</style>
