import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import saving from './modules/saving'
import pagination from './modules/pagination'
import pagination1 from './modules/pagination1'
import search from './modules/search'
import sort from './modules/sort'
import field from './modules/fields'
import communication from './modules/communication'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    loading,
    saving,
    pagination,
    pagination1,
    search,
    sort,
    field,
    communication
  },
  strict: debug,
  plugins: []
})
