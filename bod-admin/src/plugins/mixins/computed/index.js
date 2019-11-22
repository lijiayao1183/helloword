import Loading from './src/loading';

/* istanbul ignore next */
Loading.install = function (Vue) {
  Vue.mixin(Loading);
};

export {
  Loading
};
