import ElSelectCustomer from './src/ElSelectCustomer';
import ElOptionCustomer from './src/ElOptionCustomer';

/* istanbul ignore next */
ElSelectCustomer.install = function(Vue) {
  Vue.component(ElSelectCustomer.name, ElSelectCustomer);
};

ElOptionCustomer.install = function(Vue) {
	  Vue.component(ElOptionCustomer.name, ElOptionCustomer);
	};

export {
	ElSelectCustomer,
	ElOptionCustomer
	};
