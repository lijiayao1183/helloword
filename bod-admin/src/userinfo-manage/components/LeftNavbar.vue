<template>
  <div class="left-nav-bar">
    <el-menu class="el-menu-vertical-demo">
      <el-menu-item v-for="item in navData"
                    :index="item.name"
                    :class="{'is-active': item.name===$route.name}"
                    @click="getRightContent(item.name)">
        <i class="iconfont iconstyle"
           v-html="item.icon"></i>
        <el-badge v-if="item.name.indexOf('my')>-1"
                  :value="applyNum[item.name]"
                  slot="title">
          <span>{{item.value}}</span>
        </el-badge>
        <span v-else
              slot="title">{{item.value}}</span>
        </span>

      </el-menu-item>
    </el-menu>
  </div>
</template>
<script type="text/babel">
// import LeftNavBarMockData from '@system/mock/navbar.mock.js'
import { mapActions } from 'vuex'
export default {
  name: 'LeftNavbar',
  data() {
    return {
      navbars: []
    }
  },
  computed: {
    applyNum() {
      let info = this.$root.applyNum
      return {
        myApplication: info.applyNum,
        myApproval: info.auditNum
      }
    }
  },
  methods: {
    ...mapActions({
      updateMyApplyListDateRange: 'updateMyApplyListDateRange',
      updateMyApplyListType: 'updateMyApplyListType',
      updateMyApplyListStatus: 'updateMyApplyListStatus',
      updateMyApplyListSearchKey: 'updateMyApplyListSearchKey',
      updatePageTotal: `updatePageTotal`,
      updatePageIndex: `updatePageIndex`,
      updatePageSize: `updatePageSize`
    }),
    getRightContent: function(name) {
      // 重置我的申请-我的审批查询参数
      if (name !== this.$route.name && name.indexOf('myApp') > -1) {
        let end = new Date()
        end.setHours(23)
        end.setMinutes(59)
        end.setSeconds(59)
        let start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        this.updateMyApplyListDateRange([start.getTime(), end.getTime()])
        this.updateMyApplyListSearchKey('')
        this.updateMyApplyListType('')
        this.updateMyApplyListStatus('')
        this.updatePageTotal(0)
        this.updatePageIndex(1)
        this.updatePageSize(10)
      }
      this.$router.push({
        name
      })
    }
  },
  props: {
    navData: {
      type: Array,
      default() {
        return []
      }
    },
  }
}
</script>
<style lang="scss">
.left-nav-bar {
  position: relative;
  height: 100%;
  border: 1px solid #dedede;
  border-top: 0px;
  width: 100%;
  box-sizing: border-box;
  .el-menu.el-menu-vertical-demo {
    height: 100%;
    background: #fff;
    .el-menu-item {
      height: 37px;
      line-height: 37px;
      .el-badge__content {
        top: 10px;
        right: 2px;
      }
      &.is-active {
        background-color: #edf7ff;
        color: #20a0ff;
        .iconstyle {
          color: #20a0ff;
        }
      }
      &:hover {
        background-color: #edf7ff;
        color: #20a0ff;
        .iconstyle {
          color: #20a0ff;
        }
      }
      .iconstyle {
        font-size: 24px;
        margin-right: 15px;
        color: #676767;
      }
    }
  }
}
</style>
