class InterfaceMock {
  columns () {
    return [
      {
        prop: 'name',
        label: '接口名称',
        align: 'center'
      },
      {
        prop: 'organName',
        label: '组织名称',
        align: 'center'
      },
      {
        prop: 'token',
        label: 'TOKEN',
        width: 325,
        align: 'center'
      },
      {
        prop: 'url',
        label: '接口URL',
        width: 98,
        align: 'center'
      }
    ]
  }
  interfaceRules () {
    return {
      name: [
        {required: true, message: '请输入接口名称', trigger: 'blur'},
        {max: 30, message: '接口名称字符数量必须在3-30之间', trigger: 'blur'},
        {pattern: /^[a-zA-Z\u4E00-\u9FA5A0-9]+[\w\u4E00-\u9FA5A]*$/, message: '只支持中英文字符、数字以及下划线或连接符，首字符不能为特殊字符', trigger: 'blur'}
      ],
      organId: [
        {type: 'number', required: true, message: '请选择组织', trigger: 'change'}
      ],
      token: [
        {required: true, message: '请输入TOKEN', trigger: 'blur'}
      ],
      url: [
        {required: true, message: '请输入URL', trigger: 'blur'}
      ]
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
export default new InterfaceMock()
