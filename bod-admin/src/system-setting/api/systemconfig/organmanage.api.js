import axios from 'axios'

class OrgansManageApi {
  getOrgans (url) {
    return axios({
      method: 'get',
      url
    })
  }
  deleteSingleOrgan (organId) {
    return axios({
      method: 'delete',
      url: '/api/organ',
      data: organId,
      headers: {'content-type': 'application/json'}
    })
  }
  saveOrgan (organ) {
    return axios({
      url: '/api/organ',
      method: 'post',
      data: organ
    })
  }
  updateOrgan (organ) {
    return axios({
      url: '/api/organ',
      method: 'put',
      data: organ
    })
  }
  getOrganById (organId) {
    return axios({
      url: '/api/organ/' + organId,
      method: 'get'
    })
  }
  patchChangeOrgansStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }
  patchDeleteOrganStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }
  isHasRole (organId) {
    return axios({
      url: '/api/organ/isHasRole?organId=' + organId,
      method: 'get'
    })
  }
  isHasOrganCode (code, organId) {
    return axios({
      url: '/api/organ/isHasOrgan?code=' + code + '&organId=' + organId,
      method: 'get'
    })
  }
  exitName (name, organId) {
    return axios({
      url: '/api/organ/exitName?name=' + name + '&organId=' + organId,
      method: 'get'
    })
  }
  exitCode (code, organId) {
    return axios({
      url: `/api/organ/isHasOrgan?code=${code}&organId=${organId}`,
      method: 'get'
    })
  }
}
export default new OrgansManageApi()
