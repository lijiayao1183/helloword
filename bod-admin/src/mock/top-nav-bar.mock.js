import * as _ from 'lodash'
import myLocalStorage from '../scripts/my-local-storage'
import ModuleName from '../scripts/module-name'

let url = require('../scripts/url')

let topNavData = [
  {
    path: `${url.rootPath}/html/monitor-live.html`,
    name: '监控预警',
    code: 'monitorLive'
  },
  {
    path: `${url.rootPath}/html/device-manage.html`,
    name: '通道配置',
    code: 'deviceManage'
  },
  {
    path: `${url.rootPath}/html/system-setting.html`,
    name: '系统配置',
    code: 'systemConfiguration'
  }
]

export default (() => {
  let resourceCodes = myLocalStorage.getItem(ModuleName.SYSTEM.MODULE_NAME, ModuleName.SYSTEM.RESOURCES_CODES)
  if (_.isNull(resourceCodes) || resourceCodes.length === 0) {
    window.location.href = url.login.path
    return
  }

  return _.filter(topNavData, item => {
    return resourceCodes.indexOf(item.code) > -1
  })
})()
