<template>
  <div
    class="el-select" style="display:block"
    v-clickoutside="handleClose">
    <div
      class="el-select__tags"
      v-if="multiple"
      @click.stop="toggleMenu"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }">
      <transition-group @after-leave="resetInputHeight">
        <el-tag
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!disabled"
          :hit="item.hitState"
          :type="item.primary"
          @close="deleteTag($event, item)"
          close-transition>
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>

      <input
        type="text"
        class="el-select__input"
        :class="`is-${ size }`"
        @focus="visible = true"
        :disabled="disabled"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        v-model="query"
        :debounce="remote ? 300 : 0"
        v-if="filterable"
        :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
        ref="input">
    </div>
    <ElInput
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :size="size"
      :id="id"
      :disabled="disabled"
      :readonly="!filterable || multiple"
      :validate-event="false"
      @focus="handleFocus"
      @click="handleIconClick"
      @mousedown.native="handleMouseDown"
      @keyup.native="debouncedOnInputChange"
      @keydown.native.down.prevent="navigateOptions('next')"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass">
    </ElInput>
    <transition
      name="el-zoom-in-top"
      @before-enter="handleMenuEnter"
      @after-leave="doDestroy">
      <ElSelectDropdownCustomer
        ref="popper"
        v-show="visible && emptyText !== false">
        <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading">
          <ElOptionCustomer
            :value="query"
            created
            v-if="showNewOption">
          </ElOptionCustomer>
          <slot></slot>
        </el-scrollbar>
        <p class="el-select-dropdown__empty" v-if="emptyText && (allowCreate && options.length === 0 || !allowCreate)">{{ emptyText }}</p>
      </ElSelectDropdownCustomer>
    </transition>
  </div>
</template>

<script type="text/babel">
  import Popper from 'element-ui/lib/utils/vue-popper';
  import Emitter from 'element-ui/lib/mixins/emitter';
  import Locale from 'element-ui/lib/mixins/locale'; 
  import ElSelectDropdownCustomer from './ElSelectDropdownCustomer.vue';
  import ElOptionCustomer from './ElOptionCustomer.vue'; 
  import ElInput from 'element-ui/lib/input';
  import ElOptionGroupCustomer from './ElOptionGroupCustomer.vue'; 
  import debounce from 'throttle-debounce/debounce';
  import Clickoutside from 'element-ui/lib/utils/clickoutside';
  import { addClass, removeClass, hasClass } from 'element-ui/lib/utils/dom';
  import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event';
  import { t } from 'element-ui/lib/locale';
  import scrollIntoView from 'element-ui/lib/utils/scroll-into-view';
  import { getValueByPath } from 'element-ui/lib/utils/util';

  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [Emitter, Locale, Popper],

    name: 'ElSelectCustomer',

    componentName: 'ElSelectCustomer',

    computed: {
      iconClass() {
        let criteria = this.clearable &&
          !this.disabled &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== '';
        return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },
      debounce() {
        return this.remote ? 300 : 0;
      },
      emptyText() {
        if (this.loading) {
          return this.loadingText || this.t('el.select.loading');
        } else {
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.t('el.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.t('el.select.noData');
          }
        }
        return null;
      },

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
      }
    },

    components: { 
      ElInput,
      ElSelectDropdownCustomer,
      ElOptionCustomer
    },

    directives: { Clickoutside },

    props: {
      name: String,
      value: {
        required: true
      },
      id: String,
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return t('el.select.placeholder');
        }
      },
      defaultFirstOption: Boolean,
      valueKey: {
        type: String,
        default: 'value'
      }
    },

    data() {
      return {
        options: [],
        cachedOptions: [],
        createdLabel: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: ''
      };
    },

    watch: {
      disabled() {
        this.$nextTick(() => {
          this.resetInputHeight();
        });
      },

      placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },

      value(val) {
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        this.setSelected();
        if (this.filterable && !this.multiple) {
          this.inputLength = 20;
        }
        this.$emit('change', val);
        this.dispatch('ElFormItem', 'el.form.change', val);
      },

      query(val) {
        if (val === null || val === undefined) return;
        this.$nextTick(() => {
          if (this.visible) this.broadcast('SelectDropdownCustomer', 'updatePopper');
        });
        this.hoverIndex = -1;
        if (this.multiple && this.filterable) {
          this.inputLength = this.$refs.input.value.length * 15 + 20;
          this.managePlaceholder();
          this.resetInputHeight();
        }
        if (this.remote && typeof this.remoteMethod === 'function') {
          this.hoverIndex = -1;
          this.remoteMethod(val);
          this.broadcast('ElOptionCustomer', 'resetIndex');
        } else if (typeof this.filterMethod === 'function') {
          this.filterMethod(val);
          this.broadcast('ElOptionGroupCustomer', 'queryChange');
        } else {
          this.filteredOptionsCount = this.optionsCount;
          this.broadcast('ElOptionCustomer', 'queryChange', val);
          this.broadcast('ElOptionGroupCustomer', 'queryChange');
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      },

      visible(val) {
        if (!val) {
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          this.broadcast('ElSelectDropdownCustomer', 'destroyPopper');
          if (this.$refs.input) {
            this.$refs.input.blur();
          }
          this.query = '';
          this.selectedLabel = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder;
            }
          });
          if (!this.multiple) {
            if (this.selected) {
              if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdOption) {
                this.selectedLabel = this.createdLabel;
              } else {
                this.selectedLabel = this.selected.currentLabel;
              }
              if (this.filterable) this.query = this.selectedLabel;
            }
          }
        } else {
          this.handleIconShow();
          this.broadcast('ElSelectDropdownCustomer', 'updatePopper');
          if (this.filterable) {
            this.query = this.selectedLabel;
            if (this.multiple) {
              this.$refs.input.focus();
            } else {
              if (!this.remote) {
                this.broadcast('ElOptionCustomer', 'queryChange', '');
                this.broadcast('ElOptionGroupCustomer', 'queryChange');
              }
              this.broadcast('ElInput', 'inputSelect');
            }
          }
        }
        this.$emit('visible-change', val);
      },

      options(val) {
        if (this.$isServer) return;
        this.optionsAllDisabled = val.length === val.filter(item => item.disabled === true).length;
        if (this.multiple) {
          this.resetInputHeight();
        }
        let inputs = this.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          this.setSelected();
        }
        if (this.defaultFirstOption && (this.filterable || this.remote) && this.filteredOptionsCount) {
          this.checkDefaultFirstOption();
        }
      }
    },

    methods: {
      handleIconHide() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon) {
          removeClass(icon, 'is-reverse');
        }
      },

      handleIconShow() {
        let icon = this.$el.querySelector('.el-input__icon');
        if (icon && !hasClass(icon, 'el-icon-circle-close')) {
          addClass(icon, 'is-reverse');
        }
      },

      scrollToOption(option) { 
        const target = Array.isArray(option) && option[0] ? option[0].$el : option.$el;
        if (this.$refs.popper && target) {
          const menu = this.$refs.popper.$el.querySelector('.el-select-dropdown__wrap');
          scrollIntoView(menu, target);
        }
      },

      handleMenuEnter() {
        this.$nextTick(() => this.scrollToOption(this.selected));
      },

      getOption(value) {
        let option;
        const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
        for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
          const cachedOption = this.cachedOptions[i];
          const isEqual = isObject
            ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
            : cachedOption.value === value;
          if (isEqual) {
            option = cachedOption;
            break;
          }
        }
        
        if (option) return option;
        const label = !isObject
          ? value : '';
        let newOption = {
          value: value,
          currentLabel: label
        };
        if (this.multiple) {
          newOption.hitState = false;
        }
        return newOption;
      },

      setSelected() {
        if (!this.multiple) {
          let option = this.getOption(this.value);
          if (option.created) {
            this.createdLabel = option.currentLabel;
            this.createdSelected = true;
          } else {
            this.createdSelected = false;
          }
          this.selectedLabel = option.currentLabel;
          this.selected = option;
          if (this.filterable) this.query = this.selectedLabel;
          return;
        }
        let result = [];
        if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            result.push(this.getOption(value));
          });
        } 
        this.selected = result;
        this.$nextTick(() => {
          this.resetInputHeight();
        });
      },

      handleFocus() {
        this.visible = true;
      },

      handleIconClick(event) {
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.deleteSelected(event);
        } else {
          this.toggleMenu();
        }
      },

      handleMouseDown(event) {
        if (event.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          event.preventDefault();
        }
      },

      doDestroy() {
        this.$refs.popper && this.$refs.popper.doDestroy();
        this.dropdownUl = null;
      },

      handleClose() {
        this.visible = false;
      },

      toggleLastOptionHitState(hit) {
        if (!Array.isArray(this.selected)) return;
        const option = this.selected[this.selected.length - 1];
        if (!option) return;

        if (hit === true || hit === false) {
          option.hitState = hit;
          return hit;
        }

        option.hitState = !option.hitState;
        return option.hitState;
      },

      deletePrevTag(e) {
        if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
          const value = this.value.slice();
          value.pop();
          this.$emit('input', value);
        }
      },

      managePlaceholder() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },

      resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
      },

      resetInputHeight() {
        this.$nextTick(() => {
          if (!this.$refs.reference) return;
          let inputChildNodes = this.$refs.reference.$el.childNodes;
          let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          const tags = this.$refs.tags;
          input.style.height = this.selected.length === 0
            ? sizeMap[this.size] + 'px'
            : Math.max(tags ? (tags.clientHeight + 6) : 0, sizeMap[this.size] || 36) + 'px';
          if (this.visible && this.emptyText !== false) {
            this.broadcast('ElSelectDropdownCustomer', 'updatePopper');
          }
        });
      },

      resetHoverIndex() {
        setTimeout(() => {
          if (!this.multiple) {
            this.hoverIndex = this.options.indexOf(this.selected);
          } else {
            if (this.selected.length > 0) {
              this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
            } else {
              this.hoverIndex = -1;
            }
          }
        }, 300);
      },

      handleOptionSelect(option) {
        if (this.multiple) {
          const value = this.value.slice();
          const optionIndex = this.getValueIndex(value, option.value);
          if (optionIndex > -1) {
            value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
            value.push(option.value);
          }
          
          this.$emit('input', value);
            
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          
          if (this.filterable) {
            this.$refs.input.focus();
          }
        } else {
          this.$emit('input', option.value);
          this.visible = false;
        }
        this.$nextTick(() => this.scrollToOption(option));
      },

      getValueIndex(arr = [], value) {
        const isObject = Object.prototype.toString.call(value).toLowerCase() === '[object object]';
        if (!isObject) {
          return arr.indexOf(value);
        } else {
          const valueKey = this.valueKey;
          let index = -1;
          arr.some((item, i) => {
            if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
              index = i;
              return true;
            }
            return false;
          });
          return index;
        }
      },

      toggleMenu() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },

      navigateOptions(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
        this.optionsAllDisabled = this.options.length === this.options.filter(item => item.disabled === true).length;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
        this.$nextTick(() => this.scrollToOption(this.options[this.hoverIndex]));
      },

      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },

      deleteSelected(event) {
        event.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
        this.$emit('clear');
      },

      deleteTag(event, tag) {
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled) {
          const value = this.value.slice();
          value.splice(index, 1);
          this.$emit('input', value);
          this.$emit('remove-tag', tag);
        }
        event.stopPropagation();
      },

      onInputChange() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },

      onOptionDestroy(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        let index = this.options.indexOf(option);
        if (index > -1) {
          this.options.splice(index, 1);
        }
        this.broadcast('ElOptionCustomer', 'resetIndex');
      },

      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      },

      checkDefaultFirstOption() {
        this.hoverIndex = -1;
        for (let i = 0; i !== this.options.length; ++i) {
          const option = this.options[i];
          if (this.query) {
            // pick first options that passes the filter
            if (!option.disabled && !option.groupDisabled && option.visible) {
              this.hoverIndex = i;
              break;
            }
          } else {
            // pick currently selected option
            if (option.itemSelected) {
              this.hoverIndex = i;
              break;
            }
          }
        }
      },

      getValueKey(item) {
        if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
          return item.value;
        } else {
          return getValueByPath(item.value, this.valueKey);
        }
      }
    },

    created() {
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }

      this.debouncedOnInputChange = debounce(this.debounce, () => {
        this.onInputChange();
      });

      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
    },

    mounted() {
      if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
      
      this.referenceElm = this.$refs.reference.$el;
      this.setSelected();
    },

    beforeDestroy() {
      if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  };
</script>
