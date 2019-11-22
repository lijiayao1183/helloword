<template lang="pug">
  div.sys-left-nav-bar
    el-menu(:router='false', :collapse='false')
      el-menu-item(:index='item.path', @click='clickMenu' v-for='item in computedNavbars' :key="item.path"
      :class="{'is-active':item.path===defaultActive}")
        span.system-navbar(:class="item.icon") {{item.name}}
</template>
<script type="text/babel">
import LeftNavBarMockData from '@system/mock/navbar.mock.js'

export default {
  data() {
    return {
      navbars: LeftNavBarMockData,
      defaultActive: '/'
    }
  },
  props: ['permissions'],
  methods: {
    clickMenu(el) {
      sessionStorage.setItem("organId", -2)
      this.$router.push({ path: el.index })
    },
    transformedNavbars() {
      return this.navbars.map(
        item => {
          let arr = item.path.split(/[\/\_]/g)
          return arr[1] + 'Manager'
        }
      )
    }
  },
  computed: {
    computedNavbars() {
      let resultNavs = []
      if (localStorage && localStorage.getItem('admin_name') && localStorage.getItem('admin_name') === 'admin') {
        resultNavs = this.navbars
      } else if (this.permissions.length) {
        let transformedNavs = this.transformedNavbars()
        resultNavs = this.navbars.filter(
          (item, index) => {
            if (this.permissions.indexOf(transformedNavs[index]) !== -1) {
              return item
            }
          }
        )
      }
      if (resultNavs.length) {
        if (this.$route.path === '/') {
          this.$router.replace(resultNavs[0].path)
          this.defaultActive = resultNavs[0].path
        } else {
          this.defaultActive = this.$route.path
        }
      }
      return resultNavs
    }
  }
}
</script>
<style lang="scss" scoped>
$themeColor: #3e8feb;
.sys-left-nav-bar {
  position: relative;
  height: 100%;
  border: 1px solid #dedede;
  border-top: 0px;
  box-sizing: border-box;
  .el-menu {
    background-color: #fff;
    .el-menu-item {
      height: 37px;
      line-height: 37px;
    }
    .el-menu-item.is-active {
      background-color: #edf7ff;
      .system-navbar {
        color: $themeColor;
      }
    }
    .el-menu-item:hover {
      background-color: #edf7ff;
    }
  }
}

.system-navbar {
  color: #676767;
  &:hover {
    color: $themeColor;
  }
  &:before {
    font-family: "iconfont" !important;
    font-size: 24px;
    margin-right: 15px;
  }
  &.user-magage:before {
    content: "\e675";
  }
  &.role-magage:before {
    content: "\e679";
  }
  &.organ-magage:before {
    content: "\e676";
  }
  &.source-magage:before {
    content: "\e678";
  }
  &.logger-magage:before {
    content: "\e677";
  }
  &.permission-magage:before {
    content: "\e6c5";
  }
  &.approvalLog-manage:before {
    content: "\e6c6";
  }
}
</style>
