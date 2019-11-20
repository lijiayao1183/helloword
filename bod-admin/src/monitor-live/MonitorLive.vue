<template lang="pug">
  div#app
    div.top-nav-bar
      top-nav-bar
    div.content-container
      router-view
</template>
<script>
import * as _ from 'lodash'
import TopNavBar from '../components/TopNavBar.vue'

export default {
  name: 'app',
  components: {
    'top-nav-bar': TopNavBar
  }
}
</script>
<style lang="scss">
  @import '../assets/sass/common/common.scss';
  .el-pagination__jump input{
    height: 28px
  }
  $bgcolor: #f4f4f4;
  $padding-space: 10px;
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 14px;
    background-color: $bgcolor;
    width: 100%;
    min-height: 813px;
    min-width: 1000px;
    float: left;
    .content-container {
      padding: $padding-space;
      width: 100%;
      height: calc(100% - 85px);
      min-height: 768px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .is-stop{
	  color: #97a8be;
	}
  }

$inputorcolor:  rgb(191, 191, 191)!important;
textarea::-webkit-input-placeholder{
    color: $inputorcolor;
}
textarea:-moz-placeholder{
    color: $inputorcolor;
}
textarea::-moz-placeholder{
    color: $inputorcolor;
}
textarea:-ms-input-placeholder{
    color: $inputorcolor;
}

.el-checkbox__label {
    color: $inputorcolor;
}
.arrow_box {
    position: relative;
    border: 1px solid #c2e1f5;
    -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
.arrow_box:before,
.arrow_box:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border: solid transparent;
    pointer-events: none;
    content: "";
    border-color: rgba(136, 183, 213, 0);
}
.arrow_box.rright:before {
    border-left-color: #aaa;
    border-width: #aaa;
    top: 38%;
    left: 100%;
}

.arrow_box.rright:after {
    border-left-color: #c5c5c5;
    border-width: 10px;
    top: 41%;
    left: 100%;
}
</style>
