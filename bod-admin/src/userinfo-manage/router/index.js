import Vue from 'vue'
import Router from 'vue-router'
import EditUserinfo from '../components/EditUserinfo.vue'
import EditPassword from '../components/EditPassword.vue'
import ApprovalList from '../components/ApprovalList.vue'
import ApplicationList from '../components/ApplicationList.vue'
import ApplyDetail from '@/components/apply/ApplyDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/userinfo_edit'
    },
    {
      path: '/userinfo_edit',
      component: EditUserinfo,
      name: 'userinfo_edit'
    },
    {
      path: '/userPassword_edit',
      component: EditPassword,
      name: 'userPassword_edit'
    },
    {
      path: '/myApplication',
      component: ApplicationList,
      name: 'myApplication'
    },
    {
      path: '/myApproval',
      component: ApprovalList,
      name: 'myApproval'
    },
    {
      path: '/applyDetail/:type/:id',
      component: ApplyDetail,
      name: 'applyDetail'
    }
  ]
})
