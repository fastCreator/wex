let lifecycle = {
  before: [],
  loading: [],
  after: [],
  end: []
}

let utils = {
  htmlParse: require('./htmlParse'),
  ...require('../utils'),
  ...require('./ast'),
}

function registerPlugin(plugins) {
  plugins.forEach(plugin => {
    for (let key in lifecycle) {
      if (plugin[key]) {
        lifecycle[key].push(plugin[key])
      }
    }
  })
}

async function hookPlugin(type, ...args) {
  for (let i = 0; i < lifecycle[type].length; i++) {
    await lifecycle[type][i](utils, ...args)
  }
}

module.exports = {
  lifecycle, registerPlugin, hookPlugin
}