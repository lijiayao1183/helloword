<template>
  <el-tooltip :disabled="disabledTip" :content="value">
    <span ref="span" :key="uniqId">{{value}}</span>
  </el-tooltip>
</template>
<script>
  const uuid = require('node-uuid')
  export default {
    name: 'text-overflow',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        uniqId: uuid.v1(),
        disabledTip: true
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.update()
      })
    },
    methods: {
      update () {
        let span = this.$refs.span
        this.disabledTip = span.offsetWidth >= span.scrollWidth
      }
    },
    updated () {
      this.$nextTick(() => {
        this.update()
      })
    }
  }
</script>
<style lang="scss" scoped>
  span {
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    text-align: center;
  }
</style>
