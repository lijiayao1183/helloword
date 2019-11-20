export default {
  data () {
    return {
      ruleAuditOption:
        [
          {label: '拒绝', value: 2},
          {label: '通过', value: 5}
        ],
      enumOperatorOption:
        [
          {label: '等于', value: '=='},
          {label: '不等于', value: '!='}
        ],
      stringOperatorOption:
        [
          {label: '包含', value: 'contains'},
          {label: '不包含', value: 'notContains'},
          {label: '等于', value: 'equals'},
          {label: '不等于', value: 'notEquals'}
        ],
      numberOperatorOption:
        [
          {label: '大于', value: '>'},
          {label: '小于', value: '<'},
          {label: '大于等于', value: '>='},
          {label: '小于等于', value: '<='},
          {label: '等于', value: '=='},
          {label: '不等于', value: '!='}
        ],
      dateOperatorOption: [
        {label: '大于', value: 'olderThan'},
        {label: '小于', value: 'lessThan'},
        {label: '大于等于', value: 'olderEqualThan'},
        {label: '小于等于', value: 'lessEqualThan'},
        {label: '等于', value: 'equalDate'},
        {label: '不等于', value: 'notEqualDate'}
      ],
      otherLogicalOption:
        [
          // {label: '空置', value: '-1'},
          // {label: '(', value: '('},
          {label: 'and', value: '&&'},
          {label: 'or', value: '||'},
          {label: 'and(', value: '&&('},
          {label: 'or(', value: '||('}
        ],
      lastLogicalOption:
        [
          {label: '空置', value: '-1'},
          {label: ')', value: ')'},
          {label: '))', value: '))'}
        ],
      firstLogicalOption:
        [
          {label: '空置', value: '-1'},
          {label: '(', value: '('},
          {label: '((', value: '(('}
        ],
      fieldValueTypeOption:
        [
          {label: '数值型', value: 1},
          {label: '字符型', value: 2},
          {label: '枚举型', value: 3},
          {label: '日期型', value: 4}
        ],
      rulePriorityOption:
        [
          {label: 0, value: 0},
          {label: 1, value: 1},
          {label: 2, value: 2},
          {label: 3, value: 3},
          {label: 4, value: 4},
          {label: 5, value: 5},
          {label: 6, value: 6},
          {label: 7, value: 7},
          {label: 8, value: 8},
          {label: 9, value: 9}
        ],
      ruleTypeOption:
        [
          {label: '拒绝', value: 0},
          {label: '加减分', value: 1},
          {label: '关注性规则', value: 2}
        ],
      ruleGroupTypeOption:
        [
          {label: '全部', value: 0},
          {label: '规则', value: 1},
          {label: '分类', value: 2}
        ],
      numberFieldOutRangeOption:
        [
          {label: '小于最小值', value: 1},
          {label: '大于最大值', value: 2},
          {label: '空值', value: 3},
          {label: '其他值', value: 4}
        ],
      enumFieldOutRangeOption:
        [
          {label: '空值', value: 3},
          {label: '其他值', value: 4}
        ],
      dateFieldFormatterOption:
        [
          {label: 'YYYY-MM-DD', value: 'yyyy-MM-dd'},
          {label: 'YYYY-MM-DD 00:00:00', value: 'yyyy-MM-dd HH:mm:ss'}
        ],
      logicalOption:
        [
          {label: '且', value: '&&'},
          {label: '或', value: '||'}
        ],
      fieldSourceOption:
        [
          {label: '全部', value: 0},
          {label: '字段', value: 1},
          {label: '过程变量', value: 2}
        ]
    }
  }
}
