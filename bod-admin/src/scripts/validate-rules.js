import NumberUtils from './number-utils'

export default (function () {
  return {
    name: [
      {required: true, message: `不能为空`, trigger: 'blur'},
      {max: 30, message: '不能超过30个字符', trigger: 'blur'},
      {
        validator: (rule, value, callback) => {
          if (/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value) === false) {
            callback(new Error('只能输入中文、英文、数字或\'_\''))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) => {
          if (value && value.indexOf('_') === 0) {
            callback(new Error('首位不能为特殊字符'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    code: [
      {required: true, message: '不能为空', trigger: 'blur'},
      {max: 30, message: '不能超过30个字符', trigger: 'blur'},
      {
        validator: (rule, value, callback) => {
          if (/^[a-zA-Z0-9_]+$/.test(value) === false) {
            callback(new Error('只能输入数字、英文字母或\'_\''))
          } else if (_.startsWith(value, '_')) {
            callback(new Error('首字符不能为下划线'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    description: [
      {max: 300, message: '描述不能超过300个字符 ', trigger: 'blur'}
    ],
    classify: [
      {max: 30, message: '不能超过30个字符', trigger: 'blur'}
    ],
    isNotNULL: {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        value = _.trim(value)
        if (!value) { // 不可以为空
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      }
    },
    isNumberInRange (valueScope) {
      return {
        validator: (rule, value, callback) => {
          if (!NumberUtils.isNumberInRange(value, valueScope)) {
            callback(new Error('输入的数字不在区间内'))
          } else {
            callback()
          }
        }
      }
    },
    isKeywordConflict () {
      return {
        validator: (rule, value, callback) => {
          const keyList = ['quota']
          if (keyList.indexOf(value) > -1) {
            callback(new Error('特殊名称已被占用'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    },
    isNumber: [
      {required: true, message: `不能为空`, trigger: 'blur'},
      {
        validator: (rule, value, callback) => {
          if (/^[0-9]*$/.test(value) === false) {
            callback(new Error('只能输入数字'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    isCellphoneNum: [
      {required: true, message: `不能为空`, trigger: 'blur'},
      {
        validator: (rule, value, callback) => {
          if (/^[1][0-9]{10}$/.test(value) === false) {
            callback(new Error('请输入正确的手机号码'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    isDateRange: [
      {
	    type: 'array',
	    required: true,
	    trigger: 'blur',
	    fields: {
	      0: {type: 'date', required: true, message: '请输入起止日期', trigger: 'blur'},
	      1: {type: 'date', required: true, message: '请输入起止日期', trigger: 'blur'}
	    }
	  }
    ]
  }
})()
