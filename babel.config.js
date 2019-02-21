module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['dynamic-import-node', {
      noInterop: true,
    }],
  ],
  ignore: [
    '**/*.dot.js',
  ],
};
