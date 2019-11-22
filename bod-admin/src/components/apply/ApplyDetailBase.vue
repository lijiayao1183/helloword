<template>
  <el-row>
    <el-col :span="12">
      <el-form-item label="申请单ID：">{{baseInfo.id}}</el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请时间：">{{formatDate(baseInfo.created)}}</el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请类型：">{{typeOption[baseInfo.type]}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.targetEngineCode">
      <el-form-item label="引擎编码：">{{baseInfo.detailShow.targetEngineCode}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.targetEngineName">
      <el-form-item label="引擎名称：">{{baseInfo.detailShow.targetEngineName}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.sourceVersionName">
      <el-form-item label="引擎版本：">{{baseInfo.detailShow.sourceVersionName}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.targetVersionName && baseInfo.type==5">
      <el-form-item label="删除版本：">{{baseInfo.detailShow.targetVersionName}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.targetVersionName && baseInfo.type!=5">
      <el-form-item label="快照名称：">{{baseInfo.detailShow.targetVersionName}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.targetVersionDesc!=null && baseInfo.type!=5">
      <el-form-item label="快照描述：">{{baseInfo.detailShow.targetVersionDesc==''?'无':baseInfo.detailShow.targetVersionDesc}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.datacenterName">
      <el-form-item label="接口名称：">{{baseInfo.detailShow.datacenterName}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.sourceEngineCode">
      <el-form-item label="原引擎编码：">{{baseInfo.detailShow.sourceEngineCode}}</el-form-item>
    </el-col>
    <el-col :span="12"
            v-if="baseInfo.detailShow.sourceEngineName">
      <el-form-item label="原引擎名称：">{{baseInfo.detailShow.sourceEngineName}}</el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="申请原因：" class="break-all">{{baseInfo.reason==''?'无':baseInfo.reason}}</el-form-item>
    </el-col>
    <el-col :span="12" v-if="baseInfo.detailShow.link!=null">
      <el-form-item label="查看详情：" class="break-all">
        <a href="#" v-click="showMessage" v-if="baseInfo.detailShow.link==''">点击查看</a>
        <a :href="baseInfo.detailShow.link" target="_blank" v-else>点击查看</a>
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script>
import applyOptions from './apply-option.mock.js'
import DateUtil from '@/scripts/date-utils'
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => ({
        detailShow: {}
      })
    }
  },
  data() {
    return {
      typeOption: applyOptions.type
    }
  },
  methods: {
    formatDate(date) {
      return DateUtil.formate(date)
    },
    showMessage(){
      this.$message.warning('权限不足，无法跳转')
    }
  }
}
</script>

