class Utils {
    randomString (len) {
        len = len || 32
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        let maxPos = chars.length
        let pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos))
        }
        return pwd
    }
    transToId (arr, type) {
        let idArr = arr.map((item) => {
            return item[type]
        })
        return idArr.join(',')
    }
    getToday () {
        let myDate = new Date()
        let year = myDate.getFullYear().toString()
        let month = (myDate.getMonth() + 1).toString()
        let day = myDate.getDate().toString()
        return year + '-' + month + '-' + day
    }
    /**
     * 遍历树得到选中key值
     * @param {*数据} data
     * @param {*选中属性名} isCheck
     * @param {*key} resourceId
     * @param {*子节点属性名} children
     * @param {*保存到哪里} keys
     */
    traverseTree (data, isCheck, resourceId, children, keys) {
      for (let i = 0; i < data.length; i++) {
        if (data[i][isCheck]) {
          keys.push(data[i][resourceId])
        }
        if (data[i].children.length) {
          this.traverseTree(data[i][children], isCheck, resourceId, children, keys)
        }
      }
    }

    resetChildNodesId (data, prefix) {
        for (let i = 0; i < data.length; i++) {
            data[i].id = prefix + ',' + data[i].id
            if (data[i].children.length) {
                this.resetChildNodesId(data[i].children, prefix)
            }
        }
    }

    getformatDate (list, birth, format, newBirth) {
        Date.prototype.format = function (fmt) {
            let o = {
                'M+': this.getMonth() + 1,
                'd+': this.getDate(),
                'h+': this.getHours(),
                'm+': this.getMinutes(),
                's+': this.getSeconds(),
                'q+': Math.floor((this.getMonth() + 3) / 3),
                'S': this.getMilliseconds()
            }
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                }
            }
            return fmt
        }
        let property = birth || ['birth']
        let dateFormat = format || 'yyyy-MM-dd'
        let newProperty = newBirth || 'createTime'
        return list.map(
            (item) => {
                property.forEach(
                    (pitem) => {
                        let time = new Date(item[pitem]).format(dateFormat)
                        item[newProperty] = time
                    }
                )
                return item
            }
        )
    }
}
export default new Utils()
