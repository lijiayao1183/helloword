import axios from '../../../scripts/axios'

export default {
	getList (params, pageSize=10, pageNo=1) {
	  const url = `/api/monitor/channel/list?channelId=${params.channelId}&searchKey=${params.keyword}&pageSize=${pageSize}&pageNo=${pageNo}`
	  return axios({
	    method: 'get',
	    url
	  })
	},
	getType() {
	  const url = `/api/alert/rule/type`
	  return axios({
	    method: 'get',
	    url
	  })
	},
	detail (alertId) {
	  const url = `/api/alert/rule/detail/${alertId}`
	  return axios({
	    method: 'get',
	    url
	  })
	},
	log (alertId) {
	  const url = `/api/alert/optlog/query/${alertId}`
	  return axios({
	    method: 'get',
	    url
	  })
	},
	recordList (params, pageSize=10, pageNo=1) {
	  const url = `/api/alert/list?channelId=${params.channelId}&startTime=${params.startTime}&endTime=${params.endTime}&pageSize=${pageSize}&pageNo=${pageNo}`
	  return axios({
	    method: 'get',
	    url
	  })
	},
	save (data) {
	  const url = `/api/alert/rule/save`
	  return axios({
	    method: 'post',
	    url,
	    data
	  })
	},
	update (data, reset) {
	  const url = `/api/alert/rule/update?reset=${reset}`
	  return axios({
	    method: 'put',
	    url,
	    data
	  })
	},
	updateStatus (status, alertId) { 
	  const url = `/api/alert/rule/${status}/${alertId}`
	  return axios({
	    method: 'put',
	    url
	  })
	},
	deleteAlert (status, alertId) {
	  const url = `/api/alert/rule/delete/${alertId}`
	  return axios({
	    method: 'delete',
	    url
	  })
	},
	userList(){
		const url = `/api/alert/rule/user/list`
		  return axios({
		    method: 'get',
		    url
		})
	},
	field(){
		const url = `/api/field/unpage`
		  return axios({
		    method: 'get',
		    url
		})
	},
	ifAlertNameExist(ruleName){
		const url = `/api/alert/rule/name?keyword=${ruleName}`
		  return axios({
		    method: 'get',
		    url
		})
	},
	sendTestMsg(data){
      const url = `/api/alert/rule/sendTestMsg`
	  return axios({
	    method: 'post',
	    url,
	    data
	  })
	}
}
