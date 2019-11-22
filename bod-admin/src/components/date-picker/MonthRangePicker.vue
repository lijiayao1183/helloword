<template>
  <div>
    <el-date-picker
      v-model="startTime"
      type="month"
      placeholder="选择起始月份"
      :picker-options="startPickerOptions"
      @change="change">
    </el-date-picker>
    <span>-</span>
    <el-date-picker
      v-model="endTime"
      type="month"
      :picker-options="endPickerOptions"
      placeholder="选择结束月份"
      @change="change">
    </el-date-picker>
  </div>
</template>
<script>
  export default {
    props: {
      defaultRange: {
        type: Array,
        default () {
          let now = new Date()
          let end = new Date(now.getFullYear(), now.getMonth(), 1)
          let start = new Date(end).setMonth(end.getMonth() - 6)
          return [start, end]
        }
      }
    },
    data () {
      let self = this
      return {
        startTime: this.defaultRange[0],
        endTime: this.defaultRange[1],
        startPickerOptions: {
          disabledDate (time) {
            return new Date(time).getTime() > new Date(self.endTime).getTime()
          }
        },
        endPickerOptions: {
          disabledDate (time) {
            return new Date(time).getTime() < new Date(self.startTime).getTime()
          }
        }
      }
    },
    methods: {
      change () {
        this.$emit('change', [new Date(this.startTime).getTime(), new Date(this.endTime).getTime()])
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
