import axios from 'axios'

class PermissionManageApi {
    getData () {
      let url = '/api/audit/permission/getPermissions'
      return axios({
          method: 'get',
          url
      })
    }
    getUsers () {
      let url = '/api/user/list?pageSize=0&pageNo=0&status=1'
      return axios({
        method: 'get',
        url
      })
    }
    saveData (data) {
      let url = '/api/audit/permission'
      return axios({
        method: 'post',
        data,
        url
      })
    }
    editData (data) {
      let url = '/api/audit/permission'
      return axios({
        method: 'put',
        data,
        url
      })
    }
    deleteData (id) {
      let url = `/api/audit/permission?id=${id}`
      return axios({
        method: 'delete',
        url
      })
    }
}
export default new PermissionManageApi()
