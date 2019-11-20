<template>
  <el-dialog
    title="关联配置"
    :visible.sync="connectDialogVisible"
    size="tiny"
    :before-close="handleClose">
    <div class="connBox">
      <conn-deploy :titleName="titleName"
                   :connectDatas="connectDatas">
      </conn-deploy>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>
<script type="text/babel">
import connectionDeploy from '../common-setting/components/connectionDeploy.vue'
export default {
  props: {
    connectDialogVisible: {
      type: Boolean,
      default: false
    },
    connectDatas: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      titleName: '关联配置'
    }
  },
  watch () {

  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        }).catch(_ => {})
    }
  },
  components: {
    'conn-deploy': connectionDeploy
  }
}
</script>
