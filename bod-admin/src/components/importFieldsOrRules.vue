<template>
  <div id="import-fields">
    <el-dialog
      :title="importTitle"
      :visible.sync="importDialogVisible"
      :before-close="handleClose"
      size="tiny"
      :show-close="false"
    >
      <!--content-->
      <div class="importInclude">
        <div class="detailContent">
          请上传字段文件，并选择要导入的字段分类目录
        </div>
        <div class="importArea">
          <el-upload
            class="upload-demo"
            ref="upload"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :action="importUrl"
            :on-change="onChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="onSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="onError"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div style="margin-left: 30px" slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过2M</div>
            <a :href="downloadUrl" style="margin-left: 30px;line-height: 30px">下载模板</a>
          </el-upload>
          <div v-if="progressVisible">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="progressPercentage"
                         :status="progressStatus"></el-progress>
          </div>
        </div>
      </div>
      <div class="selectType">
        <span>导入目录:</span>
        <el-cascader
          expand-trigger="click"
          change-on-select
          :props="typeProp"
          :options="options"
          :model="selectedPath"
          @change="handleChange">
        </el-cascader>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="importCancel" :disabled="buttonDisabled">取 消</el-button>
    <el-button type="primary" :disabled="selectPath.length<=0||preFileList.length<=0||buttonDisabled" @click="submitUpload">导 入</el-button>
  </span>
    </el-dialog>
    <import-status-dialog
      :importTitle="importTitle"
      :importStatusDialogVisible="importStatusDialogVisible"
      :successContent="successContent"
      :downloadAddress="downloadAddress"
      :downloadContent="downloadContent"
      :isSuccess="isSuccess"
      :failedContent="failedContent"
      @dialogSure="dialogSure">

    </import-status-dialog>
  </div>

</template>
<script>
  import bus from '../field-manage/scripts/bus'
  import importStatusDialog from './importStatusDialog.vue'
  import apiProgress from '../engine-manage/decision-flow/scripts/api.js'

  export default ({
    props: {
      typeProp: {
        type: Object,
        default: {
          value: 'id',
          label: 'label',
          children: 'children'
        }
      },
      importDialogVisible:{
        type:Boolean,
        default:false
      },
      downloadUrl: {
        type: String,
        default: ''
      },
      importTitle: {
        type: String,
        default: ''
      },
      importUrl: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default: []
      },
      selectedPath: {
        type: Array,
        default: []
      },
      taskId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        fileList: [],
        preFileList:[],
        selectPath:[],
        downloadAddress:'',
        isSuccess:true,
        failedContent:'',
        successContent:'',
        downloadContent:'下载失败字段',
        importStatusDialogVisible:false,
        progressVisible: false,
        progressPercentage: 0,
        progressStatus: '',
        intervalProgress: null,
        buttonDisabled: false,
        isShow: true,
        isCheckFileOk: true
      }
    },
    created(){
      console.log(this.selectedPath);
    },
    methods: {
      importCancel () {
        this.fileList = []
        this.$emit('importCancel')
      },
      onChange(file,fileList){
        if(fileList.length>=2){
          fileList.splice(0,1)
        }
        this.preFileList=fileList;
      },
      handleClose () {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.fileList = []
            this.isShow = false
            this.$emit('importCancel')
          })
          .catch(_ => {})
      },
      submitUpload () {
        this.$refs.upload.submit()
        this.progressVisible = true
        this.buttonDisabled = this.isCheckFileOk?true: false
        this.refreshProgressPercentage()
      },
      handleChange (value) {//Trigger when type path change
        this.selectPath=value;
        this.$emit('valueChange', value)
      },
      beforeAvatarUpload (file) {
        let fileArr = file.name.split('.')
        const isExcel = fileArr[1] === 'xls' || fileArr[1] ==='xlsx';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isExcel) {
          this.$message.error('请上传excel文件');
        }
        if (!isLt2M) {
          this.$message.error('上传限制为 2MB')
        }

        if (isExcel && isLt2M) {
          this.fileList.push(file)
        }
        return this.isCheckFileOk = isExcel && isLt2M
      },
      onError (err, file, fileList) {
        this.progressStatus = 'exception'
        this.progressPercentage = 100
        clearInterval(this.intervalProgress)
        this.buttonDisabled = false
        this.importCancel()
        this.$message.warning('文件错误，取消导入')
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      refreshProgressPercentage () {
        apiProgress.task(this.taskId).then(res => {
          if (res === 100) {
            clearInterval(this.intervalProgress)
          } else if (!this.response || ( this.response.code!=='-1'|| this.response.code == '-1' && (this.response.data!=null||this.response.data!=undefined))){
            this.progressPercentage = res
            // this.intervalProgress = setTimeout(()=>{
            //   this.refreshProgressPercentage()
            // }, 10)
          }
        }).catch(err => {
          // this.intervalProgress = setTimeout(()=>{
          //   this.refreshProgressPercentage()
          // }, 10)
        })
      },
      onSuccess (response, file, fileList) {
        this.file = file;
        this.response = response;
        // 不需要执行失败-有弹出框提醒
        // if (response.code == '-1') {
        //   this.$message.warning(response.msg)
        // }
        this.progressPercentage = 100
        setTimeout(()=>{
          clearInterval(this.intervalProgress)
          this.importStatusShow(response);
        },1000)


      },
      importStatusShow (response) {
        if (this.isShow) {
          if (response.code==1&&(response.data!=null||response.data!=undefined)) {
            this.isSuccess=true;
            this.progressPercentage = 100
            this.successContent='字段导入完成，共成功导入'+JSON.parse(response.data).success+'个字段，失败'+JSON.parse(response.data).failed+'个字段！'
            this.importStatusDialogVisible=true;
          } else if(response.code==-1&&(response.data!=null||response.data!=undefined)) {
            this.buttonDisabled = false
            this.isSuccess=false;
            this.progressStatus = 'exception'
            this.progressPercentage = 100
            this.failedContent='字段导入完成，共成功导入'+JSON.parse(response.data).success+'个字段，失败'+JSON.parse(response.data).failed+'个字段！'
            this.downloadAddress=`/api/field/template?filename=${JSON.parse(response.data).filename}`
            this.fileList = []
            this.importStatusDialogVisible=true;
          } else {
            this.buttonDisabled = false
          }
        }

        this.$emit('importFields');
        console.log(response);
      },
      dialogSure(){
        this.importStatusDialogVisible=false;
        this.$emit('importCancel');
      }
    },
    components:{
      'import-status-dialog':importStatusDialog
    },
    beforeDestroy () {
      clearInterval(this.intervalProgress)
    },
  })
</script>
<style lang="scss">
  #import-fields {
    .upload-demo {
      overflow: hidden;
      .el-progress.el-progress--line {
        display: none;
      }
    }
    .upload-demo > div {
      float: left;
    }
    .el-dialog .el-dialog__body {
      text-align: -webkit-auto;
    }
    .importArea {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    /*.el-upload-list {
      display: inline-block;
    }*/
    .el-cascader {
      width: 235px;
    }
  }

</style>
