import Vue from 'vue'
import Element from 'element-ui'
import router from './scripts/router'
import store from '../store/index'
import VeeValidate from 'vee-validate'
import { baseConfig } from '../validate/validate.config'
import messages from '../validate/zh_CN'
import Validator from '../validate/custom.validate.js'
import 'element-ui/lib/theme-chalk/index.css'
import MonitorLive from './MonitorLive.vue'
import { ElSelectCustomer, ElOptionCustomer } from '../plugins/components/selectCustomer'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css' // 引入样式
import 'vue-video-player/src/custom-theme.css' // 引入样式
import 'videojs-flash'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

Vue.use(VueVideoPlayer)
Vue.use(ElSelectCustomer).use(VeeValidate, baseConfig)
Vue.use(ElOptionCustomer)
Vue.use(preview)
Vue.use(Element).use(VeeValidate, baseConfig)
Validator.addLocale(messages)

new Vue({
  el: '#app',
  router,
  store,
  template: '<MonitorLive/>',
  components: {MonitorLive}
})
