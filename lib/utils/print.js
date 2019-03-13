const chalk = require('chalk');
const log = console.log;
module.exports = {
  printSuccess(...msgs) {
    log(chalk.green(msgs.join(':')))
  },
  printError(...msgs) {
    log(chalk.red(msgs.join(':')))
  },
  printWarn(...msgs) {
    log(chalk.yellow(msgs.join(':')))
  }
}