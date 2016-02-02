module.exports = {

  build_dir: 'build',
  compile_dir: 'release',

  app_files: {
    js: ['app.js', 'src/**/*.js', '!src/**/*.spec.js'],
    jsunit: ['src/**/*.spec.js'],
  },

  test_files: {
    js: []
  },
};
