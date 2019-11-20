import axios from 'axios'

class UserManageApi {
  getUsers (url) {
    return axios({
      method: 'get',
      url
    })
  }

  getOrgans () {
    return axios({
      url: '/api/organ/list?pageSize=500',
      method: 'get'
    })
  }

  getRolesByOrganId (url) {
    return axios({
      url,
      method: 'get'
    })
  }

  deleteSingleUser (userId) {
    return axios({
      method: 'delete',
      url: '/api/user',
      data: userId,
      headers: {'content-type': 'application/json'}
    })
  }

  saveUser (user) {
    return axios({
      url: '/api/user',
      method: 'post',
      data: user
    })
  }

  updateUser (user) {
    return axios({
      url: '/api/user',
      method: 'put',
      data: user
    })
  }

  getUserById (userId) {
    return axios({
      url: '/api/user/' + userId,
      method: 'get'
    })
  }

  getUserByUserName (userName) {
    return axios({
      url: '/api/user/getUserByAccount?account=' + userName,
      method: 'get'
    })
  }

  patchChangeUsersStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }

  patchDeleteUsers (url) {
    return axios({
      url,
      method: 'put'
    })
  }

  checkIfExistAccout (accout, userId) {
    return axios({
      url: `/api/user/checkAccountOnly?account=${accout}&userId=${userId}`,
      method: 'put'
    })
  }

  getPermissions () {
    return axios({
      url: '/api/resource/getUserResourceCodes',
      method: 'get'
    })
  }

  getOrganForRole () {
    return axios({
      url: '/api/organ/getOrganForRole',
      method: 'get'
    })
  }

  resetPassword (userId) {
    return axios({
      url: '/api/user/resetPassword?password=111111&userId=' + userId,
      method: 'post'
    })
  }

  checkAccout = (rule, value, callback) => {
    this.checkIfExistAccout(value).then(
      (res) => {
        if (res) {
          callback(new Error('该账户已经存在，请更改账户名'))
        } else {
          callback()
        }
      }, (err) => {
        console.log(err)
        callback()
      }
    )
  }
}

export default new UserManageApi()
