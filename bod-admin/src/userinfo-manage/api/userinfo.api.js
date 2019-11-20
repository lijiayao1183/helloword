import axios from 'axios'

export default {
  getUserByUserName (userName) {
    return axios({
      url: '/api/user/getUserByAccount?account=' + userName,
      method: 'get'
    })
  },
  updateUserInfo (data) {
    const url = `/api/user/updateUserInfo?cellphone=${data.cellphone}&userId=${
      data.userId
    }&nickName=${data.nickName}&email=${data.email}&employeeId=${
      data.employeeId
    }`
    return axios({
      method: 'post',
      url
    })
  },
  updatePsw (data) {
    let url = `/api/user/updatePassword?userId=${data.userId}&oldPassword=${
      encodeURIComponent(data.oldPassword)
    }&newPassword=${encodeURIComponent(data.newPassword)}`
    return axios({
      method: 'post',
      url
    })
  },
  logout () {
    const url = `/api/login`
    return axios({
      method: 'get',
      url
    })
  }
}
