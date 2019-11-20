import SelectOption from './src/select-option'

/* istanbul ignore next */
SelectOption.install = function (Vue) {
  Vue.mixin(SelectOption)
}

export {
  SelectOption
}
