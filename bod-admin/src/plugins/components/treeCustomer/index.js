
import ElTreeCustomer from './src/treeCustomer'
import ElTreeNodeCustomer from './src/treeNodeCustomer'

/* istanbul ignore next */
ElTreeCustomer.install = function (Vue) {
  Vue.component(ElTreeCustomer.name, ElTreeCustomer)
}

ElTreeNodeCustomer.install = function (Vue) {
  Vue.component(ElTreeNodeCustomer.name, ElTreeNodeCustomer)
}

export {
  ElTreeCustomer,
  ElTreeNodeCustomer
}
