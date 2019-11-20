<template>
  <div id="cascader">
    <el-cascader
      expand-trigger="click"
      change-on-select
      :props="props"
      :options="options"
      :disabled="disabled"
      :model="selectPath"
      @change="handleChange">
    </el-cascader>
  </div>
</template>
<script>
import generalApi from '../field-manage/general-field/scripts/api'
import fieldApi from '../engine-manage/field/scripts/api'
import ruleApi from '../engine-manage/rule/scripts/api'
import generalRuleApi from '../common-setting/general-rule/scripts/api'
export default ({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isRule: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      engineId: this.$route.params.engineId,
      isHaiguan: this.$root.$data.isHaiguan,
      options: [],
      props: {
        value: 'id',
        label: this.isRule ? 'name' : 'fieldType',
        children: 'children'
      },
      selectPath: [],
      treeEngineFieldData: [],
      treeFieldData: [],
      engineRuleData: [],
      ruleData: []
    }
  },
  computed: {

  },
  created () {
    this.formatOption(this.engineId, false)
  },
  methods: {
    handleChange (value) { // Trigger when type path change
      this.selectPath = value
      this.$emit('valueChange', value)
    },
    formatTypeData (TypeData) {
      if (TypeData.length > 0) {
        for (var i = 0; i < TypeData.length; i++) {
          if (TypeData[i].children.length > 0) {
            this.formatTypeData(TypeData[i].children)
          } else {
            delete TypeData[i].children
          }
        }
      }
    },
    formatOption (engineId, isOutput) {
      if (engineId) {
        if (this.isRule) {
          ruleApi.knowledgeTree.get(engineId).then((data) => {
            this.engineRuleData = data
            this.formatTypeData(this.engineRuleData)
            this.options = [
              {id: 0, name: '全部'},
              {id: 1, name: '通用规则', children: this.ruleData},
              {id: 2, name: '自定义规则', children: this.engineRuleData}
            ]
          })
          ruleApi.knowledgeTree.get(engineId = '').then((data) => {
            this.ruleData = data
            this.formatTypeData(this.ruleData)
            this.options = [
              {id: 0, name: '全部'},
              {id: 1, name: '通用规则', children: this.ruleData},
              {id: 2, name: '自定义规则', children: this.engineRuleData}
            ]
          })
        } else {
          fieldApi.fieldTree.commonTree(engineId).then((data) => {
            this.treeFieldData = data[0].children
            this.treeEngineFieldData = data[1].children
            this.formatTypeData(this.treeFieldData)
            this.formatTypeData(this.treeEngineFieldData)
            this.options = [
              {id: 0, fieldType: '全部'},
              {id: 1, fieldType: '通用字段', children: this.treeFieldData}
            ]
            if (this.isHaiguan) {
            } else {
              this.options.push(
                {id: 2, fieldType: '自定义字段', children: this.treeEngineFieldData}
              )
            }
          }).catch((res) => {

          })
        }
      } else {
        if (this.isRule) {
          ruleApi.knowledgeTree.get(engineId = '').then((data) => {
            this.ruleData = data
            this.formatTypeData(this.ruleData)
            this.options = [{id: 0, name: '全部'}, {id: 1, name: '通用字段', children: this.ruleData}]
          })
        } else {
          fieldApi.fieldTree.commonTree().then((data) => {
            this.formatTypeData(data[0].children)
            data[0].id = 1
            this.options = [{id: 0, fieldType: '全部'},
              {id: 1, fieldType: '通用字段', children: data[0].children}]
          })
        }
      }
    }
  }
})
</script>
<style lang="scss">
  #cascader{
    display: inline-block;
    .el-cascader__label{
      line-height: 25px;
    }
  }
</style>
