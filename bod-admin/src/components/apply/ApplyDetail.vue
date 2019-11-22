<template>
  <div id="apply-info">
    <div class="detailHead">
      <a href="javascript:history.back();">&lt; 返回</a>
    </div>
    <div class="apply-content">
      <el-form class="info-form">
        <div class="content-title">
          基础信息
        </div>
        <ApplyDetailBase :baseInfo="baseInfo" />
        <div class="content-title"
             style="margin: 10px 0;">
          {{title}}进展
        </div>
        <ApplyStep :isReadOnly="detailType!==2"
                   :nodes="nodes"
                   @reload="reload" />
      </el-form>
    </div>
  </div>
</template>
<script>
import ApplyStep from './ApplyStep.vue'
import ApplyDetailBase from './ApplyDetailBase.vue'
import axios from '@/scripts/axios';

import comApi from '@/scripts/api.js'
export default {
  data() {
    return {
      detailType: 1,
      baseInfo: {
        detailShow: {}
      },
      nodes: []
    }
  },
  created() {
    this.detailType = this.$route.params.type * 1
    this.loadDetailData()
  },
  computed: {
    title() {
      return this.detailType === 1 ? '申请' : '审批'
    }
  },
  methods: {
    back() {
      history.back()
    },
    loadDetailData() {
      comApi.apply.getDetail(this.$route.params.id).then(res => {
        let { username, account, created, type, reason } = res
        res.nodes.unshift({
          username,
          account,
          created,
          type,
          reason,
          status: 1,
          isEdge: true,
          icon: '&#xe6c9;'
        })
        // if (res.applyStatus > 2) {
        // 申请状态为 3 4 即 待确认 已确认
        res.nodes.push({
          showExecute: true,
          canExecute: this.detailType === 1 && res.applyStatus === 3,
          applyId: res.id,
          username,
          account,
          applyStatus: res.applyStatus,
          executeTime: res.executeTime,
          reason: res.executeReason,
          status: res.applyStatus === 2 ? null : res.executeStatus,
          content: res.executeStatus ? (res.executeStatus === 1 ? '执行申请' : '取消执行') : '无',
          isEdge: true,
          icon: '&#xe6c8;',
          isWait: res.applyStatus === 3
        })
        // }
        this.nodes = res.nodes
        let currentNode = this.nodes.find(node => res.nodeId === node.id && node.status === 0)
        if (currentNode) currentNode.isWait = true
        this.baseInfo = res
        if (res.detailShow.url) {
          var aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.href = res.detailShow.url
          aLink.click()
        }
        delete this.baseInfo.nodes
      })
    },
    reload() {
      this.loadDetailData()
    }
  },
  components: {
    ApplyStep,
    ApplyDetailBase
  }
}
</script>
<style lang="scss">
#apply-info {
  height: 100%;
  .detailHead {
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #dfe6ec;
    padding-left: 20px;
    font-size: 14px;
    color: #20a0ff;
  }
  .apply-content {
    padding: 10px 30px;
    .content-title {
      line-height: 28px;
      border-bottom: 1px dashed #dedede;
    }
  }
}
</style>

