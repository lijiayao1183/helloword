<template>
  <div id="condition-region">
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
                      <el-select v-model="item.fieldEn" filterable placeholder="请选择" :disabled="disabled || (!canChangeField && index>0)"
                                 @change="fieldCheckedChange(item.fieldEn,condition.item[index],outerIndex)">
                        <el-option
                          v-for="item in fieldDataSource"
                          :key="item.key"
                          :label="item.fieldCn"
                          :value="item.fieldEn">
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
                    <el-form-item :prop="'item.'+index+'.fieldValue'"
                                  :key="item.key"
                                  :rules="{required:true,message:canSelectField?'请选择字段':'请填入内容',trigger:'blur'}">
                      <template v-if="isEnumField(item)">
                        <el-select v-model="item.fieldValue" placeholder="请选择" @change="change" :disabled="disabled">
                          <el-option
                            v-for="item in getValueScopeOption(item.valueScope)"
                            :key="item.key"
                            :label="item.label"
                            :value="selectEnumText?item.label:item.value">
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
                            :fetch-suggestions="(key,cb)=>{return querySelectField(key,cb,item.valueType)}"
                            placeholder="请输入内容"
                            @input="(value)=>{fieldValueChange(value,item)}"
                            @select="(selectItem)=>{selectField(selectItem,item)}"
                          ></el-autocomplete>
                      </template>
                      <template v-else-if="isNumberField(item)">
		                    <el-input
                          type="number"
                          :key="121"
                          @mousemove.native.stop=""
                          @mouseup.native.stop=""
		                      v-model="item.fieldValue"
		                      :disabled="disabled"
		                      @change="change"
		                      placeholder="请输入数字"
		                    ></el-input>
		              </template>
		              <template v-else>
	                    <el-input :disabled="disabled" v-model="item.fieldValue" @change="change"></el-input>
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
  import bus from '../field-manage/scripts/bus'
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
        default: false
      }
    },
    data () {
      return {
        engineId: this.$route.params.engineId,
        conditions: [this.getNewCondition()],
        fieldDataSource: [],
        isDeleteItem: false,
        isSelect: false
      }
    },
    watch: {
      versionId() {
        console.dir(this.versionId)
        this.conditions = [this.getNewCondition()]
      },
      data () {
        this.initConditions()
      },
      fieldData:{
        deep: true,
        handler: function (newValue, oldValue) {
          this.initFieldDataSource()
          //this.conditions = [this.getNewCondition()]
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
        this.initFieldDataSource()
        this.initConditions()
      },
      initFieldDataSource () {
        if (!_.isEmpty(this.fieldData)) {
          this.fieldDataSource = _.cloneDeep(this.fieldData)
        } else if (this.engineId) {
          this.loadData()
        }
      },
      initConditions () {
        if (this.data && this.data.length > 0) {
          this.conditions = _.cloneDeep(this.data)
        }
      },
      loadData () {
        api.field.getUnPage('', this.engineId,0).then((data) => {
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
      },
      selectField (item, input) {
        input.fieldValue = _.pad(item.value, item.value.length + 2, '@')
        input.isSelectField = 1
        input.selectField = _.first(_.map(_.filter(this.fieldDataSource, {fieldEn: item.code}), item => {
          return {
            fieldId: item.id,
            fieldCn: item.fieldCn,
            fieldEn: item.fieldEn,
            fieldSource : item.fieldSource || '',
            valueScope: item.valueScope,
            valueType: item.valueType,
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
              fieldCn: '',
              fieldEn: '',
              fieldSource:'',
              fieldId: '',
              fieldValue: '',
              isSelectField: 0,
              selectField: {
                fieldCn: '',
                fieldEn: '',
                fieldId: '',
                fieldSource:'',
                valueScope: '',
                valueType: '',
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
        this.$nextTick(() => {
            const $vm = $("#condition-region .condition-tables-screensmall")[0]
            $vm.scrollTop = $vm.scrollHeight
        })
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
          fieldId: !this.canChangeField? tmp.fieldId : '',
          fieldEn: !this.canChangeField? tmp.fieldEn : '',
          fieldCn: !this.canChangeField? tmp.fieldCn : '',
          fieldSource: !this.canChangeField? tmp.fieldSource : '',
          fieldValue: '',
          isSelectField: !this.canChangeField? tmp.isSelectField : 0,
          selectField: {
            fieldCn: !this.canChangeField ? tmp.selectField.fieldCn : '',
            fieldEn: !this.canChangeField ? tmp.selectField.fieldEn : '',
            fieldSource: !this.canChangeField ? tmp.selectField.fieldSource : '',
            fieldId: !this.canChangeField ? tmp.selectField.fieldId : '',
            valueScope: !this.canChangeField ? tmp.selectField.valueScope : '',
            valueType: !this.canChangeField ? tmp.selectField.valueType : '',
          },
          logical: '',
          lastLogical: '',
          operator: '',
          valueScope: !this.canChangeField? tmp.valueScope : '',
          valueType: !this.canChangeField? tmp.valueType : ''
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
        setTimeout(()=>{
          this.isDeleteItem = false
        },500)
      },
      fieldCheckedChange (value, field, outerIndex) {
        if (!this.isDeleteItem || value != '') {
          let newField = _.find(this.fieldDataSource, {fieldEn: value})
          if (newField) {
            field.fieldCn = newField.fieldCn
            field.fieldId = newField.id
            field.fieldEn = newField.fieldEn
            field.fieldSource = newField.fieldSource || ''
            field.valueScope = newField.valueScope
            field.valueType = newField.valueType
            field.operator = ''
            field.fieldValue = ''
            field.isSelectField = 0
            field.selectField = {}
            if(!this.canChangeField){
              this.conditions[outerIndex].item=this.conditions[outerIndex].item.splice(0, 1)
            }
            this.change()
          }
        }
        // this.isDeleteItem = false
      },
      change () {
        clearTimeout(this.changeTimer)
        this.changeTimer = setTimeout(()=>{
          this.$emit('change', this.conditions);
        },200)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #condition-region {
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
