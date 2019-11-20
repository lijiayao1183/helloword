import DateUtils from '../../../scripts/date-utils'

const formatConsume = (mss) => {
  if (!_.isNumber(mss)) {
    mss = parseInt(mss)
  }

  if (isNaN(mss)) {
    return ''
  }

  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = (mss % (1000 * 60)) / 1000
  return hours + ':' + minutes + ':' + parseInt(seconds)
}
export default {
  install: function (Vue) {
    Vue.prototype.$formatDate = DateUtils.formate
    Vue.filter('formatDate', DateUtils.formate)
    Vue.prototype.$formatConsume = formatConsume
    Vue.filter('formatConsume', formatConsume)
  }
}
