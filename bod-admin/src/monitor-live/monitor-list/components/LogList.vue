<template>
  <div class="alarm-list">
    <div class="alarm-list-top">
      <el-button style="margin-left: 0px;" @click="back">返回列表</el-button>
      <div class="right">
            <el-date-picker class="search-btn" type="daterange" v-model="dateRange"
	         format="yyyy-MM-dd" value-format="yyyy-MM-dd"
	         range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']"
	         @change="dateRangeChange">
	        </el-date-picker>
            <el-input placeholder="请输入名称或通道代码" v-model="searchKey" class="search-btn"
                      @keyup.enter.native="loadData">
              <el-button slot="append" @click="loadData" icon="el-icon-search"></el-button>
            </el-input>
      </div>
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
          <el-table-column prop="createTime" label="告警时间" align="left" :formatter="formatDate" :show-overflow-tooltip="true" width="200">
          </el-table-column>
          <el-table-column prop="channelName" align="left" label="设备名称" width="280px">
          </el-table-column>
          <el-table-column prop="ip" align="left" label="设备IP" width="280px">
          </el-table-column>
          <el-table-column prop="port" align="left" label="设备端口" width="280px" >
          </el-table-column>
          <el-table-column prop="alertData" align="left" label="报警图片">
            <template slot-scope="scope">
            <div>
              <img style="height: 40px;vertical-align: middle;" preview="1" :preview-text="getPicText(scope.row)" :src="getPic(scope.row)">
            </div>
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
import {alarmSendStateTypes} from '../mock/mock.data'
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
      currentRecord: [],
      data: [],
      isShowAlarmSuspendDialog: false,
      currentSelectRows: [],
      dateRangeType: 'day',
      dateRange: [],
      searchKey: ''
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
    queryParams () {
      	return {
      	  channelId: '',
      	  keyword: this.searchKey,
      	  startTime: new Date(DateUtils.formate(new Date(this.dateRange[0]), 'yyyy-MM-dd 00:00:00')).getTime(),
        endTime: new Date(DateUtils.formate(new Date(this.dateRange[1]), 'yyyy-MM-dd 23:59:59')).getTime()
      	}
    }
  },
  watch: {
  },
  mounted () {
    this.$previewRefresh() // 图片更新后使用图片查看器
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
    getPicText (data) {
      return data.channelName + '( ' + data.ip + ':' + data.port + ' ) : ' + this.formatDate(data, {property: 'createTime'}) + '	' + data.alertData
    },
    getPic (data) {
      return '/api/alert/pic/' + data.ip + '/' + data.port + '?fileName=' + data.alertData
    },
    formatDate (row, column) {
      let value = row[column.property]
      if (value) {
        return DateUtils.formate(value, 'yyyy-MM-dd  hh:mm:ss')
      } else {
        return ''
      }
    },
    loadData () {
	    if (this && !this._isDestroyed) { // _isDestroyed 组件是否被销毁
	        api.recordList(this.queryParams, this.pagination.pageSize, this.pagination.pageIndex).then(data => {
	            this.data = data.data.list
	            this.updatePageTotal(data.data.total)
	        }).catch(error => {

	        })
      }
    },
    back () {
      this.$router.back(-1)
    },
    resetDateRange () {
      let now = new Date()
      this.dateRange = [new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), now]// 最近两周
    },
    dateRangeChange (range) {
      console.dir(range)
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

      .search-btn{
        width: 244px;
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
</style>
