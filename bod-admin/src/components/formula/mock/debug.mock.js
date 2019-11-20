export default {
  statusOption: [
    {
      label: '全部结果',
      value: ''
    },
    {
      label: '异常',
      value: 1
    },
    {
      label: '成功',
      value: 0
    }
  ],
  data: [
    {
      requestTime: 1513071671590,
      companyName: '汇法',
      goodsName: '汇法分类统计',
      businessName: '消费金融引擎',
      errorStatus: 1,
      errorMsg: '',
      result: [
        {
          name: 'name',
          value: '张*'
        },
        {
          name: 'id',
          value: ' 512************0023'
        }
      ]
    },
    {
      requestTime: 1513071671590,
      companyName: '数尊',
      goodsName: '数尊运营商状态',
      businessName: '现金贷引擎',
      errorStatus: 1,
      errorMsg: '',
      result: [
        {
          name: 'mobile',
          value: '139******561'
        }
      ]
    }
  ],
  filterStatus: [
    {
      value: 1,
      label: '数尊宝'
    }, {
      value: 2,
      label: '同盾'
    }
  ],
  apiData: {
    'apiId': 'shuzunbaoDataSource',
    'apiName': '手机号等级',
    'dataSourceName': '数尊宝',
    'prodCode': 'MD0001',
    'nickName': 'Jason',
    'updated': '1512962439297',
    'tokens': ['accountID', 'privateKey'],
    'inFields': ['iphoneNumber', 'userName', 'bankCardNumber'],
    'outFieldMapping': [
      {
        'dsFieldName': 'md001',
        'dsFieldType': 1,
        'fieldCode': 'avg',
        'errorValue': '-1'
      },
      {
        'dsFieldName': 'md002',
        'dsFieldType': 2,
        'fieldCode': 'formula',
        'errorValue': 'null'
      }
    ]
  },
  loggerList: [{
    'method': '创建任务',
    'taskName': '不含小寨的消费总和',
    'message': '操作成功',
    'taskId': '791',
    'createDate': '2017-12-22 14:45:34'
  }, {
    'method': '停用任务',
    'taskName': '不含小寨的消费总和',
    'message': '操作成功',
    'taskId': '791',
    'createDate': '2017-12-22 14:45:34'
  }, {
    'method': '启用任务',
    'taskName': '不含小寨的消费总和',
    'message': '操作成功',
    'taskId': '791',
    'createDate': '2017-12-22 14:45:34'
  }]
}
