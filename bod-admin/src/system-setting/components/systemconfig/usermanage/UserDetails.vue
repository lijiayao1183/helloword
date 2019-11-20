<template lang="pug">
  common-panel(:panel="panel"
    :tableData="tableData"
      :tableOperate="tableOperate"
      :columns="columns"
  moduleName="user"
      :pagination="pagination"
      @selectionChange="selectionChange"
      @searchEvent="searchUsers"
      @addEvent="addUser"
      @deleteEvent="deleteUser"
      @enableEvent="enableUsers"
      @disableEvent="disabledUsers"
      @deleteRow="handleDelete"
      @hanlerReset="hanlerReset"
      @editRow="handleEdit"
      @pageChange="updatePagination"
      @pageSizeChange="handleSizeChange")
</template>
<script>
import UserApi from '@system/api/systemconfig/usermanage.api'
import systemconfigMixin from '@system/mixins/systemconfig.mixin'
import UserManageMock from '@system/mock/usersmanage.mock'
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
      tableOperate: {
        reset: true,
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
      this.$router.push('/editUser/add?add=1')
    },
    deleteUser () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个用户')
        return
      }
      let hasAdmin = this.selectedRows.some(
        item => {
          if (item.account === 'admin') {
            return true
          }
        }
      )
      if (hasAdmin) {
        this.$message('admin账户不能删除，请重新选择')
        return
      }
      this.$confirm('即将删除所选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doneDeleteUsers(this.selectedRows)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doneDeleteUsers (arr) {
      let ids = UtilsMock.transToId(arr, 'userId')
      let url = '/api/user/batchRemove?ids=' + ids
      UserApi.patchDeleteUsers(url).then(
        (res) => {
          this.getNewTableData()
          this.$message('删除用户成功')
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '删除用户失败')
        }
      )
    },
    enableUsers () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个用户')
        return
      }
      this.doneEnableUsers(this.selectedRows)
    },
    doneEnableUsers (arr) {
      let ids = UtilsMock.transToId(arr, 'userId')
      let url = '/api/user/batchUpdateStatus?ids=' + ids + '&status=1'
      UserApi.patchChangeUsersStatus(url).then(
        (res) => {
          this.getNewTableData()
          this.$message('用户启用成功')
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '用户启用失败')
        }
      )
    },
    disabledUsers () {
      if (!this.validateSelectedUsers) {
        this.$message('请至少选中一个用户')
        return
      }
      this.doneDisabledUsers(this.selectedRows)
    },
    doneDisabledUsers (arr) {
      let ids = UtilsMock.transToId(arr, 'userId')
      let url = '/api/user/batchUpdateStatus?ids=' + ids + '&status=0'
      UserApi.patchChangeUsersStatus(url).then(
        (res) => {
          this.getNewTableData()
          this.$message('用户停用成功')
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '用户停用失败')
        }
      )
    },
    searchUsers (val) {
      this.keyword = val
      this.updateCurIndex(1)
      this.getNewTableData()
    },
    handleDelete (row) {
      this.$confirm('即将删除用户' + row.account + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doneDeleteSingleUser(row.userId)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doneDeleteSingleUser (id) {
      UserApi.deleteSingleUser(id).then(
        (data) => {
          if (data.code === '1') {
            this.$message('删除用户成功')
            this.getNewTableData()
          } else {
            this.$message('删除用户失败')
          }
        }, (err) => {
          ResponseUtils.showErrorMessage(err, '删除用户失败')
        }
      )
    },
    hanlerReset (row) {
      this.$confirm('即将重置用户' + row.account + '的密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doneReset(row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doneReset (row) {
      UserApi.resetPassword(row.userId).then(
        (data) => {
          this.$message('用户密码重置成功')
          // this.getNewTableData()
        }, (err) => {
          console.log(err)
          this.$message('用户密码重置失败')
        }
      )
    },
    handleEdit (row) {
      this.$router.push('/editUser/' + row.userId)
    },
    /**
       * 通用查询用户数据
       */
    getNewTableData () {
      let payload = {
        pageNo: this.pagination.curIndex,
        pageSize: this.pagination.pageSize,
        keyword: this.keyword
      }
      let url = '/api/user/list?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
      url = payload.keyword ? url + '&keyWord=' + this.keyword : url
      UserApi.getUsers(url).then(
        (data) => {
          this.updateTotal(data.total)
          let tempData = Object.assign([], data.list)
          tempData = UserManageMock.getTableData(tempData)
          this.tableData = UtilsMock.getformatDate(tempData, null, 'yyyy-MM-dd hh:mm:ss')
        }, () => {

        }
      )
    }
  },
  created () {
    this.columns = UserManageMock.thead()
    this.getNewTableData()
  },
  computed: {
    /**
       * 校验是否选中用户
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
