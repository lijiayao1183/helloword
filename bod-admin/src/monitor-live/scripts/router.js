import Vue from 'vue'
import Router from 'vue-router'

const MonitorListView = resolve => require(['../monitor-list/components/View.vue'], resolve)
const LogListView = resolve => require(['../monitor-list/components/LogList.vue'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MonitorListView,
      name: 'monitor-list-view'
    }, {
	  path: '/log-list',
	  component: LogListView,
	  name: 'log-list'
    }
  ]
})
