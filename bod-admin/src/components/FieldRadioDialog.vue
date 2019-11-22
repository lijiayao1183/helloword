<template>
  <el-dialog id="select-inputs" :title="isOutputFiled ? '输出参数' : '输入参数'" :visible="visible" size="tiny"
             :show-close=false>
    <el-form :inline="false" class="dialog-edit-content">
      <el-form-item>
        <cascader style="width:182px;"
               :disabled="isReadOnly"
              @valueChange="valueChange">

        </cascader>
        <el-input v-model="key" class="search-key" placeholder="请输入关键字"></el-input>
      </el-form-item>
    </el-form>
    <el-table
      ref="fieldDataTableRef"
      :data="filteredFiledData"
      max-height="280"
      :row-style="tableRowStyle"
      tooltip-effect="dark">
      <el-table-column
        :resizable="false"
        width="37">
        <template slot-scope="scope">
          <el-radio v-model="currentCheckedFieldEn"
                    :label="scope.row.fieldEn"
                    :disabled="hasCheckedRow(scope.row.fieldEn)"><span></span></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="fieldCn"
        label="字段名称"
        show-overflow-tooltip width="137">
      </el-table-column>
      <el-table-column
        align="center"
        prop="fieldEn"
        label="字段编码"
        show-overflow-tooltip width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="valueType"
        :formatter="formatType"
        label="值类型"
        show-overflow-tooltip width="90">
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
  import api from '../scripts/api'
  import generalApi from '../field-manage/general-field/scripts/api'
  import engineApi from '../engine-manage/field/scripts/api'
  import cascader from './Cascader.vue'
  import selectOption from '../mixins/select-option.mixin'

  export default {
    props: {
      checkedFiledEn: [String],
      visible: {
        type: Boolean,
        default: false
      },
      isOutputFiled: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default () {
          return null
        }
      },
      hasCheckedFieldEns: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        engineId: this.$route.params.engineId,
        isReadOnly:this.$root.$data.isReadOnly,
        key: '',
        fieldData: [],
        currentCheckedFieldEn: this.checkedFiledEn
      }
    },
    mixins:[selectOption],
    watch: {
      checkedFiledEn () {
        this.currentCheckedFieldEn = this.checkedFiledEn
      },
      visible () {
        if (this.visible) {
          if (_.isNull(this.data)) {
            this.loadData()
          } else {
            this.fieldData = _.cloneDeep(this.data)
          }
        }
      }
    },
    computed: {
      filteredFiledData () {
        let key = _.trim(this.key)
        let data = this.fieldData
        if (!_.isEmpty(key)) {
          data = _.filter(data, (o) => {
            return this.searchFieldByKey(o, key)
          })
        }

        return data
      }
    },
    created(){
      if(!this.data) {
        this.loadData()
      }
    },
    methods: {
      loadData () {
        api.field.getUnPage('', this.engineId, this.isOutputFiled ? 1 : 0).then((data) => {
          this.fieldData = _.filter(data, {status: 1})
        }).catch(() => {

        })
      },
      formatType (row, column) {
        let value = row[column.property]
        if (value) {
          return _.find(this.fieldValueTypeOption, {value: value}).label
        } else {
          return ''
        }
      },
      valueChange(value){
        if(_.first(value)=== 1){
          if(value.length>1){
            generalApi.field.get('',_.last(value),'',{},this.isOutput,'').then((data)=>{
              this.fieldData=_.filter(data.list, {isOutput: this.isOutputFiled ? 1 : 0, status: 1});
            })
          }else{
            generalApi.field.get('',0,'',{},this.isOutput,'').then((data)=>{
              this.fieldData=_.filter(data.list, {isOutput: this.isOutputFiled ? 1 : 0, status: 1});
            })
          }
        }else if(_.first(value)=== 2){
          if(value.length>1){
            engineApi.field.get(this.engineId,_.last(value),'',{pageSize:0,pageNo:0},'','').then(data=>{
              this.fieldData=_.filter(data.list, {isOutput: this.isOutputFiled ? 1 : 0, status: 1});
            })
          }else{
            engineApi.field.get(this.engineId,'0','',{pageSize:0,pageNo:0},'','').then(data=>{
              this.fieldData=_.filter(data.list, {isOutput: this.isOutputFiled ? 1 : 0, status: 1})
            })
          }
        }else{
          api.field.getUnPage('', this.engineId).then((data) => {
            this.fieldData = _.filter(data, {isOutput: this.isOutputFiled ? 1 : 0, status: 1})
          }).catch(() => {

          })
        }
      },
      hasCheckedRow (fieldEn) {
        return _.includes(this.hasCheckedFieldEns, fieldEn)
      },
      tableRowStyle (row) {
        if (this.hasCheckedRow(row.fieldEn)) {
          return {color: '#AAAAAA'}
        } else {
          return ''
        }
      },
      searchFieldByKey (field, key) {
        return field.fieldCn && field.fieldCn.indexOf(key) > -1 ||
          field.fieldEn && field.fieldEn.indexOf(key) > -1
      },
      cancel () {
        this.$emit('cancel')
      },
      ok () {
        let checkedField = _.find(this.fieldData, {fieldEn: this.currentCheckedFieldEn})
        this.$emit('ok', checkedField)
      }
    },
    components:{
      'cascader':cascader
    }
  }
</script>
<style lang="scss">
    #select-inputs{
      .search-key{
      	float: right;
        width: 200px;
      }
    }
</style>
