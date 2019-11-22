import * as types from '../types'
const state = {
  source: {
      pagination: {
          total: 0,
          curIndex: 1,
          pageSize: 10,
          pageSizes: [10,20,30,40,50,100]
      }
  }
}

const getters = {
  sourcePagination: state => state.source.pagination
}

const actions = {
    updateSourceTotal ({commit, state}, total) {
        commit(types.SOURCE_PAGINATION_TOTAL, total)
    },
    updateSourceCurIndex ({commit, state}, index) {
        commit(types.SOURCE_PAGINATION_CURINDEX, index)
    },
    updateSourcePageSize ({commit, state}, size) {
        commit(types.SOURCE_PAGINATION_PAGESIZE, size)
    }
}

// mutations
const mutations = {
    [types.SOURCE_PAGINATION_TOTAL] (state, total) {
        state.source.pagination.total = total
    },
    [types.SOURCE_PAGINATION_CURINDEX] (state, curIndex) {
        state.source.pagination.curIndex = curIndex
    },
    [types.SOURCE_PAGINATION_PAGESIZE] (state, size) {
        state.source.pagination.pageSize = size
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
