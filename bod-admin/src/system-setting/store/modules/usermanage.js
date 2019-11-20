import * as types from '../types'
const state = {
  users: {
    pagination: {
      total: 0,
      curIndex: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50, 100]
    }
  }
}

const getters = {
  usersPagination: state => state.users.pagination
}

const actions = {
  updateUsersTotal ({commit, state}, total) {
    commit(types.USERS_PAGINATION_TOTAL, total)
  },
  updateUsersCurIndex ({commit, state}, index) {
    commit(types.USERS_PAGINATION_CURINDEX, index)
  },
  updateUsersPageSize ({commit, state}, size) {
    commit(types.USERS_PAGINATION_PAGESIZE, size)
  }
}

// mutations
const mutations = {
  [types.USERS_PAGINATION_TOTAL] (state, total) {
    state.users.pagination.total = total
  },
  [types.USERS_PAGINATION_CURINDEX] (state, curIndex) {
    state.users.pagination.curIndex = curIndex
  },
  [types.USERS_PAGINATION_PAGESIZE] (state, size) {
    state.users.pagination.pageSize = size
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
