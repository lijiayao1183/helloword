/*! jquery.caret 2016-02-27 */
!function (a, b) {'function' == typeof define && define.amd ? define(['jquery'], function (c) {return a.returnExportsGlobal = b(c)}) : 'object' == typeof exports ? module.exports = b(require('jquery')) : b(jQuery)}(this, function (a) {
  'use strict'
  var b, c, d, e, f, g, h, i, j, k, l
  k = 'caret', b = function () {
    function b (a) {this.$inputor = a, this.domInputor = this.$inputor[0]}

    return b.prototype.setPos = function (a) {
      var b, c, d, e
      return (e = j.getSelection()) && (d = 0, c = !1, (b = function (a, f) {
        var g, i, j, k, l, m
        for (l = f.childNodes, m = [], j = 0, k = l.length; k > j && (g = l[j], !c); j++) if (3 === g.nodeType) {
          if (d + g.length >= a) {
            c = !0, i = h.createRange(), i.setStart(g, a - d), e.removeAllRanges(), e.addRange(i)
            break
          }
          m.push(d += g.length)
        } else m.push(b(a, g))
        return m
      })(a, this.domInputor)), this.domInputor
    }, b.prototype.getIEPosition = function () {return this.getPosition()}, b.prototype.getPosition = function () {
      var a, b
      return b = this.getOffset(), a = this.$inputor.offset(), b.left -= a.left, b.top -= a.top, b
    }, b.prototype.getOldIEPos = function () {
      var a, b
      return b = h.selection.createRange(), a = h.body.createTextRange(), a.moveToElementText(this.domInputor), a.setEndPoint('EndToEnd', b), a.text.length
    }, b.prototype.getPos = function () {
      var a, b, c
      return (c = this.range()) ? (a = c.cloneRange(), a.selectNodeContents(this.domInputor), a.setEnd(c.endContainer, c.endOffset), b = a.toString().length, a.detach(), b) : h.selection ? this.getOldIEPos() : void 0
    }, b.prototype.getOldIEOffset = function () {
      var a, b
      return a = h.selection.createRange().duplicate(), a.moveStart('character', -1), b = a.getBoundingClientRect(), {
        height: b.bottom - b.top,
        left: b.left,
        top: b.top
      }
    }, b.prototype.getOffset = function () {
      var b, c, d, e, f
      return j.getSelection && (d = this.range()) ? (d.endOffset - 1 > 0 && d.endContainer !== this.domInputor && (b = d.cloneRange(), b.setStart(d.endContainer, d.endOffset - 1), b.setEnd(d.endContainer, d.endOffset), e = b.getBoundingClientRect(), c = {
        height: e.height,
        left: e.left + e.width,
        top: e.top
      }, b.detach()), c && 0 !== (null != c ? c.height : void 0) || (b = d.cloneRange(), f = a(h.createTextNode('|')), b.insertNode(f[0]), b.selectNode(f[0]), e = b.getBoundingClientRect(), c = {
        height: e.height,
        left: e.left,
        top: e.top
      }, f.remove(), b.detach())) : h.selection && (c = this.getOldIEOffset()), c && (c.top += a(j).scrollTop(), c.left += a(j).scrollLeft()), c
    }, b.prototype.range = function () {
      var a
      if (j.getSelection) return a = j.getSelection(), a.rangeCount > 0 ? a.getRangeAt(0) : null
    }, b
  }(), c = function () {
    function b (a) {this.$inputor = a, this.domInputor = this.$inputor[0]}

    return b.prototype.getIEPos = function () {
      var a, b, c, d, e, f, g
      return b = this.domInputor, f = h.selection.createRange(), e = 0, f && f.parentElement() === b && (d = b.value.replace(/\r\n/g, '\n'), c = d.length, g = b.createTextRange(), g.moveToBookmark(f.getBookmark()), a = b.createTextRange(), a.collapse(!1), e = g.compareEndPoints('StartToEnd', a) > -1 ? c : -g.moveStart('character', -c)), e
    }, b.prototype.getPos = function () {return h.selection ? this.getIEPos() : this.domInputor.selectionStart}, b.prototype.setPos = function (a) {
      var b, c
      return b = this.domInputor, h.selection ? (c = b.createTextRange(), c.move('character', a), c.select()) : b.setSelectionRange && b.setSelectionRange(a, a), b
    }, b.prototype.getIEOffset = function (a) {
      var b, c, d, e
      return c = this.domInputor.createTextRange(), a || (a = this.getPos()), c.move('character', a), d = c.boundingLeft, e = c.boundingTop, b = c.boundingHeight, {
        left: d,
        top: e,
        height: b
      }
    }, b.prototype.getOffset = function (b) {
      var c, d, e
      return c = this.$inputor, h.selection ? (d = this.getIEOffset(b), d.top += a(j).scrollTop() + c.scrollTop(), d.left += a(j).scrollLeft() + c.scrollLeft(), d) : (d = c.offset(), e = this.getPosition(b), d = {
        left: d.left + e.left - c.scrollLeft(),
        top: d.top + e.top - c.scrollTop(),
        height: e.height
      })
    }, b.prototype.getPosition = function (a) {
      var b, c, e, f, g, h, i
      return b = this.$inputor, f = function (a) {return a = a.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>'), /firefox/i.test(navigator.userAgent) && (a = a.replace(/\s/g, '&nbsp;')), a}, void 0 === a && (a = this.getPos()), i = b.val().slice(0, a), e = b.val().slice(a), g = '<span style=\'position: relative; display: inline;\'>' + f(i) + '</span>', g += '<span id=\'caret\' style=\'position: relative; display: inline;\'>|</span>', g += '<span style=\'position: relative; display: inline;\'>' + f(e) + '</span>', h = new d(b), c = h.create(g).rect()
    }, b.prototype.getIEPosition = function (a) {
      var b, c, d, e, f
      return d = this.getIEOffset(a), c = this.$inputor.offset(), e = d.left - c.left, f = d.top - c.top, b = d.height, {
        left: e,
        top: f,
        height: b
      }
    }, b
  }(), d = function () {
    function b (a) {this.$inputor = a}

    return b.prototype.css_attr = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'], b.prototype.mirrorCss = function () {
      var b, c = this
      return b = {
        position: 'absolute',
        left: -9999,
        top: 0,
        zIndex: -2e4
      }, 'TEXTAREA' === this.$inputor.prop('tagName') && this.css_attr.push('width'), a.each(this.css_attr, function (a, d) {return b[d] = c.$inputor.css(d)}), b
    }, b.prototype.create = function (b) {return this.$mirror = a('<div></div>'), this.$mirror.css(this.mirrorCss()), this.$mirror.html(b), this.$inputor.after(this.$mirror), this}, b.prototype.rect = function () {
      var a, b, c
      return a = this.$mirror.find('#caret'), b = a.position(), c = {
        left: b.left,
        top: b.top,
        height: a.height()
      }, this.$mirror.remove(), c
    }, b
  }(), e = {contentEditable: function (a) {return !(!a[0].contentEditable || 'true' !== a[0].contentEditable)}}, g = {
    pos: function (a) {return a || 0 === a ? this.setPos(a) : this.getPos()},
    position: function (a) {return h.selection ? this.getIEPosition(a) : this.getPosition(a)},
    offset: function (a) {
      var b
      return b = this.getOffset(a)
    }
  }, h = null, j = null, i = null, l = function (a) {
    var b
    return (b = null != a ? a.iframe : void 0) ? (i = b, j = b.contentWindow, h = b.contentDocument || j.document) : (i = void 0, j = window, h = document)
  }, f = function (a) {
    var b
    h = a[0].ownerDocument, j = h.defaultView || h.parentWindow
    try {return i = j.frameElement} catch (c) {b = c}
  }, a.fn.caret = function (d, f, h) {
    var i
    return g[d] ? (a.isPlainObject(f) ? (l(f), f = void 0) : l(h), i = e.contentEditable(this) ? new b(this) : new c(this), g[d].apply(i, [f])) : a.error('Method ' + d + ' does not exist on jQuery.caret')
  }, a.fn.caret.EditableCaret = b, a.fn.caret.InputCaret = c, a.fn.caret.Utils = e, a.fn.caret.apis = g
})
