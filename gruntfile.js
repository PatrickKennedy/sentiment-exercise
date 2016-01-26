module.exports = function(grunt) {
  var config = require('./build.config.js')
      , plugins = require('matchdep').filterDev('grunt-*')
      , tasks
      ;

  plugins.forEach(grunt.loadNpmTasks);

  // Project configuration.
  tasks = {
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.license.type %> <<%= pkg.license.url %>>\n' +
        ' */\n'
    },

    clean: [
      '<%= build_dir %>',
   ],

    concat: {
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= build_dir %>/src/**/*.js',
       ],
        dest: '<%= compile_dir %>/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    copy: {
      build_appjs: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
       ]
      },
    },

    delta: {
      options: {
        livereload: false
      },

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      jssrc: {
        files: ['<%= app_files.js %>'],
        tasks: ['jshint:src', 'mochaTest:test', 'copy:build_appjs']
      },

      jsunit: {
        files: ['<%= app_files.jsunit %>'],
        tasks: ['jshint:test', 'mochaTest:test'],
      },
    },

    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: {
        options : {
          "expr": true, // disable warnings about chai-expect in tests
        },
        files: '<%= app_files.jsunit %>'
      },
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        laxcomma: true,
        "-W070": false, // Trailing Semicolon
        "-W116": false, // Bracketless If-statements
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: ['chai'],
          ui: 'bdd',
          clearRequireCache: true,
        },
        src: ['<%= app_files.jsunit %>']
      },
    },
  };

  grunt.initConfig(grunt.util._.extend(tasks, config));


  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'mochaTest:test',  'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build', 'compile']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'copy:build_appjs',
 ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('compile', [
    'concat:compile_js',
  ]);


  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  var defaultTestSrc = grunt.config('mochaTest.test.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.test.src', defaultTestSrc);
    if (filepath.match('spec.js')) {
      grunt.config('mochaTest.test.src', filepath);
    }
  });
};
