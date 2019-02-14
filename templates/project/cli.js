#!/usr/bin/env node
require('@babel/register')({ cwd: __dirname, ignore: [] });
require('@babel/polyfill');

const { Cli } = require('alpine');

module.exports = Cli();
