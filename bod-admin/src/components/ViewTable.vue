<template>
  <el-table
    :data="data"
    :max-height="maxHeight"
    tooltip-effect="dark"
    style="width: 100%">
    <template v-for="col in cols">
      <el-table-column
        align="center"
        :prop="col.prop"
        :label="col.label"
        :formatter="(row,column)=>{return formatValue(row,column,col.formatter)}"
        show-overflow-tooltip>
      </el-table-column>
    </template>
  </el-table>
</template>
<script>
import * as _ from 'lodash'

export default {

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    cols: {
      type: Array,
      default () {
        return [{prop: '', label: ''}]
      }
    },
    maxHeight: {
      type: Number,
      default: 300
    }
  },
  methods: {
    formatValue (row, column, formatter) {
      if (_.isFunction(formatter)) {
        return formatter(row, column)
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
<style>

</style>
