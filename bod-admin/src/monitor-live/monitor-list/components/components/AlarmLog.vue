<template>
  <div class="alarm-log">
    <div class="title">
      <span>报警消息</span>
      <el-button type="text" style="float:right;padding-top: 3px;"
        @click="getMore()"  v-if="showMore">
                            更多
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </div>
    <time-line class="content" v-if="data.length>0" >
      <time-line-item v-for="item in data" :key="item.createTime">
        <p>{{formatDate(item.createTime)}}</p>
        <p class="alarm-condition">告警条件：</p>
        <p>{{formatCondition(item.alertCondition)}}</p>
        <p class="alarm-reason">触发原因：</p>
        <p>{{formatData(item.alertCondition, item.alertData)}}</p>
      </time-line-item>
    </time-line>
    <div style="text-align: center;margin-top: 50px;color: #aaaaaa;" v-else>暂无未读告警</div>
  </div>
</template>
<script>
import DateUtils from '../../../../scripts/date-utils'
import { Timeline, TimelineItem } from 'iview'
import 'iview/dist/styles/iview.css'
import NoDataPage from '../../../../components/NoDataPage.vue'

export default {
  props: {
    showMore: {
      type: Boolean,
      default () {
        return false
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  components: {
    'time-line': Timeline,
    'time-line-item': TimelineItem,
    'no-data-page': NoDataPage
  },
  methods: {
    getMore () {
      this.$emit('more')
    },
    formatDate (value) {
      if (value) {
        return DateUtils.formate(value, 'yyyy-MM-dd  hh:mm:ss')
      } else {
        return ''
      }
    },
    formatData (alertCondition, value) {
      let alertData = value

      let data = {}
      try {
        alertData = JSON.parse(alertData)
        _.map(alertData, function (value, key) {
          data[key] = {fieldEn: key, alertData: value}
        })
      } catch (e) {

      }

      try {
        let dataFilter = JSON.parse(alertCondition)
        dataFilter.traceData.forEach(
	          (item, index) => {
	            if (item.field && data[item.field.fieldEn]) {
		            data[item.field.fieldEn].fieldCn = item.field.fieldCn
		            if (item.field && item.field.valueType === 3) {
		              data[item.field.fieldEn].alertData = (item.enumValue)
		            }
	            }
	          }
	      )
      } catch (e) {

      }

      let alert = []
      _.map(data, function (value, key) {
        if (value.fieldCn) {
          alert.push(value.fieldCn + ' = ' + value.alertData)
        }
      })

      return _.join(alert, '; ')
    },
    getTotalData (dataFilter) {
      _.forEach(dataFilter, function (value, key) {
		  console.log(key)
      })
    },
    formatCondition (value) {
      try {
        value = JSON.parse(value)
        value = _.join(this.getTotalFormula(value), ' ')
      } catch (e) {
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

      return formula
    }
  }
}
</script>
<style lang="scss" scoped>
  .alarm-log {
    background-color: #ffffff;
    height: 100%;
    box-sizing: border-box;
    .title {
      height: 40px;
      padding: 9px 20px;
      font-size: 14px;
      border-left: 2px solid #338AF2;
      border-bottom: 1px solid #dfe6ec;
    }

    .content {
      height: calc(100% - 80px);
      width: 100%;
      padding: 20px;
      overflow: auto;
      .ivu-timeline-item-content {
        font-size: 14px !important;
      }
      .alarm-condition, .alarm-reason {
        color: #999999;
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }

    .ivu-timeline-item-content p {
      word-break: break-word;
      word-wrap: break-word;
    }
  }

</style>
