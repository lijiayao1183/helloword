import {InputNumber} from './components'
import {ElSelectCustomer} from './components/selectCustomer'
import {ElTreeCustomer} from './components/treeCustomer'
import {DateFormat, FieldValueScope} from './mixins/methods'
import {Loading} from './mixins/computed'
import {SelectOption} from './mixins/data'

const components = [
  InputNumber,
  ElSelectCustomer,
  ElTreeCustomer
]

const methods = [
  // DateFormat
  FieldValueScope
]

const computed = [
  Loading
]

const data = [
  SelectOption
]

const install = (Vue, opts = {}) => {
  components.map(component => {
    Vue.component(component.name, component)
  })

  methods.map(filter => {
    Vue.mixin(filter)
  })

  computed.map(c => {
    Vue.mixin(c)
  })

  data.map(d => {
    Vue.mixin(d)
  })
}

// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }

export {
  InputNumber,
  ElSelectCustomer,
  ElTreeCustomer,
  DateFormat,
  Loading,
  SelectOption,
  install
}
