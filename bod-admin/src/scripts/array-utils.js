export default {
  partition (data, maxLength) {
    if (data.length === 0) {
      return []
    }
    let result = []
    let length = data.length
    let n = Math.ceil(length / maxLength)
    let startIndex = 0
    let endIndex = maxLength
    for (let i = 0; i < n; i++) {
      result.push(data.slice(startIndex, endIndex))
      startIndex = endIndex
      endIndex = startIndex + maxLength
    }
    return result
  }
}
