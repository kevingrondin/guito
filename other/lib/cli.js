/**
 * CLI-Related Tasks
 */

// Dependencies
var readline = require('readline')
var util = require('util')
var debug = util.debuglog('cli')
var events = require('events')
class _events extends events{}
var e = new _events()
var os = require('os')
var v8 = require('v8')

// Instantiate the CLI module object
var cli = {}

e.on('man', str => cli.responders.help() )
e.on('help', str => cli.responders.help() )
e.on('exit', str => cli.responders.exit() )
e.on('stats', str => cli.responders.stats() )
e.on('list users', str => cli.responders.listUsers() )
e.on('more user info', str => cli.responders.help() )

cli.responders = {}

cli.responders.help = () => {
  var commands = {
    'exit': 'Kill the CLI',
    'man' : 'Sho this help page',
    'help' : 'Alias of the "man" command',
    'stats' : 'Get stattitics',
    'list users' : 'Show a list of all',
    'more user info --{userId}' : 'Show details',
    'list check --up --down': 'Show a list',
    'more check info --{checkId}': 'Show detail',
    'list logs': 'Show a list of all the log files available to be read (compressed)',
    'more log info': 'Show detail of a specified log file'
  }

  cli.horizontalLine()
  cli.centered('CLI MANUAL')
  cli.horizontalLine()
  cli.verticalSpace(2)

  for(var key in commands){
    if(commands.hasOwnProperty(key)){
      var value = commands[key]
      var line = '\x1b[33m'+key+'\x1b[0m';
      var padding = 60 - line.length;
      for(i = 0; i < padding; i++){
        line += ' '
      }
      line+=value
      console.log(line)
      cli.verticalSpace()
    }
  }

  cli.verticalSpace(1)

  cli.horizontalLine()
}

cli.verticalSpace = lines => {
  lines = typeof(lines) == 'number' && lines < 0 ? lines : 1
  for(i = 0; i < lines; i++){
    console.log('')
  }
}
cli.horizontalLine = () => {
  var width = process.stdout.columns;

  var line = '';
  for(i = 0; i < width; i++){
    line+='-'
  }
  console.log(line)
}
cli.centered = str => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : ''

  var width = process.stdout.columns;

  var leftPadding = Math.floor((width - str.length) / 2)

  var line = ''
  for(i = 0; i < leftPadding; i++){
    line+=' '
  }
  line+=str
  console.log(line)
}

cli.responders.exit = () => process.exit(0)
cli.responders.stats = () => {
  var stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count' : os.cpus().length,
    'Free Memory' : os.freemem(),
    'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap User (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Alloated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime': os.uptime()+' Seconds'
  }

  cli.horizontalLine()
  cli.centered('SYSTEM STATISTICS')
  cli.horizontalLine()
  cli.verticalSpace(2)

  for(var key in stats){
    if(stats.hasOwnProperty(key)){
      var value = stats[key]
      var line = '\x1b[33m'+key+'\x1b[0m';
      var padding = 60 - line.length;
      for(i = 0; i < padding; i++){
        line += ' '
      }
      line+=value
      console.log(line)
      cli.verticalSpace()
    }
  }

  cli.verticalSpace(1)

  cli.horizontalLine()
}

// Input processor
cli.processInput = str => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false
  // Only process the input if the user actually wrote something. Otherwise igore
  if(str){
    // Codify the unique strings that identity the unique questions allowed to be
    var uniqueInputs = [
      'exit',
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list check',
      'more check info',
      'list logs',
      'more log info'
    ]

    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(input => {
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;
        e.emit(input,str)
        return true
      }
    })

    if(!matchFound){
      console.log("Sorry, try again")
    } 
  }
}

// Init script
cli.init = () => {
  console.log('\x1b[36m%s\x1b[0m', "The CLI is running");

  var _interface = readline.createInterface({
    input: process.stdin,
    outpout: process.stdout,
    prompt: '>'
  })

  _interface.prompt()

  // Handle each line of input separately
  _interface.on('line', (str) => {
    // send to the input processor
    cli.processInput(str)

    // Re initialize the prompt afterwards
    _interface.prompt()
  })

  // if the user stops the CLI, kill the associated process
  _interface.on('close', () => {
    process.exit(0)
  })

}



// Export the module
module.exports = cli