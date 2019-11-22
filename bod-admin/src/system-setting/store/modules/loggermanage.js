import * as types from '../types'
const state = {
  logger: {
      pagination: {
          total: 0,
          curIndex: 1,
          pageSize: 10,
          pageSizes: [10,20,30,40,50,100]
      }
  }
}

const getters = {
  loggerPagination: state => state.logger.pagination
}

const actions = {
    updateLoggerTotal ({commit, state}, total) {
        commit(types.LOGGER_PAGINATION_TOTAL, total)
    },
    updateLoggerCurIndex ({commit, state}, index) {
        commit(types.LOGGER_PAGINATION_CURINDEX, index)
    },
    updateLoggerPageSize ({commit, state}, size) {
        commit(types.LOGGER_PAGINATION_PAGESIZE, size)
    }
}

// mutations
const mutations = {
    [types.LOGGER_PAGINATION_TOTAL] (state, total) {
        state.logger.pagination.total = total
    },
    [types.LOGGER_PAGINATION_CURINDEX] (state, curIndex) {
        state.logger.pagination.curIndex = curIndex
    },
    [types.LOGGER_PAGINATION_PAGESIZE] (state, size) {
        state.logger.pagination.pageSize = size
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
