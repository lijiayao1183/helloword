import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import system from './modules/system'
import usermanage from './modules/usermanage'
import rolemanage from './modules/rolemanage'
import loggermanage from './modules/loggermanage'
import organmanage from './modules/organmanage'
import sourcemanage from './modules/sourcemanage'
import applyLogmanage from './modules/applyLogmanage'
import pagination from './modules/pagination'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    system,
    usermanage,
    rolemanage,
    loggermanage,
    organmanage,
    sourcemanage,
    applyLogmanage,
    pagination
  },
  strict: debug,
  plugins: []
})
