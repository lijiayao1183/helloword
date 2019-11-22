<template>
  <el-dialog id="field-input-dialog"
             :title="title"
             :visible="visible"
             size="tiny"
             :show-close=false>
    <el-form :model="formData"
             label-position="right"
             ref="form"
             label-width="100px">
      <template v-for="field in fields">
        <el-tooltip class="item" :content="field.fieldCn" placement="left" :key="field.fieldEn">
          <el-form-item :label="field.fieldCn"
                        :prop="field.fieldEn"
                        :rules="getRules(field)">
            <template v-if="isEnumField(field)">
              <el-select v-model="formData[field.fieldEn]"
                         placeholder="请选择">
                <el-option
                  v-for="item in getValueScopeOption(field.valueScope)"
                  :key="parseInt(item.value)"
                  :label="item.label"
                  :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </template>
            <template v-else-if="isDateField(field)">
              <el-date-picker
                v-model="formData[field.fieldEn]"
                :format="field.valueScope"
                :type="isDateFormat(field.valueScope) ? 'date' : 'datetime'"
                @change="(val)=>{formData[field.fieldEn] = val}"
                placeholder="选择日期">
              </el-date-picker>
            </template>
            <template v-else-if="isNumberField(field)">
              <el-input v-model="formData[field.fieldEn]"
                        @mousemove.native.stop=""
                        @mouseup.native.stop=""
                        @input.native.stop="inputCheckE"
                        type="number">
              </el-input>
            </template>
            <template v-else>
              <el-input v-model="formData[field.fieldEn]"></el-input>
            </template>
          </el-form-item>
        </el-tooltip>
      </template>
      <template v-if="isDynamic">
        <el-form-item prop="outDataDesc"
                      :label="label"
                      :rules="{max: 300, message: '不能超过300个字符 ', trigger: 'blur'}">
          <el-input type="textarea"
                    :rows="2"
                    v-model.trim="formData.outDataDesc"
                    placeholder="非必填"></el-input>
        </el-form-item>
        <el-form-item prop="validityDays"
                      label="有效期"
                      :rules="[
                        { required: false,trigger: 'blur'},
                        { pattern: /^[1-9]\d{0,8}$/, message: '只能为正整数,最多9位', trigger: 'blur'}
                      ]">
          <el-input v-model.trim="formData.validityDays"
                    placeholder="非必填,不填永久有效">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ok">{{okName}}</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/babel">
  import selectOptionMixin from '../mixins/select-option.mixin';
  import fieldMixin from '../mixins/field-mixin';
  import FieldValue from './FieldValue.vue';
  import validateRules from '../scripts/validate-rules';

  export default {
    props: {
      okName: {
        type: String,
        default: '确定'
      },
      title: {
        type: String,
        default: '新增数据'
      },
      isName:{
        type:Boolean,
        default:false
      },
      visible: {
        type: Boolean,
        default: false
      },
      fields: {
        type: Array,
        default() {
          return [];
        }
      },
      requiredFields: {
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        type: Object,
        default() {
          return {};
        }
      },
      isDynamic: {
        type: Boolean,
        default: false
      },
      label: {}
    },
    components: {
      'field-value': FieldValue
    },
    data() {
      return {
        formData: _.cloneDeep(this.data)
      }
    },
    watch: {
      data() {
        this.formData = _.cloneDeep(this.data);
      }
    },
    mixins: [selectOptionMixin, fieldMixin],
    methods: {
      ok() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$emit('ok', this.formData);
          }
        });

      },
      inputCheckE(ev) {
       if (ev.data === "e" || ev.data === "E") {
         ev.target.value = ''
       }
      },
      inputCheckE(ev) {
       if (!ev.target.value) {
         ev.target.value = ''
       }
      },
      cancel() {
        this.$emit('cancel');
      },
      inputCheckE(ev) {
        if (ev.data === "e") {
          ev.target.value = ''
        }
      },
      getRules(field) {
        let rules = [];
        if (this.isFieldRequired(field.fieldEn)&&this.isName) {
          rules = [{required: true, message: '不能为空', trigger: 'blur'}];
        }else{
          rules = [{required: false}]
        }
//        if (this.isNumberField(field)) {
//          rules = _.concat(rules, validateRules.isNumberInRange(field.valueScope));
//        }
        return rules;
      },
      isFieldRequired(fieldCode) {
        return !!_.find(this.requiredFields, {fieldEn: fieldCode});
      }
    }
  }
</script>
<style lang="scss">
  #field-input-dialog {
    .el-select, .el-date-editor {
      width: 100%;
    }

    .el-dialog__body {
      max-height: 280px;
      overflow-y: auto;
    }

    .el-form {
      padding: 20px 20px;

      .el-form-item.is-required .el-form-item__label:before {
        content: none;
      }

      .el-form-item.is-required .el-form-item__label:after {
        content: '';
        color: #ff4949;
        margin-right: 4px;
        font-size: 12px;
      }

      .el-form-item__label {
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        overflow: hidden;
        padding: 11px 0 12px 0;
      }
    }
  }
</style>
