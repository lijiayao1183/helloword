<template>
  <div id="field-value">
    <template v-if="isEnumField(fieldValue)">
      <el-select v-model="fieldValue"
                 placeholder="请选择">
        <el-option
          v-for="item in getValueScopeOption(field.valueScope)"
          :key="item.value"
          :label="item.label"
          :value="item.label">
        </el-option>
      </el-select>
    </template>
    <template v-else-if="isDateField(fieldValue)">
      <el-date-picker
        v-model="fieldValue"
        :format="field.valueScope"
        @change="(val)=>{fieldValue = val}"
        :type="isDateFormat(fieldValue.valueScope) ? 'date' : 'datetime'"
        placeholder="选择日期">
      </el-date-picker>
    </template>
    <template v-else-if="isNumberField(fieldValue)">
      <el-input v-model="fieldValue" type="number"></el-input>
    </template>
    <template v-else>
      <el-input v-model="fieldValue"></el-input>
    </template>
  </div>
</template>
<script>
  import selectOptionMixin from '../mixins/select-option.mixin';
  import fieldMixin from '../mixins/field-mixin';

  export default {
    props: ['field', 'value'],
    data() {
      return {
        fieldValue: this.value
      }
    },
    mixins: [selectOptionMixin, fieldMixin],
    watch: {
      fieldValue(val) {
        this.$emit('update:value', val);
      }
    }
  }
</script>
<style lang="scss">
  #field-value {

    .el-date-editor {
      width: 100%;
    }

    .el-select {
      width: 100%;
    }
  }
</style>
