export default {
  CATALOG: {
    SUCCESS: {
      DELETE: {
        type: 'success', message: '分类删除成功'
      },
      SAVE: {
        type: 'success', message: '分类保存成功'
      }
    },
    FAIL: {
      DELETE: {
        type: 'warning', message: '分类删除失败'
      },
      SAVE: {
        type: 'warning', message: '分类保存失败'
      }
    }
  },
  MODEL: {
    SUCCESS: {
      DELETE: {
        type: 'success', message: '通道删除成功'
      },
      SAVE: {
        type: 'success', message: '通道保存成功'
      },
      UPDATE_STATUS: {
        type: 'success', message: '状态更新成功'
      }
    },
    FAIL: {
      DELETE: {
        type: 'warning', message: '通道删除失败'
      },
      SAVE: {
        type: 'warning', message: '通道保存失败'
      },
      UPDATE_STATUS: {
        type: 'warning', message: '状态更新失败'
      }
    }
  }
}
