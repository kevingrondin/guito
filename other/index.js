/**
 * Primary file for the API
 */

const cli = require('./lib/cli')

var app = {}

app.init = () => {
  // Start the server
  // server.init()

  // Start the workers

  //  Start the CLI, but make sure it starts last
  setTimeout(() => {
    cli.init()
  }, 500)
}

app.init()

module.exports = app;