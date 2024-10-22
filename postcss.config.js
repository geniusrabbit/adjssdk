module.exports = {
  syntax: 'postcss-scss',
  parser: 'postcss-scss',
  plugins: [
    require('postcss-nested'),
    require('postcss-each'),
    require('autoprefixer'),
    // require('postcss-prefix-selector')({
    //   prefix: '.__ads_general_',
    //   ignore: [ '.__ads_general_' ]
    // }),
    require('postcss-prettify'),
  ]
}