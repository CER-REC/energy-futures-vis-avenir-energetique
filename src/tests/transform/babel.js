const fs = require('fs');

const babelOptions = JSON.parse(fs.readFileSync('./.babelrc', 'utf-8'));
module.exports = require('babel-jest').createTransformer(babelOptions);
