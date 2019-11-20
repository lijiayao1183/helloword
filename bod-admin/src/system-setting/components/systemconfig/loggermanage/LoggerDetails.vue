<template lang="pug">
  common-panel(:panel="panel"
              :tableData="tableData"
              :arrowColumns="arrowColumns"
              :pickDate="date"
              :columns="columns"
              :pagination="pagination"
              @searchEvent="searchRoles"
              @checkDetail="checkLogger"
              @pageChange="updatePagination"
              @pageSizeChange="handleSizeChange"
              @pick="pick")
</template>
<script>
import CommonPanel from '@system/components/systemconfig/common/CommonDetail'
import LoggerApi from '@system/api/systemconfig/loggermanage.api'
import LoggerManageMock from '@system/mock/loggermanage.mock'
import UtilsMock from '@system/mock/utils.mock'
import {mapGetters, mapActions} from 'vuex'

export default {
  data () {
    return {
      panel: {
        datepicker: true,
        search: true,
        selection: true
      },
      tableData: [],
      date: {},
      columns: [],
      arrowColumns: [],
      keyword: ''
    }
  },
  methods: {
    ...mapActions({
      updateTotal: 'updateLoggerTotal',
      updateCurIndex: 'updateLoggerCurIndex',
      updatePageSize: 'updateLoggerPageSize'
    }),
    addRole () {
      this.$router.push('/editRole/add')
    },
    searchRoles (val) {
      this.keyword = val
      this.updateCurIndex(1)
      this.getNewTableData()
    },
    checkLogger (row) {
      this.$router.push('/editLogger/' + row.id)
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
      // let url = '/api/logger/list?pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
      // url = payload.keyword ? url + '&keyWord=' + this.keyword : url
      let url = '/api/logger/list?startTime=' + this.date.startTime + '&endTime=' + this.date.endTime + '&pageNo=' + this.pagination.curIndex + '&pageSize=' + this.pagination.pageSize
      url = payload.keyword ? url + '&keyword=' + this.keyword : url
      LoggerApi.getLoggers(url).then(
        (data) => {
          this.updateTotal(data.total)
          let tempData = Object.assign([], data.list)
          this.tableData = UtilsMock.getformatDate(tempData, ['startTime', 'endTime'], 'yyyy-MM-dd hh:mm:ss')
        }, (err) => {
          console.log(err)
          this.$message('加载日志数据失败')
        }
      )
    },
    pick (date) {
      this.date = date
      this.getNewTableData()
    },
    updatePagination (index) {
      this.updateCurIndex(index)
      this.getNewTableData()
    },
    handleSizeChange (size) {
      	this.updatePageSize(size)
      this.getNewTableData()
    }
  },
  created () {
    this.columns = LoggerManageMock.columns()
    this.arrowColumns = LoggerManageMock.arrowColumns()
  },
  computed: {
    ...mapGetters({
      pagination: 'loggerPagination'
    })
  },
  components: {
    'common-panel': CommonPanel
  }
}
</script>
<style lang="scss">

</style>
