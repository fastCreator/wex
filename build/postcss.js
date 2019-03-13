const postcss  = require('postcss');
const scoped = require('./scoped');

postcss([scoped('v-data-123123')]).process('body.aaaaaaaaaaa[a=1]{color:red;}').then(res => {
  console.log(res.css)
})

module.exports = {
  cssScoped(css, scopedId) {
    return postcss([scoped(scopedId)]).process(css)
  }
};