import axios from 'axios'

class LoggerManageApi {
  getLoggers (url) {
    return axios({
      method: 'get',
      url
    })
  }
  getLoggerById (loggerId) {
    return axios({
      url: '/api/logger/' + loggerId,
      method: 'get'
    })
  }
}
export default new LoggerManageApi()
