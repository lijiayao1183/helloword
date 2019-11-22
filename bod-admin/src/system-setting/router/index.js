import Vue from 'vue'
import Router from 'vue-router'
import UserDetails from '@system/components/systemconfig/usermanage/UserDetails'
import EditUserInfo from '@system/components/systemconfig/usermanage/EditUserInfo'
import PermissionRoleInfo from '@system/components/systemconfig/rolemanage/PermissionRoleInfo'
import LoggerDetails from '@system/components/systemconfig/loggermanage/LoggerDetails'
import CheckLogger from '@system/components/systemconfig/loggermanage/CheckLogger'
import OrgaDetails from '@system/components/systemconfig/orgamanage/OrganDetails'
import EditOrganInfo from '@system/components/systemconfig/orgamanage/EditOrganInfo'
// import SourceDetails from '@system/components/systemconfig/sourcemanage/SourceDetails'
// import EditSourceInfo from '@system/components/systemconfig/sourcemanage/EditSourceInfo'
import RoleDetails from '@system/components/systemconfig/rolemanage/RoleDetails'
import EditRoleInfo from '@system/components/systemconfig/rolemanage/EditRoleInfo'
import permissionDetails from '@system/components/systemconfig/permissionmanage/permissionDetails'
import editPermissionInfo from '@system/components/systemconfig/permissionmanage/editPermissionInfo'
import logDetails from '@system/components/systemconfig/approvalLog/logDetails'
import ApplyDetail from '@/components/apply/ApplyDetail.vue'

import UserInfo from '@system/components/systemconfig/usermanage/UserInfo'
import InterfaceDetails from '@system/components/systemconfig/interfacemanage/InterfaceDetails'
import EditInterfaceInfo from '@system/components/systemconfig/interfacemanage/EditInterfaceInfo'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   redirect: '/user_manage'
    // },
    {
		path: '/user_info',
	    component: UserInfo,
      name:'displayInfo'
    },
    {
      path: '/user_manage',
      component: UserDetails
    },
    {
      path: '/editUser/:id',
      component: EditUserInfo
    },
    {
      path: '/role_manage',
      component: RoleDetails
    },
    {
      path: '/editRole/:id',
      component: EditRoleInfo
    },
    {
      path: '/permission_manage',
      component: permissionDetails
    },
    {
      path: '/editPermission/:id',
      component: editPermissionInfo
    },
    {
      path: '/approvalLog_manage',
      component: logDetails
    },
    {
      path: '/applyDetail/:type/:id',
      component: ApplyDetail
    },
    {
      path: '/permission/:id',
      component: PermissionRoleInfo
    },
    {
      path: '/logger_manage',
      component: LoggerDetails
    },
    {
      path: '/editLogger/:id',
      component: CheckLogger
    },
    {
      path: '/organ_manage',
      component: OrgaDetails
    },
    {
      path: '/editOrgan/:id',
      component: EditOrganInfo
    },
    // 资源管理-列表
    // {
    //   path: '/source_manage',
    //   component: SourceDetails
    // },
    // 资源管理-详情
    // {
    //   path: '/editSource/:id',
    //   component: EditSourceInfo
    // },
    {
	    path: '/interface_manage',
	    component: InterfaceDetails
	  },
	  {
	    path: '/editInterface/:id',
	    component: EditInterfaceInfo
	  },
  ]
})
