import NumberUtils from '../scripts/number-utils.js'
export default {
  data() {
    return {
      valueType: {
        number: 1,
        string: 2,
        enum: 3,
        date: 4
      },
      validateErrors: {}
    }
  },
  methods: {
    isNumberMatrix(matrix) {
      return matrix.matrixColumnType === this.valueType.number;
    },
    isStringMatrix(matrix) {
      return matrix.matrixColumnType === this.valueType.string;
    },
    isDateMatrix(matrix) {
      return matrix.matrixColumnType === this.valueType.date;
    },
    isEnumField(field) {
      return field.valueType === this.valueType.enum;
    },
    isNumberField(field) {
      return field.valueType === this.valueType.number;
    },
    isStringField(field) {
      return field.valueType === this.valueType.string;
    },
    isDateField(field) {
      return field.valueType === this.valueType.date;
    },
    isDateFormat(value) {
      return value === 'yyyy-MM-dd';
    },
    isDateTimeFormat(value) {
      return value === 'yyyy-MM-dd HH:mm:ss';
    },
    GmtToStr(time,valueScope){
      let date = new Date(time)
      if(valueScope === 'yyyy-MM-dd'){
        var Str=date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate()+' '+'00:00:00'
      }else{
        var Str=date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate() + ' ' +
          date.getHours() + ':' +
          date.getMinutes() + ':' +
          date.getSeconds()
      }
      return Str
    },
    StrToGmt(time){
      let GMT = new Date(time)
      return GMT
    },
    isNumber(val) {
      return NumberUtils.isNumber(val)
    },
    isNumberInRange(val, scope) {
      return NumberUtils.isNumberInRange(val, scope)
    },
    validatorFieldValue(rule,value,callback) {
      let err = ''
      let index = rule.field.split('.')[1]
      if(value===undefined) {
        err = '不能为空'
        callback(new Error(err))
      }else{
        let row = this.selectRows[index]
        if(this.isNumberField(row)) {
          if(!this.isNumber(value)) {
            err = '必须为数值'
            callback(new Error(err))
          }else if(row.valueScope&&!this.isNumberInRange(value, row.valueScope)) {
            err = '必须满足'+row.valueScope
            callback(new Error(err))
          }else{
            callback()
          }
        }else{
          callback()
        }
      }
      this.$set(this.validateErrors,'fieldValue'+index,err)
    }
  }
}
