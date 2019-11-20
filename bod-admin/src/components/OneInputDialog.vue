<template>
  <el-dialog
    id="one-input-dialog"
    :title="title"
    :visible="visible"
    :show-close="false">
    <el-form ref="oneInputForm" :model="data" :rules="innerFormRules">
      <el-form-item :label="label" :prop="fieldName">
        <el-input autofocus
                  auto-complete="off"
                  @mousemove.native.stop=""
                  v-model="data[fieldName]"
                  @keyup.enter.native="ok"></el-input>
      </el-form-item>
      <slot/>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok" :disabled="!data[fieldName]">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
import validateRules from '../scripts/validate-rules'

export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '名称'
    },
    data: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    },
    fieldName: {
      type: String,
      default: 'name'
    },
    formRules: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    innerFormRules () {
      return {
        [this.fieldName]: _.concat(this.formRules, validateRules.name)
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$refs['oneInputForm'].validate((valid) => {
        if (valid) {
          this.$emit('ok', this.data)
        }
      })
    }
  }
}
</script>
<style lang="scss">
</style>
