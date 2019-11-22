<template>
  <ul class="el-select-group__wrap">
    <li class="el-select-group__title" v-show="visible">{{ label }}</li>
    <li>
      <ul class="el-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
  import Emitter from 'element-ui/lib/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'ElOptionGroupCustomer',

    componentName: 'ElOptionGroupCustomer',

    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true
      };
    },

    watch: {
      disabled(val) {
        this.broadcast('ElOptionCustomer', 'handleGroupDisabled', val);
      }
    },

    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true);
      }
    },

    created() {
      this.$on('queryChange', this.queryChange);
    },

    mounted() {
      if (this.disabled) {
        this.broadcast('ElOptionCustomer', 'handleGroupDisabled', this.disabled);
      }
    }
  };
</script>
