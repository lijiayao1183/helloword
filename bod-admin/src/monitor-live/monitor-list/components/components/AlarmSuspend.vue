<template>
  <el-dialog visible title="预警暂停" size="tiny" :show-close="false">
    <el-form>
      <el-form-item label="预警名称：">
        <p>{{value.name}}</p>
      </el-form-item>
      <el-form-item label="预警描述：">
        <p>{{value.description}}</p>
      </el-form-item>
      <el-form-item label="暂停时长：">
        <el-select v-model="currentSuspendTime">
          <el-option v-for="item in suspendTimes"
                     :value="item.value"
                     :label="item.name"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { suspendTimes } from '../../mock/mock.data'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {
          name: '',
          description: ''
        }
      }
    }
  },
  data () {
    return {
      currentSuspendTime: '',
      suspendTimes: suspendTimes
    }
  },
  methods: {
    ok () {
      this.$emit('ok', this.currentSuspendTime)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
