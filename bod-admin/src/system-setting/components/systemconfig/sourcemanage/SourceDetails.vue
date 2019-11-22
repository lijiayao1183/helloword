<template lang="pug">
common-panel(
            v-if="privilege"
            :panel="panel"
            :tableData="tableData"
            :tableOperate="tableOperate"
            :columns="columns"
            @update:keyword="val => keyword = val"
            :pagination="pagination"
            @selectionChange="selectionChange"
            @searchEvent="searchRoles"
            @addEvent="addRole"
            @deleteEvent="deleteOrgans"
            @deleteRow="DeleteSource"
            @editRow="roleEdit"
            @pageChange="updatePagination"
            @pageSizeChange="handleSizeChange")
div.block(v-else)
    h5 {{error}}
</template>
<script>
import SourceApi from '@system/api/systemconfig/sourcemanage.api'
import systemconfigMixin from '@system/mixins/systemconfig.mixin'
import SourceManageMock from '@system/mock/sourcemanage.mock'
import {mapGetters, mapActions} from 'vuex'
import UtilsMock from '@system/mock/utils.mock'

export default {
  mixins: [systemconfigMixin],
  data () {
      return {
        privilege: false,
        error: '对不起，您没有查看组织管理的权限'
      }
  },
  methods: {
      ...mapActions({
          updateTotal: 'updateSourceTotal',
          updateCurIndex: 'updateSourceCurIndex',
          updatePageSize: 'updateSourcePageSize'
      }),
      addRole () {
        this.$router.push('/editSource/add')
      },
      deleteOrgans () {
        if (!this.validateSelectedSources) {
            this.$message('请至少选中一个资源')
            return
        }
        this.$confirm('即将删除所选中资源, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.doneDeleteOrgans(this.selectedRows)
        }).catch(() => {
            console.log('取消删除')
        })
      },
      doneDeleteOrgans (arr) {
        SourceApi.patchDeleteSourcesStatus(UtilsMock.transToId(arr, 'resourceId')).then(
            (res) => {
                this.getNewTableData()
                this.$message('资源删除成功')
            }, (err) => {
                console.log(err)
                this.$message('资源删除失败')
            }
        )
      },
      searchRoles () {
        this.updateCurIndex(1)
        this.getNewTableData()
      },
      DeleteSource (row) {
        this.$confirm('即将删除资源' + row.name + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.doneDeleteSingleSource(row.resourceId)
        }).catch(() => {
            console.log('取消删除')
        })
      },
      doneDeleteSingleSource (id) {
        SourceApi.deleteSingleSource(id).then(
            (data) => {
                this.$message('资源删除成功')
                this.getNewTableData()
            }, (err) => {
                console.log(err)
                this.$message('资源删除失败')
            }
        )
      },
      roleEdit (row) {
        this.$router.push('/editSource/' + row.resourceId)
      },
      /**
       * 通用查询资源数据
       */
      getNewTableData () {
        let payload = {
            pageNo: this.pagination.curIndex,
            pageSize: this.pagination.pageSize,
            keyword: this.keyword
        }
        let url = '/api/resource?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
        url = payload.keyword ? url + '&keyWord=' + this.keyword : url
        SourceApi.getSources(url).then(
            (data) => {
                this.updateTotal(data.total)
                let tempData = Object.assign([], data.list)
                tempData = SourceManageMock.getTableData(tempData)
                this.tableData = UtilsMock.getformatDate(tempData, null, 'yyyy-MM-dd hh:mm:ss')
            }, (err) => {
                this.$message('加载资源失败')
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
    this.columns = SourceManageMock.columns()
    this.getNewTableData()
  },
  computed: {
      /**
       * 校验是否选中资源
       */
      validateSelectedSources () {
        return this.selectedRows.length
      },
      ...mapGetters({
        pagination: 'sourcePagination'
      })
  }
}
</script>
<style lang="scss" scoped>

</style>