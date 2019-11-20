<template>
  <el-dialog title="校验结果" :visible.sync="innerVisible" id="validate-result">
    <el-table :data="data" height="300">
      <el-table-column prop="nodeCode" label="节点编号" width="150"></el-table-column>
      <el-table-column prop="nodeName" label="节点名称" width="200"></el-table-column>
      <el-table-column label="错误信息">
        <template slot-scope="scope">
          <div v-for="(errorMsg,index) in scope.row.errorMsgs">
            <span style="color: #ff0000;">{{(index + 1) + '.' + errorMsg}}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      innerVisible: false
    }
  },
  created () {
    this.innerVisible = !_.isEmpty(this.data)
  },
  watch: {
    innerVisible (newVal) {
      if (!newVal) {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss">
  #validate-result {
    .el-dialog__body {
      padding: 0px;
    }

    .el-table td, .el-table th {
      padding-left: 10px;
      text-align: left;
    }

    .el-table th {
      background-color: white;
    }

    .el-table__header-wrapper thead div {
      background-color: white;
    }
  }
</style>
