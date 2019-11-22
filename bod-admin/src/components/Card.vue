<template>
  <div class="card">
    <slot name="header" v-if="isShowTitle">
      <div style="border-bottom: 1px solid rgb(237, 237, 237);margin-bottom: 15px">
        <span class="point"></span><h4>{{title}}</h4>
      </div>
    </slot>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      isShowTitle: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '未命名'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .card {
    padding: 20px 25px;
    border: 1px solid #ededed;
    background-color: #FFFFFF;
  }

  .point {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #209FFF;
    margin-top: 6px;
    margin-right: 5px;
    display: inline-block;
  }

  h4, h3 {
    display: inline-block;
    margin-bottom: 15px;
    margin-top: 0px;
    & + * {
      border-top: 1px solid #ededed;;
      padding-top: 20px;
    }
  }
</style>
