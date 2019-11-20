import axios from 'axios'

class InterfacesManageApi {
  getOrgans () {
    return axios({
        	url: '/api/interfaceConfig/getOrganList',
      method: 'get'
    })
  }
  getInterfaces (url) {
    return axios({
      method: 'get',
      url
    })
  }
  deleteSingleInterface (interfaceId) {
    return axios({
      method: 'delete',
      url: '/api/interfaceConfig',
      data: interfaceId,
      headers: {'content-type': 'application/json'}
    })
  }
  saveInterface (interfaceInfo) {
    return axios({
      url: '/api/interfaceConfig/',
      method: 'post',
      data: interfaceInfo
    })
  }
  updateInterface (interfaceInfo) {
    return axios({
      url: '/api/interfaceConfig/',
      method: 'put',
      data: interfaceInfo
    })
  }
  getInterfaceById (interfaceId) {
    return axios({
      url: '/api/interfaceConfig/' + interfaceId,
      method: 'get'
    })
  }
  patchChangeInterfacesStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }
  patchDeleteInterfaceStatus (url) {
    return axios({
      url,
      method: 'get'
    })
  }
}
export default new InterfacesManageApi()
