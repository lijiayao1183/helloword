<template>
  <div id="engine-container" class="container">
    <div class="top-nav-bar">
      <top-navabr></top-navabr>
    </div>
    <div class="main-container"
         v-loading="loading"
         element-loading-text="拼命加载中">
	    <div class="left-nav-bar" v-show="isShowLeftBar">
	      <sz-navbar :permissions="permissions"></sz-navbar>
	    </div>
	    <div class="content-container"
         :class="{'full-width':!isShowLeftBar}">
	      <router-view></router-view>
	    </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@system/components/systemconfig/navbar/Navbar'
import loadingMixin from '@system/mixins/loading.mixin'
import TopNavBar from '@/components/TopNavBar'
import UserApi from '@system/api/systemconfig/usermanage.api'
export default {
  name: 'app',
  data () {
    return {
      isShowLeftBar: this.$route.query.isFromUserName !== 'true',
      permissions: []
    }
  },
  mixins: [loadingMixin],
  components: {
    'sz-navbar': Navbar,
    'top-navabr': TopNavBar
  },
  watch:{
    $route(to,from){
      this.isShowLeftBar = to.query.isFromUserName !== 'true';
    }
  },
  created () {
    UserApi.getPermissions().then(
      res => {
        this.permissions = res
      }
    )
  }
}
</script>

<style lang="scss">
@import "../assets/sass/common/common";
@import "../assets/sass/sys-common/common";
</style>
