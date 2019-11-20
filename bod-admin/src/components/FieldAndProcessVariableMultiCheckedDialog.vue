<template>
  <el-dialog id="field-and-process-variable-multi-checked-dialog"
             title="输入参数"
             :visible="visible"
             size="large"
             :show-close=false>
    <el-row style="width:770px">
      <div style="width:390px;float:left">
        <el-row class="table-search-container">
          <el-form class="dialog-edit-content">
            <el-form-item class="selectRule">
              <el-select v-model="keyType" placeholder="请选择">
                <el-option
                  v-for="item in fieldSourceOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="selectType">
              <cascader
              @valueChange="valueChange"
              :disabled="keyType===2||isReadOnly">
              </cascader>
            </el-form-item>
            <el-form-item class="searchRule">
              <el-input v-model="key" placeholder="请输入关键字"></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-table
          ref="table"
          :data="filteredData"
          max-height="280"
          @select="select"
          @select-all="selectAll"
          tooltip-effect="dark">
          <el-table-column
            type="selection"
            width="37">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldCn"
            label="字段名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldSource"
            label="属性"
            :formatter="formatFieldSource"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="valueType"
            :formatter="formatType"
            label="值类型"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div style="width:350px;float:left;margin-left:19px;">
        <el-form :inline="true" class="dialog-edit-content">
          <el-form-item>
            <span>{{'已选 ' + checkedRows.length + ' 条'}}</span>
          </el-form-item>
        </el-form>
        <el-table
          :data="checkedRows"
          :max-height="300"
          :row-class-name="tableRowClassName"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column align="center"
                           prop="fieldCn"
                           label="字段名称"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center"
                           prop="fieldSource"
                           label="属性"
                           :formatter="formatFieldSource"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center"
                           prop="valueType"
                           :formatter="formatType"
                           label="值类型"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="removeCheckedRow(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <div v-model="tmpCurrentData"style="display: none"></div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="isReadOnly" @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import selectOptionMixin from '../mixins/select-option.mixin'
import Cascader from './Cascader.vue'
import generalApi from '../field-manage/general-field/scripts/api'
import engineApi from '../engine-manage/field/scripts/api'
import api from '../scripts/api'
import * as _ from 'lodash'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    defaultCheckedRows: {
      type: Array,
      default () {
        return []
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mixins: [selectOptionMixin],
  data () {
    return {
      keyType: 0,
      currentData: [],
      engineId: this.$route.params.engineId,
      key: '',
      checkedRows: this.updateFieldName(this.defaultCheckedRows)
    }
  },
  components: {
    'cascader': Cascader
  },
  watch: {
    defaultCheckedRows () {
      this.checkedRows = this.updateFieldName(this.defaultCheckedRows)
    },
    keyType () {
      if (this.keyType == 2) {
        this.currentData = this.data
      }
    }
  },
  computed: {
    tmpCurrentData () {
      this.currentData = this.data
    },
    filteredData () {
      let data = this.currentData
      if (this.keyType !== 0) {
        data = _.filter(data, {fieldSource: this.keyType})
      }
      let key = _.trim(this.key)
      if (key) {
        data = _.filter(data, (item) => {
          return item.fieldCn.indexOf(key) > -1
        })
      }
      this.setDefaultChecked()
      return data
    }
  },
  methods: {
    formatType (row, column) {
      let value = row[column.property]
      if (value) {
        return _.find(this.fieldValueTypeOption, {value: value}).label
      } else {
        return ''
      }
    },
    updateFieldName (rows) {
      let data = _.cloneDeep(rows)
      _.forEach(data, row => {
        let field = _.find(this.data, {fieldEn: row.fieldEn}) || {}
        row.fieldCn = field.fieldCn
        row.fieldType = field.fieldType
      })

      return data
    },
    valueChange (value) {
      if (_.first(value) === 1) {
        if (value.length > 1) {
          generalApi.field.get('', _.last(value), '', {}, this.isOutput, '').then((data) => {
            this.currentData = _.filter(data.list, {isOutput: 0 ? 1 : 0, status: 1})
            _.forEach(this.currentData, (item) => {
              item.fieldSource = 1
            })
          })
        } else {
          generalApi.field.get('', 0, '', {}, this.isOutput, '').then((data) => {
            this.currentData = _.filter(data.list, {isOutput: 0 ? 1 : 0, status: 1})
            _.forEach(this.currentData, (item) => {
              item.fieldSource = 1
            })
            this.currentData = this.adjustFieldModels(this.currentData)
          })
        }
      } else if (_.first(value) === 2) {
        if (value.length > 1) {
          engineApi.field.get(this.engineId, _.last(value), '', {pageSize: 0, pageNo: 0}, '', '').then(data => {
            this.currentData = _.filter(data.list, {isOutput: 0 ? 1 : 0, status: 1})
            _.forEach(this.currentData, (item) => {
              item.fieldSource = 1
            })
            this.currentData = this.adjustFieldModels(this.currentData)
          })
        } else {
          engineApi.field.get(this.engineId, '0', '', {pageSize: 0, pageNo: 0}, '', '').then(data => {
            this.currentData = _.filter(data.list, {isOutput: 0 ? 1 : 0, status: 1})
            _.forEach(this.currentData, (item) => {
              item.fieldSource = 1
            })
            this.currentData = this.adjustFieldModels(this.currentData)
          })
        }
      } else {
        this.currentData = this.data
      }
    },
    adjustFieldModels (orginalData) {
      let data = []
      if (_.isArray(orginalData)) {
        _.forEach(orginalData, function (item) {
          if (item.fieldSource === 1) { // 字段
            data.push({
              fieldId: item.id,
              fieldSource: item.fieldSource,
              fieldEn: item.fieldEn,
              fieldCn: item.fieldCn,
              fieldType: item.fieldType,
              valueType: item.valueType,
              valueScope: item.valueScope
            })
          }
        })
      }

      return data
    },
    selectAll (rows) {
      this.checkedRows = _.cloneDeep(rows)
    },
    select (selection, row) {
      if (!_.find(this.checkedRows, {fieldEn: row.fieldEn})) {
        this.checkedRows.push(row)
      } else {
        this.removeArrayItem(this.checkedRows, row)
      }
    },
    removeArrayItem (data, item) {
      let index = _.findIndex(data, {fieldEn: item.fieldEn})
      if (index > -1) {
        data.splice(index, 1)
      }
    },
    setDefaultChecked () {
      this.$nextTick(() => {
        _.forEach(this.filteredData, row => {
          this.$refs.table.toggleRowSelection(row, !_.isEmpty(_.find(this.checkedRows, {fieldEn: row.fieldEn})))
        })
      })
    },
    removeCheckedRow (row) {
      this.checkedRows = _.differenceBy(this.checkedRows, [row], 'fieldEn')
      this.setDefaultChecked()
    },
    tableRowClassName (row, index) {
      if (!_.find(this.data, {fieldEn: row.fieldEn})) {
        return 'not-exist-row'
      }
    },
    ok () {
      this.$emit('ok', this.checkedRows)
    },
    cancel () {
      this.$emit('cancel')
    },
    getFieldSourceLabel (value) {
      return _.find(this.fieldSourceOption, {value: value}).label
    },
    formatFieldSource (row, column) {
      let value = row[column.property]
      return this.getFieldSourceLabel(value)
    }
  }
}
</script>
<style lang="scss">
  #field-and-process-variable-multi-checked-dialog {
    .el-dialog.el-dialog--large {
      width: 819px;
      .table-search-container {
        .searchRule {
          float: left;
          width: 120px;
        }
        .selectType{
          float: left;
          margin-right: 8px;
          width: 150px;
        }
        .selectRule {
          float: left;
          width: 100px;
          margin-right: 10px;
        }
      }
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-table .not-exist-row {
      background: #EEF1F6;
    }
  }
</style>
