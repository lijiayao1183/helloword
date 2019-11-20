import Vue from 'vue'
import Element from 'element-ui'
import router from './scripts/router'
import store from '../store/index'
import 'element-ui/lib/theme-chalk/index.css'
import {InputNumber} from '../plugins/components'
import DeviceManage from './DeviceManage.vue'
import VeeValidate from 'vee-validate'
import { baseConfig } from '../validate/validate.config'
import messages from '../validate/zh_CN'
import Validator from '../validate/custom.validate.js'

Vue.use(Element)
Vue.use(InputNumber)
Vue.use(VeeValidate, baseConfig)
Validator.addLocale(messages)

new Vue({
  el: '#app',
  router,
  store,
  template: '<DeviceManage/>',
  components: {DeviceManage}
})
