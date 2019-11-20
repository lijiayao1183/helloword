<template>
  <el-dialog
    class="segment-set"
    title="区间设置"
    :modal="isModal"
    :show-close=false
    size="large"
    :visible="segmentSetVisible"
    >
    <el-form :model="segmentsModel" :label-position="'top'" label-width="180px">
      <el-form-item label="区间设置:">
        <el-table
        :data="segmentsModel.segmentsTable"
        border
        style="width:100%"
        >
          <el-table-column
            prop="segment"
            label="字段取值区间"
            >
          </el-table-column>
          <el-table-column
            prop="value"
            label="输出值"
           >
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="非区间内取值输出:">
        <span v-text="segmentsModel.outRangeValue"></span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'snapshotOutputFieldDialog',
  data () {
    return {
      isModal: true
    }
  },
  created () {
    if (this.$parent.$route.name === 'decision-flow') {
      this.isModal = false
    }
  },
  props: {
    segmentSetVisible: {
      type: Boolean,
      default: false
    },
    segmentsModel: {
      segmentsTable: {
        type: Array,
        default () {
          return []
        }
      },
      outRangeValue: {
        type: String,
        default: ''
      }
    }
  },
  methods: {
    ok () {
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss">
  .segment-set{
    .el-dialog.el-dialog--large {
      height: inherit !important;
    }
  }
</style>
