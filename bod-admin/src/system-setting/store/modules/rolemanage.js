import * as types from '../types'
const state = {
  roles: {
      pagination: {
          total: 0,
          curIndex: 1,
          pageSize: 10,
          pageSizes: [10,20,30,40,50,100]
      }
  }
}

const getters = {
  rolesPagination: state => state.roles.pagination
}

const actions = {
    updateRolesTotal ({commit, state}, total) {
        commit(types.ROLES_PAGINATION_TOTAL, total)
    },
    updateRolesCurIndex ({commit, state}, index) {
        commit(types.ROLES_PAGINATION_CURINDEX, index)
    },
    updateRolesPageSize ({commit, state}, size) {
        commit(types.ROLES_PAGINATION_PAGESIZE, size)
    }
}

// mutations
const mutations = {
    [types.ROLES_PAGINATION_TOTAL] (state, total) {
        state.roles.pagination.total = total
    },
    [types.ROLES_PAGINATION_CURINDEX] (state, curIndex) {
        state.roles.pagination.curIndex = curIndex
    },
    [types.ROLES_PAGINATION_PAGESIZE] (state, size) {
        state.roles.pagination.pageSize = size
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
