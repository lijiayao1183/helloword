<template>
  <el-dialog :title="'选择'+title"
             class="one-col-checked-dialog"
             :visible="visible"
             id="one-col-checked-dialog"
             size="tiny"
             :show-close=false>
    <div class="head-operate"
         v-if="isScoreCard">
      <!--筛选区-->
      <div class="leftType"
           style="width: 50%">
        <cascader :disabled="disabled"
                  @valueChange="valueChange">
        </cascader>
      </div>
      <div class="rightSelect"
           style="width: 48%">
        <el-input v-model="key"
                  placeholder="请输入关键字"></el-input>
      </div>
    </div>
    <div v-model="tmpCurrentData"
         style="display: none">
    </div>
    <el-table v-if="visible"
              ref="tableRef"
              :data="filteredData"
              max-height="280"
              tooltip-effect="dark"
              style="width: 100%;"
              @selection-change="selectChange">
      <el-table-column type="selection"
                       width="37">
      </el-table-column>
      <el-table-column align="center"
                       :prop="columnName"
                       :label="title=='输出字段'?'字段名称':title"
                       show-overflow-tooltip>
      </el-table-column>
      <template v-if="title=='输出字段'">
        <el-table-column align="center"
                         prop="fieldEn"
                         label="字段编码"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="center"
                         :formatter="formatType"
                         prop="valueType"
                         label="值类型"
                         show-overflow-tooltip>
        </el-table-column>
      </template>
    </el-table>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="ok">确定 </el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
import * as _ from 'lodash'
import cascader from './Cascader.vue'
import api from '../scripts/api'
import generalApi from '../field-manage/general-field/scripts/api'
import engineApi from '../engine-manage/field/scripts/api'
import selectOption from '../mixins/select-option.mixin'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    isScoreCard: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default () {
        return []
      }
    },
    columnName: {
      type: String,
      default: 'listName'
    },
    defaultCheckedRows: {
      type: Array,
      default () {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    valueType: {
      type: Number
    }
  },
  data () {
    return {
      disabled: this.$root.$data.isReadOnly,
      engineId: this.$route.params.engineId,
      currentData: [],
      key: '',
      checkedRows: []
    }
  },
  mixins: [selectOption],
  computed: {
    tmpCurrentData () {
      this.currentData = this.data
    },
    filteredData () {
      let data = this.currentData
      let key = _.trim(this.key)
      if (key) {
        data = _.filter(data, (item) => {
          return item.fieldCn.indexOf(key) > -1 || item.fieldEn.indexOf(key) > -1
        })
      }
      this.beforeOpen()
      return data
    }
  },
  components: {
    'cascader': cascader
  },
  watch: {
    defaultCheckedRows () {
      this.checkedRows = this.defaultCheckedRows
    },
    visible () {
      if (this.visible) {
        this.beforeOpen()
      }
    }
  },
  methods: {
    selectChange: function (rows) {
      this.checkedRows = rows
    },
    valueChange (value) {
      if (_.first(value) === 1) {
        if (value.length > 1) {
          generalApi.field.get('', _.last(value), '', {}, this.isOutput, '').then((data) => {
            this.filterData(data)
          })
        } else {
          generalApi.field.get('', 0, '', {}, this.isOutput, '').then((data) => {
            this.filterData(data)
          })
        }
      } else if (_.first(value) === 2) {
        if (value.length > 1) {
          engineApi.field.get(this.engineId, _.last(value), '', { pageSize: 0, pageNo: 0 }, '', '').then(data => {
            this.filterData(data)
          })
        } else {
          engineApi.field.get(this.engineId, '0', '', { pageSize: 0, pageNo: 0 }, '', '').then(data => {
            this.filterData(data)
          })
        }
      } else {
        this.currentData = this.data
      }
    },
    filterData (data) {
      if (this.valueType) {
        this.currentData = _.filter(data.list, { isOutput: 1 ? 1 : 0, status: 1, valueType: this.valueType })
      } else {
        this.currentData = _.filter(data.list, { isOutput: 1 ? 1 : 0, status: 1 })
      }
    },
    beforeOpen () {
      this.$nextTick(() => {
        if (!_.isEmpty(this.defaultCheckedRows)) {
          _.forEach(this.defaultCheckedRows, rowId => {
            let isChecked = !_.isEmpty(_.find(this.currentData, { id: rowId.id }))
            let row = _.find(this.currentData, { id: rowId.id })
            if (isChecked) {
              this.$refs.tableRef.toggleRowSelection(row, isChecked)
            }
          })
        }
      })
    },
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$emit('ok', this.checkedRows)
    },
    formatType (row, column) {
      let value = row[column.property]
      if (value) {
        return _.find(this.fieldValueTypeOption, { value: value }).label
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss">
#one-col-checked-dialog {
  .head-operate {
    width: 100%;
    height: 40px;
    overflow: hidden;
    .el-input__inner {
      height: 30px;
    }
    .leftType {
      float: left;
    }
    .rightSelect {
      float: right;
    }
  }
}
</style>
