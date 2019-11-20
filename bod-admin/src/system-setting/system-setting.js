// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

axios.interceptors.request.use(function (config) {
  if (!store.getters.loading) {
    store.dispatch('loading')
  }
  store.dispatch('addLoadingCount')
  // if (config.method === 'get') {
  //   config.url += '?' + moment().unix()
  // }
  return config
}, function (err) {
  return Promise.reject(err)
})
axios.interceptors.response.use(
  (res) => {
    store.dispatch('subLoadingCount')
    if (!store.getters.loadingCount) {
      store.dispatch('hideLoading')
    }
    return res
  }, (err) => {
    store.dispatch('subLoadingCount')
    if (!store.getters.loadingCount) {
      store.dispatch('hideLoading')
    }
    // if (err.response.status === 401) {
    //   window.location.href = '/html/login/index.html?url=/' + window.location.hash
    // }
    return Promise.reject(err)
  }
)
Vue.use(Element)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
    isHaiguan: true
  }
})
