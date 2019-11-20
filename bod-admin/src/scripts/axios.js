import axios from 'axios'
import store from '../store/index'

let url = require('../scripts/url')

let waitGetRespCount = 0
let waitUpdateRespCount = 0

axios.interceptors.request.use(function (config) {
  if (config.method === 'get' || config.method === 'put') {
    showLoading(config)
  } else {
    showSaving(config)
  }
  return config
}, function (err) {
  return Promise.reject(err)
})
axios.interceptors.response.use(
  (res) => {
    if (res.config && (res.config.method === 'get' || res.config.method === 'put')) {
      hideLoading(res)
    } else {
      hideSaving(res)
    }
    return res.data
  }, (err) => {
    clear()
    if (err.response) {
      switch (err.response.status) {
        case 401:
          window.location.href = url.login.path
          break
        case 307:
          alert('账号在别处登录')
          window.location.href = url.login.path
          break
        default:
          break
      }
    }
    return Promise.reject(err)
  }
)

const showLoading = (config) => {
  let isShowLoading = config.isShowLoading === undefined ? true : config.isShowLoading
  if (isShowLoading) {
    waitGetRespCount++
    store.dispatch('showLoading')
  }
}
const hideLoading = (res) => {
  let isShowLoading = res.config.isShowLoading === undefined ? true : res.config.isShowLoading
  if (isShowLoading) {
    waitGetRespCount--
    if (waitGetRespCount <= 0) {
      store.dispatch('hideLoading')
    } else {
      store.dispatch('showLoading')
    }
  }
}

const showSaving = (config) => {
  waitUpdateRespCount++
  if (!store.getters.saving) {
    store.dispatch('showSaving')
  }
}

const hideSaving = (res) => {
  waitUpdateRespCount--
  if (waitUpdateRespCount <= 0) {
    store.dispatch('hideSaving')
  }
}

const clear = () => {
  waitGetRespCount = 0
  waitUpdateRespCount = 0
  store.dispatch('hideLoading')
  store.dispatch('hideSaving')
}
export default axios
