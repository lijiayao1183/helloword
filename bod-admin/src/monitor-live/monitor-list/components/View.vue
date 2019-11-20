<template>
  <el-row class="alarm-list">
    <div class="alarm-list-content"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <div class="left-nav-tree" ref="contentLeft" :style="{height: maxHeight}">
        <div class="btn-create">
          <DeviceLeftTree ref="leftTree" :treeData="treeData" :treeProps="treeProps" @checkNodesChange="checkNodesChange"></DeviceLeftTree>
        </div>
      </div>
      <div class="content-center" ref="contentCenter">
        <el-row :gutter="10">
          <el-col :span="24">
            <button-group-selection v-if="childClassifyBtnNames.length > 0"
              :btnNumber=4
              :names="childClassifyBtnNames"
              :selectName="currentChildClassify"
              @selectChange="switchChildClassify"
              style="float:left;width: 360px;">
            </button-group-selection>
            <el-button style="float:right;" @click="isShowFull=true"><text-overflow value="全屏"></text-overflow></el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="top:-5px;">
          <el-col :span="videoSpan" v-for="(item,index) in videoList">
            <VideoCard :ref="'videoDiv'+ index" :style="{height: playerHeight+'px'}" :playerHeight="playerHeight" :title="item.channelName" :index="item.index" :playerOptions="item.playerOptions" >
			</VideoCard>
          </el-col>
        </el-row>
      </div>
      <div class="content-right" ref="contentRight" :style="{height: maxHeight}">
        <alarm-log :data="currentRecord" @more="getMore" :showMore="data && data.length>0"></alarm-log>
      </div>
    </div>

    <el-dialog title="视频报警" v-if="isShowFull"
      size="full"  class="full_video"
      :visible.sync="isShowFull"  :before-close="handleClose"
      >
       <el-row :gutter="2" style="top:0px;">
          <el-col :span="videoSpan" v-for="(item,index) in videoList">
            <VideoCard :ref="'videoDivDialog'+ index" :style="{height: playerHeight+'px'}" :playerHeight="playerHeight" :title="item.channelName" :index="item.index" :playerOptions="item.playerOptions" >
			</VideoCard>
          </el-col>
        </el-row>
    </el-dialog>
  </el-row>
</template>
<script>
import api from '../scripts/api'
import MyLocalStorage from '../../../scripts/my-local-storage'
import ModuleName from '../../../scripts/module-name'
import DateUtils from '../../../scripts/date-utils'
import * as _ from 'lodash'
import Logger from '../../../components/Logger.vue'
import TextOverflow from '../../../components/TextOverflow.vue'
import ButtonGroupSelection from '../../../components/ButtonGroupSelection.vue'
import AlarmLog from './components/AlarmLog.vue'
import VideoCard from './components/VideoCard.vue'
import DeviceLeftTree from './components/DeviceLeftTree.vue'
import AlarmSuspend from './components/AlarmSuspend.vue'
import ResponseUtils from '../../../scripts/response-utils'
import { mapGetters, mapActions } from 'vuex'

// 安装并引入相关模块
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let imgUrl = require('../../assets/img/shuzunta_home.png')
const isDebug = false
export default {
  data () {
    return {
      videoOption: {
        language: 'zh-CN',
        controls: true,
        muted: false,
        preload: 'auto',
        height: this.playerHeight,
        videoHeight: this.playerHeight,
        notSupportedMessage: '不支持的视频格式',
        poster: this.imgUrl,
        sources: [],
        techOrder: ['flash', 'html5'],
        autoplay: true,
        controlBar: {
			  'playToggle': false,
			  'currentTimeDisplay': false,
          'timeDivider': false,
          'progressControl': false,
	          'durationDisplay': false,
	          'remainingTimeDisplay': false,
	          volumePanel: {
			    inline: false // 默认是true,横着的
			  }
        }
      },
      videoIdMap: {},
      videoIdOldMap: {},
      videoCountMap: {'单屏': 1, '四分屏': 4, '九分屏': 9, '十六分屏': 16},
      childClassifyBtnNames: ['单屏', '四分屏', '九分屏', '十六分屏'],
      currentChildClassify: '四分屏',
      searchKey: '',
      treeData: [],
      treeProps: {
        id: 'id',
        label: 'channelName',
        children: 'children'
      },
      videoList: [],
      videoColCount: 0,
      playerHeight: 300,
      currentRecord: [],
      data: [],
      timeout: '',
      shotTop: 0 + 'px',
      shotLeft: 0 + 'px',
      maxHeight: '0px',
      imgUrl: imgUrl,
      isShowFull: false
    }
  },
  components: {
    'button-group-selection': ButtonGroupSelection,
    'text-overflow': TextOverflow,
    'logger': Logger,
    'alarm-log': AlarmLog,
    'alarm-suspend': AlarmSuspend,
    DeviceLeftTree,
    VideoCard
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      search: 'alarmManageList'
    }),
    queryParams () {
      	return {
      	  keyword: encodeURIComponent(this.searchKey)
      	}
    },
    videoSpan () {
      return this.videoColCount == 1 ? 24 : (this.videoColCount == 4 ? 12 : (this.videoColCount == 9 ? 8 : (this.videoColCount == 16 ? 6 : 24)))
    }
  },
  created () {
    this.videoColCount = this.videoCountMap[this.currentChildClassify]
    if (!isDebug) {
      this.loadData()
    }
  },
  beforeDestroy () {
    let that = this
    _.forEach(this.videoList, function (item) {
      if (that.$refs['videoDiv' + item.index]) {
        let videoDiv = that.$refs['videoDiv' + item.index][0].$refs.videoPlayer
      	  if (videoDiv && videoDiv.player) {
      		videoDiv.player.dispose()
      	  }
      	}
    })
  },
  destroyed () {
    clearTimeout(this.timeout)
    this.timeout = ''
  },
  watch: {
  },
  mounted () {
    this.initData()
    this.initWebSocket()
  },
  updated () {
    if (this.$refs.contentCenter) {
      this.maxHeight = this.$refs.contentCenter.clientHeight + 'px'
      this.playerHeight = this.$refs.contentCenter.clientWidth / 24 * this.videoSpan - 10
    }
  },
  methods: {
    ...mapActions({
    }),
    initWebSocket () {
      this.connection()
    },
    connection () {
      let that = this
      // 建立连接对象
	    this.socket = new SockJS('/webSocketServer')// 连接服务端提供的通信接口，连接以后才可以订阅广播消息和个人消息
	    // 获取STOMP子协议的客户端对象
	    this.stompClient = Stomp.over(this.socket)
      // 向服务器发起websocket连接
	    this.stompClient.connect({}, (frame) => {
	      that.stompClient.subscribe('/topic/getResponse', function (respnose) {
          console.dir(respnose.body)
        })
        let role = MyLocalStorage.getItem(ModuleName.USER_INFO.MODULE_NAME, ModuleName.USER_INFO.ACC_INFO)
        that.stompClient.subscribe('/user/' + role + '/msg', function (respnose) {
          console.dir(respnose.body)
        })
	    }, (err) => {
	      console.dir(err)
	    })
    },
    handleClose () {
      let that = this
      _.forEach(this.videoList, function (item) {
        let videoDiv = that.$refs['videoDivDialog' + item.index][0].$refs.videoPlayer
      	  if (videoDiv && videoDiv.player) {
      		videoDiv.player.dispose()
      	  }
      })
    },
    initVideoDiv () {
      let that = this
      this.playerHeight = this.$refs.contentCenter.clientWidth / 24 * this.videoSpan - 10

      let list = _.cloneDeep(this.videoList)
      let len = list.length
      let leave = this.videoColCount - len
      if (leave > 0) {
        for (let i = 0; i < leave; i++) {
          let info = {
	          	keyId: 0,
	          	channelName: '',
		        playerOptions: _.cloneDeep(this.videoOption)
          }
          info.playerOptions.height = this.playerHeight
          info.playerOptions.videoHeight = this.playerHeight

          list.push(info)
        }
      } else if (leave < 0) {
        list = _.reject(list, {keyId: 0})
        list = _.slice(list, 0, this.videoColCount)
        leave = this.videoColCount - list.length
        if (leave > 0) {
	          for (let i = 0; i < leave; i++) {
	            let info = {
		          	keyId: 0,
		          	channelName: '',
			        playerOptions: _.cloneDeep(this.videoOption)
            }
            info.playerOptions.height = this.playerHeight
	            info.playerOptions.videoHeight = this.playerHeight

	            list.push(info)
	          }
	      }

        this.$refs.leftTree.$refs.tree.setCheckedKeys(_.map(list, 'keyId'))
      }

      _.forEach(list, function (item) {
        item.playerOptions.height = that.playerHeight
        item.playerOptions.videoHeight = that.playerHeight
      })

      this.videoList = list
    },
    switchChildClassify (name) {
      this.currentChildClassify = name
      this.videoColCount = this.videoCountMap[this.currentChildClassify]
      this.initVideoDiv()
    },
    initData () {
      this.initVideoDiv()
    },
    loadData () {
      clearTimeout(this.timeout)
	    if (this && !this._isDestroyed) { // _isDestroyed
	        api.getList(this.queryParams, 1000, 1).then(res => {
	            this.data = res.data.list
	            this.treeData = _.cloneDeep(this.data)
	        }).catch(error => {

	        })
      } else {
        clearTimeout(this.timeout)
        this.timeout = ''
      }
    },
    checkNodesChange (params) {
      let that = this
      if (params.checked) {
        let noneIndex = _.findIndex(this.videoList, {keyId: 0})
        if (noneIndex >= 0) {
          let info = this.videoList[noneIndex]
          info.keyId = params.data.id
          info.channelName = params.data.channelName
          info.height = that.playerHeight
          info.playerOptions.height = that.playerHeight
          info.playerOptions.videoHeight = that.playerHeight
          info.playerOptions.sources = [{
            	type: params.data.channelType,
            	src: params.data.channelDest
          }]
          this.videoList[noneIndex] = info
        } else {
          this.$notify.info({
	          title: '消息',
	          message: '区域已满'
	        })

	        this.$refs.leftTree.$refs.tree.setChecked(params.data.id, false, false)
        }
      } else {
        let index = _.findIndex(this.videoList, {keyId: params.data.id})
        if (index >= 0) {
          // this.$refs['videoDiv'+index][0].$refs.videoPlayer.player.pause()

          this.videoList[index].keyId = 0
          this.videoList[index].channelName = ''
          let opt = _.cloneDeep(this.videoOption)
          opt.height = this.playerHeight
          opt.videoHeight = this.playerHeight
	        this.videoList[index].playerOptions = opt
        }
      }
    },
    getMore () {
      event.cancelBubble = true

      this.$router.push({
	    	name: 'log-list'
	    })
    }
  }
}
</script>
<style lang="scss">
.full_video .el-dialog .el-dialog--full .dialog__body{
  padding: 2px;
}
</style>
<style lang="scss" scoped>
  $alarm-top-height: 34px;
  $margin-space: 20px;
  $content-right-width: 250px;
  .is-stop{
	  color: #97a8be;
  }

  .alarm-list {
    height: 100%;
    width: 100%;
    .alarm-list-top {
      height: $alarm-top-height;
      line-height: $alarm-top-height;
      margin-bottom: $margin-space;
      & > * {
        margin-left: 10px;
      }
      .el-button {
        width: 130px;
      }
    }
    .alarm-list-content {
      padding: 0px;
      height: 100% ;
      width: 100%;
      .content-left {
        width: 300px;
        float: left;
        box-sizing: border-box;
        position: relative;
      }
      .content-center {
        width: calc(80% - 270px);
        margin-left: 10px;
        float: left;
        box-sizing: border-box;
        position: relative;
        .card {
		    border: 1px solid #ededed;
		    position: relative;
		    margin-top: 6px;
		    .action-container{
		      height: 30px;
		      position: absolute;
		      left: 0;
		      top: 0;
		      background-color: #5685;
		      width: 100%;
		      line-height: 30px;
		      font-size: 18px;
		      color: #fefefe;
		      padding-left: 10px;
		    }
		}
      }
      .content-right {
        width: $content-right-width;
        box-sizing: border-box;
        float: right;
      }
    }
  }

  .el-dropdown-menu {
    .el-button {
      width: 100%;
    }
  }

</style>
