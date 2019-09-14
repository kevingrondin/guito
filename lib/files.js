const fs = require('fs');
const path = require('path');

module.exports = {

    getCurrentDirectoryBase : () => {
        return path.basename(process.cwd())
    },

    directoryExists : () => {
        try {
            return fs.statSync(filepath).isDirectory()
        } catch (err) {
            return false
        }
    },

    isGitRepository: () => {
        if(FileList.directoryExists('.git')){
            console.log(chalk.red('.git est déja créé'))
            process.exit()
        }
    }
}