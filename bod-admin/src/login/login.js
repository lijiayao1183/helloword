import Vue from 'vue';
import Element from 'element-ui';
import store from '../store/index';
import 'element-ui/lib/theme-chalk/index.css';
import Login from './Login.vue';

Vue.use(Element);

new Vue({
  el: '#app',
  store,
  template: '<Login/>',
  components: {Login}
});

(() => {//forbidden back
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
  });
})();
