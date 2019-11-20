import * as _ from 'lodash'
import myLocalStorage from '../../scripts/my-local-storage'
import ModuleName from '../../scripts/module-name'

const leftNavData = [
  {
    path: '/user_manage',
    name: '用户管理',
    icon: 'user-magage',
    code: 'userManager'
  },
  {
    path: '/role_manage',
    name: '角色管理',
    icon: 'role-magage',
    code: 'roleManager'
  },
  {
    path: '/organ_manage',
    name: '组织管理',
    icon: 'organ-magage',
    code: 'organManager'
  },
  {
    path: '/logger_manage',
    name: '日志管理',
    icon: 'logger-magage',
    code: 'loggerManager'
  },
  {
    path: '/interface_manage',
    name: '接口配置管理',
    icon: 'user-magage',
    code: 'interfaceManager'
  },
  {
    path: '/permission_manage',
    name: '审批权限管理',
    icon: 'permission-magage',
    code: 'permissionManager'
  },
  {
    path: '/approvalLog_manage',
    name: '审批日志',
    icon: 'approvalLog-manage',
    code: 'approvalLogManager'
  }
]

export default (() => {
  let resourceCodes = myLocalStorage.getItem(ModuleName.SYSTEM.MODULE_NAME, ModuleName.SYSTEM.RESOURCES_CODES)
  return _.filter(leftNavData, item => {
    return resourceCodes.indexOf(item.code) > -1
  })
})()
