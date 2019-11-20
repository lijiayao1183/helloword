<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>角色管理</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('role')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
      <el-form label-width="80px" :model="role" ref="role" :rules="roleRules">
        <el-row :gutter="30" type="flex" class="row-bg" justify="center">
          <el-col :span="7">
            <el-form-item label="角色名" prop="roleName">
              <el-input v-model="role.roleName"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="ifAdmin">
            <el-col :span="7">
              <el-form-item label="组织" prop="organId" :class="{'is-error': ifOrganHasRecord}">
                <el-select :disabled="currentPath=='editRole'"
                v-model="role.organId" placeholder="请选择" @change="validateOrgan" filterable>
                  <el-option
                    v-for="item in companies"
                    :key="item.organId"
                    :label="item.name"
                    :value="item.organId">
                  </el-option>
                </el-select>
                <template v-if="ifOrganHasRecord">
                  <div class="el-form-item__error">
                    已为该组织创建角色，请更换组织
                  </div>
                </template>
              </el-form-item>

            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import RolesApi from '@system/api/systemconfig/rolemanage.api'
import UsersApi from '@system/api/systemconfig/usermanage.api'
import RolesManageMock from '@system/mock/rolesmanage.mock'
import ResponseUtils from '../../../../scripts/response-utils'

export default {
  data () {
    return {
      backPath: '/role_manage',
      role: {
        roleId: '',
        roleName: '',
        organId: null,
        roleCode: '',
        roleDesc: '',
        author: '',
        birth: '',
        status: 1
      },
      copiedOrganId: '',
      currentPath: '',
      timeout: null,
      roleRules: {},
      companies: [],
      ifAdmin: false,
      ifOrganHasRecord: false,
      copiedRoleName: ''
    }
  },
  watch: {

  },
  methods: {
    quit () {
      this.$router.push(this.backPath)
    },
    // 保存验证操作
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && !this.ifOrganHasRecord) {
          this.doneSaveOrUpdate()
        }
      })
    },
    checkAccout (rule, value, callback) {
      if (this.ifAdmin) {
        if (this.role.roleId != this.$route.params.id && this.$route.params.id != 'add') {
          this.role.roleId = this.$route.params.id
          RolesApi.getRoleById(this.role.roleId).then(
            (data) => {
              this.role = data
              this.role.roleName = value
              this.copiedRoleName = _.cloneDeep(this.role.roleName)
              this.copiedOrganId = _.cloneDeep(this.role.organId)
              // this.role.organId = data.organId.toString()
              if (this.role.roleId && value === this.copiedRoleName || (this.ifAdmin && !this.role.organId)) {
                callback()
                return
              }
              RolesApi.checkRoleNameExist(this.role.organId, this.role.roleName, this.$route.params.id === 'add' ? '' : this.role.roleId).then(
                (res) => {
                  if (res && value !== this.copiedRoleName) {
                    callback(new Error('该角色已经存在，请更改角色名'))
                  } else {
                    callback()
                  }
                }, (err) => {
                  console.log(err)
                  callback()
                }
              )
            }, (err) => {
              console.log(err)
              this.$message('角色信息加载失败')
            }
          )
          //          }else{
          //            if (this.role.roleId && value === this.copiedRoleName || (this.ifAdmin && !this.role.organId)) {
          //              callback()
          //              return
          //            }
          //            RolesApi.checkRoleNameExist(this.role.organId,value,this.$route.params.id==='add'?'':this.role.roleId).then(
          //              (res) => {
          //                if (res && value !== this.copiedRoleName) {
          //                  callback(new Error('该角色已经存在，请更改角色名'))
          //                } else {
          //                  callback()
          //                }
          //              }, (err) => {
          //                console.log(err)
          //                callback()
          //              }
          //            )
          //          }
        } else {
          if (this.role.organId) {
            RolesApi.checkRoleNameExist(this.role.organId, this.role.roleName, this.$route.params.id === 'add' ? '' : this.role.roleId).then(
              (res) => {
                if (res && value !== this.copiedRoleName) {
                  callback(new Error('该角色已经存在，请更改角色名'))
                } else {
                  callback()
                }
              }, (err) => {
                console.log(err)
                callback()
              }
            )
          } else {
            callback()
          }
        }
      } else if (!this.ifAdmin) {
        RolesApi.checkRoleNameExist(this.role.organId = '', value, this.$route.params.id === 'add' ? '' : this.role.roleId).then(
          (res) => {
            if (res && value !== this.copiedRoleName) {
              callback(new Error('该角色已经存在，请更改角色名'))
            } else {
              callback()
            }
          }, (err) => {
            console.log(err)
            callback()
          }
        )
      }
      //          }, 500)
    },
    validateOrgan (rule, value, callback) {
      if (this.copiedOrganId && this.copiedOrganId === this.role.organId) {
        this.ifOrganHasRecord = false
      }
      /*
        RolesApi.isHasManagerRole(this.role.organId).then(
              (res) => {
                if (res) {
                    this.ifOrganHasRecord = true
                } else {
                    this.ifOrganHasRecord = false
                }
              }, (err) => {
                    this.ifOrganHasRecord = false
              }
          ) */
    },
    doneSaveOrUpdate () {
      let payload = Object.assign({}, this.role)
      if (this.role.roleId) {
        RolesApi.checkRoleNameExist(this.role.organId, this.role.roleName, this.$route.params.id === 'add' ? '' : this.role.roleId).then((data) => {
          if (data) {
            this.$message.warning('该组织下已存在此角色名，请修改角色名')
          } else {
            RolesApi.updateRole(payload).then(
              (data) => {
                this.$router.push(this.backPath)
              }, (error) => {
                ResponseUtils.showErrorMessage(error, '角色保存失败')
              }
            )
          }
        })
      } else {
        delete payload.roleId
        RolesApi.saveRole(payload).then(
          (data) => {
            this.$router.push(this.backPath)
          }, (error) => {
            ResponseUtils.showErrorMessage(error, '角色保存失败')
          }
        )
      }
    }
  },
  created () {
    if (this.$route.params.id !== 'add') {
      this.currentPath = 'editRole'
    }
    if (localStorage && localStorage.getItem('admin_name') && localStorage.getItem('admin_name') === 'admin') {
      this.ifAdmin = true
    }
    // 根据路由信息赋值roleId
    this.role.roleId = this.$route.params.id !== 'add' ? this.$route.params.id : ''
    this.roleRules = RolesManageMock.roleRules()
    //      if(this.$route.params.id !== 'add'){
    let existRuleItem = {validator: this.checkAccout, trigger: 'blur'}
    this.roleRules.roleName.push(existRuleItem)
    //      }
    UsersApi.getOrgans().then(
      (data) => {
        this.companies = data.list
      }, () => {
        this.$message('加载组织数据失败')
      }
    )
    if (this.role.roleId != 'add' && this.role.roleId != '') {
      RolesApi.getRoleById(this.role.roleId).then(
        (data) => {
          this.role = data
          this.copiedRoleName = _.cloneDeep(this.role.roleName)
          this.copiedOrganId = _.cloneDeep(this.role.organId)
          // this.role.organId = data.organId.toString()
        }, (err) => {
          console.log(err)
          this.$message('角色信息加载失败')
        }
      )
    }
  }
}
</script>
