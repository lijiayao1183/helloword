<template>
  <div class="no-data-page">
    <div>
      <i class="iconfont">&#xe604;</i>
      <div style="position:relative;bottom: 30px;text-align: center">暂无数据</div>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="scss" scoped>
  .no-data-page {
    height: 100%;
    width: 100%;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #676767;
    i {
      font-size: 200px;
      color: #aaaaaa;
    }
  }
</style>
