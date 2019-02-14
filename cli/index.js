#!/usr/bin/env node
require('@babel/register')({ cwd: `${__dirname}/..` });
require('@babel/polyfill');

require('./cli');
