<template>
  <el-dialog :visible="true" :title="title" size="tiny" id="log-dialog" :before-close="close">
    <time-line :pending="hasMore">
      <time-line-item v-if="showTitle">
        <span class="column" style="padding-right: 78px;">创建时间</span>
        <span class="column" style="padding-right: 14px;">触发动作</span>
        <span class="column" style="padding-right: 80px;">开始时间    </span>
        <span class="column" style="padding-right: 80px;">结束时间    </span>
        <span class="column">状态 </span>
      </time-line-item>

      <time-line-item v-for="item in displayData">
        <template v-for="column in columns">
          <span class="column">{{item[column]}}</span>
        </template>
      </time-line-item>
      <template v-if="hasMore">
        <time-line-item>
          <a @click="isShowAll=true" v-if="!isShowAll" tabindex="1">查看更多</a>
          <a @click="isShowAll=false" v-else tabindex="2">收起</a>
        </time-line-item>
      </template>
    </time-line>
  </el-dialog>
</template>
<script>
import { Timeline, TimelineItem } from 'iview'
import 'iview/dist/styles/iview.css'

const lineCount = 5
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '日志'
    }
  },
  data () {
    return {
      isShowAll: false
    }
  },
  computed: {
    hasMore () {
      return this.data.length > lineCount
    },
    displayData () {
      if (this.hasMore && !this.isShowAll) {
        return _.slice(this.data, 0, lineCount)
      } else {
        return this.data
      }
    }
  },
  components: {
    'time-line': Timeline,
    'time-line-item': TimelineItem
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
  #log-dialog {
    .el-dialog.el-dialog--tiny {
      width: 600px;
    }
    .column {
      padding-right: 20px;
    }

    .el-dialog__body {
      max-height: 300px;
      overflow-y: auto;
    }
  }
</style>
