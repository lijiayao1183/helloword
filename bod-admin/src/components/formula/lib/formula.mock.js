const operatorData = [
  {
    prop: 0,
    label: '+'
  },
  {
    prop: 1,
    label: '-'
  },
  {
    prop: 2,
    label: '*'
  },
  {
    prop: 3,
    label: '/'
  },
  {
    prop: 4,
    label: 'sqrt'
  },
  {
    prop: 5,
    label: 'ln'
  },
  {
    prop: 6,
    label: 'avg'
  },
  {
    prop: 7,
    label: '()'
  },
  {
    prop: 8,
    label: 'abs'
  },
  {
    prop: 10,
    label: 'max'
  },
  {
    prop: 11,
    label: 'min'
  },
  {
    prop: 12,
    label: 'log'
  },
  {
    prop: 13,
    label: 'exp'
  },
  {
    prop: 14,
    label: 'ceil'
  },
  {
    prop: 15,
    label: 'floor'
  },
  {
    prop: 16,
    label: 'π'
  },
  {
    prop: 17,
    label: 'gavg'
  },
  {
    prop: 18,
    label: 'gmax'
  },
  {
    prop: 19,
    label: 'gmin'
  },
  {
    prop: 20,
    label: 'gsum'
  },
  {
    prop: 21,
    label: 'count'
  },
  {
    prop: 22,
    label: 'distinct'
  },
  {
    prop: 23,
    label: 'median'
  }
]
const input = []
const output = {
  author: 114,
  created: 1492574406000,
  engineId: null,
  engineName: null,
  fieldCn: 'substring_test11',
  fieldCondList: [],
  fieldEn: 'f_testtest_mj1',
  fieldRelId: null,
  fieldType: null,
  fieldTypeId: 226,
  formula: '[{",fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ ","idx":"0","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]},{"fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ ","idx":"1","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]}]',
  formulaShow: '[{"idx":"0","fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ "},{"idx":"1","fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ "}]',
  id: 556,
  isCommon: 1,
  isDerivative: 1,
  isLatestVersion: 1,
  isOutput: 0,
  nickName: null,
  organId: null,
  origFieldId: null,
  outRange: null,
  sourceFieldModels: null,
  status: 1,
  updated: 1501120073000,
  usedFieldId: ',554,555',
  valueScope: '相等:1,不等:0',
  valueType: 3
}
const normalOutput = {
  author: 114,
  created: 1492574406000,
  engineId: null,
  engineName: null,
  fieldCn: 'substring_1',
  fieldCondList: [],
  fieldEn: 'eeeeeeeeeee',
  fieldRelId: null,
  fieldType: null,
  fieldTypeId: 226,
  formula: '[{",fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ ","idx":"0","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]},{"fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ ","idx":"1","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]}]',
  formulaShow: '[{"idx":"0","fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ "},{"idx":"1","fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ "}]',
  id: 888,
  isCommon: 1,
  isDerivative: 1,
  isLatestVersion: 1,
  isOutput: 0,
  nickName: null,
  organId: null,
  origFieldId: null,
  outRange: null,
  sourceFieldModels: null,
  status: 1,
  updated: 1501120073000,
  usedFieldId: ',554,555',
  valueScope: '相等:1,不等:0',
  valueType: 1
}
const inputFields = [
  {
    author: 114,
    created: 1492574406000,
    engineId: null,
    engineName: null,
    fieldCn: 'substring_1',
    fieldCondList: [],
    fieldEn: 'hahahaha',
    fieldRelId: null,
    fieldType: null,
    fieldTypeId: 226,
    formula: '[{",fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ ","idx":"0","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]},{"fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ ","idx":"1","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]}]',
    formulaShow: '[{"idx":"0","fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ "},{"idx":"1","fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ "}]',
    id: 888,
    isCommon: 1,
    isDerivative: 1,
    isLatestVersion: 1,
    isOutput: 0,
    nickName: null,
    organId: null,
    origFieldId: null,
    outRange: null,
    sourceFieldModels: null,
    status: 1,
    updated: 1501120073000,
    usedFieldId: ',554,555',
    valueScope: '相等:1,不等:0',
    valueType: 1
  },
  {
    author: 114,
    created: 1492574406000,
    engineId: null,
    engineName: null,
    fieldCn: 'substring_test11',
    fieldCondList: [],
    fieldEn: 'hahaeftgyhhaha',
    fieldRelId: null,
    fieldType: null,
    fieldTypeId: 226,
    formula: '[{",fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ ","idx":"0","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]},{"fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ ","idx":"1","farr":[{"fieldCN":"substring_test1","fieldCond":""},{"fieldCN":"substring_test2","fieldCond":""}]}]',
    formulaShow: '[{"idx":"0","fvalue":"1","formula":"@substring_test1@ ==@substring_test2@ "},{"idx":"1","fvalue":"0","formula":"@substring_test1@ !=@substring_test2@ "}]',
    id: 888,
    isCommon: 1,
    isDerivative: 1,
    isLatestVersion: 1,
    isOutput: 0,
    nickName: null,
    organId: null,
    origFieldId: null,
    outRange: null,
    sourceFieldModels: null,
    status: 1,
    updated: 1501120073000,
    usedFieldId: ',554,555',
    valueScope: '相等:1,不等:0',
    valueType: 1
  }
]
const initFormulaData = {
  'conditions': [
    {
      'input': [
        {
          'field_name': 'substring_1',
          'field_code': 'hahahaha',
          'segments': [
            {
              'segment': '[1,234]',
              'value': '222'
            },
            {
              'segment': '[235,1000]',
              'value': '888'
            }
          ],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        },
        {
          'field_name': 'substring_test11',
          'field_code': 'hahaeftgyhhaha',
          'segments': [
            {
              'segment': '[222,888]',
              'value': '333'
            },
            {
              'segment': '[555,666]',
              'value': '[556]'
            }
          ],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        }
      ],
      'output': {
        'field_name': 'substring_1',
        'field_code': 'eeeeeeeeeee',
        'field_type': 1,
        'field_id': 888
      },
      'formula': '${hahahaha} + ${hahaeftgyhhaha} avg',
      'formula_show': '@substring_1@ + @substring_test11@ avg'
    }
  ]
}
const initspecialFormulaData = {
  'conditions': [
    {
      'input': [
        {
          'field_name': 'substring_1',
          'field_code': 'hahahaha',
          'segments': [
            {
              'segment': '[234,555]',
              'value': '345'
            },
            {
              'segment': '[556,890]',
              'value': '786'
            }
          ],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        },
        {
          'field_name': 'substring_test11',
          'field_code': 'hahaeftgyhhaha',
          'segments': [],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        }
      ],
      'output': {
        'field_name': 'substring_test11',
        'field_code': 'f_testtest_mj1',
        'field_type': 3,
        'field_id': 556
      },
      'formula': '${hahahaha} / ${hahaeftgyhhaha} ',
      'formula_show': '@substring_1@ / @substring_test11@ ',
      'result': '1'
    },
    {
      'input': [
        {
          'field_name': 'substring_test11',
          'field_code': 'hahaeftgyhhaha',
          'segments': [
            {
              'segment': '[123,345]',
              'value': '222'
            },
            {
              'segment': '[234,567]',
              'value': '444'
            },
            {
              'segment': '[234,456]',
              'value': '333'
            }
          ],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        },
        {
          'field_name': 'substring_1',
          'field_code': 'hahahaha',
          'segments': [],
          'field_id': 888,
          'field_scope': '[0,1]',
          'field_type': 1
        }
      ],
      'output': {
        'field_name': 'substring_test11',
        'field_code': 'f_testtest_mj1',
        'field_type': 3,
        'field_id': 556
      },
      'formula': '${hahaeftgyhhaha} abs ${hahahaha} ',
      'formula_show': '@substring_test11@ abs @substring_1@ ',
      'result': '0'
    }
  ]
}
export default {
  operatorData,
  output,
  normalOutput,
  inputFields,
  initFormulaData,
  initspecialFormulaData
}
