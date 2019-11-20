import * as types from '../../store/types'
import * as pageNames from '../../scripts/page-name'
const generateState = (pageNames) => {
  const obj = {}
  Object.values(pageNames).map(item => {
    obj[item] = {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50, 100]
    }
  })
  return obj
}
const state = {
  current1PageName: pageNames.DB_COL_TABLE_CONFIG,
  ...generateState(pageNames)
}

const getters = {
  current1PageName: state => state.current1PageName,
  pagination1: (state) => {
    return state[state.current1PageName]
  }
}

const actions = {
  updateCurrent1PageName ({commit, state}, currentPageName) {
    commit(types.CURRENT_COLUNM_PAGE_NAME, currentPageName)
  },
  update1PageTotal ({commit, state}, total) {
    commit(types.COLUNM_PAGE_TOTAL, total)
  },
  update1PageIndex ({commit, state}, index) {
    commit(types.COLUNM_PAGE_INDEX, index)
  },
  update1PageSize ({commit, state}, size) {
    commit(types.COLUNM_PAGE_SIZE, size)
  }
}

const mutations = {
  [types.CURRENT_COLUNM_PAGE_NAME] (state, currentPageName) {
    state.currentColunmPageName = currentPageName
  },
  [types.COLUNM_PAGE_TOTAL] (state, total) {
    state[state.currentColunmPageName].total = total
  },
  [types.COLUNM_PAGE_INDEX] (state, pageIndex) {
    state[state.currentColunmPageName].pageIndex = pageIndex
  },
  [types.COLUNM_PAGE_SIZE] (state, pageSize) {
    state[state.currentColunmPageName].pageSize = pageSize
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
