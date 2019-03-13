const gulp = require('gulp');
const path = require('path');
let complie = require('./complie');
const utils = require('./utils')

let resolve = src => path.resolve(__dirname, '../', src)

function test(cb) {
  let src = resolve('test/dist')
  utils.delDir(src)
  utils.mkdir(src)
  gulp.src(['../test/*.vue'])
    .pipe(complie(src))
  cb();
}

function dev(cb) {
  complieArrs([
    { os: resolve('example'), bs: resolve('dist') },
    { os: resolve('lib'), bs: resolve('dist/lib') }
  ], cb)
}

function complieArrs(cps, cb) {
  cps && cps.forEach(it => {
    let { os, bs } = it
    let exclude = ['.less', '.scss']
    utils.delDir(bs)
    gulp.src([os + '/**/*.*'])
      .pipe(complie({ os, bs, exclude }))
  })
  cb();
}

// exports.test = test;
// exports.dev = dev;
// exports.default = gulp.series(test);