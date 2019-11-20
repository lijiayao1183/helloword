<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>权限配置</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm()" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
      <el-form label-width="80px" :model="role" ref="role">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="角色名">
              <el-input v-model="role.roleName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item label="组织">
              <el-select v-model="role.organId" placeholder="请选择" :disabled="true">
                <el-option
                  v-for="item in companies"
                  :key="item.organId"
                  :label="item.name"
                  :value="item.organId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="userTitle">功能权限</div>
        <el-row>
          <common-tree
            :data="tree.treeData"
            :treeRef="tree.treeRef"
            :defaultProps="tree.defaultProps"
            :checkedKeys="tree.selectedNodesKeys"
            :node="tree.node"
            :checkStrictly="tree.checkStrictly"
            @getCheckedNodeIds="getCheckedNodeIds">
          </common-tree>
        </el-row>
        <template v-for="tree in dataTree">
          <div class="userTitle" style="margin-top: 20px;">{{tree.title}}</div>
          <el-row>
            <el-tree
              :data="tree.treeData"
              :props="tree.defaultProps"
              node-key="id"
              :default-checked-keys="tree.defaultCheckedKeys"
              show-checkbox
              @check-change="treeCheckChange(tree)"
              :ref="tree.treeRef">
            </el-tree>
          </el-row>
        </template>
      </el-form>
    </div>
  </div>
</template>
<script>
import RolesApi from '@system/api/systemconfig/rolemanage.api'
import UserApi from '@system/api/systemconfig/usermanage.api'
import CommonTree from '@system/components/systemconfig/common/CommonTree'
import UtilsMock from '@system/mock/utils.mock'

let url = require('../../../../scripts/url')

export default {
  data () {
    return {
      backPath: '/role_manage',
      role: {
        roleId: '',
        roleName: '',
        organId: '',
        parentId: ''
      },
      tree: {
        treeRef: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        node: {
          id: 'resourceId',
          parentId: 'parentId'
        },
        selectedNodesKeys: [],
        checkStrictly: false
      },
      dataTree: [],
      companies: [],
      getOrganPromise: null,
      getRolePrommise: null,
      getPermissionPromise: null
    }
  },
  methods: {
    quit () {
      this.$router.push(this.backPath)
    },
    // 保存验证操作
    submitForm () {
      let payload = {
        ids: this.tree.selectedNodesKeys.join(','),
        roleId: this.role.roleId
      }
      this.getRolePrommise = RolesApi.putRoleResource(payload).then(
        (res) => {
          RolesApi.getUserinfo().then((data) => {
            console.log(this.role)
            if (data.roleId === this.role.roleId) {
              this.$message.success('分配权限成功,请重新登陆！')
              setTimeout(() => {
                // window.location.href = `${url.rootPath}/html/login.html?link=${window.location.pathname}`
              }, 1500)
            }
          }).catch((err) => {
          })
        }, (err) => {
          console.log(err)
        }
      )

      let addRoleRelPromises = []
      _.forEach(this.dataTree, tree => {
        let ids = tree.selectedNodesKeys.join(',')
        addRoleRelPromises.push(RolesApi.addRoleResource(this.role.roleId, ids, tree.serviceName).then(
          res => {
            console.log(res)
          }, err => {
            console.log(err)
          }
        ))
      })
      Promise.all(_.concat(this.getRolePrommise, addRoleRelPromises)).then(
        (res) => {
          this.$message('分配权限成功')
          this.$router.push('/role_manage')
        }, (err) => {
          console.log(err)
        }
      )
    },
    afterSuccessSave () {
      this.$message('角色保存成功')
      this.$router.push(this.backPath)
    },
    afterFailSave (err) {
      console.log(err)
      this.$message('角色保存失败')
    },
    /**
       * 获得选中的节点（包含虚拟选中的父节点）
       */
    getCheckedNodeIds (nodeIds) {
      this.tree.selectedNodesKeys = nodeIds
      let index = this.tree.selectedNodesKeys.indexOf(0)
      if (index !== -1) {
        this.tree.selectedNodesKeys.splice(index, 1)
      }
    },
    treeCheckChange (tree) {
      tree.selectedNodesKeys = this.$refs[tree.treeRef][0].getCheckedKeys(false)
    }
  },
  created () {
    // 根据路由信息赋值roleId
    this.role.roleId = this.$route.params.id
    this.tree.treeRef = UtilsMock.randomString(10)
    this.getPermissionPromise = RolesApi.getRolePermissions(this.role.roleId).then(
      (data) => {
        this.tree.treeData = data
        UtilsMock.traverseTree(this.tree.treeData, 'isCheck', 'resourceId', 'children', this.tree.selectedNodesKeys)
      }, (err) => {
        console.log(err)
      }
    )

    UserApi.getOrgans().then(
      (data) => {
        this.companies = data.list
      }, (err) => {
        console.log(err)
      }
    )
    RolesApi.getRoleById(this.role.roleId).then(
      (data) => {
        this.role.roleId = data.roleId
        this.role.organId = data.organId
        this.role.roleName = data.roleName
        RolesApi.getResourceList(this.role.roleId).then((res) => {
          for (let serviceName in res) {
            let tempTree = {}
            tempTree.serviceName = serviceName
            tempTree.treeRef = serviceName
            tempTree.title = serviceName === 'roleChannelCatalogService' ? '通道权限' : ''
            tempTree.treeData = res[serviceName]
            tempTree.defaultCheckedKeys = []
            tempTree.treeData.forEach(
              item => {
                if (item.isSelect) {
                  tempTree.defaultCheckedKeys.push(item.id)
                }
              }
            )
            tempTree.defaultProps = {
              children: 'children',
              label: 'name'
            }
            tempTree.selectedNodesKeys = tempTree.defaultCheckedKeys
            this.dataTree.push(tempTree)
          }
        }).catch(error => {

        })
      }, (err) => {
        console.log(err)
      }
    )
  },
  components: {
    'common-tree': CommonTree
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
