
const utils = require('../utils')
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
  endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
  attr = /([-A-Za-z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

var HTMLParser = function (html, handler) {
  var index, chars, match, stack = [], last = html;
  stack.last = function () {
    return this[this.length - 1];
  };

  while (html) {
    chars = true;
    // 注释
    if (html.indexOf("<!--") === 0) {
      index = html.indexOf("-->");
      if (index >= 0) {
        if (handler.comment)
          handler.comment(html.substring(4, index));
        html = html.substring(index + 3);
        chars = false;
      }
      // end tag
    } else if (html.indexOf("</") === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf("<") === 0) {
      match = html.match(startTag);
      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf("<");

      var text = index < 0 ? html : html.substring(0, index);
      html = index < 0 ? "" : html.substring(index);

      if (handler.chars)
        handler.chars(text);
    }

    if (html === last) {
      utils.printError('template解析异常')
      throw html
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();
    stack.push(tagName);
    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function (match, name) {
        var value = arguments[2] ? arguments[2] :
          arguments[3] ? arguments[3] :
            arguments[4] ? arguments[4] : "";

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
        });
      });

      if (handler.start)
        handler.start(tagName, attrs, unary);

      unary = !!unary;
    }
    if (unary) {
      parseEndTag("", tagName);
    }
  }

  function parseEndTag(tag, tagName) {
    if (!tagName) {
      stack.length = 0
    } else {
      let pop = stack.pop()
      if (handler.end) {
        handler.end(pop)
      }
    }
  }
};
// let results = ''
// HTMLParser(`
//   <view :click="a">
//     <image src='/images/BasicsBg.png' mode='widthFix' class='png' style='width:100%;height:486rpx'/>
//     <view wx:if="{{length > 5}}">1</view>
//     <view wx:for="{{array}}">
//       {{index}}: {{item.message}}
//     </view>
//     <view>{{ message }}</view>
//     <view>{{ message + 1 }}</view>
//   </view>
// `, {
//     start: function (tag, attrs, unary) { //标签开始
//       results += "<" + tag;

//       for (var i = 0; i < attrs.length; i++)
//         results += ` ${attrs[i].name}="${attrs[i].escaped}"`

//       results += ">";
//     },
//     end: function (tag) { //标签结束
//       results += "</" + tag + ">";
//     },
//     chars: function (text) { //文本
//       results += text;
//     },
//     comment: function (text) { //注释
//       results += "<!--" + text + "-->";
//     }
//   })
// console.log(results)
module.exports = HTMLParser


