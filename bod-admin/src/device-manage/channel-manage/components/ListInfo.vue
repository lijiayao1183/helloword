<template>
  <div id="list-info">
    <one-input-dialog :visible="isShowCatalogEditDialog"
                      :data="newCatalog"
                      fieldName='catalog'
                      :title="catalogEditDialogTitle"
                      label="分组名称"
                      @ok="saveCatalog"
                      @cancel="isShowCatalogEditDialog=false"></one-input-dialog>
    <div class="action-btn-container">
      <div style="margin-left:20px;">
        <el-switch v-if="isEdit"
          v-model="isShowCategory"
          active-text="分组"
          inactive-text="通道"
          active-color="#13ce66"
          inactive-color="#3e8feb"
          @change="reload">
        </el-switch>
        <el-button v-if="isEdit" @click="addCatalog" size="small" type="text"><i class="iconfont">&#xe635;</i>加分组
        </el-button>
        <el-button v-if="isEdit" :disabled="isSelectRootNode" @click="addChannel" size="small" type="text">
          <i class="iconfont" :class="{'icon-disable':isSelectRootNode}">&#xe636;</i>加通道
        </el-button>
        <el-button v-if="isEdit" :disabled="!hasCheckedRows" @click="showMove" size="small" type="text">
          <i class="iconfont" :class="{'icon-disable':!hasCheckedRows}">&#xe64d;</i>移动
        </el-button>
        <el-button v-if="isEdit" :disabled="!hasCheckedRows" @click="batchDelete" size="small" type="text">
          <i class="iconfont" :class="{'icon-disable':!hasCheckedRows}">&#xe632;</i>删除
        </el-button>
        <!--
        <el-button v-if="isEdit" :disabled="isDisableStatusBtn" @click="batchUpdateStatus(1)" size="small" type="text">
          <i class="iconfont" :class="{'icon-disable':isDisableStatusBtn}">&#xe633;</i>启用
        </el-button>
        <el-button v-if="isEdit" :disabled="isDisableStatusBtn" @click="batchUpdateStatus(0)" size="small" type="text">
          <i class="iconfont" :class="{'icon-disable':isDisableStatusBtn}">&#xe634;</i>停用
        </el-button>
        -->
        <div class="right">
            <el-input placeholder="请输入名称或通道代码" v-model="tableRowKey" class="search-btn"
                      @keyup.enter.native="loadChannelData">
              <el-button slot="append" @click="loadChannelData" icon="el-icon-search"></el-button>
            </el-input>
        </div>
      </div>
    </div>
    <div class="field-value-content">
      <el-table ref="table"
                :data="filteredTableData"
                @row-dblclick="openNext"
                @selection-change="rowCheckedChange">
        <el-table-column type="selection" width="37"></el-table-column>
        <el-table-column prop="catalog" label="名称" :show-overflow-tooltip="true" align="left">
          <template slot-scope="scope">
            <i v-if="scope.row.type !== ROW_TYPE.MODEL" class="iconfont">&#xe637;</i>
            <span style="">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelDesc" label="描述" align="left" width="180"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ip" label="IP" align="left" width="180"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="port" label="端口" align="left" width="100"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="channelType" label="传输协议" align="left" width="150"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="channelDest" label="传输地址" align="left" 
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updated" label="更新日期" :formatter="formatDate" align="left" width="150"></el-table-column>
        <!--<el-table-column prop="status" label="状态" :formatter="formatStatus" align="left" width="80"></el-table-column>-->
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button v-if="isEdit && scope.row.type==='catalog'" type="text" size="small"
                       @click="editCatalog(scope.row)">
              重命名
            </el-button>
            <el-button v-if="scope.row.type==='info'" type="text" size="small"
                       @click="viewChannelValue(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table> 
        <pagination @change="loadChannelData" ref="pagination"></pagination>
    </div>
    <select-tree title="移动"
                 :visible="isShowMove" :refreshType="refreshType"
                 :treeData="temSelectTree" :rootNodes="rootNodes" :treeProps="treeProps"
                 @ok="moveCatalogClick"
                 @cancel="isShowMove=false">
    </select-tree> 
  </div>
</template>
<style lang="scss">
  #list-info{
    .blueFont{
      color: #20a0ff;
    }
    .field-value-content{
      width: 100%;
      .iconfont{
        margin-left: 0px !important;
      }
    }
  }
</style>
<script>
  import axios from '../../../scripts/axios'
  import api from '../scripts/api'
  import { mapActions, mapGetters } from 'vuex'
  import DateUtils from '../../../scripts/date-utils'
  import ResponseUtils from '../../../scripts/response-utils'
  import OneInputDialog from '../../../components/OneInputDialog.vue' 
  import SelectTreeDialog from '../../components/components/SelectTreeDialog.vue'
  import MsgInfo from '../../scripts/msg-info'
  import Pagination from '../../../components/Pagination'  
  import bus from '../../scripts/bus'
  import {GENERAL_FIELD_LIST} from '../../../scripts/page-name'
  
  export default {
    props: {
      rootNodes: {
        type: Array,
        default: () => {
          return [{name: '通用通道', id: 0}]
        }
      },
      treeData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data () {
      return {
        tableRowKey: '',
        catalogId: parseInt(this.$route.params.catalogId),
        catalogTree: null,
        tableData: [],
        checkedRows: [],
        newCatalog: {},
        isShowCatalogEditDialog: false,
        catalogEditDialogTitle: '',
        ROW_TYPE: {
          CATALOG: 'catalog',
          MODEL: 'info'
        },
        isShowMove: false,
        refreshType: 'info',
        treeProps: {
          id: 'id',
          label: 'catalog',
          children: 'children'
        },
        temSelectTree: [],  
        treeNodeKey: '',   
        isShowCategory: false
      }
    },
    // mixins: [PaginationMixin],
    components: {
      'one-input-dialog': OneInputDialog,
      'select-tree': SelectTreeDialog, 
      'pagination': Pagination
    },
    created () {
      this.updateCurrentPageName(GENERAL_FIELD_LIST)
      this.loadTreeData()
    },
    computed: {
      ...mapGetters({
        pagination: 'pagination'
      }),
      pageInfo () {
        return {
          pageSize: this.pagination.pageSize,
          pageNo: this.pagination.pageIndex
        }
      },
      isSelectRootNode () {
        return this.catalogId === 0
      },
      hasCheckedFieldTypeRow () {
        return !_.isEmpty(_.find(this.checkedRows, {type: this.ROW_TYPE.CATALOG}))
      },
      hasCheckedRows () {
        return this.checkedRows.length > 0
      },
      isDisableStatusBtn () {
        return this.hasCheckedFieldTypeRow || !this.hasCheckedRows
      },
      isEdit () {
        return !this.engineId
      },
      filteredTableData () {
        if(this.isShowCategory) {
          let startIndex = this.pageInfo.pageSize * (this.pageInfo.pageNo - 1)
          let endIndex = startIndex + this.pageInfo.pageSize
          return _.slice(this.tableData, startIndex, endIndex)
        }else{
          return this.tableData
        }
      }
    },
    watch: {
      catalogId () {
        this.resetSearch()
        this.loadTreeData()
      }
    },
    mounted () { 
    },
    methods: {
      ...mapActions({
        updateCurrentPageName: 'updateCurrentPageName',
        updatePageTotal: 'updatePageTotal'
      }), 
      resetSearch(){
        this.tableRowKey = "" 
      },
      formatTypeData (TypeData) {
        if (TypeData.length) {
          for (var i = 0; i < TypeData.length; i++) {
            if (TypeData[i].children.length > 0) {
              this.formatTypeData(TypeData[i].children)
            } else {
              delete TypeData[i].children
            }
          }
        }
      },
      formatMoveTypeData(TypeData){
        if(_.find(TypeData,{id:this.catalogId})){
          return TypeData.splice(_.find(TypeData,{id:this.catalogId}));
        }else{
          for(var i=0;i<TypeData.length;i++){
            this.formatMoveTypeData(TypeData[i].children)
          }
        }
      },  
      openNext (row, event) {
        this.$emit('openNext', row)
        if (row.type == 'catalog') { 
          bus.$emit('openId', row.id)
        } else {
          return
        }
      },
      showMove () {
        this.isShowMove = this.hasCheckedRows
        this.getSelectTree()
      },
      getSelectTree () {
        let refreshData = this.checkedRows
        let fieldTypeArr = []
        _.forEach(refreshData, row => {
          if (this.ROW_TYPE.CATALOG === row.type) {
            fieldTypeArr.push(row.id)
          }
        })
        this.temSelectTree = _.cloneDeep(this.treeData)
        for (let i = 0; i < this.temSelectTree.length; i++) {
          if (_.includes(fieldTypeArr, this.temSelectTree[i].id)) {
            this.temSelectTree[i] = null
            this.temSelectTree = _.compact(this.temSelectTree)
            return
          } else {
            this.temSelectTree[i] = this.getNodeMap(this.temSelectTree[i], fieldTypeArr)
          }
        }
        this.temSelectTree = _.compact(this.temSelectTree)
      },
      getNodeMap (data, fieldTypeArr) {
        if (data.children) {
          for (let i = 0; i < data.children.length; i++) {
            if (_.includes(fieldTypeArr, data.children[i].id)) {
              data.children[i] = null
              data.children = _.compact(data.children)
              return data
            } else {
              data.children[i] = this.getNodeMap(data.children[i], fieldTypeArr)
            }
          }
          data.children = _.compact(data.children)
        }
        return data
      },
      formatErrInfo(err){
        let data = JSON.parse(JSON.stringify(err));
        data = data.response.data.error;
        return data;
      },
      moveCatalogClick (data) {
        let refreshData = this.checkedRows
        let channelArr = []
        let catalogArr = []
        let canComit = true
        _.forEach(refreshData, row => {
          if (this.ROW_TYPE.CATALOG === row.type) {
            catalogArr.push(row.id)
          }
          if (this.ROW_TYPE.MODEL === row.type) {
            channelArr.push(row.id)
            if (0 == data.id) {
              this.$message('分组下 不能有通道')
              canComit = false
              return
            }
          }
        })
        if (canComit) {
          if (channelArr.length > 0) {
            api.channel.batchMove(channelArr.toString(), data.id).then((data) => {
              if ('0000' == data.code) {
                this.isShowMove = false
              } else {
                this.$message.error('更新失败 请重试')
              }
              this.loadTreeData()
              bus.$emit('treeDataChange')
            }).catch((err)=>{
              this.$message(this.formatErrInfo(err).message);
            })
          } else if (catalogArr.length > 0) {
            api.catalogTree.batchMove(catalogArr.toString(), data.id).then((data) => {
              if ('1' == data.code) {
                this.isShowMove = false
              } else {
                this.$message.error('更新失败 请重试')
              }
              this.loadTreeData()
              bus.$emit('treeDataChange')
            }).catch((err)=>{
              this.$message(this.formatErrInfo(err).message);
            })
          }
        }
      },
      loadTreeData () {
        api.catalogTree.get(this.catalogId).then((data) => {
          this.catalogTree = data
          this.loadChannelData()
        })
      },
      loadChannelData (ids) {
        let catalogTree = this.addItemToTableData([], this.catalogTree, this.ROW_TYPE.CATALOG)
        let catalogTreeLen = catalogTree.length
        if(this.isShowCategory) {
          this.tableData = this.addItemToTableData(catalogTree, [], this.ROW_TYPE.CATALOG)
          this.updatePageTotal(catalogTreeLen)
          return
        }
        api.channel.getList(this.catalogId, this.tableRowKey, this.pageInfo.pageSize, this.pageInfo.pageNo).then((data) => {
            this.tableData = this.addItemToTableData([], data.data.list, this.ROW_TYPE.MODEL)
            this.updatePageTotal(data.data.total)

            if (_.isArray(ids) && !_.isEmpty(ids)) {
              this.$nextTick(() => {
                _.each(ids, id => {
                  const row = _.filter(this.tableData, {id})[0]
                  this.$refs.table.toggleRowSelection(row, true)
                })
              })
            }
        })
      },
      pageInfoChange () {
        //this.loadChannelData();
      },
      rowCheckedChange (val) {
        this.checkedRows = val
      },
      addCatalog () {
        this.isShowCatalogEditDialog = true
        this.catalogEditDialogTitle = '创建分组'
        this.newCatalog = {
          catalog: '',
          parentId: this.catalogId,
          status: 1,
          isCommon: 1
        }
      },
      editCatalog (data) {
        this.isShowCatalogEditDialog = true
        this.catalogEditDialogTitle = '编辑分组'
        this.newCatalog = _.cloneDeep(_.find(this.catalogTree, {id: data.id}))
      },
      addChannel () {
        this.$router.push({
          name: 'channel-edit-info',
          params: {
            catalogId: this.catalogId,
            id: -1
          }
        })
      },
      editFieldValue (row) { 
        this.$router.push({
          name: 'channel-edit-info',
          params: {
            catalogId: this.catalogId,
            id: row.id
          }
        })
      },
      viewChannelValue (row) {
        this.$router.push({
          name: 'channel-edit-info',
          params: {
            catalogId: this.catalogId,
            id: row.id
          }
        })
      },
      saveCatalog (data) {
        if (!_.isEmpty(data)) {
          let promise = data.id ? api.catalogTree.put(data) : api.catalogTree.post(data)
          promise.then(() => {
            this.isShowCatalogEditDialog = false
            this.loadTreeData()
            bus.$emit('treeDataChange')
            this.$message(_.clone(MsgInfo.CATALOG.SUCCESS.SAVE))
          }).catch(res => {
            ResponseUtils.showErrorMessage(res, '分组保存失败')
          })
        }
      },
      batchDelete: function () {
        this.$confirm('是否确认删除?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const channelIds = _.map(_.filter(this.checkedRows, {type: 'info'}), 'id').join(',')
          if (channelIds.length > 0) {
            api.channel.batchDelete(channelIds).then((data) => {
              this.loadChannelData() 
              this.$message(_.clone(MsgInfo.MODEL.SUCCESS.DELETE))
            }).catch((res) => {
              ResponseUtils.showErrorMessage(res, '通道删除失败')
            })
          }
          const catalogIds = _.map(_.filter(this.checkedRows, {type: 'catalog'}), 'id').join(',')
          if (catalogIds.length > 0) {
            api.catalogTree.batchRemoveTree(catalogIds).then(() => {
              this.loadTreeData()
              bus.$emit('treeDataChange')
              this.$message(_.clone(MsgInfo.CATALOG.SUCCESS.DELETE))
            }).catch((res) => {
              ResponseUtils.showErrorMessage(res, '分组删除失败')
            })
          }
        }).catch(() => {

        })
      },
      batchUpdateStatus: function (status) {
        let statusLabel = this.getStatusLabel(status)
        this.$confirm(`是否确认${statusLabel}?`, statusLabel, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let channelIds = _.map(_.filter(this.checkedRows, {type: 'info'}), 'id').join(',')
          api.channel.batchUpdateStatus(channelIds, status).then((data) => {
            if(data.code!=-1&&(data.data==null||data.data==undefined)){
              this.loadChannelData()
              this.$message(_.clone(MsgInfo.MODEL.SUCCESS.UPDATE_STATUS))
            }else{
              //this.$message.warning('请先解除关联配置再进行状态更新！');
            }
          }).catch((res) => {
            ResponseUtils.showErrorMessage(res, '状态更新失败')
          })
        }).catch((error) => {
          console.dir(error)
        })
      },
      formatDate (row, column) {
        let value = row[column.property]
        if (value) {
          return DateUtils.formate(value, 'yyyy-MM-dd  hh:mm')
        } else {
          return ''
        }
      },
      formatCode (row, column) {
        let value = row[column.property]
        return value || '----'
      },
      formatStatus (row, column) {
        let value = row[column.property]
        if (!_.isNumber(value)) {
          return '----'
        }
        return this.getStatusLabel(value)
      },
      getStatusLabel (value) {
        return value === 1 ? '启用' : '停用'
      },
      addItemToTableData (originalData = [], data, type) {
        _.forEach(data, (item) => {
          let row = {
            id: item.id, 
            name: type === this.ROW_TYPE.CATALOG ? item.catalog : item.channelName, 
            status: type === this.ROW_TYPE.MODEL ? item.openStatus : '',
            ip: type === this.ROW_TYPE.MODEL ? item.ip : '', 
            port: type === this.ROW_TYPE.MODEL ? item.port : '', 
            channelType: type === this.ROW_TYPE.MODEL ? item.channelType : '', 
            channelDesc: type === this.ROW_TYPE.MODEL ? item.channelDesc : '', 
            channelDest: type === this.ROW_TYPE.MODEL ? item.channelDest : '', 
            updated: item.updateTime,
            type: type
          }
          let key = _.trim(this.tableRowKey)
          if (!_.isEmpty(key)) {
            if (row.name.indexOf(key) > -1 || row.channelDesc.indexOf(key)>-1) {
              originalData.push(row)
            }
          } else {
            originalData.push(row)
          }
        })
        
        return originalData
      },
      reload() {
        this.$refs.pagination.pageCurrentChange(1)
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.catalogId = parseInt(to.params.catalogId)
      next()
    }
  }
</script>
