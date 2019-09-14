const inquirer = require('inquirer');
const minimist = require('minimist');

const files = require('./files');

module.exports = {
    askGitHubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Github username or e-mail address:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your GitHub username or e-mail address.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Eenter your GitHub password.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
            

    askRepositoryDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type : 'input',
                name : 'name',
                message : 'Enter a name for your repository:',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Enter a unique name for the repository.';
                    }
                }
            },
            {
                type : 'input',
                name : 'description',
                default : argv._[1] || null,
                message: 'Choose a description to enter of the repository:'
            },
            {
                type: 'input',
                name: 'visibility',
                message: 'This repository is public or private?:',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        
        return inquirer.prompt(questions);
    },

    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the file and/or folders you wish to ignore:',
                choices: filelist,
                default: ['node_modules']
            }
        ];
        return inquirer.prompt(questions);
    }
}




