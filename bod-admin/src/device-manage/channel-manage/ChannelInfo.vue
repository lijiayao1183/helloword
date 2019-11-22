<template>
  <div id="common-field-com" style="height: 100%;">
    <div class="content-container">
      <div class="left-nav-tree">
        <left-tree :treeData="treeData" :treeProps="treeProps" :rootNodes="rootNodes"
                   @node-click="catalogClick"
                   :defaultNodeId="$route.params.catalogId"></left-tree>
      </div>
      <div class="content">
        <router-view :treeData="treeData" :rootNodes="rootNodes"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import LeftTree from '../components/LeftTree.vue'
  import api from './scripts/api'
  import * as _ from 'lodash'
  import bus from '../scripts/bus'

  export default {
    data () {
      return {
        treeData: [],
        rootNodes: [{name: '分组', id: 0}],
        treeProps: {
          id: 'id',
          label: 'catalog',
          children: 'children'
        }
      }
    },
    created () {
      this.loadTreeData()
      bus.$on('treeDataChange', this.loadTreeData)
      bus.$on('openId', this.catalogClick)
    },
    methods: {
      loadTreeData () {
        api.catalogTree.getAllTree().then(data => {
          this.treeData = data
        }).catch((data) => {

        })
      },
      catalogClick (id) {
        this.$router.push({name: 'channel-list-info', params: {catalogId: id}})
      }
    },
    beforeDestroy () {
      bus.$off('treeDataChange', this.loadTreeData)
      bus.$off('openId', this.catalogClick)
    },
    components: {
      'left-tree': LeftTree
    }
  }
</script>
<style lang="scss">
  #common-field-com {
    height: 100%;
    position: relative;

    .content-container {
      height: 100%;
      width: 100%;
      .left-data{
        width: 50px;
        height:100%;
        float: left;
      }
      .left-nav-tree {
        overflow: hidden;
        height: 100%;
        width: 234px;
        float: left;
      }
      .content {
        width: calc(100% - 234px);
        overflow: hidden;
        height: 100%;
        float: left;
        padding: 0px;
      }
    }
  }
</style>
