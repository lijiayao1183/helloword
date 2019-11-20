import * as types from '../types'
const state = {
  organ: {
    pagination: {
      total: 0,
      curIndex: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50, 100]
    }
  }
}

const getters = {
  organPagination: state => state.organ.pagination
}

const actions = {
  updateOrganTotal ({commit, state}, total) {
    commit(types.ORGAN_PAGINATION_TOTAL, total)
  },
  updateOrganCurIndex ({commit, state}, index) {
    commit(types.ORGAN_PAGINATION_CURINDEX, index)
  },
  updateOrganPageSize ({commit, state}, size) {
    commit(types.ORGAN_PAGINATION_PAGESIZE, size)
  }
}

// mutations
const mutations = {
  [types.ORGAN_PAGINATION_TOTAL] (state, total) {
    state.organ.pagination.total = total
  },
  [types.ORGAN_PAGINATION_CURINDEX] (state, curIndex) {
    state.organ.pagination.curIndex = curIndex
  },
  [types.ORGAN_PAGINATION_PAGESIZE] (state, size) {
    state.organ.pagination.pageSize = size
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
