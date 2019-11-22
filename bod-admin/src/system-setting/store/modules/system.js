import * as types from '../types'
const state = {
  loading: false,
  loadingCount: 0
}

const getters = {
  loading: state => state.loading,
  loadingCount: state => state.loadingCount
}

const actions = {
    loading ({commit, state}) {
        commit(types.SHOW_LOADING)
    },
    hideLoading ({commit, state}) {
        commit(types.HIDDEN_LOADING)
    },
    addLoadingCount ({commit, state}) {
        commit(types.ADD_LOADING_COUNT)
    },
    subLoadingCount ({commit, state}) {
        commit(types.SUB_LOADING_COUNT)
    }
}

// mutations
const mutations = {
    [types.SHOW_LOADING] (state) {
        state.loading = true
    },
    [types.HIDDEN_LOADING] (state) {
        state.loading = false
    },
    [types.ADD_LOADING_COUNT] (state) {
        state.loadingCount += 1
    },
    [types.SUB_LOADING_COUNT] (state) {
        state.loadingCount -= 1
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
