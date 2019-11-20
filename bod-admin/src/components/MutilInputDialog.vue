<template>
  <el-dialog
    id="mutil-input-dialog"
    :title="title"
    :visible="visible"
    :show-close="false"
    size="tiny">
    <el-form ref="createItemForm"
             :model="data"
             :rules="innerFormRules">
      <template v-for="field in fields">
        <el-form-item :label="field.label" :prop="field.name">
          <template v-if="field.type === 'textarea'">
            <el-input
              v-model="data[field.name]"
              type="textarea"
              :rows="4"
              placeholder="请输入内容">
            </el-input>
          </template>
          <template v-else>
            <el-input v-model="data[field.name]">
            </el-input>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-tooltip class="item" effect="dark" :disabled="!isDisabledSubmit" :content="tooltip" placement="bottom">
        <el-button type="primary" @click="ok" :disabled="isDisabledSubmit">确定</el-button>
      </el-tooltip>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
import validateRules from '../scripts/validate-rules'
import * as _ from 'lodash'

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
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fields: {
      type: Array,
      default () {
        return []
      }
    },
    formRules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isDisabledSubmit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    tooltip: {
      type: String,
      default: ''
    }
  },
  computed: {
    innerFormRules () {
      let rules = _.cloneDeep(this.formRules)
      _.forEach(this.fields, field => {
        rules[field.name] = _.compact(_.concat(this.formRules[field.name], validateRules[field.name]))
      })
      return rules
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$refs['createItemForm'].validate((valid) => {
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
