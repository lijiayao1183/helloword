import DateFormat from './src/date-format'
import FieldValueScope from './src/field-value-scope'

/* istanbul ignore next */
DateFormat.install = function (Vue) {
  Vue.mixin(DateFormat)
}

FieldValueScope.install = function (Vue) {
  Vue.mixin(FieldValueScope)
}

export {
  DateFormat,
  FieldValueScope
}
