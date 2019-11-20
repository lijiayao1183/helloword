import api from '../scripts/api.js'
import applyOptions from '../components/apply/apply-option.mock.js'
export default {
  data () {
    return {
      applyList: null
    }
  },
  methods: {
    /**
     * 申请类型-type
     *1: 新建引擎
     *2: 复制引擎
     *3: 删除引擎
     *4: 生成快照
     *5: 版本删除
     *6: 快照部署
     *7: 快照下线
     *8: 快照导入
     *9: 快照导出
     *10: 快照删除
     * @param {Number} type 申请类型
     * @param {Object} data 提交数据
     * @param {Boolean} isFormData 是否formData格式的提交数据
     * @returns {Promise} 返回值
     */
    $_addApply (type, data, isFormData) {
      let text = applyOptions.type[type]
      data.type = type
      let content = {}
      for (let key in data) {
        if (key !== 'reason' && key !== 'nodes' && key !== 'type') {
          content[key] = data[key]
        }
      }
      data.content = JSON.stringify(content)
      let postData = data
      if (isFormData) {
        let formData = new FormData()
        for (let key in data) {
          if (key === 'nodes') {
            formData.append(key, JSON.stringify(data[key]))
          } else {
            formData.append(key, data[key])
          }
        }
        postData = formData
      }
      let promise = api.apply.addApply(postData, isFormData)
      let typeText = data.nodes ? '申请' : ''
      promise
        .then(res => {
          this.$message.success(text + typeText + '成功')
        })
        .catch(err => {
          this.$message.warning(
            text + typeText + '失败：' + err.response.data.error.message
          )
        })
      return promise
    },
    $_loadApplyList (type) {
      api.apply
        .getList()
        .then(res => {
          this.applyList = res
        })
        .catch(() => {
          this.applyList = null
          this.$message.warning('审批人员加载失败,请重试')
        })
    }
  }
}
