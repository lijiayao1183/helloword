import validateRules from '../../scripts/validate-rules'

class RolesManageMock {
  columns () {
    return [
      {
        prop: 'roleId',
        label: 'ID',
        align: 'left'
      },
      {
        prop: 'roleName',
        label: '角色名',
        align: 'left'
      },
      {
        prop: 'organName',
        label: '组织',
        align: 'left'
      },
      {
        prop: 'status',
        label: '状态',
        align: 'left'
      }
    ]
  }

  getTableData (data) {
    let tableData = []
    tableData = data.map(function (item) {
      item.status = item.status === 0 ? '停用' : '启用'
      return item
    })
    return tableData
  }

  roleRules () {
    return {
      roleName: _.cloneDeep(validateRules.name),
      organId: [{required: true, type: 'integer', message: '请选择所属组织', trigger: 'change'}]
    }
  }

  allRoleMock () {
    return {
      'pageNum': 1,
      'pageSize': 2,
      'size': 2,
      'startRow': 0,
      'endRow': 1,
      'total': 2,
      'pages': 1,
      'list': [
        {
          'roleId': 52,
          'organId': 31,
          'roleName': '测试公司6',
          'roleCode': null,
          'roleDesc': null,
          'author': '超级管理员',
          'birth': 1488190780000,
          'status': null
        },
        {
          'roleId': 64,
          'organId': 31,
          'roleName': 'test6',
          'roleCode': null,
          'roleDesc': null,
          'author': '测试六号',
          'birth': 1490002913000,
          'status': null
        }
      ],
      'prePage': 0,
      'nextPage': 0,
      'isFirstPage': true,
      'isLastPage': true,
      'hasPreviousPage': false,
      'hasNextPage': false,
      'navigatePages': 8,
      'navigatepageNums': [1],
      'navigateFirstPage': 1,
      'navigateLastPage': 1,
      'firstPage': 1,
      'lastPage': 1
    }
  }
}

export default new RolesManageMock()
