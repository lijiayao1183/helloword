<template>
  <div id="condition-region">
    <template v-for="(condition,outerIndex) in conditions">
      <el-row :key="condition.key" class="el-table section conditions">
        <el-form :model="condition" ref="condition">
          <el-col class="condition-group computed-segment">
            <el-form-item prop="fieldValue" :rules="[...validateRules.name]">
              <el-input v-model="condition.fieldValue" @change="change"></el-input>
            </el-form-item>

            <div class="del-condition">
              <el-button type="text"
                         @click="deleteCondition(outerIndex)"
                         class="btn-delete"
                         :disabled="conditions.length === 1">
                删除
              </el-button>
            </div>
          </el-col>
          <el-col class="computed-value">
            <template v-for="(item,index,key) in condition.item">
              <el-row :key="item.key">
                <el-col :span="4">
                  <template v-if="index>0">
                    <el-form-item :prop="'item.'+index+'.logical'"
                                  :key="item.key"
                                  :rules="{required:true,message:'请选择关系符',trigger:'change'}">
                      <template v-if="index===0">
                        <el-select v-model="item.logical" placeholder="请选择" :disabled="disabled" @change="change">
                          <el-option
                            v-for="item in firstLogicalOption"
                            :key="item.key"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                      <template v-else>
                        <el-select v-model="item.logical" placeholder="请选择" :disabled="disabled" @change="change">
                          <el-option
                            v-for="item in otherLogicalOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item :prop="'item.'+index+'.logical'"
                                  :key="item.key"
                                  :rules="{required:false,message:'',trigger:'change'}">
                      <template v-if="index===0">
                        <el-select v-model="item.logical" placeholder="请选择" :disabled="disabled" @change="change">
                          <el-option
                            v-for="item in firstLogicalOption"
                            :key="item.key"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                      <template v-else>
                        <el-select v-model="item.logical" placeholder="请选择" :disabled="disabled" @change="change">
                          <el-option
                            v-for="item in otherLogicalOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </template>
                </el-col>
                <el-col :span="4">
                  <el-form-item :prop="'item.'+index+'.fieldEn'"
                                :key="item.key"
                                :rules="{required:true,message:'请选择字段',trigger:'change'}">
                    <el-select v-model="item.fieldEn" filterable placeholder="请选择" :disabled="disabled"
                               @change="(value)=>{fieldCheckedChange(value,item)}">
                      <el-option
                        v-for="item in fieldDataSource"
                        :key="item.key"
                        :label="item.fieldCn"
                        :value="item.fieldEn">
						<span v-if="item.fieldSource=='2'" style="color: #13CE66;">{{ item.fieldCn }}</span>
                        <span v-else>{{ item.fieldCn }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :prop="'item.'+index+'.operator'"
                                :key="item.key"
                                :rules="{required:true,message:'请选择操作符',trigger:'change'}">
                    <template v-if="isEnumField(item)">
                      <el-select v-model="item.operator" placeholder="请选择" @change="change" :disabled="disabled">
                        <el-option
                          v-for="item in enumOperatorOption"
                          :key="item.key"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="isStringField(item)">
                      <el-select v-model="item.operator" placeholder="请选择" @change="change" :disabled="disabled">
                        <el-option
                          v-for="item in stringOperatorOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="isNumberField(item)">
                      <el-select v-model="item.operator" placeholder="请选择" @change="change" :disabled="disabled">
                        <el-option
                          v-for="item in numberOperatorOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-select v-model="item.operator" placeholder="请选择" @change="change" :disabled="disabled">
                        <el-option
                          v-for="item in dateOperatorOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :key="index" :prop="'item.'+index+'.fieldValue'" :rules="{required:true,message:'请输入字段',trigger:'blur'}">
                    <template v-if="isEnumField(item)">
                      <el-select v-model="item.fieldValue" placeholder="请选择" @change="change" :disabled="disabled">
                        <el-option
                          v-for="item in getValueScopeOption(item.valueScope)"
                          :key="item.key"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else-if="isDateField(item)">
                      <el-date-picker
                        :disabled="disabled"
                        v-model="item.fieldValue"
                        :format="item.valueScope"
                        @change="(value)=>{item.fieldValue = value; change()}"
                        :type="isDateFormat(item.valueScope) ? 'date': 'datetime'"
                        placeholder="选择日期">
                      </el-date-picker>
                    </template>
                    <template v-else>
                      <el-autocomplete
                        :disabled="disabled"
                        :value="item.fieldValue"
                        :fetch-suggestions="(key,cb)=>{return querySelectField(key,cb,item.valueType)}"
                        placeholder="请输入内容"
                        @input="(value)=>{fieldValueChange(value,item)}"
                        @select="(selectItem)=>{selectField(selectItem,item)}"
                      ></el-autocomplete>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :prop="'item.'+index+'.lastLogical'"
                                :key="item.key"
                                :rules="{required:false,message:'',trigger:'change'}">
                    <el-select v-model="item.lastLogical" placeholder="请选择" @change="change" :disabled="disabled">
                      <el-option
                        v-for="item in lastLogicalOption"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col class="computed-btn">
                  <el-form-item>
                    <el-button type="text"
                               class="btn-add"
                               @click="addConditionItem(outerIndex,index)"
                               :disabled="disabled">
                      +
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col class="computed-btn">
                  <el-form-item>
                    <el-button type="text"
                               class="btn-delete"
                               @click="deleteConditionItem(outerIndex,index)"
                               :disabled="index===0 || disabled">
                      -
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-col>
        </el-form>
      </el-row>

    </template>
    <el-row>
      <el-col :span="12">
        <el-button type="text"
                   @click="addCondition()">
          添加项目
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selectOptionMixin from '../mixins/select-option.mixin'
import fieldMixin from '../mixins/field-mixin'
import bus from '../engine-manage/scripts/bus'
import api from '../scripts/api'
import validateRules from '../scripts/validate-rules'
const uuid = require('node-uuid')

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    fieldData: {
      type: Array,
      default () {
        return []
      }
    },
    outputField: {
      type: Object,
      default () {
        return {}
      }
    },
    isShowOutPutTitle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      engineId: this.$route.params.engineId,
      conditions: [],
      fieldDataSource: [],
      validateRules: validateRules
    }
  },
  watch: {
    data () {
      this.initConditions()
    }
  },
  beforeDestroy () {
    bus.$off('sure')
  },
  created () {
    this.initData()
  },
  mixins: [selectOptionMixin, fieldMixin],
  methods: {
    validate () {
      if (this.$refs['condition'].length > 0) {
        let validator = true
        _.forEach(this.$refs['condition'], function (obj) {
          obj.validate((valid) => {
            if (!valid) {
              validator = false
            }
          })
        })
        return validator
      } else {
        return 0
      }
    },
    initData () {
      this.initFieldDataSource()
      this.initConditions()
    },
    initFieldDataSource () {
      if (this.fieldData.length) {
        this.fieldDataSource = _.cloneDeep(this.fieldData)
      } else {
        this.loadData()
      }
    },
    initConditions () {
      if (this.data && this.data.length > 0) {
        this.conditions = _.cloneDeep(this.data)

        _.each(this.conditions, data => {
          data.key = data.key ? data.key : uuid.v1()
          _.each(data.item, once => {
            once.key = once.key ? once.key : uuid.v1()
          })
        })
      } else {
        this.conditions = []
        _.each([1, 2], () => {
          this.conditions.push(this.getNewCondition())
        })
      }
    },
    loadData () {
      api.field.getUnPage('', this.engineId, 0).then((data) => {
        this.fieldDataSource = _.filter(data, item => {
          return item.fieldEn !== this.outputField.fieldEn
        })
      }).catch(() => {

      })
    },
    querySelectField (key, cb, valueType) {
      if (this.isSelectField(key)) {
        key = key.substring(1, key.length - 1)
      }
      let data = _.filter(this.fieldDataSource, item => {
        let isContains = item.valueType === valueType
        if (key) {
          isContains = isContains && item.fieldCn.indexOf(key) > -1
        }
        return isContains
      })

      data = _.map(data, item => {
        return {value: item.fieldCn, code: item.fieldEn}
      })
      console.log('------data-----')
      console.log(data)
      cb(data)
      this.errors.clear()
    },
    selectField (item, input) {
      input.fieldValue = _.pad(item.value, item.value.length + 2, '@')
      input.isSelectField = 1
      input.selectField = _.first(_.map(_.filter(this.fieldDataSource, {fieldEn: item.code}), item => {
        if (item.fieldSource === 2) {
          return {
            fieldId: '',
            fieldCn: item.fieldCn,
            fieldEn: item.fieldEn,
            valueScope: item.valueScope,
            valueType: item.valueType
          }
        } else {
          return {
            fieldId: item.fieldId,
            fieldCn: item.fieldCn,
            fieldEn: item.fieldEn,
            valueScope: item.valueScope,
            valueType: item.valueType
          }
        }
      }))
    },
    fieldValueChange (value, input) {
      if (this.isSelectField(input.fieldValue)) {
        input.fieldValue = ''
        input.isSelectField = 0
        input.selectField = {}
      } else {
        input.fieldValue = value
      }

      this.errors.clear()
      this.change()
    },
    isSelectField (val) {
      return val && _.startsWith(val, '@') && _.endsWith(val, '@')
    },
    getDefaultFieldName () {
      let nameList = [], name = ''
      if (this.conditions.length > 0) {
        _.each(this.conditions, item => {
          item.fieldValue.replace(/分组(\d+)/, function ($1, $2) {
            nameList.push(parseInt($2))
          })
        })
        name = _.isEmpty(nameList) ? '分组1' : '分组' + (parseInt(_.last(_.sortBy(nameList))) + 1)
      } else {
        name = '分组1'
      }
      return name
    },
    getNewCondition () {
      const defaultFieldValue = this.getDefaultFieldName()
      let condition = {
        key: uuid.v1(),
        fieldValue: defaultFieldValue,
        item: [
          {
            key: uuid.v1(),
            fieldCn: '',
            fieldEn: '',
            fieldId: '',
            fieldValue: '',
            isSelectField: 0,
            selectField: {
              fieldCn: '',
              fieldEn: '',
              fieldId: '',
              valueScope: '',
              valueType: ''
            },
            logical: '',
            lastLogical: '',
            operator: '',
            valueScope: '',
            valueType: ''
          }
        ]
      }
      return _.merge(condition, this.outputField)
    },
    addCondition () {
      this.conditions.push(this.getNewCondition())
    },
    deleteCondition (index) {
      if (this.disabled) {
        return
      }
      this.conditions.splice(index, 1)
      this.change()
    },
    addConditionItem (outerIndex, index) {
      this.conditions[outerIndex].item.splice(index + 1, 0, {
        key: uuid.v1(),
        fieldId: '',
        fieldEn: '',
        fieldCn: '',
        fieldValue: '',
        isSelectField: 0,
        selectField: {
          fieldCn: '',
          fieldEn: '',
          fieldId: '',
          valueScope: '',
          valueType: ''
        },
        logical: '',
        lastLogical: '',
        operator: '',
        valueScope: '',
        valueType: ''
      })
    },
    deleteConditionItem (outerIndex, index) {
      this.conditions[outerIndex].item.splice(index, 1)
      this.change()
    },
    fieldCheckedChange (value, field) {
      let newField = _.find(this.fieldDataSource, {fieldEn: value})
      if (newField) {
        field.fieldCn = newField.fieldCn
        field.fieldId = newField.id
        field.fieldEn = newField.fieldEn
        field.valueScope = newField.valueScope
        field.valueType = newField.valueType
        field.operator = ''
        field.fieldValue = ''
        field.isSelectField = 0
        field.selectField = {}

        this.errors.clear()

        this.change()
      }
    },
    change () {
      this.errors.clear()
      clearTimeout(this.changeTimer)
      this.changeTimer = setTimeout(() => {
        this.$emit('change', this.conditions)
      }, 200)
    }
  }
}
</script>

<style lang="scss">
  #condition-region {
    .header.el-table.section {
      border: 0px;
      border-bottom: 1px dotted $split-color;
      margin-bottom: 20px;
    }

    .el-date-editor{
      width:100%;
    }
    .computed-segment {
      width: 116px;

      .del-condition {
        margin-top: -20px;
      }
    }
    .computed-value {
      width: calc(100% - 136px);
    }

    .el-table.section.conditions {
      /*border: 0px;*/
      border-bottom: 1px dotted $split-color;
      margin-bottom: 20px;
      padding-bottom: 10px;

      .condition-group {
        .el-button {
          padding: 0 0;
        }
      }
      .computed-value {
        .el-row {
          .el-col {
            margin-left: 8px;
          }

          .el-col:first-child {
            margin-left: 0px;
          }

          .computed-btn {
            width: 26px;
            box-sizing: border-box;
            .el-button.el-button--text {
              line-height: 24px;
              padding: 0 0;
              width: 100%;
              font-size: 18px;
              border: 1px solid;
              box-sizing: border-box;
              margin-top: 1px;
            }
          }
        }
      }
    }
    .conditions:last-child {
      margin-bottom: 0px;
    }

  }
</style>
