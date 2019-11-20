<template>
  <div id="left-tree">
    <div class="left-list-topSearch">
      <el-input placeholder="搜索" v-model="treeNodeKey">
      </el-input>
    </div>
    <div class="list-item-container">
      <el-collapse value="1" accordion @change="collapseChange(rootNodes[0].id)">
        <el-collapse-item name="1" :class="{'active-node':currentNodeId === 0}">
          <template slot="title">
            {{rootNodes[0].name}}
          </template>
          <el-tree :current-node-key="currentNodeIdStr"
                   class="scroll-small"
                   :render-content="renderContent"
                   ref="tree"
                   default-expand-all
                   :data="treeData"
                   :props="treeProps"
                   :filter-node-method="filterNode"
                   :highlight-current="currentNodeId!==0"
                   @node-click="nodeClick">
          </el-tree>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import bus from '../scripts/bus'
import * as _ from 'lodash'

export default {
  props: {
    rootNodes: {
      type: Array,
      default: () => {
        return [{name: '通用xx', id: 0}]
      }
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultNodeId: [Number, String],
    treeProps: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          label: 'name',
          children: 'children'
        }
      }
    }
  },
  created () {
    bus.$on('openId', (data) => {
      this.currentNodeId = data
      this.$emit('node-click', data)
    })
  },
  data () {
    return {
      currentNodeIdStr: '',
      currentTypeIds: '',
      treeNodeKey: '',
      currentNodeId: parseInt(this.defaultNodeId) || 0,
      selectedFiles: [],
      leftFoldNameTitle: '通道分类',
      selectedFileTitle: '已选通道'
    }
  },
  watch: {
    treeNodeKey (val) {
      this.$refs.tree.filter(val)
    },
    currentNodeId () {
      let copyCurrentNodeId = _.cloneDeep(this.currentNodeId)
      this.currentNodeIdStr = copyCurrentNodeId.toString()
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(_.trim(value)) !== -1
    },
    renderContent (createElement, {node, data, store}) {
      return createElement('span', [
        createElement('i', {
          attrs: {class: 'iconfont'},
          domProps: {innerHTML: '&#xe637;'}
        }), createElement('span', {style: {paddingLeft: '10px'}}, node.label)])
    },
    collapseChange (id) {
      this.currentNodeId = id
      this.$emit('node-click', id)
    },
    nodeClick (data) {
      this.currentNodeId = data.id
      this.$emit('node-click', data.id)
    }
  }
}
</script>

<style lang="scss">
  .left-nav-tree #left-tree {
    font-size: 14px;
    height: 100%;
    border-right: 1px solid $split-color;
    .el-dialog.el-dialog--tiny {
      width: 700px;
    }

    .el-collapse {
      box-sizing: border-box;
      height: calc(100% - 39px);
    }
    .el-collapse-item {
      max-height: 100%;
    }
    .active-node {
      .el-collapse-item__header {
        background-color: $two-nav-focus;
      }
    }

    .el-collapse-item__header {
      padding-left: 10px;
      height: 37px;
      line-height: 37px;
      border-bottom: 1px solid $split-color;
    }
    .el-collapse-item__content {
      padding: 0;
      max-height: 100%;
    }

    .el-collapse-item__wrap {
      border: none;
      max-height: calc(100% - 44px);
    }
    .el-tree {
      overflow-y: auto;
      border: none;
      height: 100%;
    }

    .el-input {
      padding-bottom: 3px;
      .el-input__inner {
        height: 37px;
        border-radius: 0px;
        border-width: 0px;
      }

      .el-input__inner:focus {
        outline: 0;
        border-color: #20a0ff;
        border-width: 1px;
      }
    }
    .left-list-topSearch {
      height: 37px;
      border-bottom: 0px solid $split-color;
      margin-bottom: 0px;
      border-left: 1px solid $split-color;
    }
    .list-item-container {
      height: calc(100%);
      border: 1px solid $split-color;
      border-right: none;
      box-sizing: border-box;
      .el-collapse {
        border: 0px;
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }
</style>
