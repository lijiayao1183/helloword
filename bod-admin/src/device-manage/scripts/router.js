import Vue from 'vue'
import Router from 'vue-router'

const ChannelInfo = resolve => require(['../channel-manage/ChannelInfo.vue'], resolve)
const ChannelListInfo = resolve => require(['../channel-manage/components/ListInfo.vue'], resolve)
const ChannelEditInfo = resolve => require(['../channel-manage/components/EditInfo.vue'], resolve)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/channel-manage'
    },
    {
      path: '/channel-manage',
      name: 'channel-manage',
      component: ChannelInfo,
      children: [
        {
          path: '',
          name:'list-info',
          redirect: 'list-info/0',
        },
        {
          path: 'list-info/:catalogId',
          name: 'channel-list-info',
          component: ChannelListInfo
        },
        {
          path: 'edit-info/:catalogId/:id',
          name: 'channel-edit-info',
          component: ChannelEditInfo
        }
      ]
    } 
  ]
})

export default router
