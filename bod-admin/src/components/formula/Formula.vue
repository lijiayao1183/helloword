<template lang="pug">
  div.c-field-equation(:class="{'none-border':!fieldType}")
    //- 公式选项区域
    template(v-if="onOperator")
      div.c-field-operator-head(v-if="oneLine")
        div.c-operational-character(:dataid="item.prop"
          v-for="(item, index) in iconList"
          :key="item.prop"
          :style="{width: 'calc(100% / ' + iconList.length + ')'}"
          :class="'character_' + index"
          @click="clickOperator(item.label)"
        )
          label.normal-img {{item.label}}
        a(:href="explainFileUrl" target='_blank') 查看支持的运算符 / 函数
        //- div.c-operational-character(:style="{width: 'calc(100% / ' + iconList.length + ')'}")
        //-     label.normal-img.iconfont.symbol
      div.c-field-operator-head(v-else)
        div.c-operational-character(v-for="(item, index) in separatedData[0]" :key="item.prop" :style="{width: 'calc(100% / ' + separatedFirstLength + ')'}" :class="'character_' + index" @click="clickOperator(item.label)")
          label.normal-img {{item.label}}
        div.c-operational-character(v-if="!oneLine")
          label.normal-img.iconfont.more(@click="showMore")
      div.c-field-operator-head(v-if="!oneLine && !moreBtn")
        div.c-operational-character(v-for="item in separatedData[1]" :key="item.prop" :style="{width: 'calc(100% / ' + separatedAfterLength + ')'}" @click="clickOperator(item.label)")
          label.normal-img {{item.label}}
        //- div.c-operational-character(:style="{width: 'calc(100% / ' + separatedData[1].length + ')'}")
        //-     label.normal-img.iconfont.symbol
    //- 公示结果区域
    div.includeFormula(:style="{height: 'calc(100% - ' + (onOperator ? ' 46px' : '0px') + ')', 'max-height': (onOperator ? '215px' : '220px')}")
      div.formulas
        div.textArea(:style="{'padding-bottom': (onOperator ? ' 6px' : '0px'), height: 'calc(100% - ' + (onOperator ? '6px' : '0px') + ')'}")
          div.common-formulas(v-if="fieldType")
            textarea#inputor0.inputor(@blur="getFormular" ref="inputor0" :disabled="textDisabled" :placeholder="placeholder")
          div.enum-formulas(v-else)
            div.explain-text
              span 输出 =
              span 条件公式
              span 枚举型字段衍生公式必须为条件公式，如：a>2
            div.formula-items(v-for="(item, index) in fieldSetOptions")
              el-input.title(placeholder="请输入内容" v-model="item.label" :value="item.value" readonly)
              span.operator 满足
              textarea.inputor(:id="'inputor' + index" :ref="'inputor' + index" @blur="getArrayFormular" :disabled="textDisabled")
        el-dialog(:sectionModalVsible="sectionModalVsible" title="区间设置" :visible="sectionModalVsible " size="small" :modal="isModal" :show-close="false")
          field-section(v-if="selectedField.length&&sectionModalVsible" :isReadOnly="isReadOnly" :field="selectedField[0]" :segments="segments" @switchChange="switchChange" :fieldSwitch="fieldSwitch" :outRangeValue="outRangeValue" @shutmodal="shutSectionModal" @getSectionData="getSectionData")
        snapshot-outputField-dialog(:segmentSetVisible="segmentSetVisible" :segmentsModel="segmentsModel" @ok="segmentSetVisible=false")
</template>
<script type="text/babel">
/**
 * @props: inputFields [输入字段，类型Array];
 * outputField [输出字段，类型Object];
 * oneLine [公式head是否一行展示，类型 Boolean, true(默认): 一行展示，false: 两行展示];
 * initFormula [公式的初始化数据：{},格式以最终该组件输出的格式为准]
 * editPattern [输出是否处于编辑状态 false(默认)：非编辑状态，true: 编辑状态]
 * @getFormular 事件， 向父组件传递公式最新值
 */
import caret from './lib/jquery.caret'
import atwho from './lib/jquery.atwho'
import Mock from './lib/formula.mock'
import * as _ from 'lodash'
import FieldSection from './FieldSection.vue'
import SnapshotOutputFieldDialog from './outputFieldDialog.vue'
import DateUtils from '../../../src/scripts/date-utils.js'
import debugDataMock from './mock/debug.mock'

let url = require('../../scripts/url')

export default {
  props: {
    isMatrix: { // 是否是数组衍生
      type: Boolean,
      default: false
    },
    isAllowCopy: {
      type: Boolean,
      default: false
    },
    inputFields: {
      type: Array,
      default: function () {
        return {}
      }
    },
    isModal: {
      type: Boolean,
      default: true
    },
    onOperator: {
      type: Boolean,
      default: true
    },
    handleInvoke: {
      type: Boolean,
      default: true
    },
    outputField: {
      type: Object,
      default: function () {
        return {}
      }
    },
    initFormula: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    oneLine: {
      type: Boolean,
      default: true
    },
    editPattern: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: function () {
        return '请输入" @"(@前加空格)选取字段开始编辑公式'
      }
    }
  },
  watch: {
    modalVsible: function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    }
  },
  data: () => ({
    explainFileUrl: `${url.rootPath}/lib/resources/函数说明文档.pdf`,
    iconList: [],
    moreBtn: true,
    formulaValue: '',
    selectedFieldInfo: null,
    activeElementId: '',
    sectionModalVsible: false,
    sectionModalTitle: '',
    fieldSwitch: false,
    fieldsData: [],
    outRangeValue: '',
    segments: [],
    segmentsReadOnly: [],
    segmentsModel: {},
    copiedOutput: {
      fieldEn: '',
      valueScope: '',
      valueType: null
    },
    copiedConditions: [],
    segmentSetVisible: false,
    textDisabled: true,
    blurTimer: null
  }),
  computed: {
    computedFormula () {
      return _.cloneDeep(this.initFormula)
    },
    //      isReadOnly () {
    //        return this.$root.$data.isReadOnly
    //      },
    separatedData () {
      let afterData = Object.assign([], this.iconList)
      let preData = afterData.splice(0, 8)
      return [preData, afterData]
    },
    separatedFirstLength () {
      return this.separatedData[0].length + 1
    },
    separatedAfterLength () {
      return this.separatedData[1].length
    },
    /**
     * 输出字段是否枚举型
     * 是：false;否: true
     */
    fieldType () {
      if (this.outputField && this.outputField.valueType === 3) {
        return false
      }
      return true
    },
    /**
     * 字段类型为枚举的可选值集合
     * 默认array length = 0
     */
    fieldSetOptions () {
      if (!this.fieldType) {
        if (!this.outputField.valueScope) {
          return []
        }
        let source = this.outputField.valueScope
        source = source.replace(/,$/, '')
        let items = source.split(/[,，]/g)
        if (!items.length) {
          return []
        }
        return items.map(
          item => {
            let itemObjArr = item.split(/[:：]/g)
            if (!itemObjArr.length) {
              return []
            }
            return {
              label: itemObjArr[0],
              prop: itemObjArr[1]
            }
          }
        )
      }
    },
    /**
     * 当前点击的字段具体信息
     */
    selectedField () {
      if (this.selectedFieldInfo && this.selectedFieldInfo[0] && this.selectedFieldInfo[0].text) {
        return this.inputFields.filter(
          item => {
            if (item.fieldCn === this.selectedFieldInfo[0].text) {
              return item
            }
          }
        )
      } else {
        return []
      }
    },
    activedEnumId () {
      return this.fieldSetOptions[parseInt(this.activeElementId.match(/[0-9]{1,}$/))].prop
    },
    // 当前光标所在enum索引
    activedEnumIndex () {
      if (this.fieldType) {
        return -1
      }
      for (let i = 0; i < this.computedFormula.conditions.length; i++) {
        if (this.computedFormula.conditions[i].result === this.activedEnumId) {
          return i
        }
      }
      return -1
    },
    outputInfo () {
      if (!this.outputField || this.outputField && this.outputField.fieldEn === undefined) {
        return {
          field_name: '',
          field_code: '',
          field_type: 1,
          field_id: ''
        }
      }
      return {
        field_name: this.outputField.fieldCn,
        field_code: this.outputField.fieldEn,
        field_type: this.outputField.valueType,
        field_id: this.outputField.id,
        valueScope: this.outputField.valueScope
      }
    }
  },
  methods: {
    switchChange (switchValue) {
      this.fieldSwitch = switchValue
    },
    modalVsibleOpen () {
      let dlg = $('.c-field-equation').parents('.el-dialog__wrapper')
      if (dlg) {
        // 控制遮罩z-index
        let z_index = dlg.css('z-index')
        z_index = z_index - 2
        if ($('#score-card')) {
          $('.v-modal').css({
            'z-index': z_index
          })
        }
      }
    },
    /**
     * 关闭区间模态框
     */
    shutSectionModal () {
      this.sectionModalVsible = false
    },
    /**
     * 运算符的点击事件
     * 1. 把运算符放到formula中；2. 运算符之后加一个空格，方便选择字段；3.自动把光标聚焦在运算符之后
     * */
    clickOperator (operator) {
      if (this.textDisabled) {
        return
      }
      let realOperator = this.transformOperator(operator)
      let curActivedId = ''
      if (this.fieldType) {
        curActivedId = 'inputor0'
      } else {
        curActivedId = this.activeElementId
      }
      let $inputor = this.$refs[curActivedId]
      let position = $($inputor).getCursorPosition()
      let oldValue = $($inputor).val()
      let preValue = oldValue.slice(0, position)
      let suffixValue = oldValue.slice(position, oldValue.length)
      $($inputor).val(preValue + realOperator + suffixValue)
      // 定位光标位置
      document.getElementById(curActivedId).setSelectionRange(position + realOperator.length, position + realOperator.length)
      $($inputor).focus()
    },
    /**
     * 转化实际运算符
     */
    transformOperator (operator) {
      let valid = operator.search(/^[\+\/\-\*π]|(\(\))$/)
      if (valid === -1) {
        return operator + '() '
      }
      return operator + ' '
    },
    showMore () {
      this.moreBtn = !this.moreBtn
    },
    //      dispatchModelVisible () {
    //        return this.modalVsible
    //      },
    handlerDelete (text) {
      // if(this.modalVsible) {
      this.selectedFieldInfo = text
      this.deleteField(text)
      //     return false
      // }
      // return true
    },
    setActivedEleId (id) {
      this.activeElementId = id
    },
    // 点击textarea中字段，弹出模态框
    handleSelectedField (data, view, modalFlag) {
      // 获取当前焦点所在id
      this.activeElementId = document.activeElement.id
      // 得到当前点击字段的名称，进而得到该字段全部信息 【selectedField】
      if (data && data[0] && data[0].text) {
        let existField = this.inputFields.filter(
          item => {
            if (item.fieldCn === data[0].text) {
              return item
            }
          }
        )

        if (_.isArray(existField) && existField[0] && existField[0].fieldSource == 2) {
          this.$message.warning('过程变量不能设置区间！')
          view.hide()
        } else {
          if (!existField.length) {
            this.caretChecked = false
            return
          }
          view.hide()
          this.selectedFieldInfo = data
          // 已选中字段，但是光标紧挨最后的@，模态框不出现
          if (modalFlag) {
            this.caretChecked = true
            return
          }
          // this.modalVsible = true
          this.sectionModalTitle = '区间设置'
          // 确定该字段的区间信息
          let inputArray = []
          if (this.fieldType) {
            inputArray = this.computedFormula.conditions[0].input
          } else {
            inputArray = this.computedFormula.conditions[this.activedEnumIndex].input
          }
          existField = inputArray.filter(
            item => {
              if (item.field_code === this.selectedField[0].fieldEn) {
                return item
              }
            }
          )
          this.setSection()
        }
      }
    },
    /**
     * 设置区间功能
     * 1. 添加默认区间信息； 2. 弹出对应模态框
     */
    setSection () {
      // 设置默认显示区间信息 activedEnumIndex
      console.log(JSON.parse(JSON.stringify(this.computedFormula)))
      let defaultConditions = {}
      if (this.fieldType) {
        defaultConditions = this.computedFormula.conditions[0]
      } else {
        defaultConditions = this.computedFormula.conditions[this.activedEnumIndex]
      }
      let checkedFieldSection = defaultConditions.input.filter(
        item => this.selectedField.some(field => field.fieldEn === item.field_code)
        // {
        //   if (this.selectedField[0].fieldEn === item.field_code) {
        //     return item
        //   }
        // }
      )
      let segments = checkedFieldSection[0] && checkedFieldSection[0].segments || []
      if (segments.length) {
        this.outRangeValue = checkedFieldSection[0].outRangeValue
        this.fieldSwitch = checkedFieldSection[0].fieldSwitch
        this.segments = Object.assign([], segments)
        if (this.isReadOnly && this.fieldSwitch) { // 子维度评分卡只读状态
          this.segmentsReadOnly = _.cloneDeep(segments)
          if (checkedFieldSection[0].field_type === 3) {
            _.each(this.segmentsReadOnly, (segItem) => {
              let itemVal = []
              _.each(JSON.parse(segItem.segment), data => {
                _.each(checkedFieldSection[0].field_scope.split(','), item => {
                  if (item.split(':')[1] === data) {
                    itemVal.push(item.split(':')[0])
                    return false
                  }
                })
              })
              segItem.segment = itemVal.join(',')
            })
          } else if (checkedFieldSection[0].field_type === 4) {
            _.each(this.segmentsReadOnly, item => {
              const timerStart = DateUtils.formate(JSON.parse(item.segment)[0], checkedFieldSection[0].field_scope.replace('HH', 'hh'))
              const timerEnd = DateUtils.formate(JSON.parse(item.segment)[1], checkedFieldSection[0].field_scope.replace('HH', 'hh'))
              item.segment = '[' + timerStart + '-' + timerEnd + ']'
            })
          }
          this.segmentsModel = {
            segmentsTable: this.segmentsReadOnly,
            outRangeValue: this.outRangeValue
          }
        }
      } else {
        if (checkedFieldSection[0].field_type != 3) {
          this.fieldSwitch = false
          this.outRangeValue = ''
          this.segments = [{ segment: null, value: null }]
        } else {
          this.fieldSwitch = false
          this.outRangeValue = ''
          this.segments = [{ segment: [], value: null }]
        }
      }

      if (this.isReadOnly && this.selectedField[0].fieldSource != 3) {
        if (!this.isMatrix) {
          this.segmentSetVisible = true
        }
      } else if (this.selectedField[0].fieldSource != 3) {
        if (!this.isMatrix) {
          this.sectionModalVsible = true
        }
      }
    },
    replaceAllFields (str, inputIndex) {
      let reg = /@[a-zA-Z0-9_\u4e00-\u9fa5()（）-]+@/
      let patt = new RegExp(reg, 'g')
      let arr0 = str.match(patt)
      if (arr0 != null && arr0.length > 0) {
        for (var i = 0; i < arr0.length; i++) {
          let field = this.computedFormula.conditions[inputIndex].input.find(field => ('@' + field.field_name + '@') === arr0[i]) || {field_code: ''}
          let transitionedFieldEn = '#{' + field.field_code + '}'
          // for (let index = 0; index < this.inputFields.length; index++) {
          //   if ('@' + this.inputFields[index].fieldCn + '@' === arr0[i]) {
          //     transitionedFieldEn = '#{' + this.inputFields[index].fieldEn + '}'
          //     break
          //   }
          // }
          str = str.replace(arr0[i], transitionedFieldEn)
        }
      }
      return str.replace(/π/g, '#{PI}')
    },
    getInputFieldNames (str) {
      let reg = /@[a-zA-Z0-9_\u4e00-\u9fa5()（）-]+@/
      let patt = new RegExp(reg, 'g')
      return (str.match(patt) || []).map(name => name.slice(1, -1))
    },
    validateFormulaInputField (condition) {
      let fieldNames = this.getInputFieldNames(condition.formula_show)
      console.log('----------fieldNames----------', fieldNames)
      if (fieldNames.length) {
        condition.input = condition.input.filter(field => fieldNames.some(name => name === field.field_name))
      } else {
        condition.input = []
      }
    },
    /**
     * 非枚举型输出字段，生成conditions数据
     * 将数据传递给父组件获知
     */
    getFormular (str, nowPut) {
      // 转换格式以及名称后，给父组件传递公式 str event事件 nowPut 立刻保存(评分卡维度用到)
      if (str) {
        clearTimeout(this.blurTimer)
        this.blurTimer = setTimeout(() => {
          this.getFormularDo()
        }, 500)
      } else {
        this.getFormularDo(nowPut)
      }
    },
    getFormularDo (nowPut) {
      this.computedFormula.conditions[0].formula = this.replaceAllFields($(this.$refs['inputor0']).val(), 0)
      this.computedFormula.conditions[0].formula_show = ($(this.$refs['inputor0']).val())

      // 使用最新的output信息
      this.computedFormula.conditions[0].output = this.outputInfo
      this.copiedConditions = Object.assign([], this.initFormula.conditions)

      this.validateFormulaInputField(this.computedFormula.conditions[0])
      if (this.computedFormula.conditions[0].formula_show.length > 1000) {
        this.$message.warning('公式长度不能大于1000个字符')
      } else {
        this.$emit('getFormular', this.computedFormula, nowPut)
      }
    },
    /**
     * 枚举型输出字段，生成conditions数据
     * 将数据传递给父组件获知
     */
    getArrayFormular (str) {
      if (!this.fieldSetOptions) {
        return
      }
      if (str) {
        clearTimeout(this.blurTimer)
        this.blurTimer = setTimeout(() => {
          this.getArrayFormularDo()
        }, 500)
      } else {
        this.getArrayFormularDo()
      }
    },
    getArrayFormularDo () {
      this.computedFormula.conditions.forEach(
        (item, inputIndex) => {
          let index = -1
          for (let i = 0; i < this.fieldSetOptions.length; i++) {
            if (!item['result'] || item.result === this.fieldSetOptions[i].prop) {
              index = i
              break
            }
          }
          item.formula_show = ($(this.$refs['inputor' + index]).val())

          item.formula = this.replaceAllFields($(this.$refs['inputor' + index]).val(), inputIndex)
          // 使用最新的output信息
          item.output = this.outputInfo
          this.validateFormulaInputField(item)
        }
      )
      this.copiedConditions = Object.assign([], this.initFormula.conditions)
      this.$emit('getFormular', this.computedFormula)
    },
    deleteField (text) {
      let inputorId = 'inputor0'
      if (!this.fieldType) {
        inputorId = this.activeElementId
      }
      if (!this.selectedFieldInfo) {
        return
      }
      let $inputor = $(this.$refs[inputorId])
      let deletedContent = $inputor.val().replace(eval('/@' + this.selectedFieldInfo[0].text + '@|@' + this.selectedFieldInfo[0].text + '/g'), '')
      deletedContent = deletedContent.trim()
      $inputor.val(deletedContent)
      this.modalVsible = false
      let fieldCn = deletedContent.replace(/@/g, '')
      // 删除conditions中对应字段信息
      if (this.fieldType) {
        let index = -1
        for (let i = 0; i < this.computedFormula.conditions[0].input.length; i++) {
          if (this.computedFormula.conditions[0].input[i].field_name === fieldCn) {
            index = i
            break
          }
        }
        this.computedFormula.conditions[0].input.splice(index, 1)
        this.getFormular()
      } else {
        let index = -1
        for (let i = 0; i < this.computedFormula.conditions[this.activedEnumIndex].input.length; i++) {
          if (this.computedFormula.conditions[this.activedEnumIndex].input[i].field_name === fieldCn) {
            index = i
            break
          }
        }
        this.computedFormula.conditions[this.activedEnumIndex].input.splice(index, 1)
        this.getArrayFormular()
      }
    },
    /**
     * 重写at.js的钩子函数 beforeInsert
     * 触发时机为选中字段，插入textarea之前
     */
    beforeInsert (value, isDimension) {
      let tempValue = value
      tempValue = tempValue.replace('@', '')
      let checkedFields = this.inputFields.filter(
        item => {
          if (item.isDimension === undefined) {
            return item.fieldCn === tempValue
          } else {
            return item.fieldCn === tempValue && item.isDimension === isDimension
          }
        }
      )
      // conditions存入选择字段相关信息
      let condiIndex = 0
      if (!this.fieldType) {
        condiIndex = this.activedEnumIndex == -1 ? 0 : this.activedEnumIndex
      }

      let formulaShow = $(this.$refs['inputor' + condiIndex]).val()
      let num = 0
      for (var i = 0, len = formulaShow.length; i < len; i++) {
        if (formulaShow[i] === '@') {
          num++
        }
      }
      this.computedFormula.conditions[condiIndex].input.push({
        field_name: checkedFields[0].fieldCn,
        field_code: checkedFields[0].fieldEn,
        segments: [],
        field_id: checkedFields[0].id !== undefined ? checkedFields[0].id : null,
        field_scope: checkedFields[0].valueScope,
        field_type: checkedFields[0].valueType,
        isDimension: checkedFields[0].isDimension || 0,
        fieldSwitch: false,
        outRangeValue: '',
        fieldSource: checkedFields[0].fieldSource
      })
      // this.computedFormula.conditions[condiIndex].input.push({
      //   field_name: checkedFields[0].fieldCn,
      //   field_code: checkedFields[0].fieldEn,
      //   segments: [],
      //   field_id: checkedFields[0].id !== undefined ? checkedFields[0].id : null,
      //   field_scope: checkedFields[0].valueScope,
      //   field_type: checkedFields[0].valueType,
      //   isDimension: checkedFields[0].isDimension || 0,
      //   fieldSwitch: false,
      //   outRangeValue: '',
      //   fieldSource: checkedFields[0].fieldSource,
      // })
      console.log('-------beforeInsert---------', JSON.parse(JSON.stringify(this.computedFormula.conditions[0])))
      return value
    },
    /**
     * 1. 初始化atwho；2. 初始化textarea的值
     */
    initAtWhoDom () {
      let config = {
        at: '@',
        data: this.inputFields,
        callbacks: {
          beforeSave: function (data) {
            let newData = []
            _.forEach(data, (item) => {
              newData.push({
                fieldCn: item.fieldCn,
                isDimension: item.isDimension
              })
            })
            return newData
          },
          beforeInsert: (value, $li, e) => {
            this.beforeInsert(value, $li[0].className.indexOf('isDimension') > -1 ? 1 : 0)
            return value
          },
          matcher: function (flag, subtext, should_startWithSpace, acceptSpaceBar) {
            var _a, _y, match, regexp, space
            flag = flag.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
            if (should_startWithSpace) {
              flag = '(?:^|\\s)' + flag
            }
            _a = decodeURI('%C3%80')
            _y = decodeURI('%C3%BF')
            space = acceptSpaceBar ? '\ ' : ''
            regexp = new RegExp(flag + '(([a-zA-Z0-9' + _a + '-' + _y + ']|[^\\x00-\\xff]|[_\.\+\-])*)(@?)$', 'gi')
            match = regexp.exec(subtext)
            if (match) {
              var allIn = false
              if (match[0] && match[0].match(/@.+@/g)) {
                allIn = true
              }
              return {
                match: match[1],
                allIn: allIn
              }
            } else {
              return null
            }
          },
          filter: function (query, data, searchKey) {
            var _results, i, item, len, itemObj
            _results = []
            for (i = 0, len = data.length; i < len; i++) {
              itemObj = data[i]
              if (data[i].fieldCn.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                _results.push(itemObj)
              }
            }
            return _results
          },
          sorter: function (query, items, searchKey) {
            var _results, i, item, len
            if (!query) {
              return items
            }
            _results = []
            for (i = 0, len = items.length; i < len; i++) {
              item = items[i]
              items[i].atwho_order = new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())
              if (items[i].atwho_order > -1) {
                _results.push(item)
              }
            }
            return _results.sort(function (a, b) {
              return a.atwho_order - b.atwho_order
            })
          }
        },
        headerTpl: '',
        limit: 500,
        suffix: '@ ',
        invoke: this.handleInvoke ? this.handleSelectedField : null,
        handlerDelete: this.handlerDelete,
        getModalVisible: this.dispatchModelVisible,
        setActivedEleId: this.setActivedEleId
      }
      let _this = this
      if (this.fieldType) {
        $(this.$refs['inputor0']).atwho(config)
        let value = this.computedFormula.conditions[0].formula_show ? this.computedFormula.conditions[0].formula_show : ''
        $(this.$refs['inputor0']).val(value)
      } else {
        this.fieldSetOptions.forEach(
          (item, index) => {
            $(_this.$refs['inputor' + index]).atwho(config)
            let value
            try {
              value = _this.computedFormula.conditions[index].formula_show ? _this.computedFormula.conditions[index].formula_show : ''
            } catch (err) {
              value = ''
            }
            $(this.$refs['inputor' + index]).val(value)
          }
        )
      }
      this.textDisabled = false
    },
    /**
     * 从区间子组件中接收信息，获取选中字段区间信息
     */
    getSectionData (data) {
      // 非枚举型输出字段
      if (this.fieldType) {
        let sectionIndex = -1
        // 设置字段区间开关
        for (let index = 0; index < this.computedFormula.conditions[0].input.length; index++) {
          if (this.computedFormula.conditions[0].input[index].field_code === this.selectedField[0].fieldEn) {
            sectionIndex = index
            break
          }
        }
        if (sectionIndex !== -1) {
          this.computedFormula.conditions[0].input[sectionIndex].segments = Object.assign([], data.table)
          this.computedFormula.conditions[0].input[sectionIndex].fieldSwitch = data.fieldSwitch
          this.computedFormula.conditions[0].input[sectionIndex].outRangeValue = data.outRangeValue
        } else {
          this.computedFormula.conditions[0].input.push({
            field_name: this.selectedField.fieldCn,
            field_code: this.selectedField.fieldEn,
            segments: Object.assign([], data.table),
            field_id: this.selectedField.id !== undefined ? this.selectedField.id : null,
            field_scope: this.selectedField.valueScope,
            field_type: this.selectedField.valueType,
            isDimension: this.selectedField.isDimension !== undefined ? this.selectedField.isDimension : 0,
            fieldSwitch: data.fieldSwitch,
            outRangeValue: data.outRangeValue
          })
        }
        this.getFormular()
      } else {
        let sectionIndex = -1
        // 设置字段区间开关
        // this.computedFormula.conditions[this.activedEnumIndex].fieldSwitch = data.fieldSwitch
        for (let index = 0; index < this.computedFormula.conditions[this.activedEnumIndex].input.length; index++) {
          if (this.computedFormula.conditions[this.activedEnumIndex].input[index].field_code === this.selectedField[0].fieldEn) {
            sectionIndex = index
            break
          }
        }
        if (sectionIndex !== -1) {
          this.computedFormula.conditions[this.activedEnumIndex].input[sectionIndex].segments = Object.assign([], data.table)
          this.computedFormula.conditions[this.activedEnumIndex].input[sectionIndex].fieldSwitch = data.fieldSwitch
          this.computedFormula.conditions[this.activedEnumIndex].input[sectionIndex].outRangeValue = data.outRangeValue
        } else {
          this.computedFormula.conditions[this.activedEnumIndex].input.push({
            field_name: this.selectedField.fieldCn,
            field_code: this.selectedField.fieldEn,
            segments: Object.assign([], data.table),
            field_id: this.selectedField.id !== undefined ? this.selectedField.id : null,
            field_scope: this.selectedField.valueScope,
            field_type: this.selectedField.valueType,
            isDimension: this.selectedField.isDimension !== undefined ? this.selectedField.isDimension : 0,
            fieldSwitch: data.fieldSwitch,
            outRangeValue: data.outRangeValue
          })
        }
        this.getArrayFormular()
      }
      this.sectionModalVsible = false
    },
    nextTickInitAtWho () {
      this.textDisabled = true
      this.$nextTick(
        function () {
          this.initAtWhoDom()
        }
      )
    },
    /**
     * 初始化拷贝输出字段类型
     * 比较model和formula是否需要初始化使用
     */
    initCopiedOutput () {
      this.copiedOutput = {
        fieldEn: this.outputField.fieldEn,
        valueType: this.outputField.valueType,
        valueScope: this.outputField.valueScope
      }
    },
    /**
     * 判断公式是否为空
     * 只要有一个为空，就返回true
     */
    isFormulaEmpty (conditions) {
      return conditions.some(
        item => {
          if (item.formula_show) {
            return true
          }
        }
      )
    },
    /**
     * 父组件的formula发生改变，且与公式组件的formula不同
     */
    formulaHasChanged (copied, origin) {
      if (copied.length !== origin.length) {
        return false
      }
      return copied.some(
        (item, index) => {
          if (item.formula_show !== origin[index].formula_show) {
            return TextTrackCueList
          }
        }
      )
    },
    resetFormulaData (ifDispatchData) {
      this.initCopiedOutput()
      if (!this.computedFormula.conditions) {
        this.computedFormula.conditions = []
      }
      if (this.fieldType) {
        if (!this.computedFormula.conditions.length) {
          this.computedFormula.conditions.push({
            input: [],
            output: this.outputInfo,
            formula: '',
            formula_show: ''
          })
        } else {
          this.computedFormula.conditions[0].output = this.outputInfo
        }
        if (ifDispatchData) {
          this.getFormular()
        }
      } else {
        if (this.computedFormula.conditions.length !== this.fieldSetOptions.length) {
          this.computedFormula.conditions.length = 0
        }
        this.fieldSetOptions.forEach(
          (item, index) => {
            if (!this.computedFormula.conditions[index]) {
              this.computedFormula.conditions.push({
                input: [],
                output: this.outputInfo,
                formula: '',
                formula_show: '',
                result: item.prop,
                resultKey: item.label
              })
            } else {
              this.computedFormula.conditions[index].output = this.outputInfo
              this.computedFormula.conditions[index].result = item.prop
              this.computedFormula.conditions[index].resultKey = item.label
            }
          }
        )
        if (ifDispatchData) {
          this.getArrayFormular()
        }
      }
      this.copiedOutputName = this.outputField.fieldEn
      this.nextTickInitAtWho()
    }
  },
  mounted () {
    let that = this
    let isAllowCopy = this.isAllowCopy
    $('.inputor').bind('copy', function (event) {
      if (!isAllowCopy) {
        that.$message.warning('为保证公式正确配置，该区域不允许复制操作！')
        return false
      } else {
        var word = window.getSelection().toString()
        if (word.length > 0) {
          // 过滤掉字段信息
          word = word.replace(/\s@[^@]*@/, ' ')
          event.originalEvent.clipboardData.setData('text', word)
        }
      }
    })
    this.initAtWhoDom()
    if (!this.fieldType) {
      this.computedFormula.conditions.forEach(
        item => {
          let index = 0
          for (let i = 0; i < this.fieldSetOptions.length; i++) {
            if (item.result === this.fieldSetOptions[i].prop) {
              index = i
              break
            }
          }
        }
      )
    }
    this.computedFormula.conditions.forEach(
      item => {
        item.output = this.outputInfo
      }
    )
  },
  watch: {
    inputFields () {
      if (this.inputFields.length) {
        _.forEach(this.inputFields, (item) => {
          this.fieldsData.push({
            fieldCn: item.fieldCn,
            isDimension: item.isDimension
          })
        })
      }
      this.nextTickInitAtWho()
    },
    outputField: {
      deep: true,
      handler () {
        // 输出字段非编辑状态，字段code未发生改变
        if (!this.editPattern && this.copiedOutput.fieldEn && this.copiedOutput.fieldEn === this.outputField.fieldEn) {
          return
        }
        // 输出字段处于编译状态，字段type以及范围都未发生变化
        if (this.editPattern && (this.copiedOutput.valueType !== 3 && this.outputField.valueType !== 3 ||
          this.copiedOutput.valueType === 3 && this.outputField.valueType === 3) && this.copiedOutput.valueScope === this.outputField.valueScope) {
          return
        }
        this.resetFormulaData(false)
      }
    },
    /**
     * 1. 父组件初始化formula为空，之后突然有值，重置组件；
     * 2. 父组件formula发生改变与公示组件内容不同后，重置组件；
     */
    initFormula: {
      deep: true,
      handler () {
        let clonedFormulaEmpty = this.isFormulaEmpty(this.copiedConditions)
        let computedFormulaEmpty = this.isFormulaEmpty(this.initFormula.conditions)
        if (!clonedFormulaEmpty && computedFormulaEmpty || this.formulaHasChanged(this.copiedConditions, this.initFormula.conditions)) {
          this.resetFormulaData(false)
          this.copiedConditions = Object.assign([], this.initFormula.conditions)
        }
      }
    }
  },
  created () {
    let matrixOperatorData = _.cloneDeep(Mock.operatorData).splice(0, 4).concat(_.cloneDeep(Mock.operatorData).splice(11, 13))
    let commonOperatorData = _.cloneDeep(Mock.operatorData).splice(0, 16)
    let operatorData = this.isMatrix ? matrixOperatorData : commonOperatorData
    this.iconList = operatorData
    this.segments = []
    // this.copiedOutputName = this.outputField.fieldEn
    this.initCopiedOutput()
    if (!this.computedFormula.conditions) {
      this.$set(this.computedFormula, 'conditions', [])
    }
    if (this.fieldType && this.computedFormula.conditions.length === 0) {
      this.computedFormula.conditions.push({
        input: [],
        output: this.outputInfo,
        formula: '',
        formula_show: ''
      })
    }
    if (!this.fieldType && this.computedFormula.conditions.length === 0) {
      this.fieldSetOptions.forEach(
        item => {
          let condition = {
            input: [],
            output: this.outputInfo,
            formula: '',
            formula_show: '',
            result: item.prop,
            resultKey: item.label
          }
          this.computedFormula.conditions.push(Object.assign({}, condition))
        }
      )
    }
    let copiedFormulaStr = JSON.stringify(this.initFormula.conditions || [])
    this.copiedConditions = JSON.parse(copiedFormulaStr)
    // 如果用户未传递输出字段信息，强行初始化；容错机制
    if (!this.outputField) {
      this.$set(this.computedFormula, 'conditions', [])
      this.computedFormula.conditions.push({
        input: [],
        output: {
          field_name: '',
          field_code: '',
          field_type: 1,
          field_id: ''
        },
        formula: '',
        formula_show: ''
      })
    }
  },
  components: {
    FieldSection,
    SnapshotOutputFieldDialog
  },
  destroyed () {
    if (this.fieldType) {
      $(this.$refs['inputor0']).atwho('destroy')
    } else {
      this.fieldSetOptions.forEach(
        (item, index) => {
          $(this.$refs['inputor' + index]).atwho('destroy')
        }
      )
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/icon/iconfont.css";

.c-field-equation {
  border: 1px solid $split-color;
  margin: 15px 0 0 0px;
  height: 220px;
  & > .c-field-operator-head {
    background-color: $formular-header-color;
    height: 45px;
    line-height: 45px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 12px;
    border-bottom: 1px solid $split-color;
    a {
      padding-right: 10px;
      width: 230px;
      text-align: right;
    }
  }
}

/*.none-border {*/
/*border: none !important;*/
/*}*/
.isDimension {
  color: green;
}
.includeFormula {
  width: 100%;
  overflow: auto;
  max-height: 215px;
  height: calc(100% - 46px);
  overflow-x: hidden;
  & > .formulas {
    overflow: hidden;
    float: left;
    width: 100%;
    height: 100%;
  }
  .el-dialog--small {
    width: 600px;
    .el-dialog__body {
      width: 100% !important;
    }
  }
  .textArea {
    width: 100%;
    height: calc(100% - 6px);
    min-height: 60px;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    &::-webkit-scrollbar-thumb {
      height: 30%;
      min-height: 30px;
      background-color: #ddd;
      border-radius: 4px;
    }
    &::-webkit-scrollbar {
      width: 8px;
    }
    & > .common-formulas {
      height: 100%;
      & > .inputor {
        padding-left: 20px;
        width: 100%;
        height: 100%;
        border: none;
        box-sizing: border-box;
        vertical-align: middle;
        resize: vertical;
        padding: 5px 7px;
        line-height: 1.5;
        box-sizing: border-box;
        font-size: 14px;
        color: #1f2d3d;
        background-color: #fff;
        background-image: none;
        /* border: 1px solid #bfcbd9;*/
        border-radius: 2px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
  .enum-formulas {
    .explain-text {
      margin-top: 10px;
      & > span:first-child {
        display: inline-block;
        width: 100px;
      }
      & > span:nth-child(2) {
        margin-left: 50px;
        margin-right: 20px;
      }
      & > span:nth-child(3) {
        color: #aaa;
      }
    }
    .formula-items {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      height: 36px;
      line-height: 36px;
      & > .title {
        width: 100px;
      }
    }
    .operator {
      margin-left: 10px;
      margin-right: 10px;
    }
    .inputor {
      width: calc(100% - 155px);
      height: inherit;
      line-height: 28px;
      vertical-align: middle;
      resize: vertical;
      padding: 5px 7px;
      line-height: 1.5;
      box-sizing: border-box;
      font-size: 14px;
      color: #1f2d3d;
      background-color: #fff;
      background-image: none;
      border: 1px solid #bfcbd9;
      border-radius: 4px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}

.c-operational-character {
  // display: inline-block;
  margin: auto 5px;
  font-family: Arial, sans-serif;
  // font-weight: bold;
  text-align: center;
  &.character_0 {
    font-size: 20px;
  }
  &.character_1 {
    font-size: 25px;
  }
  &.character_2 {
    font-size: 25px;
    position: relative;
    top: 5px;
  }
  .normal-img {
    display: inline-block;
    cursor: pointer;
  }
  .focus-img {
    display: none;
  }
  .normal-img:hover {
    color: rgb(32, 160, 255);
  }
}

.iconfont {
  &.more {
    &:before {
      content: "\e653";
      color: #000;
    }
  }
  &.symbol {
    &:before {
      content: "\e666";
      color: #000;
    }
  }
  &:hover:before {
    color: rgb(32, 160, 255);
  }
}
</style>
<style lang="scss">
/** at.js自有css **/
.atwho-view {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  margin-top: 18px;
  background: #fff;
  color: #000;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 11110 !important;
}

.atwho-view .cur {
  background: rgb(11, 158, 255);
  color: #fff;
}

.atwho-view .cur small {
  color: #fff;
}

.atwho-view strong {
  color: rgb(11, 158, 255);
}

.atwho-view .cur strong {
  color: #fff;
  font: 700;
}

.atwho-view ul {
  max-height: 274px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: auto;
}

.atwho-view ul li {
  display: block;
  padding: 5px 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.atwho-view small {
  font-size: smaller;
  color: #777;
  font-weight: 400;
}
</style>
