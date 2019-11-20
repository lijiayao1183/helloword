const alarmTypes = {
  ENGINE: {
    name: '引擎预警',
    value: 1
  },
  MODEL: {
    name: '业务预警',
    value: 2
  },
  BUSSINESS: {
    name: '模型预警',
    value: 3
  }
}

const alarmOperateTypes = {
  RUNNING: 'active',
  STOP: 'disActive',
  DELETE: 'delete'
}

const alarmStateTypes = {
  ALL: {
    name: '全部状态',
    value: ''
  },
  RUNNING: {
    name: '启用',
    value: 1
  },
  STOP: {
    name: '停用',
    value: 2
  }
}
const alarmUpdateStateCodes = {
  '1000': '失败',
  '0000': '成功',
  '0001': '失败',
  '0002': '部分失败'
}
const alarmSendStateTypes = {
  ALL: {
    name: '全部状态',
    value: ''
  },
  SUCCESS: {
    name: '成功',
    value: 0
  },
  FAILE: {
    name: '失败',
    value: 1
  },
  NONE: {
    name: '未发送',
    value: 3
  }
}

const alarmalertWay = {
  MESSAGE: {
    name: '短信',
    value: 1
  },
  EMAIL: {
    name: '邮箱',
    value: 2
  },
  MESSAGEANDEMAIL: {
    name: '短信+邮箱',
    value: 3
  }
}

const alarmData = {
  'code': '0000',
  'msg': 'success',
  'data': [{
    'alertId': 1,
    'createTime': 1523591725000,
    'alertData': '{"a":"60"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': '短信发送失败，response[code=400,content={"http_status_code":400,"code":-1,"msg":"非法的apikey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523591696000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': '短信发送失败，response[code=400,content={"http_status_code":400,"code":-1,"msg":"非法的apikey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523587271000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': '短信发送失败，response[code=400,content={"http_status_code":400,"code":-1,"msg":"非法的apikey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523587176000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': '短信发送失败，response[code=400,content={"http_status_code":400,"code":-1,"msg":"非法的apikey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523586785000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000},
    {'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523586651000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000},
    {'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523586651000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000},
    {'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }, {
    'alertId': 1,
    'createTime': 1523586651000,
    'alertData': '{"a":"40"}',
    'alertCondition': '#{a}>30',
    'alertSendList': [{'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 1,
      'recipient': '13466666666,13477777777',
      'resCode': 0,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000},
    {'id': 11,
      'recordId': 4,
      'alertId': 1,
      'content': '这是一条测试短信4',
      'sendType': 0,
      'recipient': '13466666666,13477777777',
      'resCode': 1,
      'errorInfo': ' ey","detail":"请检查您的apikey是否正确，或者账户已经失效"}]',
      'createTime': 1524725086000}]
  }]
}

const tableData = []

const detailData = {'id': 2,
  'channelName': '逾期率预警',
  'channelDesc': '当天逾期率超过20%',
  'channeldest': '1',
  'ruleCodeName': '1',
  'alertCondition': '{"expression":[{"fieldName":"#{sex}","operator":"==","value":"1"},{"rule":"||","fieldName":"#{machine_Phones}","operator":"==","value":"21"},{"rule":"|| (","fieldName":"#{phone_network_time}","operator":">=","value":"6"}],"suffix":{"selectedId":1,"selectedName":")"},"traceData":[{"field":{"id":206622721253376,"fieldEn":"sex","fieldCn":"性别","fieldTypeId":206622316394496,"fieldType":null,"valueType":3,"valueScope":"男:1,女:2","valueFormat":null,"isDerivative":0,"isOutput":0,"isCommon":0,"formula":null,"formulaShow":null,"usedFieldId":null,"origFieldId":null,"author":185,"organId":66,"nickName":null,"created":1520931600000,"updated":1520931600000,"isLatestVersion":null,"engineId":null,"engineName":null,"status":1,"fieldCondList":[],"fieldRelId":null,"sourceFieldModels":null,"fieldTypeModels":null,"outRange":"[{\\"condition\\":4,\\"index\\":2,\\"value\\":\\"1\\"},{\\"condition\\":3,\\"index\\":1,\\"value\\":\\"1\\"}]","valueNull":null,"isDimension":0,"conditionType":null,"isReadonly":0,"parentVersionId":null,"isUpdate":1,"error":null},"fieldId":null,"preFieldEn":"sex","fieldType":3,"operatorId":"==","operatorName":"=","multipleValueIds":[],"dateTimeValue":null,"valueId":"1","enumValue":"男","valueList":[{"id":"1","name":"男"},{"id":"2","name":"女"}],"value":null},{"ruleId":"||","ruleName":"或者","field":{"id":212058866167808,"fieldEn":"machine_Phones","fieldCn":"同设备近1小时申请手机号个数","fieldTypeId":195991621836800,"fieldType":null,"valueType":1,"valueScope":"","valueFormat":null,"isDerivative":0,"isOutput":1,"isCommon":0,"formula":"{}","formulaShow":"","usedFieldId":null,"origFieldId":null,"author":179,"organId":66,"nickName":null,"created":1523585968000,"updated":1523585968000,"isLatestVersion":null,"engineId":null,"engineName":null,"status":1,"fieldCondList":[],"fieldRelId":null,"sourceFieldModels":null,"fieldTypeModels":null,"outRange":"[{\\"index\\":1,\\"condition\\":3,\\"value\\":\\"0\\"},{\\"index\\":2,\\"condition\\":1,\\"value\\":\\"0\\"},{\\"index\\":3,\\"condition\\":2,\\"value\\":\\"0\\"}]","valueNull":null,"isDimension":0,"conditionType":null,"isReadonly":0,"parentVersionId":null,"isUpdate":1,"error":null},"preFieldEn":"machine_Phones","operatorId":"==","operatorName":"=","valueId":"21","multipleValueIds":[],"dateTimeValue":null,"enumValue":"","valueList":[],"fieldType":1,"value":null},{"ruleId":"|| (","ruleName":"或者 (","field":{"id":206622721318912,"fieldEn":"phone_network_time","fieldCn":"手机在网时长","fieldTypeId":206622316394496,"fieldType":null,"valueType":1,"valueScope":"","valueFormat":null,"isDerivative":0,"isOutput":0,"isCommon":0,"formula":null,"formulaShow":null,"usedFieldId":null,"origFieldId":null,"author":185,"organId":66,"nickName":null,"created":1520931600000,"updated":1520931600000,"isLatestVersion":null,"engineId":null,"engineName":null,"status":1,"fieldCondList":[],"fieldRelId":null,"sourceFieldModels":null,"fieldTypeModels":null,"outRange":"[{\\"condition\\":1,\\"index\\":2,\\"value\\":\\"0\\"},{\\"condition\\":2,\\"index\\":3,\\"value\\":\\"0\\"},{\\"condition\\":3,\\"index\\":1,\\"value\\":\\"0\\"}]","valueNull":null,"isDimension":0,"conditionType":null,"isReadonly":0,"parentVersionId":null,"isUpdate":1,"error":null},"preFieldEn":"phone_network_time","operatorId":">=","operatorName":">=","valueId":"6","multipleValueIds":[],"dateTimeValue":null,"enumValue":"","valueList":[],"fieldType":1,"value":null}]}',
  'alertConditionField': null,
  'alertWay': 3,
  'alertStatus': 2,
  'alertStatusName': '停用',
  'emailTemplate': '{"conditions":[{"input":[{"field_name":"基本额度","field_code":"basic_limit","segments":[],"field_id":206622721380352,"field_scope":"[0,100000000]","field_type":1,"isDimension":0,"fieldSwitch":false,"outRangeValue":""},{"field_name":"近6个月征信查询次数","field_code":"6months_credit_inquiry_time","segments":[],"field_id":206622721331200,"field_scope":"","field_type":1,"isDimension":0,"fieldSwitch":false,"outRangeValue":""}],"output":{"field_name":"","field_code":"","field_type":1,"field_id":""},"formula":"我是个测试的测试邮件\\n    基本额度： #{basic_limit} \\n    近6个月征信查询次数： #{6months_credit_inquiry_time} ","formula_show":"我是个测试的测试邮件\\n    基本额度： @基本额度@ \\n    近6个月征信查询次数： @近6个月征信查询次数@ "}]}',
  'smsTemplate': '{"conditions":[{"input":[{"field_name":"是否申请地本地户籍","field_code":"is_indigen","segments":[],"field_id":206622721312768,"field_scope":"是:1,否:2","field_type":3,"isDimension":0,"fieldSwitch":false,"outRangeValue":""},{"field_name":"性别","field_code":"sex","segments":[],"field_id":206622721253376,"field_scope":"男:1,女:2","field_type":3,"isDimension":0,"fieldSwitch":false,"outRangeValue":""},{"field_name":"婚姻情况","field_code":"marital_status","segments":[],"field_id":206622721265664,"field_scope":"已婚有子女:1,已婚无子女:2,其他:3","field_type":3,"isDimension":0,"fieldSwitch":false,"outRangeValue":""}],"output":{"field_name":"","field_code":"","field_type":1,"field_id":""},"formula":"我是个测试的短信\\n      是否申请本地户籍： #{is_indigen} \\n      性别：#{sex} \\n      婚姻情况：#{marital_status} ","formula_show":"我是个测试的短信\\n      是否申请本地户籍： @是否申请地本地户籍@ \\n      性别：@性别@ \\n      婚姻情况：@婚姻情况@ "}]}',
  'smsId': 'duanxinID',
  'maxTimes': 30,
  'usedTimes': 10,
  'roleId': null,
  'organId': null,
  'createUserId': null,
  'createTime': 1522315953000,
  'isDelete': 0,
  'deleteTime': null,
  'receiveUserId': '177,179',
  'receiveUserList': [{'userId': 177, 'account': '007', 'nickName': 'xuetong', 'email': 's@c.c', 'cellphone': '12345678901', 'status': 1, 'roleId': null, 'roleName': null, 'organId': 66, 'organName': null}, {'userId': 179, 'account': 'nk1', 'nickName': '诺克', 'email': '123@qq.com', 'cellphone': '15091189988', 'status': 1, 'roleId': null, 'roleName': null, 'organId': 66, 'organName': null}],
  'hasAlert': false,
  'usingFieldId': '206622721253376,212058866167808,206622721318912,206622721380352,206622721331200,206622721312768,206622721265664'}

const createData = {
  channelName: '',
  channelDesc: '',
  channelDest: '',
  alertStatus: 1,
  alertStatusName: '启用'
}

const channelTypeOptions = [
  {
    name: 'rtmp/flv',
    value: 'rtmp/flv'
  }
]

const loggerList = [{
  'method': '暂停预警',
  'message': '操作成功',
  'username': 'Jason.Bai',
  'createDate': '2017-12-22 14:45:34'
}, {
  'method': '停用预警',
  'message': '操作成功',
  'username': 'Jason.Bai',
  'createDate': '2017-12-22 14:45:34'
}, {
  'method': '启用预警',
  'message': '操作成功',
  'username': 'Jason.Bai',
  'createDate': '2017-12-22 14:45:34'
}, {
  'method': '新建预警',
  'message': '操作成功',
  'username': 'Jason.Bai',
  'createDate': '2017-12-22 14:45:34'
}]

export {
  alarmTypes,
  alarmOperateTypes,
  alarmSendStateTypes,
  alarmUpdateStateCodes,
  alarmStateTypes,
  alarmalertWay,
  tableData,
  loggerList,
  detailData,
  channelTypeOptions,
  createData,
  alarmData
}
