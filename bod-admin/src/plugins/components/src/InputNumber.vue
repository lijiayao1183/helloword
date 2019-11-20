<template>
  <div class="el-input">
    <input class="el-input__inner"
           :value="value"
           @change="change"
           @input="input"
           placeholder="请输入数字"
           @mouseup.native.stop
           @mousemove.native.stop>
  </div>
</template>
<script>
export default {
  name: 'input-number',
  props: {
    value: [String, Number]
  },
  methods: {
    change (event) {
      this.$emit('change', event.currentTarget.value)
    },
    input (event) {
      let value = event.currentTarget.value
      const t = value.charAt(0)
      value = value.replace(/[^\d.]/g, '')
      value = value.replace(/^\./g, '')
      value = value.replace(/\.{2,}/g, '.')
      value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      if (t === '-') {
        value = '-' + value
      }
      event.currentTarget.value = value
      this.$emit('input', value)
    }
  }
}
</script>
