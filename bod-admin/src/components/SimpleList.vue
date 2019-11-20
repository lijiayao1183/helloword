<template>
  <div id="simple-list" class="scroll-small">
    <ul>
      <template v-for="(item,key) in innerData">
        <el-tooltip :disabled="disabledValues[key]" :content="item[name]">
          <li class="ellipsis" :id="uniqId+'_'+key">
            {{item[name]}}
          </li>
        </el-tooltip>
      </template>
    </ul>
  </div>
</template>
<script>
import * as $ from 'jquery'
import * as _ from 'lodash'

const uuid = require('node-uuid')

export default {
  props: {
    data: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    name: {
      type: String,
      default: 'name'
    }
  },
  computed: {
    innerData () {
      if (_.isArray(this.data)) {
        return this.data
      } else {
        return [this.data]
      }
    }
  },
  data () {
    return {
      disabledValues: {},
      uniqId: uuid.v1()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.updateDisabledValues()
    })
  },
  methods: {
    updateDisabledValues () {
      _.forEach(this.innerData, (item, index) => {
        let li = $(`#${this.uniqId}_${index}`)[0]
        let disabled = li.offsetWidth >= li.scrollWidth
        this.$set(this.disabledValues, index, disabled)
      })
    }
  },
  updated () {
    this.$nextTick(() => {
      this.updateDisabledValues()
    })
  }
}
</script>
<style lang="scss">
  $border: 1px solid #dedede;
  #simple-list {
    border: $border;
    ul {
      padding: 0;
      margin: 0;
      height: 100%;
      list-style-type: none;
      li {
        border-top: $border;
        &:first-child {
          border-top: none;
        }
        padding: 10px;
      }
    }
  }
</style>
