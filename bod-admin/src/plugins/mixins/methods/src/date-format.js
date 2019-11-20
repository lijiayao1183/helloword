import DateUtils from '../../../../scripts/date-utils'

export default {
  methods: {
    formatDate (value, formatter = 'yyyy-MM-dd') {
      if (!value) {
        return ''
      } else {
        return DateUtils.formate(value, 'yyyy-MM-dd')
      }
    }
  }
}
