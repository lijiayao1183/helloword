<template lang="pug">
  div
    el-dialog(title="提示"
      :visible.sync="prompDialogVisible"
    size="tiny"
      :show-close="false")
      span {{prompMsg}}
      span(slot="footer" class="dialog-footer")
        el-button(type="primary" @click="prompDialogVisible=false")  确 定
    el-dialog(title="提示"
      :visible.sync="deleteDialogVisible"
    size="tiny"
      :show-close="false")
      span 是否确认删除？
      span(slot="footer" class="dialog-footer")
        el-button(@click="deleteDialogVisible = false") 取 消
        el-button(type="primary" @click="deleteSure")  确 定
    common-panel(
    v-if="privilege"
      :panel="panel"
        :tableData="tableData"
        :tableOperate="tableOperate"
        :columns="columns"
        @update:keyword="val => keyword = val"
        :pagination="pagination"
        @selectionChange="selectionChange"
        @searchEvent="searchUsers"
        @addEvent="addUser"
        @deleteEvent="deleteInterface"
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
  import InterfaceApi from '@system/api/systemconfig/interfacemanage.api'
  import systemconfigMixin from '@system/mixins/systemconfig.mixin'
  import InterfaceManageMock from '@system/mock/interfacemanage.mock'
  import UtilsMock from '@system/mock/utils.mock'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mixins: [systemconfigMixin],
    data () {
      return {
        currentDeleteRow: [],
        prompMsg:'',
        deleteDialogVisible: false,
        prompDialogVisible:false,
        panel: {
          enable: false,
          disable: false,
          delete: false,
          selection: true
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
        this.$router.push('/editInterface/add')
      },
      deleteSure () {
        this.handleDelete(this.currentDeleteRow)
      }
      ,
      deleteInterface () {
        this.$confirm('即将删除所选中公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doneDeleteInterfaces(this.selectedRows)
        }).catch(() => {
          console.log('取消删除')
        })
      }
      ,
      doneDeleteInterfaces (arr) {
        let ids = UtilsMock.transToId(arr, 'id')
        let url = '/api/interfaceConfig/batchRemove?ids=' + ids
        InterfaceApi.patchDeleteInterfaceStatus(url).then(
          (res) => {
            if(res.code==-4){
              this.$message.warning(res.msg);
            }else{
              this.$message('接口删除成功')
              this.getNewTableData()
            }

          }, () => {

          }
        )
      }
      ,
      enableUsers () {
        if (!this.validateSelectedUsers) {
          this.$message('请至少选中一个接口')
          return
        }
        this.doneEnableInterfaces(this.selectedRows)
      }
      ,
      doneEnableInterfaces (arr) {
        let ids = UtilsMock.transToId(arr, 'id')
        let url = '/api/interfaceConfig/batchUpdateStatus?ids=' + ids + '&status=1'
        InterfaceApi.patchDeleteInterfaceStatus(url).then(
          (res) => {
            this.$message('接口启用成功')
            this.getNewTableData()
          }, () => {

          }
        )
      }
      ,
      disabledUsers () {
        if (!this.validateSelectedUsers) {
          this.$message('请至少选中一个公司')
          return
        }
        this.doneDisableInterfaces(this.selectedRows)
      }
      ,
      doneDisableInterfaces (arr) {
        let ids = UtilsMock.transToId(arr, 'id')
        let url = '/api/interfaceConfig/batchUpdateStatus?ids=' + ids + '&status=0'
        InterfaceApi.patchDeleteInterfaceStatus(url).then(
          (res) => {
            this.$message('接口停用成功')
            this.getNewTableData()
          }, () => {

          }
        )
      }
      ,
      searchUsers () {
        this.updateCurIndex(1)
        this.getNewTableData()
      },
      handleDelete (row) {
        if (!this.deleteDialogVisible) {
          this.deleteDialogVisible = true
          this.currentDeleteRow = row
        } else {
          let url = '/api/interfaceConfig/batchRemove?ids=' + row.id
          InterfaceApi.patchDeleteInterfaceStatus(url).then(
            (res) => {
              this.deleteDialogVisible=false;
              if(res.code == -4){
                this.prompMsg = res.msg;
                this.prompDialogVisible = true;
              }else{
                this.$message('接口删除成功')
                this.getNewTableData()
              }

            }, (err) => {
              this.$message.warning(err.response.data.error.message)
            }
          )
        }

      }
      ,
      doneDeleteSingleInterface (id) {
        InterfaceApi.deleteSingleInterface(id).then(
          (data) => {
            this.$message('接口删除成功')
            this.getNewTableData()
          }, (err) => {
            console.log(err)
            this.$message('接口删除失败')
          }
        )
      }
      ,
      handleEdit (row) {
        this.$router.push('/editInterface/' + row.id)
      }
      ,
      /**
       * 通用查询公司数据
       */
      getNewTableData () {
        let payload = {
          pageNo: this.pagination.curIndex,
          pageSize: this.pagination.pageSize,
          keyword: this.keyword
        }
        let url = '/api/interfaceConfig/getConfigList?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
        url = payload.keyword ? url + '&keyWord=' + this.keyword : url
        InterfaceApi.getInterfaces(url).then(
          (data) => {
            this.updateTotal(data.total)
            let tempData = Object.assign([], data.list)
            this.tableData = InterfaceManageMock.getTableData(tempData)
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
      this.columns = InterfaceManageMock.columns()
      this.getNewTableData()
    }
    ,
    computed: {
      /**
       * 校验是否选中公司
       */
      validateSelectedUsers () {
        return this.selectedRows.length
      }
      ,
      ...
        mapGetters({
          pagination: 'usersPagination'
        })
    }
  }
</script>
<style lang="scss" scoped>

</style>
