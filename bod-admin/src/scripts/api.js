import axios from './axios'

export default {
  field: {
    getUnPage (keyWord, engineId, isOutput) {
      let url = `/api/field/unpage?keyWord=${keyWord}`
      if (engineId) {
        url = `/api/field/unpage?keyWord=${keyWord}&engineId=${engineId}`
      }
      if (isOutput != undefined) {
        url += `&isOutput=${isOutput}`
      }

      return axios({
        method: 'get',
        isShowLoading: false,
        url
      })
    },
    getField (id) {
      const url = `/api/field/getField?id=${id}`
      return axios({
        method: 'get',
        url
      })
    }
  },
  login: {
    put () {
      const url = `/api/login`
      return axios({
        method: 'get',
        url
      })
    }
  },
  getApplyNum () {
    return axios({
      url: '/api/audit/apply/getRemind',
      method: 'get'
    })
  },
  getAllUsers () {
    return axios({
      url: '/api/user/list?status=1&pageSize=0',
      method: 'get'
    })
  },
  resource: {
    getUserResourceCodes () {
      const url = `/api/resource/getUserResourceCodes`
      return axios({
        method: 'get',
        url
      })
    }
  },
  user: {
    updateUserInfo (data) {
      const url = `/api/user/updateUserInfo?cellphone=${
        data.cellphone
      }&userId=${data.userId}&nickName=${data.nickName}&email=${
        data.email
      }&employeeId=${data.employeeId}`
      return axios({
        method: 'post',
        url
      })
    }
  },
  psw: {
    updatePsw (data) {
      const url = `/api/user/updatePassword?userId=${data.userId}&oldPassword=${
        data.oldPassword
      }&newPassword=${data.newPassword}`
      return axios({
        method: 'post',
        url
      })
    }
  },
  apply: {
    getList () {
      return axios.get('/api/audit/permission/getPermissions', {
        // isShowLoading: false
      })
    },
    addApply (data, isFormData) {
      if (isFormData) {
        return axios.post('/api/audit/apply/formData', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        return axios.post('/api/audit/apply', data)
      }
    },
    getApplyList (queryType, params) {
      return axios.get('/api/audit/apply/getApplys/' + queryType, { params })
    },
    getDetail (applyId) {
      return axios.get('/api/audit/apply?id=' + applyId)
    },
    approveApply (data) {
      return axios.post('/api/audit/apply/audit', data)
    },
    executeApply (data) {
      return axios.post('/api/audit/apply/execute', data)
    },
    authorization (id) {
      return axios.get('/api/audit/permission?id=' + id)
    },
    getSublicense () {
      return axios.get('/api/audit/sublicense')
    },
    saveSublicense (data) {
      return axios.post('/api/audit/sublicense', data)
    }
  }
}
