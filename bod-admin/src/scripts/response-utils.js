import Vue from 'vue'

export default {
  isSuccess (data) {
    if (data) {
      return data.code === '0000'
    }
  },
  /**
   *@function http请求失败，显示错误消息
   * @param response http请求错误返回值
   * @param defaultMessage 如果返回值中的message没有，则设置默认message
   * @param errorLevel message的级别(info,warning,error) */
  showErrorMessage (response, defaultMessage = '未知异常', errorLevel = 'warning') {
    let messageOption = null
    try {
      let errorCode = response.response.data.error.code
      messageOption = {
        type: errorLevel,
        message: errorCode === '0000' ? defaultMessage : response.response.data.error.message
      }
    } catch (er) {
      messageOption = {
        type: errorLevel,
        message: defaultMessage
      }
    }
    Vue.prototype.$message(messageOption)
  }
}
