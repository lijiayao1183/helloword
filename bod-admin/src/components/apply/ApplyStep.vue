<template>
  <div>
    <el-steps space="20%"
              v-for="(nodes,index) in nodeList"
              :key="index">
      <el-step v-for="(node,i) in nodes"
               :key="i"
               :class="{
                 'is-select': node.nodeLevel===selectNodeIndex,
                 'is-success': node.status===1,
                 'is-reject': node.status===2||node.status===4,
                 'is-wait': node.isWait,
                 'is-icon': node.isEdge
               }">
        <span class="step-action"
              slot="icon"
              @click="stepClick(node)"
              @dblclick="stepDblClick(node)"
              :class="node.isEdge?'iconfont':''"
              :style="node.nodeLevel?'':'left:1px'"
              v-html="node.isEdge?node.icon:node.nodeLevel"></span>
        <!-- node.showExecute?'执行': -->
        <span v-if="node.type"
              slot="title">申请人：已提交</span>
        <span v-else-if="node.showExecute"
              slot="title">申请人：{{node.applyStatus===4?'已确认':'待确认'}}</span>
        <span v-else
              slot="title">{{`${node.name||`审批人${node.nodeLevel-1}级`}：${nodeStatus[node.status]}`}}</span>
        <div v-if="node.type"
             slot="description">
          <div>{{formatDate(node.created)}}</div>
          <div>申请人：{{node.account+'('+node.username+')'}}</div>
          <div>操作内容：{{typeOptions[node.type]}}</div>
          <div>申请原因：{{node.reason||'无'}}</div>
        </div>
        <div v-else-if="node.results&&node.results.length"
             slot="description">
          <div v-for="(des,dIndex) in node.results"
               :key="dIndex"
               :class="{'node-description':dIndex}">
            <div>{{formatDate(des.created)}}</div>
            <div>审批人：{{des.account+'('+des.username+')'}}</div>
            <div>操作内容：{{des.content||'无'}}</div>
            <div>{{getDesText(des.status)}}原因：{{des.reason||'无'}}</div>
          </div>
        </div>
        <div v-else-if="node.showExecute"
             slot="description">
          <template v-if="node.applyStatus===4">
            <div>{{formatDate(node.executeTime)}}</div>
            <div>申请人：{{node.account+'('+node.username+')'}}</div>
            <div>操作内容：{{node.content}}</div>
            <div>{{node.status === 1 ? '执行' : '取消'}}原因：{{node.reason||'无'}}</div>
          </template>
        </div>
        <div v-else
             slot="description">
          <div>审批人：{{node.account+'('+node.username+')'}}</div>
        </div>
      </el-step>
    </el-steps>
    <!-- 我的审批和我的申请可执行申请时显示 -->
    <el-dialog v-if="!isReadOnly||isExecute"
               title="流程节点操作"
               :visible="visible"
               size="tiny"
               :before-close="handleClose"
               :show-close="false">
      <el-form :model="formData"
               ref="form">
        <template v-if="isExecute">
          <el-form-item>
            <el-radio-group v-model="formData.status"
                            @change="changeExecuteStatus">
              <el-radio v-for="status in executeStatusList"
                        :key="status.label"
                        :label="status.label">{{status.text}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reason"
                        :label="executeLabel+'原因'"
                        :rules="[
                                  {required: formData.status===2,message:'原因不能为空', trigger:'blur'},
                                  {max: 200, message: '不能超过200个字符', trigger: 'blur'}
                                ]">
            <el-input type="textarea"
                      v-model.trim="formData.reason"
                      :rows="3"
                      placeholder="请输入原因" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item>
            <el-radio-group v-model="formData.status"
                            @change="changeStatus">
              <el-radio v-for="status in statusList"
                        :key="status.label"
                        :label="status.label">{{status.text}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.status===1"
                        class="edit-item"
                        prop="authorizationId"
                        label="接受转授权人"
                        :rules="[
                          {required: true,message:'接受转授权人不能为空'}
                        ]">
            <el-select filterable
                       v-model="formData.authorizationId"
                       class="full-width-btn">
              <el-option v-for="user in users"
                         :key="user.userId"
                         :value="user.userId"
                         :label="user.account+'('+user.nickName+')'" />
            </el-select>
          </el-form-item>
          <el-form-item prop="reason"
                        :label="label+'原因'"
                        :rules="[
                                  {required: formData.status===3,message:'原因不能为空', trigger:'blur'},
                                  {max: 300, message: '不能超过300个字符', trigger: 'blur'}
                                ]">
            <el-input type="textarea"
                      v-model.trim="formData.reason"
                      :rows="3"
                      placeholder="请输入原因" />
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   v-loading="saving"
                   @click="save">确定</el-button>
        <el-button @click="visible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import applyOption from './apply-option.mock.js'
import DateUtil from '@/scripts/date-utils'

import comApi from '@/scripts/api.js'

import comBus from '../../scripts/bus.js'
export default {
  props: {
    /**
     * 是否只读
     */
    isReadOnly: {
      type: Boolean,
      default: false
    },
    nodes: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      nodeStatus: applyOption.nodeStatus,
      statusList: [
        { label: 2, text: '通过' },
        { label: 3, text: '拒绝' },
        { label: 1, text: '转授权' }
      ],
      executeStatusList: [
        { label: 1, text: '执行申请' },
        { label: 2, text: '取消申请' }
      ],
      typeOptions: applyOption.type,
      selectNodeIndex: '',
      users: null,
      formData: {
        status: 2
      },
      currentNodeId: '',
      visible: false,
      saving: false,
      isExecute: false
    }
  },
  computed: {
    nodeList () {
      let arr = []
      let index = this.nodes.findIndex(node => node.isWait)
      if (index > -1) {
        this.nodes[index].isWait = true
        this.currentNodeId = this.nodes[index].permissionId
      }
      this.nodes.forEach((node, i) => {
        node.nodeLevel = i
        if (!(i % 5)) {
          arr.push(this.nodes.slice(i, i + 5))
        }
      })
      return arr
    },
    label () {
      return this.statusList.find(status => status.label === this.formData.status).text
    },
    executeLabel () {
      return this.executeStatusList.find(status => status.label === this.formData.status).text
    }
  },
  methods: {
    formatDate (date) {
      return DateUtil.formate(date)
    },
    getDesText (status) {
      if (status === 4) {
        return '终止'
      } else {
        return this.statusList.find(s => s.label === status).text
      }
    },
    stepDblClick (node) {
      if (!this.isReadOnly && node.isWait && node.canAudit) {
        // 审批
        this.isExecute = false
        this.formData = {
          id: node.applyId,
          status: 2
        }
        this.visible = true
        this.saving = false
      } else if (node.showExecute && node.canExecute) {
        // 执行
        this.isExecute = true
        this.formData = {
          id: node.applyId,
          status: 1
        }
        this.visible = true
        this.saving = false
      }
    },
    stepClick (node) {
      if (!this.isReadOnly || node.showExecute) {
        this.selectNodeIndex = node.nodeLevel
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
          this.cancel()
        })
    },
    changeStatus (status) {
      this.$refs.form.validateField('reason')
      if (status === 1 && !this.users) {
        this.loadUsers(this.currentNodeId)
      }
    },
    changeExecuteStatus () {
      this.$refs.form.validateField('reason')
    },
    loadUsers () {
      comApi.apply.authorization(this.currentNodeId).then(res => {
        this.users = res.userInfos
        // if (!this.users.length) {
        //   this.$message.error('接受转授权人员为空,不能转授权')
        // }
      }).catch(err => {
        this.users = null
        this.$message.error('接受转授权人员获取失败')
      })
    },
    save () {
      this.$refs.form.validate(valide => {
        if (valide) {
          let text = ''
          let promise = null
          this.saving = true
          if (this.isExecute) {
            promise = comApi.apply.executeApply(this.formData)
            text = this.executeLabel + '失败'
          } else {
            promise = comApi.apply.approveApply(this.formData)
            text = this.label + '失败'
          }
          promise.then(res => {
            this.saving = this.visible = false
            this.selectNodeIndex = ''
            // if (this.isExecute) {

            // } else if (this.formData.status === 1) {
            //   // 转授权

            // }
            comBus.$emit('applyNumChange')
            this.$emit('reload')
          }).catch(err => {
            this.saving = false
            this.$message.error(text)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.step-action {
  cursor: pointer;
}
.el-step__description {
  div {
    line-height: 20px;
  }
}
.node-description {
  margin-top: 10px;
}
</style>
