<template lang="pug">
  div.c-resources-dialog_content
    el-row
        el-button(@click="back") 返回
    div.c-resources-names
        label.title 操作名称:
        span {{logger.opName}}
    div.c-resources-names
        label.title 操作人员名称:
        span {{logger.opUserId}}
    div.c-resources-names
        label.title IP:
        span {{logger.ip}}
    div.c-resources-names
        label.title 请求路径:
        span {{logger.requestPath}}
    div.c-resources-names
        label.title 请求参数：
        span {{logger.requestParam}}
    div.c-resources-names
        label.title 响应参数：
        span {{logger.name}}
</template>
<script>
import LoggerApi from '@system/api/systemconfig/loggermanage.api'

export default {
  data () {
      return {
        logger: {
            id: '',
            organId: '',
            name: '',
            opUserId: '',
            ip: '',
            requestParam: '',
            responseParam: '',
            requestPath: '',
            startTime: '',
            endTime: ''
        }
      }
  },
  methods: {
      back () {
          this.$router.push('/logger_manage')
      }
  },
  created () {
      this.logger.id = this.$route.params.id
      LoggerApi.getLoggerById(this.logger.id).then(
          (res) => {
              this.logger = res
              this.$message('日志加载成功')
          }, (err) => {
              console.log(err)
              this.$message('日志加载失败')
          }
      )
  }
}
</script>
<style lang="scss" scoped>
.c-resources-dialog_content {
    width: 100%;
    overflow: auto;
    height: 100%;
}
.c-resources-names {
    padding-left: 20px;
    font-weight: 100;
    width: 500px;
    line-height: 40px;
    font-size: 14px;
    color: #777777;
}
label.title {
    font-size: 100;
}
</style>
