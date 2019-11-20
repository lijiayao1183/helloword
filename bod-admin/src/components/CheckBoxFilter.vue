<template>
  <div class="checkbox-filter">
    <span class="iconfont filter-btn" :class="{'active': visible}" @click.stop="toggleFilter">&#xe692;</span>
    <div v-show="visible" class="filter-content" @click.stop="">
      <el-checkbox-group v-model="isCheckedAll" @change="checkedAllChange">
        <el-checkbox>全选</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-model="checkedStatus">
        <el-checkbox v-for="item in data" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    defaultCheckedStatus: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false,
      checkedStatus: [],
      allStatus: [],
      isCheckedAll: false
    }
  },
  watch: {
    checkedStatus (newVal) {
      this.isCheckedAll = newVal.length === this.allStatus.length
      this.$emit('checkedStatusChange', this.checkedStatus)
    },
    data () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.allStatus = _.map(this.data, 'value')
      if (this.defaultCheckedStatus.length === 0) {
        this.checkedStatus = _.cloneDeep(this.allStatus)
      } else {
        this.checkedStatus = _.cloneDeep(this.defaultCheckedStatus)
      }
    },
    checkedAllChange (val) {
      if (val) {
        this.checkedStatus = _.cloneDeep(this.allStatus)
      } else {
        this.checkedStatus = []
      }
    },
    toggleFilter () {
      this.visible = !this.visible
    }
  },
  mounted () {
    document.addEventListener('click', () => {
      this.visible = false
    })
  }
}
</script>
<style lang="scss" scoped>
  $themeColor: #3e8feb;
  .checkbox-filter {
    position: relative;

  }

  .filter-content {
    position: absolute;
    top: 45px;
    right: 0px;
    z-index: 100;
    background: #fff;
    padding: 15px 15px 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    .el-checkbox {
      display: block;
      & + .el-checkbox {
        margin-left: 0;
      }
    }
  }

  .filter-btn {
    border: 0px;
    width: 35px;
    height: 35px;
    line-height: 35px;
    border-radius: 0px;
    border-color: #dedede;
    color: #777777;
    background: #fff;
    padding: 7px 8px;
    &:hover, &.active {
      border-color: $themeColor;
      color: $themeColor;
    }
  }

</style>
