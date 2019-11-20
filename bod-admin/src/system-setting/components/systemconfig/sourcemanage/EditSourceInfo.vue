<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>资源配置</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('source')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom">
        <el-form label-width="80px" :model="source" ref="source" :rules="sourceRules">
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="资源编号" prop="code">
	              <el-input v-model="source.code" ></el-input>
	            </el-form-item>
	          </el-col>

	          <el-col :span="7">
	            <el-form-item label="资源名" prop="name">
	               <el-input v-model="source.name" ></el-input>
	            </el-form-item>
	          </el-col>
	       </el-row>
	       <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="访问路径" prop="url">
	               <el-input v-model="source.url" ></el-input>
	            </el-form-item>
	          </el-col>
	        </el-row>

	        <div class="userTitle">父类资源</div>
	        <el-row>
	        	<common-tree
		          :data="tree.treeData"
		          :treeRef="tree.treeRef"
		          @checkChange="checkChange"
		          :defaultProps="tree.defaultProps"
		          :checkedKeys="tree.checkedKeys"
		          :node="tree.node"
		          :filter="tree.filter"
		          :checkStrictly="checkStrictly">
		        </common-tree>
	          <div class="text-danger text-center" v-if="!this.tree.checkedKeys.length">
	        请至少选择一个节点
	          </div>
	        </el-row>
	    </el-form>
    </div>
  </div>
</template>
<script>
import SourcesApi from '@system/api/systemconfig/sourcemanage.api'
import UtilsMock from '@system/mock/utils.mock'
import SourceMock from '@system/mock/sourcemanage.mock'
import CommonTree from '@system/components/systemconfig/common/CommonTree'
export default {
  data () {
    return {
      backPath: '/source_manage',
      source: {
        resourceId: null,
        parentId: null,
        code: '',
        name: '',
        userId: '',
        url: '',
        des: '',
        birth: '',
        icon: '',
        status: 1
      },
      checkStrictly: true,
      sourceRules: {},
      companies: [],
      tree: {
        node: {
          id: 'resourceId',
          parentId: 'parentId'
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        checkedKeys: [],
        treeRef: '',
        filter: {
          radio: true
        }
      },
      nodesPromise: null,
      sourcePromise: null
    }
  },
  methods: {
    quit () {
      this.$router.push(this.backPath)
    },
    checkChange (ref) {
      this.tree.checkedKeys = [ref]
    },
    // 保存验证操作
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.tree.checkedKeys.length) {
          this.doneSaveOrUpdate()
        }
      })
    },
    doneSaveOrUpdate () {
      let payload = Object.assign({}, this.source)
      payload.parentId = this.tree.checkedKeys[0]
      if (!this.source.resourceId) {
        delete payload.resourceId
        SourcesApi.saveSource(payload).then(
          (data) => {
            this.afterSuccessSave(data)
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      } else {
        SourcesApi.updateSource(payload).then(
          (data) => {
            this.afterSuccessSave()
          }, (error) => {
            this.afterFailSave(error)
          }
        )
      }
    },
    afterSuccessSave (data) {
      if (data.code > 0) {
        this.$message('资源保存成功')
      } else {
        this.$message(data.msg)
      }

      this.$router.push(this.backPath)
    },
    afterFailSave (err) {
      console.log(err)
      this.$message('资源保存失败')
    }
  },
  created () {
    // 根据路由信息赋值roleId
    this.source.resourceId = this.$route.params.id !== 'add' ? this.$route.params.id : ''
    this.tree.treeRef = UtilsMock.randomString(10)
    this.sourceRules = SourceMock.sourceRules()
    // let self = this
    this.sourcePromise = SourcesApi.getSourceNodes().then(
      (data) => {
        let tempData = Object.assign([], data)
        this.tree.treeData = [{name: '系统', resourceId: 0, children: tempData}]
        // UtilsMock.traverseTree(this.tree.treeData, 'isCheck', 'resourceId', 'children', this.tree.checkedKeys)
        // console.log(this.tree.checkedKeys)
      }
    )
    if (this.source.resourceId) {
      this.nodesPromise = SourcesApi.getSourceById(this.source.resourceId).then(
        (data) => {
          this.source = data
          this.tree.checkedKeys = [this.source.parentId]
        }, (err) => {
          console.log(err)
        }
      )
      Promise.all([this.sourcePromise, this.nodesPromise]).then(
        (res) => {
          this.tree.checkedKeys = [this.source.parentId]
        }
      )
    }
  },
  components: {
    'common-tree': CommonTree
  }
}
</script>
<style lang="scss" scoped>
.userTitle {
    line-height: 36px;
    border-bottom: 1px dashed #dedede;
    margin-bottom: 15px;
}
.el-dialog__footer {
    text-align: center;
}
</style>
