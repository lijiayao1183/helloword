import * as types from '../types'
const state = {
  myApply: {
    dateRange:(()=>{
      let end = new Date()
      end.setHours(23)
      end.setMinutes(59)
      end.setSeconds(59)
      let start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      return [start.getTime(), end.getTime()]
    })(),
    type: '',
    status: '',
    keyword: ''
  }
}

const getters = {
  myApplyList: state => state.myApply
}

const actions = {
  // 我的审批-列表
  updateMyApplyListDateRange({commit, state},dateRange) {
    commit(types.APPLY_LIST_DATE_RANGE, dateRange)
  },
  updateMyApplyListType({commit, state},type) {
    commit(types.APPLY_LIST_APPLY_TYPE, type)
  },
  updateMyApplyListStatus({commit, state},status) {
    commit(types.APPLY_LIST_APPLY_STATUS, status)
  },
  updateMyApplyListSearchKey({commit, state},keyWord) {
    commit(types.APPLY_LIST_APPLY_SEACH_KEY, keyWord)
  }
}

// mutations
const mutations = {
  // 我的审批-列表
  [types.APPLY_LIST_DATE_RANGE] (state, dateRange) {
    state.myApply.dateRange = dateRange
  },
  [types.APPLY_LIST_APPLY_TYPE] (state, type) {
    state.myApply.type = type
  },
  [types.APPLY_LIST_APPLY_STATUS] (state, status) {
    state.myApply.status = status
  },
  [types.APPLY_LIST_APPLY_SEACH_KEY] (state, keyword) {
    state.myApply.keyword = keyword
  }
}

export default {
    state,
    getters,
    actions,
    mutations
}
