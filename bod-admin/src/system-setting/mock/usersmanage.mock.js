import validateRules from '../../scripts/validate-rules'

class UsersManageMock {
  thead () {
    return [
      {
        prop: 'account',
        label: '账号',
        align: 'left'
      },
      {
        prop: 'roleName',
        label: '角色',
        align: 'left'
      },
      {
        prop: 'employeeId',
        label: '员工编号',
        align: 'left'
      },
      {
        prop: 'nickName',
        label: '使用人姓名',
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
        width: '98',
        align: 'left'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        width: '180',
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

  userRules () {
    return {
      account: validateRules.code,
      organId: [{required: true, type: 'integer', message: '请选择所属公司', trigger: 'change'}],
      roleId: [{required: true, type: 'integer', message: '请选择角色', trigger: 'change'}],
      employeeId: [
        {required: true, message: '请输入员工编号', trigger: 'blur'},
        {max: 30, message: '不能超过30个字符'},
        {pattern: /^[a-zA-Z0-9]+$/, message: '员工编号只支持英文字母或数字', trigger: 'blur'}
      ],
      nickName: [
        {required: true, message: '请输入员工姓名', trigger: 'blur'},
        {max: 30, message: '不能超过30个字符'},
        {pattern: /^[0-9a-zA-Z\u4E00-\u9FA5A]+$/, message: '员工姓名含有中英文字符和数字外的非法字符', trigger: 'blur'}
      ],
      cellphone: [
        {required: true, message: '请输入员工手机号', trigger: 'blur'},
        {pattern: /^1[0-9]{10}$/, message: '手机号格式不正确', trigger: 'blur'}
      ],
      email: [
        {required: true, message: '请输入员工邮箱', trigger: 'blur'},
        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
      ]
    }
  }
}

export default new UsersManageMock()
