<template>
  <div id="list-info">
    <div class="action-btn-container">
      <el-date-picker v-model="dateRange"
                      type="daterange"
                      style="margin-left:20px"
                      @change="loadData"
                      placeholder="选择日期范围">
      </el-date-picker>
      <div class="right">
        <el-select v-if="!isHaiguan" 
                   v-model="type"
                   @change="loadData"
                   class="value-select"
                   style="right:-8px">
          <el-option label="全部类型"
                     value="" />
          <el-option v-for="(label,value) in typeOptions"
                     :key="value"
                     :label="label"
                     :value="value*1" />
        </el-select>
        <el-select v-model="status"
                   @change="loadData"
                   class="value-select">
          <el-option label="全部状态"
                     value="" />
          <el-option v-for="(label,value) in applyOptions"
                     :key="value"
                     :label="label"
                     :value="value*1" />
        </el-select>
        <el-input placeholder="请输入关键字"
                  v-model="keyword"
                  class="search-btn"
                  @keyup.enter.native="loadData">
          <el-button slot="append"
                     @click="loadData"
                     icon="search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="field-value-content">
      <slot name="trigger" />
      <el-table :data="tableData"
                tooltip-effect="dark"
                style="width:100%">
        <el-table-column width="10" />
        <el-table-column label="申请单ID"
                         prop="id"
                         align="left"
                         width="170"/>
        <el-table-column label="申请类型"
                         align="left"
                         width="100">
          <template slot-scope="scope">
            {{typeOptions[scope.row.type]}}
          </template>
        </el-table-column>
        <el-table-column label="引擎编码"
                         align="left"
                         prop="code"
                         show-overflow-tooltip/>
        <el-table-column v-if="queryType!=1"
                         label="申请人"
                         show-overflow-tooltip
                         align="left" >
          <template slot-scope="scope">
            {{scope.row.account+'('+scope.row.username+')'}}
          </template>
        </el-table-column>
        <el-table-column :label="typeText+'时间'"
                         align="left"
                         width="160">
          <template slot-scope="scope">
            {{formatDate(scope.row.created)}}
          </template>
        </el-table-column>
        <el-table-column :label="typeText+'状态'"
                         align="left"
                         width="100">
          <template slot-scope="scope">
            {{applyOptions[getStatus(scope.row)]}}
          </template>
        </el-table-column>
        <el-table-column label="详情"
                         width="100"
                         align="center">
          <template slot-scope="scope">
            <i style="font-size: 16px;cursor: pointer"
               class="iconfont"
               @click="showDetail(scope.row.id)">&#xe696;</i>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @change="loadData" />
      <slot/>
    </div>
  </div>
</template>
<script>
import applyOptions from './apply-option.mock.js'
import Pagination from '@/components/Pagination.vue'
import comApi from '@/scripts/api.js'
import { mapGetters, mapActions } from 'vuex'
import DateUtil from '@/scripts/date-utils'

export default {
  props: {
    queryType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isHaiguan: this.$root.$data.isHaiguan,
      tableData: [],
      typeOptions: applyOptions.type
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    applyOptions() {
      return applyOptions.status[this.queryType]
    },
    typeText() {
      return this.queryType === 1 ? '申请' : '审批'
    },
    ...mapGetters({
      search: 'myApplyList',
      pageInfo: 'pagination'
    }),
    dateRange: {
      get() {
        return this.search.dateRange
      },
      set(dateRange) {
        this.updateMyApplyListDateRange(dateRange)
      }
    },
    type: {
      get() {
        return this.search.type
      },
      set(type) {
        this.updateMyApplyListType(type)
      }
    },
    status: {
      get() {
        return this.search.status
      },
      set(status) {
        this.updateMyApplyListStatus(status)
      }
    },
    keyword: {
      get() {
        return this.search.keyword
      },
      set(keyword) {
        this.updateMyApplyListSearchKey(keyword)
      }
    }
  },
  methods: {
    ...mapActions({
      updateMyApplyListDateRange: 'updateMyApplyListDateRange',
      updateMyApplyListType: 'updateMyApplyListType',
      updateMyApplyListStatus: 'updateMyApplyListStatus',
      updateMyApplyListSearchKey: 'updateMyApplyListSearchKey',
      updatePageTotal: 'updatePageTotal'
    }),
    formatDate(date){
      return DateUtil.formate(date)
    },
    getStatus(row){
      if(this.queryType==1){
        return row.applyStatus
      }else if(this.queryType==2){
        return row.auditStatus
      }else{
        return row.processStatus
      }
    },
    loadData() {
      let params = {
        ...this.search,
        ...this.pageInfo
      }
      params.startTime = +new Date(params.dateRange[0])
      params.endTime = +new Date(params.dateRange[1])
      params.pageNo = params.pageIndex
      delete params.dateRange
      delete params.pageSizes
      delete params.total
      delete params.pageIndex
      comApi.apply.getApplyList(this.queryType,params).then(res=>{
        this.tableData = res.list
        this.updatePageTotal(res.total)
      })
    },
    showDetail(id) {
      this.$router.push('/applyDetail/' + this.queryType + '/' + id)
    }
  },
  components: {
    Pagination
  }
}
</script>
<style lang="scss">
</style>

