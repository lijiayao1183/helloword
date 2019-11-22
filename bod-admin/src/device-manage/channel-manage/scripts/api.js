import axios from '../../../scripts/axios'

export default {
  catalogTree: {
    getAllTree(parentId = 0){
      const url = `/api/catalogTree?parentId=${parentId}&status=1`
      return axios({
        method:'get',
        url
      })
    },
    get(parentId = 0) {
      const url = `/api/catalogTree?parentId=${parentId}&status=1`
      return axios({
        method: 'get',
        url
      })
    },
    post (data) {
      const url = '/api/catalogTree'
      return axios({
        method: 'post',
        url: url,
        data: data
      })
    },
    put (data) {
      const url = '/api/catalogTree'
      return axios({
        method: 'put',
        url: url,
        data: data
      })
    },
    batchRemoveTree (ids) {
      const url = `/api/catalogTree/batchRemoveTree?ids=${ids}`
      return axios({
        method: 'put',
        url
      })
    },
    batchMove (ids, catalogId) {
      const url = `/api/catalogTree/batchMove?ids=${ids}&parentId=${catalogId}`
      return axios({
        method: 'put',
        url
      })
    }
  },
  channel: {
    getList (catalogId, keyword, pageSize=10, pageNo=1) {
	  const url = `/api/monitor/channel/list?catalogId=${catalogId}&keyword=${keyword}&pageSize=${pageSize}&pageNo=${pageNo}`
	  return axios({
	    method: 'get',
	    url
	  })
	},
    batchDelete (ids) {
      const url = `/api/monitor/channel/delete/${ids}`
      return axios({
        method: 'delete',
        url
      })
    },
    batchUpdateStatus (ids, status) {
      let url = `/api/monitor/channel/active/${ids}?status=${status}`
      if( 0 == status) {
    	  url = `/api/monitor/channel/disActive/${ids}?status=${status}`
      }
      return axios({
        method: 'put',
        url
      })
    },
    batchMove (ids, catalogId) {
      const url = `/api/monitor/channel/batchMove?ids=${ids}&catalogId=${catalogId}`
      return axios({
        method: 'put',
        url
      })
    }, 
    save (data) {
  	  const url = `/api/monitor/channel/save`
  	  return axios({
  	    method: 'post',
  	    url,
  	    data
  	  })
  	},
  	update (data) {
	  const url = `/api/monitor/channel/update`
	  return axios({
	    method: 'post',
	    url,
	    data
	  })
	},
	ifChannelNameExist(name){
		const url = `/api/monitor/channel/name?keyword=${name}`
		  return axios({
		    method: 'get',
		    url
		})
	},
	detail (channelId) {
	  const url = `/api/monitor/channel/detail/${channelId}`
	  return axios({
	    method: 'get',
	    url
	  })
	}
  }
}
