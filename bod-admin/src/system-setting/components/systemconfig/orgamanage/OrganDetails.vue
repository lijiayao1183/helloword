<template lang="pug">
  common-panel(
  v-if="privilege"
    :panel="panel"
      :tableData="tableData"
      :tableOperate="tableOperate"
      :columns="columns"
      :pagination="pagination"
      @selectionChange="selectionChange"
      @searchEvent="searchUsers"
      @addEvent="addUser"
      @deleteEvent="deleteOrgan"
      @enableEvent="enableUsers"
      @disableEvent="disabledUsers"
      @deleteRow="handleDelete"
      @editRow="handleEdit"
      @pageChange="updatePagination"
      @pageSizeChange="handleSizeChange")
  div.block(v-else)
    h5 {{error}}
</template>
<script>
import OrganApi from '@system/api/systemconfig/organmanage.api'
import systemconfigMixin from '@system/mixins/systemconfig.mixin'
import OrganManageMock from '@system/mock/organmanage.mock'
import UtilsMock from '@system/mock/utils.mock'
import ResponseUtils from '../../../../scripts/response-utils'
import {mapGetters, mapActions} from 'vuex'

export default {
  mixins: [systemconfigMixin],
  data () {
    return {
      panel: {
        enable: true,
        disable: true
      },
      privilege: false,
      error: '对不起，您没有查看组织管理的权限',
      tableOperate: {
        reset: false,
        width: 190
      }
    }
  },
  methods: {
    ...mapActions({
      updateTotal: 'updateUsersTotal',
      updateCurIndex: 'updateUsersCurIndex',
      updatePageSize: 'updateUsersPageSize'
    }),
    addUser () {
      this.$router.push('/editOrgan/add')
    },
    deleteOrgan (arr) {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个组织')
        return
      }
      let checkPromise = []
      let result = []
      this.selectedRows.forEach(
        (item, index) => {
          checkPromise[index] = OrganApi.isHasRole(item.organId).then(
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
            this.$message('选中的组织下有角色存在，不能删除，请重新选择')
          } else {
            this.$confirm('即将删除所选中组织, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doneDeleteOrgans(this.selectedRows)
            }).catch(() => {
              console.log('取消删除')
            })
          }
        }
      )
    },
    doneDeleteOrgans (arr) {
      let ids = UtilsMock.transToId(arr, 'organId')
      let url = '/api/organ/batchRemove?ids=' + ids
      OrganApi.patchDeleteOrganStatus(url).then(
        (res) => {
          this.getNewTableData()
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '组织删除失败')
        }
      )
    },
    enableUsers () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个组织')
        return
      }
      this.doneEnableOrgans(this.selectedRows)
    },
    doneEnableOrgans (arr) {
      let ids = UtilsMock.transToId(arr, 'organId')
      let url = '/api/organ/batchUpdateStatus?ids=' + ids + '&status=1'
      OrganApi.patchDeleteOrganStatus(url).then(
        (res) => {
          this.$message('组织启用成功')
          this.getNewTableData()
        }, () => {

        }
      )
    },
    disabledUsers () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个组织')
        return
      }
      this.$confirm('停用组织会停用对应的角色和用户,确认停用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doneDisableOrgans(this.selectedRows)
      }).catch(() => {
        console.log('cancel disable organ')
      })
    },
    doneDisableOrgans (arr) {
      let ids = UtilsMock.transToId(arr, 'organId')
      let url = '/api/organ/batchUpdateStatus?ids=' + ids + '&status=0'
      OrganApi.patchDeleteOrganStatus(url).then(
        (res) => {
          this.$message('组织停用成功')
          this.getNewTableData()
        }, () => {

        }
      )
    },
    searchUsers (val) {
      this.keyword = val
      this.updateCurIndex(1)
      this.getNewTableData()
    },
    handleDelete (row) {
      OrganApi.isHasRole(row.organId).then(
        res => {
          if (!res) {
            this.$confirm('即将删除组织' + row.name + ', 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.doneDeleteSingleOrgan(row.organId)
            }).catch(() => {
              console.log('取消删除')
            })
          } else {
            this.$message('该组织下有角色存在，不能删除')
          }
        }
      )
    },
    doneDeleteSingleOrgan (id) {
      OrganApi.deleteSingleOrgan(id).then(
        (data) => {
          this.$message('组织删除成功')
          this.getNewTableData()
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '组织删除失败')
        }
      )
    },
    handleEdit (row) {
      this.$router.push('/editOrgan/' + row.organId)
    },
    /**
       * 通用查询公司数据
       */
    getNewTableData () {
      let payload = {
        pageNo: this.pagination.curIndex,
        pageSize: this.pagination.pageSize,
        keyword: this.keyword
      }
      let url = '/api/organ/list?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
      url = payload.keyword ? url + '&keyWord=' + this.keyword : url
      OrganApi.getOrgans(url).then(
        (data) => {
          this.updateTotal(data.total)
          let tempData = Object.assign([], data.list)
          this.tableData = OrganManageMock.getTableData(tempData)
        }, (err) => {
          console.log(err)
        }
      )
    }
  },
  created () {
    if (localStorage && localStorage.getItem('admin_name') && localStorage.getItem('admin_name') === 'admin') {
      this.privilege = true
    } else {
      return
    }
    this.columns = OrganManageMock.columns()
    this.getNewTableData()
  },
  computed: {
    /**
       * 校验是否选中公司
       */
    validateSelectedUsers () {
      return this.selectedRows.length
    },
    ...mapGetters({
      pagination: 'usersPagination'
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
