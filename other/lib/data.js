var fs = require('fs');
var path = require('path')

var lib = {}

lib.baseDir = path.join(__dirname,'../.dtata/');

lib.list = (dir, cb) => {
  fs.readdir(lib.baseDir+dir+'/',(err,data) => {
    if(!err && data && data.length > 0) {
      var trimmedFileNames = []
      data.forEach(fileName => {
        trimmedFileNames.push(fileName.replace('.json',''))
      })
      cb(false,trimmedFileNames)
    } else {
      cb(err,data)
    }
  })
}