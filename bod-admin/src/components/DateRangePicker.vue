<template>
  <component :is="currentView"
             :defaultRange="defaultRange"
             @change="change"
             class="date-range-picker"></component>
</template>
<script>
  import DayRangePicker from './date-picker/DayRangePicker.vue'
  import WeekRangePicker from './date-picker/WeekRangePicker.vue'
  import MonthRangePicker from './date-picker/MonthRangePicker.vue'

  const type = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
  }
  export default {
    props: {
      defaultRange: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        default: type.DAY
      }
    },
    data () {
      return {
        currentView: MonthRangePicker
      }
    },
    watch: {
      type () {
        this.setCurrentView()
      }
    },
    created () {
      this.setCurrentView()
    },
    components: {
      'week-range-picker': WeekRangePicker
    },
    methods: {
      change (range) {
        this.$emit('change', range)
      },
      setCurrentView () {
        switch (this.type) {
          case type.DAY:
            this.currentView = DayRangePicker
            break
          case type.WEEK:
            this.currentView = WeekRangePicker
            break
          case type.MONTH:
            this.currentView = MonthRangePicker
            break
          default:
            this.currentView = DayRangePicker
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .date-range-picker {
    display: inline-block;
  }
</style>
