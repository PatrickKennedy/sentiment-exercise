module.exports = {

  build_dir: 'build',
  compile_dir: 'release',

  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
  },

  test_files: {
    js: []
  },
};
