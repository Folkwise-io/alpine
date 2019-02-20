#!/usr/bin/env node
require('@babel/register')({ cwd: `${__dirname}/..` });
require('@babel/polyfill/noConflict');

require('./cli');
