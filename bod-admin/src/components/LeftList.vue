<template>
  <div id="left-list">
    <template v-if="isSearch">
      <div class="left-list-topSearch">
        <el-input placeholder="搜索" v-model="listItemKey">
        </el-input>
       <slot name="checkbox"></slot>
      </div>
    </template>
    <div class="list-item-container" :class="{'border-bottom-none':!isEdit}">
      <ul class="scroll-small">
        <template v-for="(item,index) in filteredData">
          <template v-if="'back'==item.path">
            <div class="back" :key="index">
              <span @click="back">
              <span style="color:#20a0ff; cursor: pointer">&lt;</span>
              <el-button type="text"  style="">返回</el-button>
              </span>
            </div>
          </template>
          <template v-else>
            <el-tooltip :disabled="tipDisabled[index]" :content="item[prop.name]" :key="index">
              <li @click="listItemClick(item[prop.id])"
                  :class="{select:selectItemId === item[prop.id],highlight:item[prop.isHighlight]}">
                <el-badge :value="item.snapshotCount"
                  :max="99">
                  <i class="iconfont item-icon"
                    v-html="itemIcon"></i>
                </el-badge>
                <span class="ellipsis">{{item[prop.name]}}</span>
                <template v-if="isEdit">
                  <i class="iconfont delete-icon"
                     @click.stop="deleteItem(item[prop.id], item[prop.name])" v-html="operateIcon"></i>
                </template>
              </li>
            </el-tooltip>
          </template>
        </template>
      </ul>
    </div>
    <template v-if="notSnapshot">
      <div class="btn-create" v-if="isEdit">
        <el-button type="primary" @click="createItem">创建{{createLabel}}</el-button>
      </div>
    </template>
  </div>
</template>
<script type="text/babel">
  export default {
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      notSnapshot: {
        type: Boolean,
        default: true
      },
      operateIcon: {
        type: String,
        default: '&#xe632;'
      },
      itemIcon: {
        type: String,
        default: '&#xe637;'
      },
      createLabel: {
        type: String,
        default: '创建'
      },
      prop: {
        type: Object,
        default() {
          return {
            name: 'name',
            id: 'id',
            isHighlight: 'isHighlight'
          }
        }
      },
      isEdit: {
        type: Boolean,
        default: true
      },
      selectItemId: {
        type: [String, Number],
        default: Number.MAX_VALUE
      },
      isShowBadge: {
        type: Boolean,
        default: false
      },
      isSearch: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        listItemKey: '',
        tipDisabled: {},
      }
    },
    created() {
      console.dir(this.selectItemId);
    },
    computed: {
      filteredData(){
          let filteredData = this.data;
          let key = _.trim(this.listItemKey);
          if (key) {
            filteredData = _.filter(this.data, (item) => {
              return item[this.prop.name].indexOf(key) > -1
            })
          }
          return filteredData;
      }
    },
    methods: {
      back() {
        this.$router.push({
          name: "snapshot-list",
          params: {engineId: this.$route.params.engineId}
        });
      },
      createItem() {
        this.$emit('createItem');
      },
      deleteItem(id, name) {
        this.$emit('deleteItem', id, name);
      },
      listItemClick(id) {
        this.$emit('listItemClick', id);
      }
    },
    updated() {
      this.$nextTick(() => {
        _.forEach($('.ellipsis'), (item, index) => {
          let disabled = item.offsetWidth >= item.scrollWidth;
          this.$set(this.tipDisabled, index, disabled)
        });
      })
    }
  }
</script>
<style lang="scss">
  #left-list {
    font-size: 14px;
    height: 100%;
    border-right: 1px solid $split-color;
    $badge-size: 15px;
    .back {
      border-bottom: 1px solid #e7e7e7;
      height: 37px;
      line-height: 37px;
      box-sizing: border-box;
      padding-left: 10px;
    }
    .el-input {
      padding-bottom: 3px;
      .el-input__inner {
        height: 37px;
        line-height: 37px;
        border-radius: 0px;
        border-width: 0px;
        text-align:center;
      }
      .el-input__inner:focus {
        outline: 0;
        border-color: #20a0ff;
        border-width: 1px;
      }
      }
      .el-button {
        border-radius: 0;
      }
    .checkbox-filter{
      position:absolute;
      right:0px;
      top:0;
    }
    .el-badge {
      bottom: 17px;
    }
    .el-badge__content {
      background-color: #22C9A1;
      border-radius: $badge-size;
      height: $badge-size;
      width: $badge-size;
      line-height: $badge-size;
      padding: 1px;
      &.is-fixed {
        top: 12px;
        right: 35px;
      }
    }
    .left-list-topSearch {
      position:relative;
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid $split-color;
      margin-bottom: 0px;
      border-left: 1px solid $split-color;
    }

    .list-item-container {
      height: calc(100% - 73px);
      border: 1px solid $split-color;
      border-right: none;
      box-sizing: border-box;
      ul {
        list-style-type: none;
        overflow-y: auto;
        height: 100%;
        margin: 0;
        padding: 0;
        li {
          clear: both;
          cursor: pointer;
          height: 37px;
          padding-left: 20px;
          line-height: 37px;
          color: $one-nav-text-color;
          i {
            padding-right: 5px;
            float: left;
          }
          span {
            width: 70%;
            display: inline-block;
            position: relative;
          }
          &:hover{
            background-color: $two-nav-focus;
            border: 0 solid black;
            border-left-width: 5px;
            border-left-color: #20a0ff;
            .delete-icon {
              display: inline-block;
            }
          }
        &.select{
          background-color: $two-nav-focus;
          border: 0 solid black;
          border-left-width: 5px;
          border-left-color: #20a0ff;
          .delete-icon {
            display: inline-block;
          }
        }
        }
        .delete-icon {
          display:none;
          float: right;
          position: relative;
          font-size: 20px;
        }
        .item-icon {
          font-size: 20px;
        }
      }
    }
    .btn-create {
      border: 1px solid $split-color;
      border-top: none;
      text-align: center;
      position: absolute;
      height: 39px;
      bottom: 0;
      width: 238px;
      .el-button {
        height: 100%;
        width: 100%;
        border-radius: 0;
      }
    }
  }
  .border-bottom-none {
    border-bottom: none !important;
  }

  #snapshot-report-list #left-list .list-item-container {
    height: calc(100%);
  }

  #snapshot-list #left-list .list-item-container {
    height: calc(100% - 37px);
  }
  .highlight {
    color: #20a0ff !important;
  }
</style>
