<template>
  <el-dialog title="输入参数"
             :visible="visible"
             size="tiny"
             :show-close=false>
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
        <el-form-item class="searchRule">
          <el-input v-model="key" placeholder="请输入关键字"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      ref="table"
      :data="filteredData"
      max-height="280"
      tooltip-effect="dark">
      <el-table-column
        :resizable="false"
        align="left"
        width="37">
        <template slot-scope="scope">
          <el-radio v-model="currentCheckedCode"
                    :label="scope.row.fieldCode"><span></span></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="fieldCn"
        label="字段名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="left"
        prop="fieldSource"
        label="属性"
        :formatter="formatFieldSource"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="left"
        prop="valueType"
        label="值类型"
        show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column
        align="center"
        prop="fieldType"
        label="分类/节点"
        show-overflow-tooltip>
      </el-table-column>-->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok" :disabled="!currentCheckedCode">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import selectOptionMixin from '../mixins/select-option.mixin'
  import * as _ from 'lodash'

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      checkedCode: [String],
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
        key: '',
        currentCheckedCode: this.checkedCode
      }
    },
    watch: {
      checkedCode () {
        this.currentCheckedCode = this.checkedCode
      }
    },
    computed: {
      filteredData () {
        let data = this.data
        let key = _.trim(this.key)
        if (this.keyType !== 0) {
          data = _.filter(data, {fieldSource: this.keyType})
        }
        if (key) {
          data = _.filter(data, (item) => {
            return item.fieldCn.indexOf(key) > -1
          })
        }
        return data
      }
    },
    methods: {
      ok () {
        this.$emit('ok', this.currentCheckedCode)
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

</style>
