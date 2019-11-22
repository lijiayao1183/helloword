<template lang="pug">

div.container-items
  div(v-if="data.length>0")   
    div.row.item(v-for="(item, index) in computedData" :class="{'last-item' :  (!hasMore || isShowMore) && (index === computedData.length - 1)}")
      div.symbol
        div.circle
        div.vertical-line
      label.margin-right(v-for="column in columns") {{item[column]}}
    div.row.margin-bottom.item.item-bottom(v-if="!isShowMore && hasMore")
      div.symbol
        div.circle
      el-button.checkmore(type="text" @click="checkmore") 查看更多
  <no-data-page v-else></no-data-page>
    
</template>
<script>
  import NoDataPage from './NoDataPage.vue'
  
  export default {
    props: ['data', 'columns'],
    data() {
      return {
        isShowMore: false
      }
    },
    components: { 
      'no-data-page': NoDataPage
    },
    computed: {
      hasMore() {
        return this.data.length > 3;
      },
      computedData() {
        let data = Object.assign([], this.data)
        if (!this.isShowMore) {
          return data.splice(0, 3)
        }
        return data
      }
    },
    methods: {
      checkmore() {
        this.isShowMore = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  $circle-color: #4ec872;
  $vertical-color: #ececec;
  .container-items {
    width: 100%;
    max-height: 380px;
    overflow: auto;
    overflow-x: hidden;
    min-height: 50px;
  }

  .item {
    height: 80px;
    margin-left: 20px;
    & > .symbol {
      margin-right: 20px;
      & > .circle {
        width: 15px;
        height: 15px;
        border: 2px solid $circle-color;
        border-radius: 50%;
        box-sizing: border-box;
      }
      & > .vertical-line {
        height: calc(100% - 15px);
        border: 0px solid $vertical-color;
        border-left-width: 2px;
        position: relative;
        left: 7px;
      }
    }
  }

  .last-item {
    height: 30px;
    & > .symbol {
      & > .vertical-line {
        border-left-width: 0px;
      }
    }
  }

  .item-bottom {
    height: 30px;
  }

  .checkmore {
    margin-top: -13px;
  }

  .row {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -15px;
    /* margin-left: -15px; */
  }
</style>
