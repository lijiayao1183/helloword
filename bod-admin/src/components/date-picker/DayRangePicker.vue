<template>
  <el-date-picker
    v-model="dateRange"
    type="daterange"
    placeholder="选择日期范围"
    @change="change">
  </el-date-picker>
</template>
<script>
export default {
  props: {
    defaultRange: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dateRange: this.defaultRange
    }
  },
  watch: {
    defaultRange () {
      this.dateRange = this.defaultRange
    }
  },
  methods: {
    change () {
      this.$emit('change', [this.dateRange[0].getTime(), this.dateRange[1].getTime()])
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
