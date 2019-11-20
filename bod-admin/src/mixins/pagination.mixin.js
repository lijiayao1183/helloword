export default {
  data () {
    return {
      pageInfo: {
        total: 0,
        pageNo: parseInt(this.$route.query.pageNo) || 1,
        pageSize: parseInt(this.$route.query.pageSize) || 10,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    }
  },
  methods: {
    getAdjustmentData (data) {
      let hasLength = data.length
      if (hasLength > 0) {
        let hasPageNum = Math.ceil(hasLength / this.pageInfo.pageSize)
        let hasPageSize = hasLength % this.pageInfo.pageSize
        if (this.pageInfo.pageNo === hasPageNum) {
          return _.takeRight(data, hasPageSize || this.pageInfo.pageSize)
        } else if (this.pageInfo.pageNo < hasPageNum) {
          return _.slice(data, (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize,
            (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + this.pageInfo.pageSize)
        } else {
          return []
        }
      } else {
        return []
      }
    },
    getPageOffset (totalHasDataLength, currentPageHasDataLength) {
      let startIndex = this.pageInfo.pageSize * (this.pageInfo.pageNo - 1)
      if (startIndex > totalHasDataLength) {
        startIndex = startIndex - totalHasDataLength
      } else {
        startIndex = 0
      }
      let endIndex = startIndex + this.pageInfo.pageSize - currentPageHasDataLength
      return {startIndex, endIndex}
    },
    pageSizeChange (pageSize) {
      this.pageInfo.pageSize = pageSize
      this.pageInfoChangeCallBack()
    },
    pageCurrentChange (pageNo) {
      this.pageInfo.pageNo = pageNo
      this.pageInfoChangeCallBack()
    },
    pageInfoChangeCallBack () {
      this.$router.replace({
        name: this.$route.name,
        params: this.$route.params,
        query: {pageNo: this.pageInfo.pageNo, pageSize: this.pageInfo.pageSize}
      })
      this.pageInfoChange()
    }
  }
}
