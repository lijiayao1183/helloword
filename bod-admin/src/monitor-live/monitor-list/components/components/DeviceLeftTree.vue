<template>
  <div class="alarm-log">
    <div class="title" style="position: relative;">
      <span>通道列表</span>
      <el-radio-group v-if="false" v-model="showType" style="margin-top: -7px;position: absolute; right: 1px;">
	    <el-radio-button label='list'><i class="el-icon-date"></i></el-radio-button>
	    <el-radio-button label='block'><i class="el-icon-menu"></i></el-radio-button>
	  </el-radio-group>
    </div>
    <div class="left-list-topSearch">
      <el-input placeholder="搜索" v-model="searchKey">
      </el-input>
    </div>
    <el-tree v-if="treeData.length>0"
           class="scroll-small"
           ref="tree"
           node-key="id"
           show-checkbox
           default-expand-all
           :data="treeData"
           :props="treeProps"
           :filter-node-method="filterNode"
           :highlight-current="currentNodeId!==0"
           @check-change="handleCheckChange">
    </el-tree>
    <div style="text-align: center;margin-top: 50px;color: #aaaaaa;" v-else>暂无通道</div>
  </div>
</template>
<script>
import DateUtils from '../../../../scripts/date-utils'
import { Timeline, TimelineItem } from 'iview'
import 'iview/dist/styles/iview.css'
import NoDataPage from '../../../../components/NoDataPage.vue'

export default {
  props: {
    treeProps: {
      type: Object,
      default () {
        return {
	          id: 'id',
	          label: 'name',
	          children: 'children'
	      }
      }
    },
    treeData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showType: 'block',
      currentNodeId: 0,
      searchKey: ''
    }
  },
  components: {
    'no-data-page': NoDataPage
  },
  watch: {
    searchKey (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(_.trim(value)) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      this.$emit('checkNodesChange', {data: data, checked: checked})
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
