#!/usr/bin/env node
require('@babel/register')({ cwd: __dirname });
require('@babel/polyfill');

const { Cli } = require('alpine');

module.exports = Cli();
