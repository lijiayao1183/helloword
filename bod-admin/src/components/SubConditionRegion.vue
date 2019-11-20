<template>
  <div id="catalog-condition-region">
    <template v-if="isShowOutPutTitle">
      <el-row>
        <div class="header el-table section">
          <el-tooltip :content="outputField.fieldCn" placement="top">
            <div class="computed-segment ellipsis">{{outputField.fieldCn}}</div>
          </el-tooltip>
          <div class="computed-value">条件判断</div>
        </div>
      </el-row>
    </template>
    <div :class="[ isScreenfull? 'condition-tables-screenfull': 'condition-tables-screensmall']">
      <template v-for="(condition,outerIndex) in conditions">
        <el-row :key="condition.key" class="el-table section conditions">
          <el-form :model="condition" ref="condition">
            <el-col class="condition-group computed-segment" v-if="isShowOutputValue">
              <el-form-item :key="condition.key" prop="fieldValue"
                            :rules="[{required:true,message:'请输入值',trigger:'blur'}]">
                <template v-if="isEnumField(outputField)">
                  <el-select v-model="condition.fieldValue"
                             :disabled="disabled"
                             placeholder="请选择"
                             @change="change">
                    <el-option
                      v-for="item in getValueScopeOption(outputField.valueScope)"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-else-if="isDateField(outputField)">
                  <el-date-picker
                    :disabled="disabled"
                    v-model="condition.fieldValue"
                    :format="outputField.valueScope"
                    @change="(val)=>{condition.fieldValue = val;change()}"
                    :type="isDateFormat(outputField.valueScope) ? 'date' : 'datetime'"
                    placeholder="选择日期">
                  </el-date-picker>
                </template>
                <template v-else-if="isNumberField(outputField)">
                  <el-input
                    v-model="condition.fieldValue"
                    :disabled="disabled"
                    @change="change"
                    type="number"
                    placeholder="请输入数字"
                  ></el-input>
                  <!--<input-number v-model="condition.fieldValue" :disabled="disabled" @change="change"></input-number>-->
                </template>
                <template v-else>
                  <el-input :disabled="disabled" v-model="condition.fieldValue" @change="change"></el-input>
                </template>
              </el-form-item>

              <div class="del-condition">
                <el-button type="text"
                           @click="deleteCondition(outerIndex)"
                           class="btn-delete"
                           :disabled="disabled || conditions.length==1">
                  删除
                </el-button>
              </div>
            </el-col>
            <el-col class="computed-value" style="width: auto;">
              <template v-for="(item,index,key) in condition.item">
                <el-row :gutter="24" :key="item.key">
                  <el-col :span="3" style="padding:0 0;">
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
                  <el-col :span="4" style="padding:0 0;">
                    <el-form-item :prop="'item.'+index+'.catalogId'"
                                  :key="item.key"
                                  :rules="{required:true,message:'请选择节点',trigger:'change'}">
                      <el-select v-model="item.catalogId" filterable placeholder="请选择" :disabled="disabled || (!canChangeField && index>0)"
                                 @change="changeCatalog(item.catalogId,condition.item[index],outerIndex)">
                        <el-option
                          v-for="item in catalogDataSource"
                          :key="item.nodeId+''"
                          :label="item.nodeName"
                          :value="item.nodeId+''">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" style="padding:0 0;">
                    <el-form-item :prop="'item.'+index+'.fieldEn'"
                                  :key="item.key"
                                  :rules="{required:true,message:'请选择变量',trigger:'change'}">
                      <el-select v-model="item.fieldEn" filterable placeholder="请选择" :disabled="disabled || (!canChangeField && index>0)"
                                 @change="fieldCheckedChange(item.fieldEn,condition.item[index],outerIndex)">
                        <el-option
                          v-for="item in getCatalogFields(item.catalogId)"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="padding:0 0;">
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
                  <el-col :span="4" style="padding:0 0;">
                    <el-form-item :prop="'item.'+index+'.fieldValue'"
                                  :key="item.key"
                                  :rules="{required:true,message:canSelectField?'请选择字段':'请填入内容',trigger:'blur'}">
                      <template v-if="isEnumField(item)">
                        <el-select v-model="item.fieldValue" placeholder="请选择" @change="change" :disabled="disabled">
                          <el-option
                            v-for="item in getValueScopeOption(item.valueScope)"
                            :key="item.key"
                            :label="item.label"
                            :value="selectEnumText ? item.label: item.value">
                          </el-option>
                        </el-select>
                      </template>
                      <template v-else-if="isDateField(item)">
                        <el-date-picker
                          :disabled="disabled"
                          v-model="item.fieldValue"
                          :format="item.valueScope"
                          @change="(value)=>{item.fieldValue = value;change()}"
                          :type="isDateFormat(item.valueScope) ? 'date': 'datetime'"
                          placeholder="选择日期">
                        </el-date-picker>
                      </template>
                      <template v-else-if="canSelectField">
                          <el-autocomplete
                            :disabled="disabled"
                            :value="item.fieldValue"
                            :fetch-suggestions="(key,cb)=>{return querySelectField(key,cb,item.valueType,item)}"
                            placeholder="请输入内容"
                            @input="(value)=>{fieldValueChange(value,item)}"
                            @select="(selectItem)=>{selectField(selectItem,item)}"
                          ></el-autocomplete>
                      </template>
                      <template v-else-if="isNumberField(item)">
		                    <el-input
		                      v-model="item.fieldValue"
		                      :disabled="disabled"
		                      @change="change"
		                      type="number"
		                      placeholder="请输入数字"
		                    ></el-input>
		              </template>
		              <template v-else>
	                    <el-input :disabled="disabled" v-model="item.fieldValue" @change="change"></el-input>
	                  </template>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3" style="padding:0 0;">
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
                  <el-col :span="1" class="computed-btn" style="padding:0 0;">
                    <el-form-item>
                      <el-button type="text"
                                 class="btn-add"
                                 @click="addConditionItem(outerIndex,index)"
                                 :disabled="disabled">
                        +
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col class="computed-btn" :span="1" style="padding:0 0;">
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
    </div>

    <el-row v-if="isShowOutputValue">
      <el-col :span="12">
        <el-button type="text"
                   :disabled="disabled"
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

export default {
  props: {
    versionId: {
      type: Number,
      default () {
        return null
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    catalogData: {
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
    },
    isShowOutputValue: {
      type: Boolean,
      default: true
    },
    isScreenfull: {
      type: Boolean,
      default: false
    },
    canSelectField: {
      type: Boolean,
      default: true
    },
    canChangeField: {
      type: Boolean,
      default: true
    },
    selectEnumText: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      engineId: this.$route.params.engineId,
      conditions: [this.getNewCondition()],
      catalogMap: {},
      catalogDataSource: [],
      isDeleteItem: false,
      isSelect: false
    }
  },
  watch: {
    versionId () {
      console.dir(this.versionId)
      this.conditions = [this.getNewCondition()]
    },
    catalogData: {
      deep: true,
      handler: function (newValue, oldValue) {
        this.conditions = [this.getNewCondition()]
      }
    }
  },
  beforeDestroy () {
    bus.$off('sure')
  },
  created () {
    this.initData()
    let that = this
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
      this.initCatalogDataSource()
      this.initConditions()
    },
    initCatalogDataSource () {
      _.forEach(this.catalogData, (item) => {
        this.catalogDataSource.push({nodeId: item.nodeId + '', nodeName: item.nodeName, nodeType: item.nodeType})

        this.catalogMap[item.nodeId] = item.tempDetailVariableFields
      })
    },
    initConditions () {
      if (this.data && this.data.length > 0) {
        this.conditions = _.cloneDeep(this.data)
      }
    },
    getCatalogFields (catalogId) {
      let tmp = this.catalogMap[catalogId]
      if (tmp) {
        return tmp
      }
      return []
    },
    querySelectField (key, cb, valueType, item) {
      if (this.isSelectField(key)) {
        key = key.substring(1, key.length - 1)
      }
      let data = _.filter(this.getCatalogFields(input.catalogId), item => {
        let isContains = item.valueType === valueType
        if (key) {
          isContains = isContains && item.fieldCn.indexOf(key) > -1
        }
        return isContains
      })

      data = _.map(data, item => {
        return {value: item.fieldCn, code: item.fieldEn}
      })
      cb(data)
    },
    selectField (item, input) {
      input.fieldValue = _.pad(item.value, item.value.length + 2, '@')
      input.isSelectField = 1
      input.selectField = _.first(_.map(_.filter(this.getCatalogFields(input.catalogId), {code: item.code}), item => {
        return {
          fieldId: item.fieldId,
          knowledgeId: item.knowledgeId,
          bowId: item.bowId,
          variableId: item.variableId,
          resultFromType: item.resultFromType,
          fieldCn: item.name,
          fieldEn: item.code,
          valueScope: item.valueScope,
          valueType: item.valueType
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
      this.change()
    },
    isSelectField (value) {
      return value && _.startsWith(value, '@') && _.endsWith(value, '@')
    },
    getNewCondition () {
      let condition = {
        key: Date.now(),
        fieldValue: '',
        item: [
          {
            key: Date.now(),
            catalogId: '',
            catalogType: '',
            fieldCn: '',
            fieldEn: '',
            fieldSource: '',
            fieldId: '',
            fieldValue: '',
            isSelectField: 0,
            resultFromType: '',
            selectField: {
              fieldCn: '',
              fieldEn: '',
              fieldId: '',
	            knowledgeId: '',
	            bowId: '',
	            variableId: '',
              fieldSource: '',
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
      console.log(_.merge(condition, this.outputField))
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
      let tmp = this.conditions[outerIndex].item[0]

      this.conditions[outerIndex].item.splice(index + 1, 0, {
        key: Date.now(),
        catalogId: !this.canChangeField ? tmp.catalogId : '',
        catalogType: !this.canChangeField ? tmp.catalogType : '',
        fieldId: !this.canChangeField ? tmp.fieldId : '',
        fieldEn: !this.canChangeField ? tmp.fieldEn : '',
        fieldCn: !this.canChangeField ? tmp.fieldCn : '',
        fieldSource: !this.canChangeField ? tmp.fieldSource : '',
        fieldValue: '',
        isSelectField: !this.canChangeField ? tmp.isSelectField : 0,
        resultFromType: !this.canChangeField ? tmp.resultFromType : 0,
        selectField: {
          fieldCn: !this.canChangeField ? tmp.selectField.fieldCn : '',
          fieldEn: !this.canChangeField ? tmp.selectField.fieldEn : '',
          fieldId: !this.canChangeField ? tmp.selectField.fieldId : '',
          knowledgeId: !this.canChangeField ? tmp.selectField.knowledgeId : '',
          bowId: !this.canChangeField ? tmp.selectField.bowId : '',
          variableId: !this.canChangeField ? tmp.selectField.variableId : '',
          fieldSource: !this.canChangeField ? tmp.selectField.fieldSource : '',
          valueScope: !this.canChangeField ? tmp.selectField.valueScope : '',
          valueType: !this.canChangeField ? tmp.selectField.valueType : ''
        },
        logical: '',
        lastLogical: '',
        operator: '',
        valueScope: !this.canChangeField ? tmp.valueScope : '',
        valueType: !this.canChangeField ? tmp.valueType : ''
      })
      this.change()
    },
    deleteConditionItem (outerIndex, index) {
      this.isDeleteItem = true
      _.forEach(this.conditions, arr => {
        _.forEach(arr.item, obj => {
          if (obj.fieldEn != '' || this.isSelect) {
            this.isDeleteItem = true
            this.isSelect = true
          }
        })
      })
      this.conditions[outerIndex].item.splice(index, 1)
      this.change()
      setTimeout(() => {
        this.isDeleteItem = false
      }, 500)
    },
    changeCatalog (value, field, outerIndex) {
      if (!this.isDeleteItem || value != '') {
        field.catalogId = value

        let tmp = _.filter(this.catalogDataSource, {nodeId: value})
        field.catalogType = tmp && tmp.length > 0 ? tmp[0].nodeType : ''

        field.fieldCn = ''
        field.fieldId = ''
        field.knowledgeId = ''
        field.bowId = ''
        field.fieldEn = ''
        field.resultFromType = ''
        field.valueScope = ''
        field.valueType = ''
        field.operator = ''
        field.fieldValue = ''
        field.isSelectField = 0
        field.selectField = {}

        if (!this.canChangeField) {
          // 清空下面的组
          if (!this.canChangeField) {
            this.conditions[outerIndex].item = this.conditions[outerIndex].item.splice(0, 1)
          }
        }
      }
    },
    fieldCheckedChange (value, field, outerIndex) {
      if (!this.isDeleteItem || value != '') {
        let newField = _.find(this.getCatalogFields(field.catalogId), {code: value})
        if (newField) {
          field.fieldCn = newField.name
          field.fieldId = newField.fieldId
          field.knowledgeId = newField.knowledgeId
          field.bowId = newField.bowId
          field.fieldEn = newField.code
          field.resultFromType = newField.resultFromType
          field.valueScope = newField.valueScope
          field.valueType = newField.valueType
          field.operator = ''
          field.fieldValue = ''
          field.isSelectField = 0
          field.selectField = {}

          if (!this.canChangeField) {
            this.conditions[outerIndex].item = this.conditions[outerIndex].item.splice(0, 1)
          }
          this.change()
        }
      }
    },
    change () {
      clearTimeout(this.changeTimer)
      this.changeTimer = setTimeout(() => {
        this.$emit('change', this.conditions)
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
  #catalog-condition-region {
    .header.el-table.section {
      border: 0px;
      border-bottom: 1px dotted $split-color;
      margin-bottom: 20px;
    }

    .condition-tables-screensmall {
      max-height: 260px;
      overflow: auto;
    }

    .condition-tables-screenfull {
      max-height: inherit;
      overflow: auto;
    }

    .el-date-editor {
      width: 100%;
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
      border-bottom: 1px dotted $split-color;
      /*margin-bottom: 20px;*/
      /*padding-bottom: 10px;*/

      .condition-group {
        .el-button {
          padding: 0 0;
        }
      }
      .computed-value {
        .el-row {
          margin-bottom: 10px;
          .el-col {
            margin-left: 4px;
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
