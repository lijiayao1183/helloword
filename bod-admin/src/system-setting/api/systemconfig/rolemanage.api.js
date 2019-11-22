import axios from 'axios'

class RolesManageApi {
  getRoles (url) {
    return axios({
      method: 'get',
      url
    })
  }

  deleteSingleRole (roleId) {
    return axios({
      method: 'delete',
      url: '/api/role',
      data: roleId,
      headers: {'content-type': 'application/json'}
    })
  }

  saveRole (user) {
    return axios({
      url: '/api/role',
      method: 'post',
      data: user
    })
  }

  updateRole (user) {
    return axios({
      url: '/api/role',
      method: 'put',
      data: user
    })
  }

  getRoleById (roleId) {
    return axios({
      url: '/api/role/' + roleId,
      method: 'get'
    })
  }

  patchChangeRolesStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }

  patchDeleteRolesStatus (url) {
    return axios({
      url,
      method: 'put'
    })
  }

  getRolePermissions (roleId) {
    return axios({
      url: '/api/role/' + roleId + '/resources?parentId=0',
      method: 'get'
    })
  }

  putRoleResource (data) {
    return axios({
      url: '/api/role/addRoleResourceRel?ids=' + data.ids + '&roleId=' + data.roleId,
      method: 'put'
    })
  }
  getUserinfo(){
    return axios({
      url:'/api/user/getCurrentUser',
      method:'get'
    })
  }
  getResourceList (roleId) {
    const url = `/api/role/getResourceList?roleId=${roleId}`
    return axios({
      url,
      method: 'get'
    })
  }

  addRoleResource (roleId, ids, serviceName) {
    const url = `/api/role/addRoleResource?roleId=${roleId}&ids=${ids}&serviceName=${serviceName}`
    return axios({
      url,
      method: 'get'
    })
  }


  checkRoleNameExist (organId, roleName ,roleId) {
    const url = `/api/role/isHasRole?organId=${organId}&roleName=${roleName}&roleId=${roleId}`
    return axios({
      method: 'get',
      url
    })
  }

  isHasManagerRole (organId) {
    return axios({
      url: '/api/role/isHasManagerRole?organId=' + organId,
      method: 'get'
    })
  }

  isHasUser (roleId) {
    return axios({
      url: '/api/role/isHasUser?roleIds=' + roleId,
      method: 'get'
    })
  }
}

export default new RolesManageApi()
