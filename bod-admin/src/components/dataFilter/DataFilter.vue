<template lang="pug">
  div.el-form-item__content
    div.data-filter-row(v-if="editble" v-for="(item, index) in dataFilter.traceData" :class="{'last-row': index === dataFilter.traceData.length - 1}")
      div.inline-block
        div.block(v-if="editble && item.ruleId !== undefined")
          //- 选择逻辑符号
          el-select.fixed-width(
          v-model="item.ruleId"
            @change="changeRule(item, index)"
              :class="{'input': true, 'is-danger': errors.has('operator' + index) }"
          v-validate="'required'"
            :name="'operator' + index"
          data-vv-as="运算符"
          )
            el-option(
            v-for="(optionItem, sIndex) in ruleList"
              :key="optionItem.id",
              :label="optionItem.name"
              :disabled="((sIndex === 2 || sIndex === 3 || sIndex === 4 || sIndex === 5) && balance === 0) || ((sIndex === 6 || sIndex === 7) && balance === 1)"
              :value="optionItem.id"
            )
              //:disabled="((sIndex === 2 || sIndex === 3 || sIndex === 4 || sIndex === 5) && balance === 0) || ((sIndex === 6 || sIndex === 7) && balance === 1)"
          span.select-error.block(v-if="errors.has('operator' + index)" class="help is-danger") {{ errors.first('operator' + index) }}
        //- label.margin-right(v-if="!editble && item.ruleId !== undefined") {{item.ruleName || item.ruleId}}
      //- 选择输入字段
      div.inline-block
        div.block(v-if="editble")
          el-select.select-margin-left( filterable
          v-model="item.field"
          value-key="fieldEn" @change="changeInputField(item, index)"
            :class="{'no-margin-left': editble && item.ruleId === undefined, 'input': true, 'is-danger': errors.has('field' + index)}"
          v-validate="'required'"
            :name="'field' + index"
          data-vv-as="输入字段"
          )
            el-option(v-for="optionItem in selectedInputFields"
              :key="optionItem.id"
                :label="optionItem.fieldCn"
                :value="optionItem")
          span.select-error.select-margin-left.block(v-if="errors.has('field' + index)" class="help is-danger") {{ errors.first('field' + index) }}
        //- label.margin-right(v-if="!editble && item.field") {{item.field.fieldEn}}
      //- 选择运算符
      div.inline-block
        div.block(v-if="editble")
          el-select.fixed-width.select-margin-left(
          v-model="item.operatorId"
            @change="changeOperator(item, index)"
          v-validate="'required'"
            :name="'compare' + index"
              :class="{'input': true, 'is-danger': errors.has('compare' + index) }"
          data-vv-as="选择操作符"
          )
            el-option(
            v-if="item.field && item.field.valueType === 4"
            v-for="optionItem in timeOperatorList"
              :key="optionItem.id"
                :label="optionItem.text"
                :disabled="item.field && (item.field.valueType === 2 || item.field.valueType === 3) && optionItem.id !== '==' && optionItem.id !== '!=' && optionItem.id !== 'likeList' && optionItem.id !== '!likeList'"
                :value="optionItem.id"
            )
            el-option(
            v-if="item.field && item.field.valueType === 1"
            v-for="optionItem in timeOperatorList"
              :key="optionItem.id"
                :label="optionItem.text"
                :disabled="optionItem.id == 'likeList' || optionItem.id == '!likeList'"
                :value="optionItem.id"
            )
            el-option(
            v-if="item.field && item.field.valueType !== 4 && item.field.valueType !==1"
            v-for="optionItem in operatorList"
              :key="optionItem.id"
                :label="optionItem.text"
                :disabled="item.field && (item.field.valueType === 2 || item.field.valueType === 3) && optionItem.id !== '==' && optionItem.id !== '!=' && optionItem.id !== 'likeList' && optionItem.id !== '!likeList'"
                :value="optionItem.id"
            )
          span.select-error.select-margin-left.block(v-if="errors.has('compare' + index)" class="help is-danger") {{ errors.first('compare' + index) }}
        //- label.margin-right(v-if="!editble") {{item.operatorName || item.operatorId}}
      //- 输入或者选择值
      div.inline-block.select-margin-left
        div.block(v-if="editble")
          el-input.form-control(
          v-if="item.field && item.field.valueType == 1"
          v-model="item.valueId"
          placeholder="请填写正确的值"
            @input="changeInputValue(item, index)"
              :class="{'input': true, 'is-danger': errors.has('fieldValue' + index) }"
            v-validate="'required|isNumber'"
            :name="'fieldValue' + index"
          data-vv-as="字段值"
          )
          el-input.form-control(
          v-if="item.field && item.field.valueType !== 1 && item.field.valueType !== 3 && item.field.valueType !== 4"
          v-model="item.valueId"
          placeholder="请填写正确的值"
            @input="changeInputValue(item, index)"
              :class="{'input': true, 'is-danger': errors.has('fieldValue' + index) }"
          v-validate="'required'"
            :name="'fieldValue' + index"
          data-vv-as="字段值"
          )
          el-select.enum-select.multiple-select(
          multiple
          v-if="item.field && item.field.valueType === 3 && (item.operatorId === 'likeList' || item.operatorId === '!likeList')"
          v-model="item.multipleValueIds"
            :class="{'input': true, 'is-danger': errors.has('fieldValue' + index) }"
          v-validate="'required|array'"
            :name="'fieldValue' + index"
          data-vv-as="字段值"
            @change="changeMultiValue(item, index)"
          )
            el-option(
            v-for="(optionItem, optionIndex) in item.valueList"
              :key="optionIndex"
                :label="optionItem.name"
                :value="optionItem.id"
            )
          el-select.enum-select.single-select(
          v-if="item.field && item.field.valueType === 3 && item.operatorId !== 'likeList' && item.operatorId !== '!likeList'"
          v-model="item.valueId"
            :class="{'input': true, 'is-danger': errors.has('fieldValue' + index) }"
          v-validate="'required'"
            :name="'fieldValue' + index"
          data-vv-as="字段值"
            @change="changeValue(item, index)"
          )
            el-option(
            v-for="(optionItem, optionIndex) in item.valueList"
              :key="optionIndex"
                :label="optionItem.name"
                :value="optionItem.id"
            )
          div.inline-block(v-if="item.field && item.field.valueType === 4")
            el-date-picker(
            :editable="dateEditable"
            v-show="item.operatorId !== 'likeList' && item.operatorId !== '!likeList'"
            v-model="item.dateTimeValue"
            :type="item.field.valueScope && item.field.valueScope.toLowerCase().indexOf('hh')>0  ?'datetime':'date'"
            :format="item.field.valueScope"
            placeholder="选择日期时间"
              :class="{'input': true, 'is-danger': item.operatorId !== 'likeList' && item.operatorId !== '!likeList' && !item.valueId}"
                @change="changeDateValue($event, item, index)"
            )
            el-date-picker(
            :editable="dateEditable"
            v-show="item.operatorId === 'likeList' || item.operatorId === '!likeList'"
            v-model="item.multipleValueIds"
            :type="item.field.valueScope && item.field.valueScope.toLowerCase().indexOf('hh')>0  ?'datetimerange':'daterange'"
            :format="item.field.valueScope"
            placeholder="选择时间范围"
              :class="{'input': true, 'is-danger': (item.operatorId === 'likeList' || item.operatorId === '!likeList') && !item.valueId}"
                @change="changeMultiDate($event, item, index)"
            )
            span.select-error.block(v-if="item.field && item.field.valueType !== 4 && errors.has('fieldValue' + index)" class="help is-danger") {{ errors.first('fieldValue' + index) }}
            span.select-error.block(v-if="item.field && item.field.valueType === 4 && !item.valueId" class="help is-danger") 该字段的值不能为空
        //- label.margin-right(v-if="!editble && item.field && item.field.valueType !== 3") {{dataFilter.expression[index].value}}
        //- label.margin-right(v-else-if="!editble && item.field && item.field.valueType === 3") {{item.enumValue}}
      div.el-select.row-btns
        a.iconfont-conn.add(v-if="editble && ( dataFilter.traceData.length === 0 || index === dataFilter.traceData.length - 1)" @click="addRow")
        a.iconfont-conn.delete(v-if="editble && index && index === dataFilter.traceData.length - 1" @click="deleteRow")
    el-row.data-filter-row(v-if="editble && (balance === 1 || dataFilter.suffix.selectedId)" :class="{'hori': !editble}")
      el-select(
      v-if="editble && (balance === 1 || dataFilter.suffix.selectedId)"
      v-model="dataFilter.suffix.selectedId"
        @change="changeSuffix"
          :class="{'input': true, 'is-danger': errors.has('filter-suffix')}"
      v-validate="suffixValidate"
        :name="'filter-suffix'"
      data-vv-as="后缀括号"
      )
        el-option(
        v-for="optionItem in suffixList"
          :key="optionItem.id"
            :label="optionItem.name"
            :value="optionItem.id"
        )
      //- label(v-else-if="!editble && balance === 0 && dataFilter.suffix.selectedId !== null") {{dataFilter.suffix.selectedName}}
      span.select-error.block(v-if="errors.has('filter-suffix')" class="help is-danger") 后缀括号不能缺少
    div.read-only-row(v-if="!editble")
      label(v-for="formula in totalFormula") {{formula}}
</template>
<script>
/**
   * 数据筛选组件
   * props: selectedInputFields: 已选取的输入字段集合
   * @author: xinghua.wen
   */
import TaskMock from './mock/task.mock'
import UtilsMock from './mock/utils.func'

export default {
  props: ['dataFilter', 'selectedInputFields', 'editble'],
  inject: ['$validator'],
  data () {
    return {
      ruleList: [],
      operatorList: [],
      timeOperatorList: [],
      filterResultArray: [],
      suffixList: [],
      // 左右括弧均衡指数, 0: 均衡；1：左 > 右；2：右 > 左
      balance: 0,
      dateEditable: false,
      suffixValidate: {
        rules: {
          required: true,
          filterSuffix: null
        }
      },
      totalFormula: []
    }
  },
  methods: {
    deleteRow () {
      this.dataFilter.traceData.pop()
      this.dataFilter.expression.pop()
    },
    addRow () {
      this.dataFilter.traceData.push({
        ruleId: null,
        ruleName: '',
        field: null,
        preFieldEn: '',
        operatorId: null,
        operatorName: '',
        valueId: null,
        multipleValueIds: [],
        dateTimeValue: '',
        enumValue: '',
        valueList: []
      })
      this.dataFilter.expression.push({
        rule: null,
        fieldName: null,
        fieldScope: null,
        operator: null,
        value: null
      })
    },
    /**
       * 数据筛选 输入字段发生改变的回调函数
       * 功能： 1. 得到当前选择字段的整个信息 2. 如果当前选中字段为枚举型，获取该数据源的信息
       * @Date 2017/07/31
       */
    changeInputField (item, index) {
      // fieldType
      if (item.preFieldEn && item.preFieldEn === item.field.fieldEn) {
        return
      }
      item.preFieldEn = item.field.fieldEn
      this.dataFilter.traceData[index].fieldType = item.field.valueType
      if (item.field.valueType === 1 || item.field.valueType === 3) {
        this.dataFilter.expression[index].fieldName = '#{' + item.field.fieldEn + '}'
      } else {
        this.dataFilter.expression[index].fieldName = '\"#{' + item.field.fieldEn + '}\"'
      }

      this.dataFilter.expression[index].valueScope = item.field && item.field.valueScope ? item.field.valueScope : null

      item.operatorId = null
      item.valueId = null
      item.value = null

      // 如果是枚举型，获取枚举数据集
      if (item.field.valueType === 3) {
        // let clonedSource = item.field.valueScope.replace(//)
        item.valueList = UtilsMock.getEnumValueScope(item.field.valueScope)
      } else {
        item.valueList.length = 0
      }

      this.errors.clear()
    },
    /**
       * 数据筛选 运算符发生改变的回调函数
       * 功能： 1. 得到运算符的显示名称；2. 清空该行的值
       * @Date 2017/07/31
       */
    changeOperator (item, index) {
      let operatorIdArr = this.operatorList.map(
        oItem => {
          return oItem.id
        }
      )
      if (item.operatorId === 'likeList' && item.field.valueType !== 4) {
        item.operatorName = '包含'
      } else if (item.operatorId === 'likeList' && item.field.valueType === 4) {
        item.operatorName = '包含于'
      } else if (item.operatorId === '!likeList' && item.field.valueType !== 4) {
        item.operatorName = '不包含'
      } else if (item.operatorId === '!likeList' && item.field.valueType === 4) {
        item.operatorName = '不包含于'
      }
      let oIndex = operatorIdArr.indexOf(item.operatorId)
      if (oIndex === -1) {
        item.operatorName = ''
      } else {
        item.operatorName = item.fieldType !== 4 ? this.operatorList[oIndex].text : this.timeOperatorList[oIndex].text
      }
      this.dataFilter.expression[index].operator = item.operatorId
      item.valueId = null
      item.dateTimeValue = null
      item.multipleValueIds.length = 0
      this.errors.clear()
      /**
         * 修复select从多选到单选，input框没有恢复正常的问题
         */
      this.$nextTick(
        function () {
          let selectDomes = this.$el.querySelectorAll('.enum-select.single-select input')

          if (selectDomes.length > 0) {
	            selectDomes.forEach(
	              item => {
	                item.style.height = '36px'
	              }
	            )
          }
        }
      )
    },
    /**
       * 从给定字符串中统计特殊字符的数量
       * @argument char 特殊字符
       * @argument chars 字符串
       */
    countSpecifiedChar (char, chars) {
      let regex = new RegExp('\\' + char, 'gi')
      let result = chars.match(regex)
      return !result ? 0 : result.length
    },
    /**
       * 改变枚举型值
       */
    changeMultiValue (item, index) {
      item.valueId = item.multipleValueIds.join(' ')
      let idList = item.valueList.map(
        valueItem => {
          return valueItem.id
        }
      )
      let nameArr = item.multipleValueIds.map(
        valueItem => {
          let valueIndex = idList.indexOf(valueItem)
          return item.valueList[valueIndex].name
        }
      )
      // 枚举类型查看模式下展示用
      item.enumValue = nameArr.join(',')
      this.dataFilter.expression[index].value = item.multipleValueIds.join(',')
    },
    changeValue (item, index) {
      this.dataFilter.expression[index].value = item.valueId
      if (item.field.valueType !== 3) {
        return
      }
      let idList = item.valueList.map(
        valueItem => {
          return valueItem.id
        }
      )
      let valueIndex = idList.indexOf(item.valueId)
      if (item.field.valueType === 3 && valueIndex !== -1) {
        // 枚举类型查看模式下展示用
        item.enumValue = item.valueList[valueIndex].name
      }
    },

    changeDateValue (date, item, index) {
      item.valueId = date
      this.dataFilter.expression[index].value = item.valueId
    },
    changeMultiDate (date, item, index) {
      item.valueId = date.replace(/\s\-\s/g, ',')
      this.dataFilter.expression[index].value = item.valueId
    },
    /**
       * 同步输入框的值给公式表达式对象的对应属性
       */
    changeInputValue (item, index) {
      this.dataFilter.expression[index].value = item.valueId
    },
    changeRule (item, index) {
      // item.ruleName
      let ruleIdArr = this.ruleList.map(
        item => {
          return item.id
        }
      )
      let nameIndex = ruleIdArr.indexOf(item.ruleId)
      item.ruleName = this.ruleList[nameIndex].name
      this.dataFilter.expression[index].rule = item.ruleId
    },
    changeSuffix () {
      this.dataFilter.suffix.selectedName = this.dataFilter.suffix.selectedId ? ')' : ''
    },
    /**
       * 校验后缀括号是否被选中
       */
    validateSuffiexHasBracket (value) {
      if (this.dataFilter.suffix.selectedId) {
        return true
      }
      return false
    },
    getTotalFormula () {
      let formula = []
      this.dataFilter.traceData.forEach(
        (item, index) => {
          if (item.ruleId !== undefined) {
            formula.push(item.ruleName ? item.ruleName : item.ruleId)
          }
          if (item.field) {
            formula.push(item.field.fieldCn)
          }
          formula.push(item.operatorName ? item.operatorName : item.operatorId)
          if (item.field && item.field.valueType !== 3) {
            formula.push(this.dataFilter.expression[index].value)
          } else if (item.field && item.field.valueType === 3) {
            formula.push(item.enumValue)
          }
        }
      )
      if (this.dataFilter.suffix.selectedId !== null) {
        formula.push(this.dataFilter.suffix.selectedName)
      }

      return formula
    }
  },
  watch: {
    dataFilter: {
      deep: true,
      /**
         * dataFilter数据发生变化后，检测左右括号是否平衡，以此判定是否该显示后缀括号
         */
      handler: function () {
        let left = 0
        let right = 0
        let ruleArr = this.dataFilter.expression.map(
          item => {
            if (!item.rule) {
              return ''
            } else {
              return item.rule
            }
          }
        )
        let rules = ruleArr.join(' ')
        if (this.dataFilter.suffix.selectedId) {
          rules += this.dataFilter.suffix.selectedName
        }
        left = this.countSpecifiedChar('(', rules)
        right = this.countSpecifiedChar(')', rules)
        if (left === right) {
          this.balance = 0
        } else if (left > right) {
          this.balance = 1
        } else {
          if (this.dataFilter.suffix.selectedId) {
            this.dataFilter.suffix.selectedId = null
            this.dataFilter.suffix.selectedName = ''
          } else {
            this.balance = 2
          }
        }

        this.totalFormula = this.getTotalFormula()
      }
    }
  },
  created () {
    this.ruleList = TaskMock.getRuleList()
    this.operatorList = TaskMock.getOperatorList()
    this.timeOperatorList = TaskMock.getOperatorList()
    this.timeOperatorList.forEach(
      item => {
        if (item.text === '包含' || item.text === '不包含') {
          item.text += '于'
        }
      }
    )
    this.suffixList = TaskMock.getSuffixList()
    this.suffixValidate.rules.filterSuffix = this.validateSuffiexHasBracket
    if (!this.editable) {
      this.totalFormula = this.getTotalFormula()
    }
  }
}
</script>
<style lang="scss" scoped>
  $themeColor: #3e8feb;
  $themeReadOnlyColor: #777777;
  .iconfont-conn {
    position: relative;
    margin-left: 10px;
    &:before {
      color: #c4c4c4;
      cursor: pointer;
    }
    &:hover, &:focus {
      &:before {
        color: $themeColor;
      }
    }
    &.delete {
      top: 1px;
      font-size: 26px;
    }
    &.add {
      top: 3px;
      font-size: 21px;
    }
  }

  .fixed-width {
    width: 100px;
  }

  .select-margin-left {
    margin-left: 20px;
    &.no-margin-left {
      margin-left: 0;
    }
  }

  .row-btns {
    vertical-align: top;
  }

  .inline-block {
    vertical-align: top;
  }

  .data-filter-row {
    margin-bottom: 10px;
    &.hori {
      display: inline-block;
      color: $themeReadOnlyColor;
    }
    &.last-row {
      margin-bottom: 0px;
    }
  }

  input.form-control {
    font-size: 14px;
  }

  .read-only-row {
    color: $themeReadOnlyColor;
    margin-left: -15px;
    & > label {
      padding-right: 15px;
    }
  }
</style>
