import axios from "../../scripts/axios"

export default {
  login: {
    post({ username, password}) {
      let url = `/api/login?username=${username}&password=${encodeURIComponent(password)}`
      return axios({
        method: "post",
        url
      })
    }
  },
  resetPassword(account, password) {
    let url = "/api/login?password=" + encodeURIComponent(password) + "&username=" + encodeURIComponent(account)
    return axios({
      method: "put",
      url
    })
  }
}
