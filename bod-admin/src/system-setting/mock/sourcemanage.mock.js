class SourcesManageMock {
    columns () {
        return [
            {
                prop: 'code',
                label: '编码',
                align: 'center'
            },
            {
                prop: 'name',
                label: '名称',
                align: 'center'
            },
            {
                prop: 'url',
                label: '属性',
                align: 'center'
            },
            {
                prop: 'userName',
                label: '创建人',
                align: 'center'
                	
            },
            {
                prop: 'createTime',
                label: '创建时间',
                width: 180,
                align: 'center'
            }
        ]
    }
    treeData () {
        return [
            {
                'resourceId': 1,
                'userId': null,
                'name': '引擎管理',
                'code': '0001',
                'url': 'sysMenu/getChildMenu',
                'parentId': 0,
                'des': '我是引擎管理',
                'birth': 1482473854000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 2,
                'userId': null,
                'name': '规则管理',
                'code': '0002',
                'url': 'sysMenu/getChildMenu',
                'parentId': 0,
                'des': '我是规则管理',
                'birth': 1482473898000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 3,
                'userId': null,
                'name': '数据管理',
                'code': '0003',
                'url': 'datamanage/field',
                'parentId': 0,
                'des': '我是规则管理',
                'birth': 1482473927000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 4,
                'userId': null,
                'name': '系统管理',
                'code': '0004',
                'url': 'sysUser',
                'parentId': 0,
                'des': '我是系统管理',
                'birth': 1482473967000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 11,
                'userId': null,
                'name': '用户管理',
                'code': '0005',
                'url': 'sysUser/view',
                'parentId': 4,
                'des': '我是用户管理',
                'birth': 1482474008000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 12,
                'userId': null,
                'name': '角色管理',
                'code': '0006',
                'url': 'sysRole/view',
                'parentId': 4,
                'des': '我是角色管理',
                'birth': 1482474073000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 15,
                'userId': null,
                'name': '知识库索引页',
                'code': '0008',
                'url': 'knowledge/tree',
                'parentId': 2,
                'des': '我是规则管理1',
                'birth': 1482474149000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 16,
                'userId': null,
                'name': '规则管理22',
                'code': '0009',
                'url': 'guize/view/2',
                'parentId': 2,
                'des': '我是规则管理2',
                'birth': 1482474182000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 17,
                'userId': null,
                'name': '通用字段',
                'code': '0010',
                'url': 'datamanage/field',
                'parentId': 3,
                'des': '我是数据管理1',
                'birth': 1482474251000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 18,
                'userId': null,
                'name': '数据库管理',
                'code': '0011',
                'url': 'shuju/view/2',
                'parentId': 3,
                'des': '我是数据管理2',
                'birth': 1482474315000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 19,
                'userId': null,
                'name': '引擎列表',
                'code': '0012',
                'url': 'engine/list',
                'parentId': 1,
                'des': '我是引擎管理1',
                'birth': 1482474347000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 20,
                'userId': null,
                'name': '系统新增权限1',
                'code': '0013',
                'url': 'save/view/1',
                'parentId': 12,
                'des': '我是系统新增权限1',
                'birth': 1482474430000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 23,
                'userId': null,
                'name': '系统修改权限1',
                'code': '0016',
                'url': 'update/view/1',
                'parentId': 12,
                'des': '我是系统修改权限1',
                'birth': 1482474639000,
                'icon': null,
                'status': true
            },
            {
                'resourceId': 25,
                'userId': null,
                'name': '系统删除权限1',
                'code': '0018',
                'url': 'delete/view/1',
                'parentId': 12,
                'des': '我是系统删除权限1',
                'birth': 1482474780000,
                'icon': null,
                'status': true
            }
        ]
    }
    getTableData (data) {
        let tableData = []
        tableData = data.map(function (item) {
            item.status = item.status === false ? '停用' : '启用'
            return item
        })
        return tableData
    }
    sourceRules () {
        return {
            name: [{required: true, message: '请输入资源编号', trigger: 'blur'}],
            code: [{required: true, message: '请选择资源名', trigger: 'blur'}],
            url: [{required: true, message: '请选择访问路径', trigger: 'blur'}]
        }
    }
}

export default new SourcesManageMock()
