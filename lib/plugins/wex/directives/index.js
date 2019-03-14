let model = require('./model')
let event = require('./event')
let ifElse = require('./ifElse')
let showHidden = require('./showHidden')
let key = require('./key')
let For = require('./for')
module.exports = function (...args) {
  return [model(...args), event(...args), ifElse(...args), showHidden(...args), For(...args), key(...args)]
}