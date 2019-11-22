<template>
	<el-dialog id="select-tree-dialog"
	             :title="title"
	             :visible="visible"
	             :show-close=false>
		  <div id="left-select-tree">
		    <el-form :inline="false" class="dialog-edit-content">
			  <el-form-item>
				<el-input v-model="treeNodeKey" placeholder="请输入关键字"></el-input>
			  </el-form-item>
			</el-form>
		    <el-collapse value="1" accordion>
		      <div @click="clickRoot(rootNodes[0])">
			      <el-collapse-item :title="rootNodes[0].name" name="1">
			        <el-tree node-key="id"
			                 class="scroll-small"
			                 :current-node-key="currentNodeKey"
			                 :render-content="renderContent"
			                 ref="selectTree"
			                 default-expand-all
			                 :data="treeData"
			                 :props="treeProps"
			                 :filter-node-method="filterNode"
			                 :highlight-current="true"
			                 @node-click="handleNodeClick">
			        </el-tree>
			      </el-collapse-item>
		      </div>
		    </el-collapse>
		  </div>
		  <div slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="move()">移动</el-button>
		    <el-button @click="cancel">取消</el-button>
		  </div>
	 </el-dialog>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: '移动'
      },
      visible: {
        type: Boolean,
        default: false
      },
      refreshType: {
        type: String,
        default: 'rule'
      },
      rootNodes: {
        type: Array,
        default: () => {
          return [{name: '通用规则', id: 0}];
        }
      },
      treeData: {
        type: Array,
        default: () => {
          return [];
        }
      },
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
    data() {
      return {
        treeNodeKey : '',
        moveToNode : null,
        currentNodeKey: "",
        treeNodeMap:{}
      }
    },
    watch: {
      treeNodeKey(val) {
        this.$refs.selectTree.filter(val);
      }
    },
    created(){
    //this.refreshType
    },
    methods: {
      cancel(){
      	this.$emit('cancel');
      },
      move(){
        _.forEach(this.$refs.selectTree.data, (item)=> {
          	this.treeNodeMap[item.id] =  item.parentId;
          	this.getNodeMap(item);
		});

		let roots = [];
		roots = this.getRootMap(this.moveToNode.id, roots);

      	if(null == this.moveToNode){
      		this.$message.error('请选择节点');
      	}else if(true){
      		this.$emit('ok', this.moveToNode, roots);
      	}
      },
      clickRoot(root){
        this.currentNodeKey = "";
      	this.moveToNode = root;
      },
      handleNodeClick(data){
      	this.moveToNode = data;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data[this.treeProps.label].indexOf(_.trim(value)) !== -1;
      },
      renderContent(createElement, {node, data, store}) {
        return createElement('span', [
          createElement('i', {
            attrs: {class: 'iconfont',},
            domProps: {innerHTML: '&#xe637;'}
          }), createElement('span', {style: {paddingLeft: '10px'}}, node.label)]);
      },
      getNodeMap(data){
        if(data.children){
        	_.forEach(data.children, (item) => {
			  if(item.parentId){
	          	this.treeNodeMap[item.id] =  item.parentId;
	          	this.getNodeMap(item);
	          }
			});
        }
      },
      getRootMap(id, roots){
        let p = this.treeNodeMap[id];
        if(p){
          roots.push(p);console.dir(roots);
          roots = this.getRootMap(p, roots);
        }
        return roots;
      }
    }
  }
</script>
<style lang="scss">
  #left-select-tree {
    height: 100%;
    .el-input {
      padding-bottom: 3px;
    }
    .el-collapse {
      box-sizing: border-box;
      height: calc(100% - 39px);

    }
    .el-collapse-item {
      max-height: 100%;
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
  }
</style>
