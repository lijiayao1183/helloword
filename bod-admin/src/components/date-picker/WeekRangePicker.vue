<template>
  <div>
    <el-date-picker
      v-model="startTime"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择起始周"
      @change="change">
    </el-date-picker>
    <span>-</span>
    <el-date-picker
      v-model="endTime"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择结束周"
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
        return [new Date().getTime(), new Date().getTime()]
      }
    }
  },
  data () {
    return {
      startTime: this.defaultRange[0],
      endTime: this.defaultRange[1]
    }
  },
  methods: {
    change () {
      this.$emit('change', [this.startTime, this.endTime])
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
