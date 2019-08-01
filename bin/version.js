#!/usr/bin/env node

const fs = require('fs');
fs.readFile(`${process.cwd()}/package.json`, (err, data) => {
    if (err) throw err;
    let _data = JSON.parse(data.toString());
    console.log(_data.version)
});
