<template>
  <div id="list-info">
    <div class="action-btn-container">
      <div style="margin-left:20px;">
        <div class="right">
          <el-input placeholder="请输入关键字" v-model="tableRowKey" class="search-btn"
                    @keyup.enter.native="loadFieldData">
            <el-button slot="append" @click="loadFieldData" icon="search"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="field-value-content">
      <el-table
        ref="multipleTable"
        :data="tableDataFn"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          align="left"
          width="15 ">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
          align="left"
          width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="left"
          label="审批权限"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="left"
          label="授权账户"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatUser(scope.row.userInfos)}}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="修改时间"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{formatDate(scope.row.updated)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="!(scope.row.level=='0')" @click="look(scope.row)">
              <i class="iconfont" title="查看详情">&#xe6c7;</i>
            </el-button>
            <el-button type="text" size="small" :disabled="tableData.length>=10" @click="add(scope.row)">
              <i class="iconfont" :class="{'icon-disable':tableData.length>=10}" title="权限等级个数不能超过10" v-show="tableData.length>=10">&#xe622;</i>
              <i class="iconfont" title="添加" v-show="tableData.length<10">&#xe622;</i>
            </el-button>
            <el-button type="text" size="small" v-if="!(scope.row.level=='0')" @click="batchDelete(scope.row)">
              <i class="iconfont" title="删除">&#xe654;</i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import PermissionManageApi from '@system/api/systemconfig/permissionmanage.api'//
import DateUtil from '../../../../scripts/date-utils'
export default {
  data () {
    return {
      tableData: [],
      tableRowKey: ''
    }
  },
  methods: {
    formatDate: function (date) {
      if (date == undefined || date == '--') {
        return '--'
      }
      return DateUtil.formate(date)
    },
    formatUser: function (userInfos) {
      if (userInfos == null || userInfos.length == 0) {
        return '--'
      }
      return _.map(userInfos, function (item) {
        return item.account + '(' + item.nickName + ')'
      }).toString()
    },
    loadFieldData: function () {
      let _this = this
      PermissionManageApi.getData().then((data) => {
        _this.tableData = _.cloneDeep(data)
        _this.tableData.unshift({
          id: '0',
          level: '0',
          name: '申请人',
          userInfos: [],
          users: '--',
          updateTime: '--'
        })
        sessionStorage.setItem('nameStr', _.map(_this.tableData, 'name').toString())
      })
    },
    add: function (row) {
      this.$router.push('/editPermission/0?level=' + row.level)
    },
    batchDelete: function (row) {
      let _this = this
      this.$confirm('确认删除？', '权限删除').then(res => {
        PermissionManageApi.deleteData(row.id).then((data) => {
          if (data.code == '1') {
            _this.loadFieldData()
          }
        }).catch((res) => {
          this.$message.warning(res.response.data.error.message)
        })
      }).catch(res => {
      })
    },
    look: function (row) {
      sessionStorage.setItem(row.id, JSON.stringify(row))
      let nameStr = sessionStorage.getItem('nameStr').split(',')
      nameStr.splice(nameStr.indexOf(row.name), 1)
      sessionStorage.setItem('nameStr', nameStr.toString())
      this.$router.push('/editPermission/' + row.id)
    }
  },
  created () {
    this.loadFieldData()
  },
  computed: {
    tableDataFn () {
      let tableData = _.cloneDeep(this.tableData)
      let key = _.trim(this.tableRowKey)
      let name = ''
      if (key) {
        tableData = _.filter(tableData, (field) => {
          name = _.map(field.userInfos, function (item) {
            return item.nickName + '_' + item.account
          }).toString()
          return (field.name && field.name.indexOf(key) > -1) ||
                  (name && name.indexOf(key) > -1)
        })
      }
      return tableData
    }
  }
}
</script>
<style lang="scss" scoped>
  .action-btn-container {
    height: $action-btn-container-height;
    line-height: $action-btn-container-height;
    width: 100%;
    border-bottom: 1px solid #dedede;

    .right-top {
      height: $action-btn-container-height;
      line-height: $action-btn-container-height;
    }
  }
</style>
