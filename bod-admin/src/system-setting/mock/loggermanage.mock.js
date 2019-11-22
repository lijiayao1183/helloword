class LoggerManageMock {
    columns () {
        return [
            {
                prop: 'id',
                label: 'ID',
                align: 'left'
            },
            {
                prop: 'organName',
                label: '组织名称',
                align: 'left'
            },
            {
                prop: 'opName',
                label: '操作名称',
                align: 'left'
            },
            {
                prop: 'userName',
                label: '操作人员名称',
                align: 'left'
            },
            {
                prop: 'ip',
                label: 'IP',
                width: 140,
                align: 'left'
            },
            {
                prop: 'createTime',
                label: '时间',
                width: 180,
                align: 'left'
            }
        ]
    }
    arrowColumns () {
        return [
            {
                prop: 'opName',
                label: '操作名称',
                align: 'left'
            },
            {
                prop: 'userName',
                label: '操作人员名称',
                align: 'left'
            },
            {
                prop: 'ip',
                label: 'IP',
                align: 'left'
            },
            {
                prop: 'requestPath',
                label: '请求路径',
                align: 'left'
            },
            {
                prop: 'requestParam',
                label: '请求参数',
                align: 'left'
            },
            {
                prop: 'responseParam',
                label: '响应参数',
                align: 'left'
            }
        ]
    }
    getTableData (data) {
        let tableData = []
        tableData = data.map(function (item) {
            item.status = item.status === 0 ? '停用' : '启用'
            return item
        })
        return tableData
    }
    loggerRules () {
        return {
            roleName: [{required: true, message: '请输入角色名', trigger: 'blur'}],
            organId: [{required: true, message: '请选择所属公司', trigger: 'change'}]
        }
    }
}

export default new LoggerManageMock()
