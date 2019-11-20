<template>
  <div id="export-fields-rules">
    <el-dialog
      :title="exportTitle"
      :visible.sync="exportDialogVisible"
      size="tiny"
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <!--content-->
      <div class="detailTitle">
        <span>{{detailTitle}}</span>
      </div>
      <div class="exportArea">
        <div class="exportLeft">
          <div class="foldName">
            {{leftFoldNameTitle}}
          </div>
          <div class="foldNodetree">
            <tree-customer
              :data="typeData"
              show-checkbox
              :check-strictly="true"
              @node-click="currentChange"
              @check-change="getCheckedKeys"
              node-key="id"
              ref="tree"
              :props="treeProps">
            </tree-customer>
          </div>
        </div>
        <div class="exportMid">
          <div class="transform"><i style="font-size: 40px" class="iconfont">&#xe64f;</i></div>
        </div>
        <div class="exportRight">
          <div class="selectedFileTitle">{{selectedFileTitle}}</div>
          <div class="selectedFile">
            <template v-for="(item,index) in selectedFiles">
              <div class="selectdItem">
                <el-tooltip :disabled="item.label.length<=15" class="item" effect="dark" :content="item.label" placement="top">
                <span>{{formatStrTooLang(item.label)}}</span>
                </el-tooltip>
              </div>
            </template>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
      <div class="check-all">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div>
    <el-button @click="exportCancel">取 消</el-button>
    <el-button type="primary" :disabled="exportDisabled" @click="exportSure">导 出</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import { ElTreeCustomer } from '../plugins/components/treeCustomer'

export default ({
  props: {
    exportTitle: {
      type: String,
      default: ''
    },
    leftFoldNameTitle: {
      type: String,
      default: ''
    },
    exportDisabled: {
      type: Boolean,
      default: true
    },
    selectedFileTitle: {
      type: String,
      default: ''
    },
    typeData: {
      type: Array,
      default: []
    },
    treeProps: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          label: 'fieldType',
          children: 'children'
        }
      }
    },
    detailTitle: {
      type: String,
      default: ''
    },
    selectedFiles: {
      type: Array,
      default: []
    },
    exportDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      treeNodes: 0,
      oldSelect: []
    }
  },
  created () {
  },
  components: {
    'tree-customer': ElTreeCustomer
  },
  watch: {
	    oldSelect: {
      handler (newValue, oldValue) {
	        if (newValue.join(',') !== oldValue.join(',')) {
	         const $tree = this.$refs.tree
	         let data = $tree.getCheckedKeys()
	         this.getAllNodes(this.typeData, this.treeNodes = 0)
	         if (data.length < this.treeNodes) {
	          this.checkAll = false
	         } else {
	          this.checkAll = true
	         }

	　　　　　　    this.$emit('getCheckedKeys', newValue)
	        }
      },
      deep: true
	　　   }
  },
  methods: {
    handleCheckAllChange (event) {
      let cls = this.$refs.tree.$data.root.data
      let that = this
      _.forEach(cls, function (item, index) {
        that.$refs.tree.setChecked(item, that.checkAll, true)
      })
      this.currentChange()
    },
    currentChange () {
      const $tree = this.$refs.tree
      let data = $tree.getCheckedKeys()
      this.getAllNodes(this.typeData, this.treeNodes = 0)
      if (data.length < this.treeNodes) {
        this.checkAll = false
      } else {
        this.checkAll = true
      }
      this.oldSelect = data
    },
    getCheckedKeys (nodeData, checked, chilChecked) {
      if (checked) {
        this.$refs.tree.setChecked(nodeData, checked, true)
      }
      this.currentChange()
    },
    getAllNodes (typeData) {
      _.each(typeData, item => {
        if (!_.isEmpty(item)) {
          this.treeNodes++
        }
        this.getAllNodes(item.children)
      })
    },
    formatStrTooLang (strValue) {
      let tmpStr = ''
      if (strValue.length > 15) {
        tmpStr = strValue.slice(0, 14) + '...'
      } else {
        tmpStr = strValue
      }
      return tmpStr
    },
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('exportCancel')
        })
        .catch(_ => {})
    },
    exportCancel () {
      this.$emit('exportCancel')
    },
    exportSure () {
      this.$emit('exportSure')
    }
  }
})
</script>
<style lang="scss">
  #export-fields-rules {
    .el-dialog.el-dialog--tiny {
      width: 700px;
      .check-all {
        text-align: left;
        margin-left: 27px;
        margin-top: -15px;
      }
    }
    .detailTitle {
      margin-bottom: 10px;
    }
    .foldNodetree{
      max-height: 355px;
      overflow-y: auto;
      .el-tree{
        border: none;
      }
    }
    .selectedFile{
      max-height: 384px;
      overflow-y: auto;
    }
    .selectdItem {
      text-align: center;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid rgba(228, 228, 228, 1);
    }
    .exportArea {
      width: 100%;
      overflow: hidden;
      .foldName, .selectedFileTitle {
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background: rgba(228, 228, 228, 1);
        color: rgba(77, 77, 77, 1);
      }
      /*.selectedFileTitle{*/
      /*width: 100%;*/
      /*height: 30px;*/
      /*text-align: center;*/
      /*line-height: 30px;*/
      /*background: rgba(228,228,228,1);*/
      /*color: rgba(77,77,77,1);*/
      /*}*/
      .exportLeft, .exportRight {
        width: 250px;
        border: 1px solid rgba(228, 228, 228, 1);
      }
    }
    .exportArea > div {
      float: left;
      height: 384px;
    }
    .exportMid {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      .transform {
        float: left;
        transform: rotate(90deg);
        -ms-transform: rotate(90deg); /* Internet Explorer */
        -moz-transform: rotate(90deg); /* Firefox */
        -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
        -o-transform: rotate(90deg); /* Opera */
      }
    }
  }
</style>
