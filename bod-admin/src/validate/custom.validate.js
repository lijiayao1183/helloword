// import TaskApi from '@conn/api/task.api'
import { Validator } from 'vee-validate'

const isNumber = (value) => {
  return !isNaN(Number(value))
}

const isInteger = (value) => {
  let regCn = /^[0-9]*[1-9][0-9]*$/

  return regCn.test(value)
}

const isNumberRange = (value, args) => {
  if (isNumber(value)) return true
  return /^\(,\)$|^(\-|\+)?\d+(\.\d+)?$|^([\[\(](\-|\+)?\d+(\.\d+)?,[\]\)])$|^([\[\(],(\-|\+)?\d+(\.\d+)?[\]\)])$|^([\[\(](\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?[\]\)])$/.test(value) === true
}
const isMoreThanNumber = (value, args) => {

}
const isStartMoreThanEndValue = (value, args) => {
  if (isNumber(value)) return true
  if (isNumberRange(value)) {
    let splitValues = value.substring(1, value.length - 1).split(/[,，]/)
    let startValue = splitValues[0].trim()
    let endValue = splitValues[1].trim()
    return !(startValue && endValue && parseInt(startValue) > parseInt(endValue))
  } else {
    return false
  }
}

const customFunc = (value, args) => {
  return args[0](value)
}
const valueRules = (value, args) => { // 仅适用于创建字段枚举型取值校验
  if (args && args.length > 1) {
    let isValid = true
    for (var i = 0; i < args.length - 1; i++) {
      if (value == args[i] && i != _.last(args)) {
        isValid = false
      }
    }
    return isValid
  }
}

const repeatValues = (value, args) => {
  if (args && args.length > 1) {
    let isValid = true
    let val = _.isArray(value) ? Date.parse(value[0]).toString() + Date.parse(value[1]).toString() : (_.isObject(value) ? value : value.replace(',', '+'))
    for (var i = 0; i < args.length - 1; i++) {
      if ((val == args[i] || _.isEqual(val, args[i])) && i != _.last(args)) {
        isValid = false
      }
    }
    return isValid
  }
}

const moreThanNumberEquals = (value, args) => {
  return isNumber(value) && value <= parseFloat(args[0])
}
const lessThanNumberEquals = (value, args) => {
  return isNumber(value) && value >= parseFloat(args[0])
}
const customArray = (value, args) => {
  if (!value.length) {
    return false
  }
  return true
}
const specialCharacterRule = (value, args) => { // 字段编辑枚举型展示值校验
  // let regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im
  let regEn = /[:,;|]/im
  // let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
  let regCn = /[：；，|]/im
  if (regCn.test(value) || regEn.test(value)) {
    return false
  } else {
    return true
  }
}

const numberInRange = (value, args) => {
  /**
   *test value in range: (0,200]
   */
  let start = args[0]
  let end = args[1]
  let startEquals = (start[0] === '[')
  if (start && start.substr(1).length > 0) {
    start = parseFloat(start.substr(1))
    if (startEquals) {
      if (value < start) {
        return false
      }
    } else {
      if (value <= start) {
        return false
      }
    }
  }

  if (end && end.length >= 1) {
    let endEquals = (end[end.length - 1] === ']')
    if (end.length >= 2) {
      end = parseFloat(end.substr(0, end.length - 1))
      if (endEquals) {
        if (value > end) {
          return false
        }
      } else {
        if (value >= end) {
          return false
        }
      }
    }
  }
  return true
}

const nameValidator = {
  tooLong (value, args) {
    return value.length <= 30
  },
  veryLong (value, args) {
    return value.length <= 100
  },
  character (value, args) {
    return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(value)
  },
  initial (value, args) {
    return value.indexOf('_') !== 0
  },
  exist (value, args) {
    return args.indexOf(value) === args.lastIndexOf(value)
  }
}

const codeValidate = {
  initial (value, args) {
    return value.indexOf('_') !== 0
  },
  character (value, args) {
    return /^[a-zA-Z0-9_]*$/.test(value)
  },
  keywordConflict (value, args) {
    const keyList = ['quota']
    return keyList.indexOf(value) < 0
  }
}

const sumValidate = (value, args) => {
  let expect = Number(args.shift())
  let sum = Number(args.reduce((pre, cur) => {
    return Number(pre) + Number(cur)
  }))
  return expect === sum
}

Validator.extend('specialCharacterRule', specialCharacterRule)
Validator.extend('numberInRange', numberInRange)
Validator.extend('valueRules', valueRules)
Validator.extend('moreThanNumberEquals', moreThanNumberEquals)
Validator.extend('lessThanNumberEquals', lessThanNumberEquals)
Validator.extend('taskExist', customFunc)
Validator.extend('alarmExist', customFunc)
Validator.extend('usersDisabled', customFunc)
Validator.extend('filterSuffix', customFunc)
Validator.extend('existGroupName', customFunc)
Validator.extend('isKeyword', customFunc)
Validator.extend('array', customArray)
Validator.extend('isDate', customFunc)

Validator.extend('isNumber', isNumber)
Validator.extend('isNumberInRange', customFunc)
Validator.extend('isNumberRange', isNumberRange)
Validator.extend('isStartMoreThanEndValue', isStartMoreThanEndValue)
Validator.extend('isStartTimeMoreThanEndTime', customFunc)
Validator.extend('repeatValues', repeatValues)
Validator.extend('isInteger', isInteger)

Validator.extend('sumValidate', sumValidate)
// name validator
Validator.extend('nameTooLong', nameValidator.tooLong)
Validator.extend('veryLong', nameValidator.veryLong)
Validator.extend('nameCharacter', nameValidator.character)
Validator.extend('nameInitial', nameValidator.initial)
Validator.extend('nameExist', nameValidator.exist)

// code validator
Validator.extend('codeInitial', codeValidate.initial)
Validator.extend('codeCharacter', codeValidate.character)
Validator.extend('keywordConflict', codeValidate.keywordConflict)

export default Validator
