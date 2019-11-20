import CommonPanel from '@system/components/systemconfig/common/CommonDetail'

const mixin = {
  data () {
    return {
      panel: {
        add: true,
        delete: true,
        search: true
      },
      tableData: [],
      tableOperate: {
        edit: true,
        delete: true
      },
      columns: [],
      keyword: '',
      selectedRows: []
    }
  },
  methods: {
    selectionChange (val) {
      this.selectedRows = val
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
  components: {
    'common-panel': CommonPanel
  }
}
export default mixin
