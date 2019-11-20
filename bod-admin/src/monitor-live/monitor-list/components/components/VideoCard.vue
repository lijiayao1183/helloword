<template>
  <div class="card"
    @mouseenter="isShowActionBtn=true"
    @mouseleave="isShowActionBtn=false">
    <template v-if="title">
	    <videoPlayer ref="videoPlayer" :key="index" :playsinline="true" :options="playerOptions"  autoplay="autoplay" class="vjs-custom-skin videoPlayer" ></videoPlayer>
	    <span class="action-container" v-show="isShowActionBtn && title">
	      <span style="margin-left:20px;">{{title}}</span>
	    </span>
    </template>
    <template v-else>
      <!-- <img :src="imgUrl" class="videoBg" :style="{height: playerHeight+'px'}"></img> -->
      <div class="videoBg"><span>暂无视频</span></div>
    </template>
  </div>
</template>
<script>
import  videojs from 'video.js'
import 'video.js/dist/video-js.css'
import {videoPlayer} from 'vue-video-player'
import 'videojs-flash'
let imgUrl = require('../../../assets/img/shuzunta_home.png')

export default {
  props: {
    playerHeight: {
      type: Number,
      default: 300
    },
    playerOptions: {
      type: Object,
      default: {
        height: this.playerHeight,
        notSupportedMessage: '不支持的视频格格式',
        poster: imgUrl,
        sources: [],
        techOrder: ['flash'],
        autoplay: true,
        controls: true
      }
    },
    index: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    videoPlayer
  },
  data () {
    return {
      isShowActionBtn: false,
      imgUrl: imgUrl
    }
  },
  watch: {
    playerHeight () {
      if (this.$refs.videoPlayer && this.$refs.videoPlayer.player) {
        this.playerOptions.height = this.playerHeight
        this.$refs.videoPlayer.player.height(this.playerHeight)
        this.$refs.videoPlayer.player.language('zh-CN')
      }
    },
    playerOptions: {
      deep: true,
      handler: function () {
        if (this.$refs.videoPlayer && this.$refs.videoPlayer.palyer) {
          this.$refs.videoPlayer.player.load()
          this.$refs.videoPlayer.player.height(this.playerHeight)
          this.$refs.videoPlayer.player.language('zh-CN')
        }
      }
    }
  }
}
</script>
<style lang="scss">
   .video-js .vjs-volume-panel{
      position: absolute;
      right: 0.5em;
    }
</style>
<style lang="scss" scoped>
  .action-container{
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #f9f9f926;
    width: 100%;
    color: white;
  }
  .card {
    background-color: #8c8c8c;
    position: relative;
    margin-top: 5px;
  }
  .videoBg {
    width:100%;
    height:100%;
    display: table;
    text-align: center;
    line-height: 30px;
    color: #fefefe;
    font-size: 15px;

    span{
      line-height: normal;
      display: table-cell;
      vertical-align: middle;
    }
  }
</style>
