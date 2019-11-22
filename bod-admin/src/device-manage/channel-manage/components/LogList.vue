<template>
  <div class="alarm-list">
    <div class="alarm-list-top">
      <el-button style="margin-left: 0px;" @click="back">返回列表</el-button>
      
      <date-range-picker  class="right" 
         :defaultRange="dateRange"
         :type="dateRangeType"
         @change="dateRangeChange">
      </date-range-picker>
      
      <el-select v-model="currentAlarmStateType"
         clearable class="right"
         @change="loadData">
        <el-option v-for="item in alarmStateTypes"
           :label="item.name"
           :value="item.value"
           :key="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="alarm-list-content"
         v-loading="loading"
         element-loading-text="拼命加载中">
 
        <el-table ref="table"
                  :data="data"
                  highlight-current-row
                  align="left"
                  row-key="id"
                  class="header-white">
          <el-table-column width="10">
          </el-table-column>
          <el-table-column prop="createTime" label="告警时间" align="left" :formatter="formatDate" :show-overflow-tooltip="true" width="200">
          </el-table-column>
          <el-table-column prop="alertCondition" label="告警条件" align="left" :formatter="formatCondition"  :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="alertData"  align="left" label="告警数据" :formatter="formatData" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="state" align="left" label="接口请求状态" width="280">
            <template slot-scope="scope">
              <template v-if="scope.row.sendStatus && scope.row.sendStatus.length >0 ">
                <span v-for="(alert, index) in scope.row.sendStatus.split(',').sort()" v-if="null != alert && alert.length>0" :style="{color: alert.endsWith('-1')  ? 'red' : ''}">
                  {{alert.startsWith('1-') ? "短信" : "邮件"}}：{{alert.endsWith('-1') ? "失败" : "成功"}}{{ index == scope.row.sendStatus.split(',').length-1 ? '':';'}}
                </span>
              </template>
              <div v-else style="color:green;">未发送</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination @change="loadData"></pagination>
    </div>
  </div>
</template>
<script>
  import api from '../scripts/api'
  import DateUtils from '../../../scripts/date-utils'
  import * as _ from 'lodash'
  import {alarmSendStateTypes, alarmData} from '../mock/mock.data'
  import DateRangePicker from '../../../components/DateRangePicker.vue'
  import Pagination from '../../../components/Pagination.vue' 
  import ResponseUtils from '../../../scripts/response-utils'
  import { mapGetters, mapActions } from 'vuex'
  import { ALARM_LIST } from '../../../scripts/page-name'

  const isDebug = false
  export default {
    props: { 
    },
    data () {
      return {  
        alarmStateTypes: _.values(alarmSendStateTypes),
        currentRecord: [],
        debugData: alarmData.data,
        data: [],
        isShowAlarmSuspendDialog: false,
        currentSelectRows: [],
        dateRangeType: 'day',
        dateRange: [],
        currentAlarmStateType:''
      }
    },
    components: {
      'pagination': Pagination,
      'date-range-picker': DateRangePicker
    },
    computed: {
      ...mapGetters({
        loading: 'loading',
        search: 'alarmManageList',
        pagination: 'pagination'
      }),
      id(){
        return parseInt(this.$route.params.id)
      },
      queryParams (){
      	return {
      	  alertId: this.id,
      	  alertStatus: this.currentAlarmStateType,
      	  startTime: new Date(DateUtils.formate(new Date(this.dateRange[0]), 'yyyy-MM-dd  00:00:00')).getTime(),
          endTime: new Date(DateUtils.formate(new Date(this.dateRange[1]), 'yyyy-MM-dd  23:59:59')).getTime()
      	} 
      }
    },
    watch: {
      id(){
        this.loadData()
      },
      alarmStateTypes(){
        if (!_.find(this.alarmStateTypes, {value: this.currentAlarmStateType})) {
          this.currentAlarmStateType = (_.first(this.alarmStateTypes).value)
        }
        this.loadData()
      }
    },
    created () {
      this.updateCurrentPageName(ALARM_LIST)
      this.resetDateRange()
      this.loadData() 
    },
    methods: {
      ...mapActions({
        updatePageTotal: `updatePageTotal`, 
        updateCurrentPageName: 'updateCurrentPageName'
      }),
      formatDate (row, column) {
        let value = row[column.property]
        if (value) {
          return DateUtils.formate(value, 'yyyy-MM-dd  hh:mm:ss')
        } else {
          return ''
        }
      },
      isSuccess(alertList){
        if(_.isArray(alertList)){
           let tmp = _.filter(alertList, {'resCode':0})
           if(tmp && tmp.length == alertList.length){
             return true
           }
        }
        
        return false
      },
      loadData () { 
	    if(this && !this._isDestroyed){ //_isDestroyed 组件是否被销毁
	        if(isDebug){
		        let data = this.debugData 
                if (0 === this.currentAlarmStateType) {
		          data = _.filter(data, {smsState: 0, emailState:0 })
		        }
		        
		        if (1 === this.currentAlarmStateType) {
		          data = _.union(_.concat(_.filter(data, {smsState: 1 }),_.filter(data, {emailState: 1 })))
		        }
		        
		        this.data = data
		        this.updatePageTotal(this.data.length) 
	         }else{ 
		        api.recordList(this.queryParams, this.pagination.pageSize, this.pagination.pageIndex ).then(data => {
		            this.data = data.data.list
		            this.updatePageTotal(data.data.total)
		        }).catch(error => {

		        })
	        }
        }
      },
      back(){
        this.$router.back(-1)
      },
      resetDateRange () {
        let now = new Date()
        this.dateRange = [new Date(now.getTime() -  6* 24 * 60 * 60 * 1000).getTime(), now.getTime()]//最近两周
      }, 
      formatData(row, column) {
        let alertCondition = row.alertCondition
        let alertData = row[column.property]
        
        let data = {}
        try{
          alertData = JSON.parse(alertData) 
          _.map(alertData, function(value,key){
            data[key] = {fieldEn: key, alertData: value}
          })

        }catch(e){
          
        }
       
        try{
          let dataFilter = JSON.parse(alertCondition)
          dataFilter.traceData.forEach(
	          (item, index) => {
	            if (item.field && data[item.field.fieldEn]) {
		            data[item.field.fieldEn].fieldCn = item.field.fieldCn
		            if (item.field && item.field.valueType === 3) {
		              let tm = _.filter(item.valueList, {'id':''+data[item.field.fieldEn].alertData})
		              data[item.field.fieldEn].alertData = tm&&tm.length>0 ? tm[0].name : item.enumValue
		            }
	            }
	          }
	      )
        }catch(e){
           
        }
        
        let alert = []
        _.map(data, function(value,key){
            if(value.fieldCn){
              alert.push(value.fieldCn + ' = ' + value.alertData)
            }
        })
          
        return _.join(alert,"  ")
      },
      formatCondition(row, column) {
        let value = row[column.property]
        try{
          value = JSON.parse(value)
          value = this.getTotalFormula(value)
        }catch(e){
          value = ''
        }
        return value
      },
      getTotalFormula (dataFilter) {
        let formula = []
        dataFilter.traceData.forEach(
          (item, index) => {
          
            if (item.ruleId !== undefined) {
              formula.push(item.ruleName ? item.ruleName : item.ruleId)
            }
            if (item.field) {
              formula.push(item.field.fieldCn)
            }
            formula.push(item.operatorName ? item.operatorName : item.operatorId)
            if (item.field && item.field.valueType !== 3) {
              formula.push(dataFilter.expression[index].value)
            } else if (item.field && item.field.valueType === 3) {
              formula.push(item.enumValue)
            }
          }
        )
        if (dataFilter.suffix.selectedId !== null) {
          formula.push(dataFilter.suffix.selectedName)
        }
        
        return _.join(formula, ' ')
      },
      dateRangeChange(range) { 
        this.dateRange = range
        this.loadData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  $alarm-top-height: 34px;
  $margin-space: 20px;
  $content-right-width: 250px;
  .alarm-list {
    height: 100%;
    width: 100%;
    .alarm-list-top {
      height: $alarm-top-height;
      line-height: $alarm-top-height;
      margin-bottom: $margin-space;
      & > * {
        margin-left: 10px;
      }
      .el-button {
        width: 130px;
      }
    }
    .alarm-list-content {
      height: calc(100% - 54px);
      width: 100%;
      .content-left {
        width: calc(100% - 260px);
        height: 100%;
        float: left;
        box-sizing: border-box;
      }
      .content-right {
        width: $content-right-width;
        height: 100%;
        box-sizing: border-box;
        float: right;
      }
    }
  }

  .el-dropdown-menu {
    .el-button {
      width: 100%;
    }
  }
</style>
