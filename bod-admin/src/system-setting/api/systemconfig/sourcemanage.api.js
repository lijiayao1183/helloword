import axios from 'axios'
class SourceManageApi {
    getSources (url) {
        return axios({
            method: 'get',
            url
        })
    }
    deleteSingleSource (resourceId) {
        return axios({
            method: 'delete',
            url: '/api/resource',
            data: resourceId,
            headers: {'content-type': 'application/json'}
        })
    }
    saveSource (resource) {
        return axios({
            url: '/api/resource',
            method: 'post',
            data: resource
        })
    }
    updateSource (user) {
        return axios({
            url: '/api/resource',
            method: 'put',
            data: user
        })
    }
    getSourceById (resourceId) {
        return axios({
            url: '/api/resource/' + resourceId,
            method: 'get'
        })
    }
    patchDeleteSourcesStatus (ids) {
        return axios({
            url: '/api/resource/batchRemove?ids=' + ids,
            method: 'put'
        })
    }
    getSourceNodes () {
        return axios({
            url: '/api/resource/getResourceTree?parentId=0',
            method: 'get'
        })
    }
}
export default new SourceManageApi()
