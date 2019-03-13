const through = require('through2');
const less = require('less');
var sass = require('node-sass');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const compiler = require('vue-template-compiler')
const utils = require('./utils')
const HTMLParser = require('./htmlParse')

const wexextname = '.vue'

module.exports = function (opt) {
  return through.obj(function (file, encoding, cb) {
    if (opt.exclude && opt.exclude.includes(file.extname)) {
      cb()
    } else if (file.extname === wexextname) {
      dealwex(file, encoding, cb, opt)
    } else {
      utils.writeFile(getWritePath(opt.os, opt.bs, file) + file.extname, file.content)
      cb()
    }
  });
};

function getWritePath(os, bs, file) {
  let relativePath = path.relative(os, file.dirname);
  return path.resolve(bs, relativePath, file.stem)
}

function dealwex(file, encoding, cb, opt) {
  if (file.isNull()) {
    return cb(null, file);
  }
  if (file.isStream()) {
    return cb(new PluginError('gulp-less', 'Streaming not supported'));
  }
  let { os, bs } = opt
  let filePath = getWritePath(os, bs, file)
  var contents = file.contents.toString();
  let sfc = compiler.parseComponent(contents, { pad: 'line' });
  compileStyle(sfc.styles, filePath, file.dirname)
  compileTemplate(sfc.template, filePath)
  compileScript(sfc.script, filePath)
  compileJSON(sfc.customBlocks.find(it => it.type === 'json'), filePath)
  cb(null, file)
}

async function compileJSON(data, path) {
  if (data) {
    path = path + '.json'
    utils.writeFile(path, data.content.replace(/\n/g, ''))
  }

}

async function compileTemplate(data, path) {
  if (data) {
    path = path + '.wxml'
    let res = parseTemplate(data.content)
    utils.writeFile(path, res.results)
    return res
  }
}

async function compileScript(data, path) {
  let str = ''
  path = path + '.wxs'
  utils.writeFile(path, data.content.replace(/\/\/\n/g, ''))
}

async function compileStyle(styles, path, oldfilePath) {
  let str = ''
  path = path + '.wxss'
  for (let i = 0; i < styles.length; i++) {
    let style = styles[i]
    let content = style.content
    if (style.lang === 'less') {
      let res = await less.render(content, { compress: false, paths: [oldfilePath] }).catch(err => { utils.error(err, 'less解析失败') })
      str += res.css
    } else if (style.lang === 'scss') {
      str += await parseSass(content, oldfilePath).catch(err => { utils.error(err, 'scss解析失败') })
    } else {
      str += content
    }
  }
  utils.writeFile(path, str)
}

function parseTemplate(temp) {
  var results = "";
  let observer = []
  let isRoot = false
  let wxfor = {
    count: 0,
    index: 'index',
    item: 'item'
  }
  HTMLParser(temp, {
    start: function (tag, attrs, unary) { //标签开始
      results += "<" + tag;
      if (wxfor.count) {
        wxfor.count++
      }
      let attrObj = {}
      for (var i = 0; i < attrs.length; i++) {
        results += ` ${attrs[i].name}="${attrs[i].escaped}"`
        attrObj[attrs[i].name] = attrs[i].escaped
      }
      if (attrObj['wx:for']) {
        wxfor = {
          count: 1,
          index: attrObj['wx:for-index'] || 'index',
          item: attrObj['wx:for-item'] || 'item'
        }
      }
      for (var i = 0; i < attrs.length; i++) {
        getObserve(attrs[i].escaped)
      }
      results += (unary ? "/" : "") + ">";
      isRoot = true
    },
    end: function (tag) { //标签结束
      results += "</" + tag + ">";
      if (wxfor.count) {
        wxfor.count--
      }
    },
    chars: function (text) { //文本
      getObserve(text)
      results += text;
    },
    comment: function (text) { //注释
      results += "<!--" + text + "-->";
    }
  });

  function getObserve(text) {
    let obs = text.match(/{{.+?}}/g)
    if (obs) {
      observer.splice(0, 0, ...obs.map(it => it.replace(/{|}/g, '').trim()).filter(it => !wxfor.count || (it !== wxfor.index && it !== wxfor.item)))
    }
  }
  return {
    results: results,
    observer: observer
  };
}

function parseSass(content, oldfilePath) {
  return new Promise((resolve, reject) => {
    sass.render({
      data: content,
      includePaths: [oldfilePath]
    }, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result.css)
      }
    })
  })
}


