var cp = require('child_process');




module.exports = function(grunt) {

  grunt.initConfig({

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 3000,
          hostname: "0.0.0.0",
          server: 'app.js',
          livereload: true
        }
      }
    },

    browserify: {
      json: {
        src: ['assets/json/**/*.json'],
        dest: 'assets/js/compiled/json.js'
      },
      vendor: {
        src: [],
        dest: 'assets/js/compiled/vendor.js',
        options: {
          shim: {
            jQuery: {
              path: 'assets/vendor/components/jquery/jquery.js',
              exports: '$'
            },
            handlebars: {
              path: 'assets/vendor/components/handlebars/handlebars.js',
              exports: 'Handlebars'
            },
            fastclick: {
              path: 'assets/vendor/components/fastclick/lib/fastclick.js',
              exports: 'FastClick'
            }
          },
          alias: [
            'assets/vendor/components/backbone/backbone.js:backbone',
            'assets/js/compiled/templates:templates',
            'assets/js/compiled/json:json',
            'assets/js/lib/global-ui:global-ui'
          ]
        }
      },
      app: {
        src: ['assets/js/lib/**/*.js', 'assets/js/app/**/*.js'],
        dest: 'assets/js/compiled/app.js',
        options: {
          debug: true,
          external: ['jQuery', 'handlebars', 'backbone', 'templates', 'json', 'fastclick', 'global-ui']
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          wrapped: true,
          commonjs: true,
          processName: function (filePath) {
            var name = filePath.split('/').join('.');
            name = name.replace(/shared\.templates\./,'');
            name = name.replace(/\.hbs/,'').replace(/\.handlebars/,'');
            return name;
          },
          partialRegex: /^_/,
          processPartialName: function (filePath) {
            var name = filePath.split('/').join('.');
            name = name.replace(/shared\.templates\./,'');
            name = name.replace(/\.hbs/,'').replace(/\.handlebars/,'');
            name = name.replace(/\._/, '.');
            return name;
          }
        },
        files: {
          "assets/js/compiled/templates.js": ['shared/templates/**/*.handlebars']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded',
          sourcemap: true
        },
        files: {
          'assets/css/compiled/screen.css': 'assets/css/screen.css.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', '> 1%', 'ie 8']
      },
      your_target: {
        files: {
          'assets/css/compiled/screen.css': ['assets/css/compiled/screen.css']
        }
      },
    },

    watch: {
      scss: {
        files: ['assets/css/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        },
      },
      css: {
        files: ['assets/css/compiled/**/*.css'],
        tasks: ['autoprefixer']
      },
      handlebars: {
        files: ['shared/templates/**/*.handlebars'],
        tasks: ['handlebars', 'browserify']
      },
      scripts: {
        files: ['assets/js/app/**/*.js', 'assets/js/lib/**/*.js'],
        tasks: ['browserify:app']
      },
    },
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-autoprefixer');




  // custom tasks

  grunt.registerTask('bower', 'Install bower dependencies', function () {
    var done = this.async();
    if (grunt.file.exists('./assets/vendor/components')) {
      grunt.log.writeln('Cleaning existing bower components');
      grunt.file.delete('./assets/vendor/components');
    }
    grunt.log.writeln('Installing bower components...');
     cp
      .spawn('./node_modules/.bin/bower', ['install'], {stdio: 'inherit'})
      .on('exit', function () {
        grunt.log.writeln('... finished installing components');
        done();
      });
  });

  grunt.registerTask('base', ['handlebars', 'browserify', 'sass', 'autoprefixer']);
  grunt.registerTask('server', ['base', 'bower', 'express', 'watch']);
  grunt.registerTask('dev', ['base', 'watch']);
  grunt.registerTask('deploy', ['base'])
  grunt.registerTask('default', ['dev']);


};