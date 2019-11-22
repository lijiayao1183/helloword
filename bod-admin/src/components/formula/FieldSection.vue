<template>
  <div id="field-region-include">
    <!--<el-dialog-->
      <!--title="区间设置"-->
      <!--:visible="sectionModalVsible "-->
      <!--size="tiny"-->
      <!--:modal="isModal"-->
      <!--:show-close="false">-->
      <!--信息-->
      <div class="switch">
        <div class="switch-title">
          字段取值区间映射：
        </div>
        <div class="switch-display">
          <el-switch
            v-model="computedForm.fieldSwitch"
            @change="switchChange"
            on-text=""
            off-text="">
          </el-switch>
        </div>
        <div class="switch-prompt">
          可对字段取值进行分组，并设置映射输出，输出为数值方便公式计算
        </div>
      </div>
      <div class="set-section-area" v-show="computedForm.fieldSwitch">
        <el-form :model="computedForm" ref="sectionForm" id="field-region">
          <div class="sectionText">区间设置<span class="titleSpan">&nbsp;(&nbsp;例：数值型 [0,30)代表大于等于0小于30&nbsp;)</span></div>
          <el-table
            :data="computedForm.table"
            border
            style="width: 80%">
            <el-table-column
              label="字段取值区间">
              <template slot-scope="scope">
                <el-form-item v-if="fieldType===4">
                  <el-tooltip :disabled="!errors.has('取值'+scope.$index)"
                              :content="errors.first('取值'+scope.$index)" placement="top">
                    <el-date-picker
                      v-validate="'required|repeatValues:'+formatScopeData(computedForm.table,scope.$index,fieldType)"
                      :name="'取值'+scope.$index"
                      data-vv-as="取值"
                      data-vv-delay="10000000000000"
                      :class="{'input': true, 'is-danger': errors.has('取值'+scope.$index) }"
                      v-model="scope.row.segment"
                      :type="isDateFormat(field.valueScope) ? 'daterange' : 'datetimerange'"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-tooltip>
                </el-form-item>
                <el-form-item v-else-if="fieldType !== null && fieldType === 2">
                  <el-tooltip :disabled="!errors.has('取值'+scope.$index)"
                              :content="errors.first('取值'+scope.$index)" placement="top">
                    <el-input
                      v-validate="'required|repeatValues:'+formatScopeData(computedForm.table,scope.$index,fieldType)"
                      :name="'取值'+scope.$index"
                      data-vv-as="取值"
                      :class="{'input': true, 'is-danger': errors.has('取值'+scope.$index) }"
                      v-model="scope.row.segment">
                    </el-input>
                  </el-tooltip>

                </el-form-item>
                <el-form-item v-else-if="fieldType !== null && fieldType === 3">
                  <el-tooltip :disabled="!errors.has('取值'+scope.$index)"
                              :content="errors.first('取值'+scope.$index)" placement="top">
                    <el-select class="enmuSelect" multiple  v-model="scope.row.segment">
                      <el-option
                        v-for="(item, index) in enumOriginData"
                        :key="index"
                        :label="item.label"
                        :disabled="emnuSelected(item.prop)"
                        :value="item.prop"
                        :name="'取值'+scope.$index"
                        v-validate="'required'"
                        data-vv-as="取值"
                        :class="{'input': true, 'is-danger': errors.has('取值'+scope.$index) }">
                      </el-option>
                    </el-select>
                  </el-tooltip>
                </el-form-item>
                <el-form-item v-else>
                  <el-tooltip :disabled="!errors.has('取值'+scope.$index)"
                              :content="errors.first('取值'+scope.$index)" placement="top">
                    <el-input
                      v-validate="'required|isStartMoreThanEndValue|isNumberRange|repeatValues:'+formatScopeData(computedForm.table,scope.$index,fieldType)"
                      :name="'取值'+scope.$index"
                      data-vv-as="取值"
                      :class="{'input': true, 'is-danger': errors.has('取值'+scope.$index) }"
                      v-model="scope.row.segment">
                    </el-input>
                  </el-tooltip>

                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="输出值">
              <template slot-scope="scope">
                <el-form-item>
                  <el-tooltip :disabled="!errors.has('输出值'+scope.$index)"
                              :content="errors.first('输出值'+scope.$index)" placement="top">
                    <el-input v-model="scope.row.value"
                              v-validate="'required|isNumber'"
                              data-vv-as="输出值"
                              :name="'输出值'+scope.$index"
                              :class="{'input': true, 'is-danger': errors.has('输出值'+scope.$index) }"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              width="60"
              label="">
              <template slot-scope="scope" v-if="scope.$index !== 0">
                <el-button class="computed-value"
                           v-if="!isReadOnly" type="text" @click="deleteRow(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="formula-section">
            <el-button v-if="!isReadOnly" type="text" @click="add" :disabled="isDisabledAddBtn()">
              添加项目
            </el-button>
          </div>
          <div style="width: 180px">
            <el-form-item label="非区间内取值输出:">
              <el-tooltip :disabled="!errors.has('非区间')"
                          :content="errors.first('非区间')" placement="top" >
                <el-input v-model="computedForm.outRangeValue"
                                   v-validate="'isNumber'"
                                   :name="'非区间'"
                                   :class="{'input': true, 'is-danger': errors.has('非区间') }">
                                   </el-input>
              </el-tooltip>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer .segments-dialog-footer">
          <el-button type="primary" @click="submit" :disabled="isReadOnly">确 定</el-button>
          <el-button type="default" @click="quit">取 消</el-button>
      </span>
    <!--</el-dialog>-->
  </div>
</template>
<script>
  import fieldMixin from '../../mixins/field-mixin'
  import * as _ from 'lodash'

  export default {
    // field: 完整的字段信息
    data: () => ({
      emnuValue:[],
      dateRangeTable:[],
      computedForm: {
        fieldSwitch:false,
        table: [],
        outRangeValue:''
      },
      dateTable:[]
    }),
    props: {
      sectionModalVsible: {
        type: Boolean,
        default: false
      },
      isReadOnly: {
        type: Boolean,
        default: false
      },
      segments: {
        type: Array,
        required: true
      },
      fieldSwitch:{
        type:Boolean,
        default:false
      },
      outRangeValue:{
        type:String,
        default:''
      },
      field: {
        type: Object,
        required: true
      }
    },
    mixins: [fieldMixin],
    computed: {
      fieldType () {
        if (this.field.fieldEn) {
          return parseInt(this.field.valueType)
        }
        return null
      },
      /**
       * 枚举型的数据源
       */
      enumOriginData () {
        if (this.fieldType && this.fieldType === 3) {
          let items = this.field.valueScope.split(/[,，]/g)
          return items.map(
            item => {
              let itemObjArr = item.split(/[:：]/g)
              return {
                label: itemObjArr[0],
                prop: itemObjArr[1]
              }
            }
          )
        }
        return []
      },
      sectionRules () {
        if (this.fieldType && this.fieldType === 1) {
          return [
            {required: true, message: '区间不能为空', trigger: 'blur'},
            {
              pattern: /^\(,\)$|^(\-|\+)?\d+(\.\d+)?$|^([\[\(](\-|\+)?\d+(\.\d+)?,[\]\)])$|^([\[\(],(\-|\+)?\d+(\.\d+)?[\]\)])$|^([\[\(](\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?[\]\)])$/,
              message: '区间格式错误',
              trigger: 'blur'
            },
            {validator: this.validateSection, trigger: 'blur'}
          ]
        }else{
          return [
            {required: true, message: '区间不能为空', trigger: 'blur'}
          ]
        }
      },
      valueRules () {
        if (this.fieldType && this.fieldType === 3) {
          return [
            {required: true, message: '值不能为空', trigger: 'blur'},
            {pattern: /^(\-|\+)?\d+(\.\d+)?$/, message: '值必须为数字', trigger: 'blur'}
          ]
        }
        return [
          {required: true, message: '值不能为空', trigger: 'blur'}
        ]
      }
    },
    methods: {
      changeDateRange(val,index){//TODO
        if(val.indexOf('-')!=-1){
          this.computedForm.table[index].segment = val
        }
      },
      emnuSelected(value){
        let disable = false
        let enmuValues = []
          _.forEach(this.computedForm.table,(item)=>{
            enmuValues = item.segment.concat(enmuValues)
          })
        _.forEach(enmuValues,(data)=>{
          if(data === value){
            disable = true
          }
        })
        return disable
      },
      switchChange () {
        this.$emit('switchChange', this.switchValue)
      },
      add () {
        if(this.fieldType !== 3){
          this.computedForm.table.push({segment: null, value: null})
        }else{
          this.computedForm.table.push({segment: [], value: null})
        }

      },
      deleteRow (index, row) {
        this.computedForm.table.splice(index, 1)
      },
      hasSelected (val) {
        console.log('------val-----')
        console.log(val)
        return !!_.find(this.computedForm.table, {segment: val})
      },
      isDisabledAddBtn () {
        if (this.fieldType && this.fieldType === 3) {
          return this.enumOriginData.length === this.computedForm.table.length
        } else {
          return false
        }
      },
      validateSection (rule, value, callback) {
        let temp = value
        temp = temp.replace(/[\[\]\(\)]/g, '')
        let tempArr = temp.split(',')
        if (tempArr.length === 2) {
          if (tempArr[0] !== '' && tempArr[1] !== '') {
            let result = tempArr[1] - tempArr[0]
            if (result > 0) {
              callback()
            } else {
              callback(new Error('区间右侧数值必须大于左侧数值'))
            }
            return
          }
          callback()
        }
        callback()
      },
      submit () {
        if(this.computedForm.fieldSwitch){
          this.$validator.validateAll().then((valid) => {
            if (valid) {
              this.dipatchData()
            }
          })
        }else{
          this.dipatchData()
        }

      },
      dipatchData () {//TODO
        this.$emit('getSectionData', this.computedForm)
      },
      quit () {
        this.$emit('shutmodal')
      },
      formatScopeData(scopeData,index,type){
        let tmpArray=[];
        _.each(scopeData, (item,seq) => {
          if (type === 4 && scopeData[seq].segment) {
            tmpArray.push(Date.parse(scopeData[seq].segment[0]).toString()+Date.parse(scopeData[seq].segment[1]).toString())
          } else {
            const value = item.segment ? item.segment.replace(",", "+") : item.segment
            tmpArray.push(value)
          }
        })
        tmpArray.push(index)
        return tmpArray;
      },
    },
    watch:{
      // fieldSwitch(){
      //   this.computedForm.fieldSwitch = this.fieldSwitch
      // },
      outRangeValue(){
        this.computedForm.outRangeValue = this.outRangeValue
      },
      segments(){
        this.computedForm.table = Object.assign([], this.segments)
      }
    },
    created () {
      this.computedForm.table = Object.assign([], this.segments)
      if(this.fieldType === 3 || this.fieldType === 4){
        _.forEach(this.computedForm.table,(item)=>{
          if(typeof(item.segment)==='string'){
            item.segment = JSON.parse(item.segment)
          }
        })
      }
      this.computedForm.fieldSwitch = this.fieldSwitch
      this.computedForm.outRangeValue = this.outRangeValue
    }
  }
</script>
<style lang="scss">
  #field-region-include {
    .switch-title{
      margin-bottom: 15px;
    }
    .el-form-item {
      margin-bottom: 0px !important;
      .el-input.el-date-editor {
        width: 100%;
      }
    }
    .el-dialog__footer{
      margin-top: 20px;
    }
    .switch-prompt {
      margin-bottom: 20px;
      margin-top: 5px;
    }
    .sectionText {
      margin-bottom: 10px;
    }
    .el-dialog.el-dialog--tiny {
      width: 550px;
    }
    .el-form-item.section-modal {
      .el-date-editor {
        width: 100%;
      }
      .el-input {
        // width: 100px;
      }
      .el-form-item__error {
        // width: 100px;
      }
    }

    #field-region {
      .el-form {
        padding: 0 0;
        .computed-segment {
          width: 170px;
        }
        .computed-value {
          width: 170px;
        }
      }
    }

  }


</style>

