<template>
  <el-form :model="formData"
           label-position="top"
           inline-message
           ref="form">
    <el-form-item v-if="applyList&&applyList.length"
                  label="申请原因"
                  prop="reason"
                  :rules="[
        {max: 300, message: '不能超过300个字符', trigger: 'blur'}
      ]">
      <el-input type="textarea"
                :rows="2"
                v-model.trim="formData.reason"
                placeholder="请输入申请原因" />
    </el-form-item>
    <!-- <template v-if="validateModel==='default'"> -->
    <el-form-item v-for="item in applyList"
                  :key="item.id"
                  :label="item.name"
                  :prop="'applyLevel'+item.id"
                  :rules="[
                    {required: true, message: item.name+'审批人不能为空'}
                  ]">
      <el-select v-model="formData['applyLevel'+item.id]"
                 filterable
                 class="full-width-btn">
        <el-option v-for="user in item.userInfos"
                   :key="user.userId"
                   :label="user.account+'('+user.nickName+')'"
                   :value="user.userId" />
      </el-select>
    </el-form-item>
    <!-- </template> -->
    <!-- <template v-else>
      <el-form-item v-for="(item,index) in applyList"
                    :key="index"
                    :label="item.name"
                    class="is-required no-margin-bottom"
                    :class="{'is-error':errors.has('applyLevel'+(index+1))}">
        <el-tooltip :disabled="!errors.has('applyLevel'+(index+1))"
                    :content="item.name+'审批人不能为空'"
                    placement="top">
          <el-select v-model="applyForm['applyLevel'+item.id]"
                     :name="'applyLevel'+item.id"
                     v-validate="'required'"
                     filterable
                     class="full-width-btn">
            <el-option v-for="user in item.userInfos"
                       :key="user.userId"
                       :label="user.account+'('+user.nickName+')'"
                       :value="user.userId" />
          </el-select>
        </el-tooltip>
      </el-form-item>
    </template> -->
    <!-- <div v-if="!applyList"
         class="apply-box">审批人员加载失败,请刷新页面</div> -->
  </el-form>
</template>
<script>
export default {
  props: {
    /**
     * 需要申请的form表单对象
     */
    applyForm: {
      type: Object,
      required: true
    },
    /**
     * default element自带
     * vee vee-validate
     */
    // validateModel: {
    //   type: String,
    //   default: 'default'
    // },
    /**
     * 是否显示该表单
     */
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    /**
     * 审批人员列表
     */
    applyList() {
      return this.$root.applyList
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        if (!this.applyList) {
          this.$root.$_loadApplyList()
        }
      } else {
        this.formData = {}
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    validate() {
      let validate = true
      if (this.applyList && this.applyList.length) {
        validate = false
        // if (this.validateModel === 'default') {
        this.$refs.form.validate(val => {
          validate = val
        })
        // } else {
        //   this.$validator.validateAll().then(val => {
        //     validate = val
        //   })
        // }
        if (validate) {
          this.applyForm.nodes = []
          for (var key in this.formData) {
            if (key !== 'reason') {
              let permissionId = key.slice(10) * 1
              let flowNode = this.applyList.find(node => node.id === permissionId)
              this.applyForm.nodes.push({
                permissionId,
                level: flowNode.level,
                userId: this.formData[key]
              })
            }
          }
          this.applyForm.reason = this.formData.reason || ''
        }
      }
      return validate
    },
    resetForm() {
      this.formData = {}
    }
  },
  mounted() {
    if (!this.applyList) {
      this.$root.$_loadApplyList()
    }
  }
}
</script>

