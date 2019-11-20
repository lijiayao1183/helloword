import validateRules from '../../scripts/validate-rules'

class OrganMock {
  columns () {
    return [
      {
        prop: 'name',
        label: '组织名称',
        align: 'center'
      },
      {
        prop: 'code',
        label: '组织代号',
        align: 'center'
      },
      {
        prop: 'token',
        label: 'TOKEN',
        width: 325,
        align: 'center'
      },
      {
        prop: 'status',
        label: '状态',
        width: 98,
        align: 'center'
      }
    ]
  }

  organRules () {
    return {
      name: _.cloneDeep(validateRules.name),
      code: validateRules.code
    }
  }

  getTableData (data) {
    let tableData = []
    tableData = data.map(function (item) {
      item.status = !item.status ? '停用' : '启用'
      return item
    })
    return tableData
  }
}

export default new OrganMock()
