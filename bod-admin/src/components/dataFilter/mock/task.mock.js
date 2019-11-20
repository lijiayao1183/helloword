class TaskMock {
  getRelationOperatorList () {
    return [
      {
        id: '=',
        text: '='
      }
    ]
  }

  getOperatorList () {
    return [
      {
        id: '==',
        text: '='
      },
      {
        id: '!=',
        text: '!='
      },
      {
        id: '<',
        text: '<'
      },
      {
        id: '>',
        text: '>'
      },
      {
        id: '<=',
        text: '<='
      },
      {
        id: '>=',
        text: '>='
      },
      {
        id: 'likeList',
        text: '包含'
      },
      {
        id: '!likeList',
        text: '不包含'
      }
    ]
  }

  getOperarorList () {
    let beforeList = this.getOperatorList()
    return beforeList.concat([
      {
        id: '=(',
        text: '=('
      },
      {
        id: '=[',
        text: '=['
      }
    ])
  }

  getRuleList () {
    return [
      {
        id: '||',
        name: '或者'
      },
      {
        id: '&&',
        name: '并且'
      },
      {
        id: ') || (',
        name: ') 或者 ('
      },
      {
        id: ') && (',
        name: ') 并且 ('
      },
      {
        id: ') ||',
        name: ') 或者'
      },
      {
        id: ') &&',
        name: ') 并且'
      },
      {
        id: '|| (',
        name: '或者 ('
      },
      {
        id: '&& (',
        name: '并且 ('
      }
    ]
  }

  getPartRuleList () {
    return [
      {
        id: '||',
        name: '或者'
      },
      {
        id: '&&',
        name: '并且'
      },
      {
        id: '|| (',
        name: '或者 ('
      },
      {
        id: '&& (',
        name: '并且 ('
      }
    ]
  }

  getSuffixList () {
    return [
      {
        id: 1,
        name: ')'
      }
    ]
  }

  getGroupSuffixList () {
    return [
      {
        id: 1,
        name: ')'
      },
      {
        id: 2,
        name: ']'
      }
    ]
  }

  getCalcTypeList () {
    return [
      {
        id: 0,
        name: '顺序计算'
      },
      {
        id: 1,
        name: '循环计算'
      }
    ]
  }

  getCyclicDateList () {
    return [
      {
        id: 'hour',
        name: '小时',
        type: ['yyyy-MM-dd HH:mm:ss']
      },
      {
        id: 'day',
        name: '天',
        type: ['yyyy-MM-dd', 'yyyy-MM-dd HH:mm:ss']
      }
      // {
      //   id: 'week',
      //   name: '周'
      // },
      // {
      //   id: 'month',
      //   name: '月'
      // }
    ]
  }

  getExpressionList () {
    return [
      {
        id: 0,
        label: '去重统计',
        labelEn: 'noRepeat'
      },
      {
        id: 1,
        label: '求和',
        labelEn: 'sum'
      },
      {
        id: 2,
        label: '求平均值',
        labelEn: 'avg'
      },
      {
        id: 3,
        label: '取最大值',
        labelEn: 'max'
      },
      {
        id: 4,
        label: '取最小值',
        labelEn: 'min'
      },
      {
        id: 5,
        label: '计数',
        labelEn: 'count'
      },
      {
        id: 6,
        label: '编写公式',
        labelEn: 'formula'
      }
    ]
  }

  getGroupList () {
    return [
      {
        id: 0,
        label: '按年分组',
        labelEn: 'year'
      },
      // {
      //   id: 1,
      //   label: '按季度分组',
      //   labelEn: 'quarter'
      // },
      {
        id: 2,
        label: '按月分组',
        labelEn: 'month'
      },
      // {
      //   id: 3,
      //   label: '按周分组',
      //   labelEn: 'week'
      // },
      {
        id: 4,
        label: '按天分组',
        labelEn: 'day'
      },
      {
        id: 5,
        label: '自定义分组',
        labelEn: 'custom'
      }
    ]
  }

  taskPreColumns () {
    return [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        key: 'taskId',
        tile: '任务Id'
      },
      {
        key: 'taskName',
        title: '任务名称'
      }
    ]
  }

  taskLastColumns () {
    return [
      // {
      //     prop: '',
      //     label: '累计计算条数'
      // },
      {
        prop: 'dutyUserIds',
        label: '责任人'
      }
    ]
  }

  statusList () {
    return [
      {
        value: 0,
        label: '已停用'
      },
      {
        value: 1,
        label: '运行中'
      },
      {
        value: 2,
        label: '未启动'
      },
      {
        value: 3,
        label: '启动中'
      },
      // {
      //   value: 4,
      //   label: '停用中'
      // },
      // {
      //   value: 5,
      //   label: '删除中'
      // },
      {
        value: 6,
        label: '操作异常'
      },
      {
        value: 7,
        label: '状态异常'
      }
    ]
  }

  taskStatusTypes () {
    return {
      RUNNING: 1,
      STOPPED: 0,
      START_ERROR: 2,
      STARTING: 3,
      STOPPING: 4,
      DELETING: 5,
      OPERATOR_ERROR: 6,
      STATUS_ERROR: 7
    }
  }

  getTaskDetailStatus () {
    return [
      {
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '异常'
      }, {
        value: 2,
        label: '成功'
      }
    ]
  }

  getAllTasks () {
    return [
      {taskId: 100, taskName: '任务1'},
      {taskId: 101, taskName: '任务2'},
      {taskId: 102, taskName: '任务3'},
      {taskId: 103, taskName: '任务4'},
      {taskId: 104, taskName: '任务5'},
      {taskId: 105, taskName: '任务6'},
      {taskId: 106, taskName: '任务7'},
      {taskId: 107, taskName: '任务8'},
      {taskId: 108, taskName: '任务9'},
      {taskId: 109, taskName: '任务10'},
      {taskId: 110, taskName: '任务11'}
    ]
  }

  getTaskStatus () {
    return [{
      name: '未启动',
      code: 'failed'
    }, {
      name: '已启动',
      code: 'active'
    }, {
      name: '已停止',
      code: 'disable'
    }, {
      name: '状态异常',
      code: 'exception'
    }, {
      name: '操作异常',
      code: 'optException'
    }, {
      name: '启动中',
      code: 'activeLoading'
    }, {
      name: '停止中',
      code: 'disableLoading'
    }, {
      name: '删除中',
      code: 'deleteLoading'
    }]
  }

  getTaskDetail () {
    return [
      {
        createTime: '2017-04-23 09:21:01',
        status: 1,
        taskId: 110,
        consumeTime: 110,
        taskName: '任务1',
        exceptionCause: ''
      }, {
        createTime: '2017-05-23 09:21:01',
        status: 0,
        taskId: 111,
        taskName: '任务2',
        consumeTime: 110,
        exceptionCause: '数据格式转化异常'
      }, {
        createTime: '2017-04-25 09:21:01',
        status: 1,
        taskId: 112,
        taskName: '任务3',
        consumeTime: 110,
        exceptionCause: ''
      }, {
        createTime: '2017-07-23 09:21:01',
        status: 1,
        taskId: 113,
        consumeTime: 110,
        taskName: '任务4',
        exceptionCause: ''
      }, {
        createTime: '2017-09-23 09:21:01',
        status: 1,
        taskId: 114,
        taskName: '任务5',
        consumeTime: 110,
        exceptionCause: ''
      }, {
        createTime: '2017-11-20 09:21:01',
        status: 0,
        taskId: 115,
        taskName: '任务6',
        consumeTime: 110,
        exceptionCause: '位置异常'
      }, {
        createTime: '2017-04-01 09:21:01',
        status: 1,
        taskId: 116,
        consumeTime: 110,
        taskName: '任务7',
        exceptionCause: ''
      }, {
        createTime: '2017-12-23 09:21:01',
        status: 0,
        taskId: 117,
        consumeTime: 110,
        taskName: '任务8',
        exceptionCause: '过滤器表达式执行异常'
      }, {
        createTime: '2017-12-23 09:21:01',
        status: 0,
        taskId: 118,
        taskName: '任务8',
        exceptionCause: '过滤器表达式执行异常'
      }, {
        createTime: '2017-12-23 09:21:01',
        status: 0,
        consumeTime: 110,
        taskId: 119,
        taskName: '任务8',
        exceptionCause: '过滤器表达式执行异常'
      }, {
        createTime: '2017-12-23 09:21:01',
        status: 0,
        taskId: 120,
        consumeTime: 110,
        taskName: '任务8',
        exceptionCause: '过滤器表达式执行异常'
      }
    ]
  }

  getTaskDetailExceptionMessage (code) {
    let errors = [
      {code: 1000, message: '未知错误'},
      // 过滤器异常
      {code: 5000, message: '过滤器执行失败'},
      {code: 5001, message: '数据不满足过滤条件'},
      {code: 5002, message: '过滤器获取无法获取字段或字段为空'},
      {code: 5003, message: '过滤表达式执行失败'},
      // 分组异常
      {code: 5100, message: '分组执行失败'},
      {code: 5101, message: '分组列表为空'},
      {code: 5102, message: '分组未指定数据'},
      {code: 5103, message: '分组不能获取指定数据'},
      // 计算异常
      {code: 5200, message: '计算节点执行失败'},
      {code: 5201, message: '计算节点不能获取指定数据'},
      {code: 5202, message: '数据格式转化失败'},
      {code: 5203, message: '数据类型转化失败'},
      // 数据库异常
      {code: 5300, message: 'hbase执行失败'},
      {code: 5301, message: 'hbase连接失败'},
      {code: 5302, message: 'redis执行失败'},
      {code: 5303, message: 'redis连接失败'}
    ]
    let error = _.find(errors, {code: code})
    return error ? error.message : ''
  }
}

export default new TaskMock()
