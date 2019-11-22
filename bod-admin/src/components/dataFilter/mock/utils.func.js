class Utils {
    getformatDate (birth, format) {
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
        let dateFormat = format || 'yyyy-MM-dd'
        return new Date(birth).format(dateFormat)
    }

    getEnumValueScope (valueScope) {
        valueScope = valueScope.replace(/,$/, '')
        let source = valueScope.split(/[,，]/g)
        if (!source.length) {
            return []
        }
        return source.map(
            (item) => {
                let jsonArr = item.split(/[:：]/g)
                if (!jsonArr.length) {
                    return []
                }
                if (jsonArr.length === 2) {
                    return {
                        id: jsonArr[1],
                        name: jsonArr[0]
                    }
                }
                return {
                    id: jsonArr[0],
                    name: jsonArr[0]
                }
            }
        )
    }
    indexOfAll(array, item) {
        let result = []
        array.forEach(
            (aitem, index) => {
                if (aitem === item) {
                    result.push(index)
                }
            }
        )
        return result
    }
}

export default new Utils()
