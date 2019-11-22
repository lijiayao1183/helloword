import * as types from "../../store/types"
import api from "../../scripts/api"
import store from "../index"

const state = {
  fields: null
}
const getters = {
  fields: state => {
    if (
      location.href.indexOf("login.html") === -1 &&
      location.href.indexOf("system-setting.html") === -1 &&
      location.href.indexOf("userinfo-manage.html") === -1 &&
      location.href.indexOf("snapshot-manage.html") === -1 &&
      !state.fields
    ) {
      store.dispatch("loadField")
    }
    return state.fields
  }
}

const actions = {
  loadField({ commit, state }, params) {
    let keyWord = (params && params.keyWord) || ""
    let engineId = (params && params.engineId) || ""
    api.field.getUnPage(keyWord, engineId)
      .then(data => {
        commit(types.LOAD_FIELD, data)
      })
      .catch(error => {})
  }
}

const mutations = {
  [types.LOAD_FIELD](state, data) {
    state.fields = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
