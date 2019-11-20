<template lang="pug">
  div.container.tree-container
    el-input(v-if="filter && filter.show" v-model="filter.text")
    el-tree.filter-tree(:data="computedData"
                        :props="defaultProps"
                        :node-key="node.id"
                        :default-checked-keys="computedDefaultCheckedIds"
                        :current-node-key="currentNodeKey"
                        show-checkbox
                        :check-strictly="checkStrictly"
                        :filter-node-method="filterNode"
                        @check-change="handleCheckChange"
                        @node-click="nodeClick"
                        :ref="treeRef")
</template>
<script>
export default {
  // data: 数据 (require)
  // treeRef: ref (require)
  // defaultProps: 区分节点的唯一id和显示label (require)
  // checkedNodeKeys: 选中的节点id (require)
  // node: 数据中节点id、parentId字段名称 (require)
  // filter: show: 显示搜索框；radio: 是否多选
  props: {
    data: {
      type: Array,
      required: true
    },
    treeRef: {
      type: String,
      required: true
    },
    defaultProps: {
      type: Object,
      required: true
    },
    checkedKeys: {
      type: Array,
      required: true
    },
    node: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      default: function () {
        return { show: false, text: '', radio: false }
      }
    },
    checkStrictly: {
      type: Boolean,
      default: function () {
        return false
      }
    }
  },
  data () {
    return {
      checkedId: '',
      computedCheckedKeys: [],
      currentNodeKey: ''
    }
  },
  computed: {
    computedData () {
      return this.data
    },
    computedCheckedIds () {
      return this.checkedKeys
    },
    /**
     * 筛选后实际选中的节点id
     */
    computedDefaultCheckedIds () {
      this.computedCheckedIds.sort(this.compare)
      let fakeFilterIds = this.computedCheckedIds.map(
        (item, index) => {
          let node = this.getNodeById(this.data, item)
          // 判断父节点是否实际被选中
          if (node && node.children) {
            // let flag = node.children.some(
            //   child => {
            //     if (this.computedCheckedIds.indexOf(child.resourceId) === -1) {
            //       return true
            //     }
            //   }
            // )
            let flag = this.fatherNodeCheck(node)
            if (flag) {
              return 0
            } else {
              return item
            }
          }
        }
      )
      // 去掉填充的卡槽数据 0，得到实际选中的节点id
      let filterIdStr = fakeFilterIds.join(',').replace(/(^0,)|(,0$)/g, '')
      filterIdStr.replace(/,0,/g, ',')
      return filterIdStr.split(',')
    }
  },
  watch: {
    computedData () {
      this.initTreeData(this.computedData)
    }
  },
  methods: {
    fatherNodeCheck (node) {
      if (node.children && node.children.length) {
        return node.children.some(
          child => {
            if (child.children && child.children.length) {
              return this.fatherNodeCheck(child)
            } else {
              return this.computedCheckedIds.indexOf(child.resourceId) === -1
            }
          }
        )
      } else {
        return false
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 根据id获得节点数据
    getNodeById (data, id, idName = 'resourceId') {
      for (let i = 0; i < data.length; i++) {
        if (data[i][idName] === id) {
          return data[i]
        } else if (data[i].children) {
          let deep = this.getNodeById(data[i].children, id, idName)
          if (deep) {
            return deep
          }
        }
      }
    },
    compare (val1, val2) {
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },
    /**
     * 构造树形数据，每个节点数据加上ancestorIds属性，存放其祖先节点id
     */
    initTreeData (data, preAncestors) {
      let treeData = Object.assign([], data)
      data.forEach(
        item => {
          if (!preAncestors) {
            item.ancestorIds = [item.parentId]
          } else {
            item.ancestorIds = Object.assign([], preAncestors)
            item.ancestorIds.push(item.parentId)
          }
          if (item.children) {
            this.initTreeData(item.children, item.ancestorIds)
          }
        }
      )
    },
    handleCheckChange (data, checked, indeterminate) {
      if (this.filter && this.filter.radio && checked) {
        this.checkedId = data.resourceId
        this.$refs[this.treeRef].setCheckedKeys([])
        this.$refs[this.treeRef].setChecked(this.checkedId, true, false)
        this.$emit('checkChange', this.checkedId)
        return
      }
      this.$emit('getCheckedNodeIds', this.filterCheckedNodeIds(this.$refs[this.treeRef].getCheckedNodes()))
    },
    filterCheckedNodeIds (nodes) {
      let tempArr = []
      nodes.forEach(
        item => {
          tempArr.push(item[this.node.id])
          tempArr = tempArr.concat(item.ancestorIds)
        }
      )
      let result = []
      tempArr.forEach(
        item => {
          if (result.indexOf(item) === -1) {
            result.push(item)
          }
        }
      )
      return result
    },
    nodeClick (data, checked, indeterminate) {
      this.checkedId = data.resourceId
    },
    initCheckedValue () {
      this.$refs[this.treeRef].setChecked(this.checkedKeys[0], true, false)
    }
  }
}
</script>
<style lang="scss">
// .tree-container {
//   max-height: 360px;
//   overflow: auto;
//   overflow-x: hidden;
// }
</style>
