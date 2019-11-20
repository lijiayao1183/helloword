<template>
  <div class="container">
    <div class="top-nav-bar">
      <top-nav-bar></top-nav-bar>
    </div>
    <div class="main-container"
         v-loading="loading"
         element-loading-text="拼命加载中">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import TopNavBar from '../components/TopNavBar.vue'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  },
  methods: {},
  components: {
    'top-nav-bar': TopNavBar
  }
}
</script>
<style lang="scss">
  @import "../assets/sass/common/common";
</style>
