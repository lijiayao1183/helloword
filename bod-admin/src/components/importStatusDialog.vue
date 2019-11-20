<template>
  <div id="container-import">
    <el-dialog
      v-if="importStatusDialogVisible"
      :title="importTitle"
      :visible.sync="importStatusDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="import-content">
        <template v-if="isSuccess">
          <div class="content-left">
            <i class="el-icon-circle-check"></i>
          </div>
          <div class="content-right">
            {{successContent}}
          </div>
        </template>
        <template v-else>
          <div class="content-left">
            <i class="el-icon-warning"></i>
          </div>
          <div class="content-right">
            <div class="up">
              {{failedContent}}
            </div>
            <div class="down">
              <a :href="downloadAddress">{{downloadContent}}</a>查看详情
            </div>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogSure">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>
<script>
export default ({
  props: {
    importTitle: {
      type: String,
      default: ''
    },
    importStatusDialogVisible: {
      type: Boolean,
      default: false
    },
    successContent: {
      type: String,
      default: ''
    },
    downloadAddress: {
      type: String,
      default: ''
    },
    downloadContent: {
      type: String,
      default: ''
    },
    isSuccess: {
      type: Boolean,
      default: true
    },
    failedContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  created () {

  },
  methods: {
    handleClose () {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$emit('dialogSure')
        })
        .catch(_ => {})
    },
    dialogSure () {
      this.$emit('dialogSure')
    }
  }
})
</script>
<style lang="scss" scoped>
  #container-import {
    .el-dialog__body {
      width: 100%;
      height: 200px;
    }
    .import-content {
      overflow: hidden;
      padding-top: 50px;
      height: 160px;
      .content-left {
        text-align: center;
        float: left;
        width: 40%;
        .el-icon-circle-check {
          font-size: 60px;
          color: green;
        }
        .el-icon-warning {
          font-size: 60px;
          color: orange;
        }
      }
      .content-right {
        float: left;
        width: 60%;
        .down {
          margin-top: 30px;
        }
      }
    }

  }
</style>
