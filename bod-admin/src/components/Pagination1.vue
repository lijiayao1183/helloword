<template>
  <el-pagination
    :current-page="pagination.pageIndex"
    :page-size="pagination.pageSize"
    :layout="layout"
    :page-sizes="pagination.pageSizes"
    @size-change="pageSizeChange"
    @current-change="pageCurrentChange"
    :total="pagination.total">
  </el-pagination>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  props: {
    layout: {
      type: String,
      default: () => {
        return 'sizes, prev, pager, next,total, jumper'
      }
    }
  },
  computed: {
    ...mapGetters({
      pagination: `pagination1`
    })
  },
  methods: {
    ...mapActions({
      updatePageIndex: `update1PageIndex`,
      updatePageTotal: `update1PageTotal`,
      updatePageSize: `update1PageSize`
    }),
    /**
       * 如果数据分页数据是由前段和后端拼装的，则在调用后端接口之前，需要调用此方法调整pagination
       * */
    getAdjustmentData (data) {
      let hasLength = data.length
      if (hasLength > 0) {
        let hasPageNum = Math.ceil(hasLength / this.pagination.pageSize)
        let hasPageSize = hasLength % this.pagination.pageSize
        if (this.pagination.pageIndex === hasPageNum) {
          return _.takeRight(data, hasPageSize || this.pagination.pageSize)
        } else if (this.pagination.pageIndex < hasPageNum) {
          return _.slice(data, (this.pagination.pageIndex - 1) * this.pagination.pageSize,
            (this.pagination.pageIndex - 1) * this.pagination.pageSize + this.pagination.pageSize)
        }
      }
      return data
    },
    pageSizeChange (pageSize) {
      this.updatePageSize(pageSize)
      this.updatePageIndex(1)
      this.change()
    },
    pageCurrentChange (pageIndex) {
      this.updatePageIndex(pageIndex)
      this.change()
    },
    change () {
      this.$emit('change', this.pagination)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
