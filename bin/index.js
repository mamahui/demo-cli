#!/usr/bin/env node

const inquirer = require('inquirer'); //交互式输入
const download = require('download-git-repo');// 从git拉取模板
const ora = require('ora');
const fs = require('fs');
const chalk = require('chalk');
const spinner = ora('downloading template ...');

const argvs = process.argv;
const questions = [
    {
        type: 'input', name: 'projectName', message: 'please input project name:', validate (val) {
            if (!val) {
                return '请输入文件名';
            }
            if (fs.existsSync(val)) {
                return '文件已存在';
            }
            else {
                return true;
            }
            ;
        }
    }, {
        type: 'input', name: 'version', message: 'please input project version:', default: '1.0.0', validate (val) {
            return true;
        }
    }, {
        type: 'input', name: 'description', message: 'please input project description:', default: '', validate (val) {
            return true;
        }
    }, {
        type: 'input',
        name: 'repository',
        message: 'please input address which you will git pull:',
        default: 'https://github.com:mamahui/vue-template#master'
    }
];
const editFile = function({ version, projectName, description }) {
    fs.readFile(`${process.cwd()}/${projectName}/package.json`, (err, data) => {
        if (err) throw err;
        let _data = JSON.parse(data.toString());
        _data.name = projectName;
        _data.version = version;
        _data.description = description;
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${projectName}/package.json`, str, function(err) {
            if (err) throw err;
        });
        spinner.succeed();
    });
};

/**
 * @description: 下载模板
 * @param {type}
 * @return:
 */
const downloadTemplate = function({ repository, version, description, projectName }) {
    download(repository, projectName, { clone: true }, function(err) {
        if (err !== 'Error') {
            editFile({ version, projectName, description });
            console.log(chalk.green('cli 构建加载完成，可以开始您的项目。'));
        }
        else {
            spinner.succeed();
            console.log(chalk.red('cli 构建加载错误,请重试。'));
        }
        
        console.log();
        console.log(chalk.green(`开始项目:  cd ${projectName} && npm install`));
    });
};
 if (argvs[2].toUpperCase() === '-V') {require('./version.js');
} else if (argvs[2].toUpperCase() === 'INIT') {
    inquirer
    .prompt(questions)
    .then(answers => {
        const version = answers.version;
        const projectName = answers.projectName;
        const description = answers.description;
        const repository = answers.repository;
        
        spinner.start();
        spinner.color = 'green';
        downloadTemplate({ repository, version, description,projectName });
    });
} else {
    return require('./tips.js');
}




