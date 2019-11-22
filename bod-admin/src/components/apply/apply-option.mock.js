export default {
  type: {
    // 申请类型
    1: "新建引擎",
    2: "复制引擎",
    3: "删除引擎",
    4: "生成快照",
    5: "版本删除",
    6: "快照部署",
    7: "快照下线",
    8: "快照导入",
    9: "快照导出",
    10: "快照删除"
  },
  status: {
    1: {
      // 申请状态
      0: "审批中",
      1: "审批拒绝",
      2: "审批终止",
      3: "已审批待确认",
      4: "已审批已确认"
    },
    2: {
      // 审批状态
      0: "待审批",
      1: "转授权",
      2: "审批通过",
      3: "审批拒绝",
      4: "审批终止"
    },
    3: {
      // 审批日志流程状态
      0: "已完成",
      1: "未完成",
      2: "审批终止"
    }
  },
  nodeStatus: {
    0: "待审核",
    1: "通过",
    2: "拒绝",
    4: "系统终止"
  }
}