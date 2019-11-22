<template>
  <ApplyList :queryType="2">
    <el-button slot="trigger"
               type="primary"
               class="trigger"
               @click="transfer">转授权设置</el-button>
    <el-dialog title="默认转授权"
               size="tiny"
               :show-close="false"
               :visible="dialogShow">
      <el-form :model=transferForm
               ref="transferForm">
        <el-form-item label="是否转授权">
          <el-radio-group v-model="transferForm.isSublicense">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="transferForm.isSublicense">
          <el-form-item v-for="item in applyList"
                        :key="item.id"
                        :label="item.name"
                        :prop="'applyLevel'+item.id">
            <el-select v-model="transferForm['applyLevel'+item.id]"
                       filterable
                       clearable>
              <!-- <el-option label="请选择权限账户"
                         value="" /> -->
              <el-option v-for="user in item.userInfos"
                         :key="user.userId"
                         :label="user.account+'('+user.nickName+')'"
                         :value="user.userId" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="saveForm">确 定</el-button>
        <el-button @click="dialogShow=false">取 消</el-button>
      </div>
    </el-dialog>
  </ApplyList>
</template>
<script>
// 审批列表
import ApplyList from '@/components/apply/ApplyList.vue'
import comApi from '@/scripts/api.js'
export default {
  data() {
    return {
      dialogShow: false,
      applyList: [],
      transferForm: {
        isSublicense: 0
      }
    }
  },
  methods: {
    saveForm() {
      let nodes = []
      let isSublicense = this.transferForm.isSublicense
      for (let key in this.transferForm) {
        //将转授权账户的改动存入nodes中,一旦改动,不论是否转授权,信息都需要保存提交给后台
        if (key != 'isSublicense' && this.transferForm[key]) {
          let auditId = key.slice(10) * 1
          nodes.push({
            auditId,
            authId: this.transferForm[key],
            isSublicense,
          })
        }
      }
      //是否转授权:是
      if (isSublicense) {
        if (nodes.length) {
          this.doneSave(nodes)
        } else {
          this.$message.warning("请至少转授权一项")
        }
      }
      //是否转授权:否
      else {
        //转授权账户只要发生改动.则nodes中就会提交isSublicense: 0,
        //所以需要判断 避免提交两份isSublicense: 0,
        if (!nodes.length) {
          nodes.push({
            isSublicense: 0
          })
        }
        this.doneSave(nodes)
      }
    },
    transfer() {
      comApi.apply.getSublicense().then((res) => {
        if (res.nodes.length) {
          this.dialogShow = true
          this.applyList = res.nodes
          //设置回显
          this.transferForm.isSublicense = res.isSublicense
          res.nodes.forEach(item => {
            this.$set(this.transferForm, 'applyLevel' + item.id, item.authId)
            // this.transferForm['applyLevel' + item.id] = item.authId
          })
        } else {
          this.$message.warning("当前账户没有审批权限,无法进行转授权")
        }
      }).catch(() => {
        this.$message.warning("获取转授权信息失败")
      })
    },
    doneSave(nodes) {
      comApi.apply.saveSublicense(nodes).then(() => {
        this.dialogShow = false
      })
    }
  },
  components: {
    ApplyList
  }
}
</script>
<style lang="scss" scoped>
.el-button.trigger {
  margin-bottom: 20px;
}
</style>

