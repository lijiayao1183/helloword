<template lang="pug">
  div.template-container
    div.action-btn-container
      div.right-top
        el-button(v-if="panel.add" @click="addFun" type="text" size="small" :disabled="isUserOwn")
          i(class="iconfont" :class="{'icon-disable':isUserOwn}") &#xe631;
          span 新增
        el-button(v-if="panel.delete" @click="deleteFunc" type="text" size="small" :disabled="isUserOwn")
          i(class="iconfont" :class="{'icon-disable':isUserOwn}") &#xe632;
          span 删除
        el-button(v-if="panel.enable" @click="enableFunc" type="text" size="small" :disabled="isUserOwn")
          i(class="iconfont" :class="{'icon-disable':isUserOwn}") &#xe633;
          span 启用
        el-button(v-if="panel.disable" @click="disableFunc" type="text" size="small" :disabled="isUserOwn")
          i(class="iconfont" :class="{'icon-disable':isUserOwn}") &#xe634;
          span 停用
        el-input(v-if="panel.search" placeholder="请输入名称" v-model="keyWord" @keyup.enter.native="searchRole" class="right search-btn" size="small")
          el-button(@click="searchRole" icon="el-icon-search" slot="append" )
        el-date-picker(v-if="panel.datepicker" type="daterange" v-model="pickDate" @change="pick" value-format="yyyy-MM-dd" class="" style="margin-right:10px;" :editable="pickInput" placeholder="选择日期范围" size="small")

    div.user-table
      div.detail-container
        el-table(
        ref="multipleTable"
          :data="tableData"
        tooltip-effect="dark"
          @selection-change="handleSelectionChange")
          el-table-column(v-if="arrowColumns && arrowColumns.length" type="expand")
            template(slot-scope="props")
              el-form(label-position="left" inline class="demo-table-expand")
                el-form-item.half-width(v-for="arrowitem in arrowColumns" :key="arrowitem.prop" :label="arrowitem.label")
                  span {{props.row[arrowitem.prop]}}
          el-table-column(v-if="!panel.selection" type="selection" width="37" )
          el-table-column(
          v-for="column in columns"
            :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
          :align="column.align"
          show-overflow-tooltip)
          el-table-column(label="操作" :width="tableOperate.width" align="center" v-if="tableOperate")
            template(slot-scope="scope")
              el-button(v-if="tableOperate.check" @click="checkDetail(scope.$index, scope.row)" type="text" size="small" ) 查看
              el-button(v-if="tableOperate.edit" type="text" size="small" @click="roleEdit(scope.$index, scope.row)" :disabled="scope.row.account===user") 编辑
              el-button(v-if="tableOperate.permission" type="text" size="small" @click="rolePermission(scope.$index, scope.row)" ) 权限分配
              el-button(
              v-if="tableOperate.delete"
                :disabled="(moduleName === 'user' && scope.row.account && scope.row.account === 'admin') || (moduleName === 'role' && scope.row.roleCode === 'admin')||(scope.row.account===user)"
              size="small" type="text danger"
                @click="roleDelete(scope.$index, scope.row)"
              ) 删除
              el-button(v-if="tableOperate.reset" type="text" size="small" @click="resetRole(scope.$index, scope.row)" :disabled="scope.row.account===user") 重置
        el-pagination(
        @current-change="updatePagination"
          @size-change="handleSizeChange"
            :current-page="pagination.curIndex"
        layout="sizes, prev, pager, next, total,jumper"
          :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total")
</template>
<script>
import UtilsMock from '@system/mock/utils.mock'
import DateUtils from '../../../../scripts/date-utils'

export default {
  props: ['panel', 'tableData', 'columns', 'tableOperate', 'pagination', 'arrowColumns', 'moduleName'],
  data () {
    return {
      user: localStorage['admin_name'],
      isUserOwn: false,
      multipleSelection: [],
      pickDate: '',
      keyWord: '',
      pickInput: false
    }
  },
  methods: {
    addFun () {
      this.$emit('addEvent')
    },
    deleteFunc () {
      this.$emit('deleteEvent', this.multipleSelection)
    },
    enableFunc () {
      this.$emit('enableEvent', this.multipleSelection)
    },
    disableFunc () {
      this.$emit('disableEvent', this.multipleSelection)
    },
    searchRole () {
      this.$emit('searchEvent', this.keyWord)
    },
    roleDelete (index, row) {
      this.$emit('deleteRow', row)
    },
    roleEdit (index, row) {
      this.$emit('editRow', row)
    },
    rolePermission (index, row) {
      this.$emit('permissionRow', row)
    },
    handleSelectionChange (val) {
      console.log(val)
      let that = this
      if (val.length == 0) {
        that.isUserOwn = false
      } else {
        this.isUserOwn = val.some(function (item) {
          return item.account == that.user
        })
      }
      this.$emit('selectionChange', val)
    },
    checkDetail (index, row) {
      this.$emit('checkDetail', row)
    },
    updatePagination (index) {
      this.$emit('pageChange', index)
    },
    handleSizeChange (val) {
      this.$emit('pageSizeChange', val)
      console.log(`每页 ${val} 条`)
    },
    keywordChange (value) {
      console.log(value)
      this.$emit('update:keyword', value)
    },
    pick (date) {
      let dateArr = date
      this.$emit('pick', {startTime: dateArr[0], endTime: dateArr[1]})
    },
    resetRole (index, row) {
      this.$emit('hanlerReset', row)
    }
  },
  computed: {},
  created () {
    let today = UtilsMock.getToday()
    this.pickDate = [today, today]
    if (this.panel.datepicker) {
      this.$emit('pick', {startTime: today, endTime: today})
    }
  }
}
</script>
<style lang="scss">
  .action-btn-container {
    height: $action-btn-container-height;
    line-height: $action-btn-container-height;
    width: 100%;
    border-bottom: 1px solid #dedede;

    .right-top {
      height: $action-btn-container-height;
      line-height: $action-btn-container-height;
    }

  }

  .form-block {
    margin-left: -25px;
    .form-item-title {
      margin-right: 16px;
    }
  }

  .el-form-item.half-width {
    width: 48%;
    display: inline-block !important;
    margin-bottom: 5px;
  }
</style>
