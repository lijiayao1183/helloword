<template>
  <el-dialog :title="title"
             :visible="visible"
             size="tiny"
             :show-close=false>
    <el-table
      ref="table"
      max-height="280"
      :data="data"
      tooltip-effect="dark">
      <el-table-column width="55"
                       align="center">
        <template slot-scope="scope">
          <el-radio v-model="currentCheckedId" :label="scope.row.id"><span></span></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :prop="col.name"
        :label="col.title"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
export default {
  props: {
    checkedId: [Number],
    data: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default () {
        return ''
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    col: {
      type: Object,
      default () {
        return {
          prop: 'name',
          title: '名称'
        }
      }
    }
  },
  data () {
    return {
      currentCheckedId: this.checkedId
    }
  },
  watch: {
    checkedId () {
      this.currentCheckedId = this.checkedId
    }
  },
  computed: {},
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$emit('ok', this.currentCheckedId)
    }
  }
}
</script>
<style type="scss" scoped>

</style>
