<template>
  <div class="my-btn-dropdown">
    <el-button-group :class="{'full-width':!isShowDropDown}">
      <template v-for="name in btnGroupNames">
        <el-button :style="{'width': widthClass}" style="" :type="name===currentName ? 'primary' : 'default'" @click="btnClick(name)">
          <text-overflow :value="name"></text-overflow>
        </el-button>
      </template>
    </el-button-group>
    <template v-if="isShowDropDown">
      <el-dropdown type="default" trigger="click" @command="dropDownSelectItemChange">
        <el-button>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-for="name in dropDownNames">
            <el-dropdown-item :command="name" :class="name===currentName ? 'active':''">{{name}}</el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>
<script>
import * as _ from 'lodash'
import TextOverflow from '../../src/components/TextOverflow.vue'
export default {
  props: {
    btnNumber: {
      type: Number,
      default: 3
    },
    names: {
      type: Array,
      default () {
        return ['信用得分', 'PD', 'OOD', '年龄', '学历', '身份证号码']
      }
    },
    selectName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnGroupNames: [],
      dropDownNames: [],
      currentName: ''
    }
  },
  watch: {
    names () {
      	this.distributionNames()
    },
    currentName () {
      this.$emit('selectChange', this.currentName)
    },
    selectName () {
      	this.currentName = this.selectName
      	// this.$emit('selectChange', this.currentName)
    }
  },
  computed: {
    isShowDropDown () {
      return this.names.length > this.btnGroupNames.length
    },
    widthClass () {
      if (this.names.length == 1) {
        	return '100%'
      } else if (this.names.length == 2) {
        	return '50%'
      } else if (this.names.length == 4) {
        	return '25%'
      } else {
        	return '33.3%'
      }
    }
  },
  created () {
    this.distributionNames()
    this.setDefaultName()
  },
  components: {
    'text-overflow': TextOverflow
  },
  methods: {
    distributionNames () {
      if (this.names.length > this.btnNumber) {
        this.btnGroupNames = _.slice(this.names, 0, this.btnNumber)
        this.dropDownNames = _.slice(this.names, this.btnNumber)
      } else {
        this.btnGroupNames = _.slice(this.names, 0)
      }
    },
    setDefaultName () {
      this.currentName = this.selectName || _.first(this.btnGroupNames)
      if (_.indexOf(this.dropDownNames, this.currentName) >= 0) {
        this.dropDownSelectItemChange(this.currentName)
      }
    },
    dropDownSelectItemChange (item) {
      this.currentName = item
    },
    btnClick (name) {
      this.currentName = name
    }
  }
}
</script>
<style lang="scss" scoped>
 .my-btn-dropdown .el-button-group {
    width: calc(100% - 56px);
    .el-button {
      padding: 12px 5px;
      span {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .el-dropdown-menu__item {
    font-size: 14px;
  }

  .el-dropdown-menu__item.active{
    background-color: #3e8feb;
    color: #fff;
  }

  .full-width {
    width: 100%;
  }
</style>
