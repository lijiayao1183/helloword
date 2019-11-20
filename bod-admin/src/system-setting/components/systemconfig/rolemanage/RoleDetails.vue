<template lang="pug">
  common-panel(:panel="panel"
    :tableData="tableData"
      :tableOperate="tableOperate"
      :columns="columns"
      moduleName="role"
      :pagination="pagination"
      @selectionChange="selectionChange"
      @searchEvent="searchRoles"
      @addEvent="addRole"
      @deleteEvent="deleteRoles"
      @enableEvent="enableRoles"
      @disableEvent="disabledRoles"
      @deleteRow="roleDelete"
      @editRow="roleEdit"
      @permissionRow="rolePermission"
      @pageChange="updatePagination"
      @pageSizeChange="handleSizeChange")
</template>
<script>
import RoleApi from '@system/api/systemconfig/rolemanage.api'
import systemconfigMixin from '@system/mixins/systemconfig.mixin'
import RolesManageMock from '@system/mock/rolesmanage.mock'
import {mapGetters, mapActions} from 'vuex'
import UtilsMock from '@system/mock/utils.mock'
import ResponseUtils from '../../../../scripts/response-utils'

export default {
  mixins: [systemconfigMixin],
  data () {
    return {
      panel: {
        enable: true,
        disable: true
      },
      tableOperate: {
        permission: true,
        width: 270
      }
    }
  },
  methods: {
    ...mapActions({
      updateTotal: 'updateRolesTotal',
      updateCurIndex: 'updateRolesCurIndex',
      updatePageSize: 'updateRolesPageSize'
    }),
    addRole () {
      this.$router.push('/editRole/add')
    },
    deleteRoles () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个角色')
        return
      }
      let hasAdmin = this.selectedRows.some(
        item => {
          if (item.roleCode === 'admin') {
            return true
          }
        }
      )
      if (hasAdmin) {
        this.$message('admin角色不能删除，请重新选择')
        return
      }
      // RoleApi.
      let checkPromise = []
      let result = []
      this.selectedRows.forEach(
        (item, index) => {
          checkPromise[index] = RoleApi.isHasUser(item.roleId).then(
            res => {
              result.push(res)
            }
          )
        }
      )
      Promise.all(checkPromise).then(
        res => {
          let ifCanDelete = result.some(
            item => {
              if (item) {
                return true
              }
            }
          )
          if (ifCanDelete) {
            this.$message('选中的角色下有用户存在，不能删除，请重新选择')
          } else {
            this.$confirm('即将删除所选中角色, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doneDeleteRoles(this.selectedRows)
            }).catch(() => {
              console.log('取消删除')
            })
          }
        }
      )
    },
    doneDeleteRoles (arr) {
      let ids = UtilsMock.transToId(arr, 'roleId')
      let url = '/api/role/batchRemove?ids=' + ids
      RoleApi.patchDeleteRolesStatus(url).then(
        (res) => {
          this.getNewTableData()
          this.$message('角色删除成功')
        }
      )
    },
    enableRoles () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个角色')
        return
      }
      this.doneEnableRoles(this.selectedRows)
    },
    doneEnableRoles (arr) {
      let ids = UtilsMock.transToId(arr, 'roleId')
      let url = '/api/role/batchUpdateStatus?ids=' + ids + '&status=1'
      RoleApi.patchChangeRolesStatus(url).then(
        (res) => {
          if (res.code == '1') {
            this.$message('角色启用成功')
            this.getNewTableData()
          }
        }, (res) => {
          ResponseUtils.showErrorMessage(res, '角色启用失败')
        }
      )
    },
    disabledRoles () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个角色')
        return
      }
      let ids = UtilsMock.transToId(this.selectedRows, 'roleId')
      RoleApi.isHasUser(ids).then(
        res => {
          if (res) {
            this.$confirm('角色停用后，角色关联用户将失去相应权限', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doneDisabledRoles(ids)
            }).catch(() => {
              console.log('取消停用')
            })
          } else {
            this.doneDisabledRoles(ids)
          }
        }).catch(() => {

      })
    },
    doneDisabledRoles (ids) {
      let url = '/api/role/batchUpdateStatus?ids=' + ids + '&status=0'
      RoleApi.patchChangeRolesStatus(url).then(
        (res) => {
          this.getNewTableData()
          this.$message('角色停用成功')
        }, (res) => {
          console.log(res)
        }
      )
    },
    searchRoles (val) {
      this.keyword = val
      this.updateCurIndex(1)
      this.getNewTableData()
    },
    roleDelete (row) {
      RoleApi.isHasUser(row.roleId).then(
        res => {
          if (!res) {
            this.$confirm('即将删除角色' + row.roleName + ', 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doneDeleteSingleRole(row.roleId)
            }).catch(() => {
              console.log('取消删除')
            })
          } else {
            this.$message('该角色下有用户存在，不能删除')
          }
        }
      )
    },
    doneDeleteSingleRole (id) {
      RoleApi.deleteSingleRole(id).then(
        (data) => {
          this.$message('角色删除成功')
          this.getNewTableData()
        }, (err) => {
          console.log(err)
          this.$message('角色删除失败')
        }
      )
    },
    roleEdit (row) {
      this.$router.push('/editRole/' + row.roleId)
    },
    rolePermission (row) {
      this.$router.push('/permission/' + row.roleId)
    },
    /**
       * 通用查询角色数据
       */
    getNewTableData () {
      let payload = {
        pageNo: this.pagination.curIndex,
        pageSize: this.pagination.pageSize,
        keyword: this.keyword
      }
      let url = '/api/role/pageInfo?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
      url = payload.keyword ? url + '&keyWord=' + this.keyword : url
      RoleApi.getRoles(url).then(
        (data) => {
          this.updateTotal(data.total)
          let tempData = Object.assign([], data.list)
          this.tableData = RolesManageMock.getTableData(tempData)
        }, () => {
          this.$message('加载角色信息失败')
        }
      )
    }
  },
  created () {
    this.columns = RolesManageMock.columns()
    this.getNewTableData()
  },
  computed: {
    /**
       * 校验是否选中角色
       */
    validateSelectedUsers () {
      return this.selectedRows.length
    },
    ...mapGetters({
      pagination: 'rolesPagination'
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
