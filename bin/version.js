#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const _data = require(path.resolve(__dirname, './../package.json'));
console.log(_data.version);
