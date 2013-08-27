module.exports = function(grunt) {

  grunt.initConfig({

    browserify: {
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
            }
          },
          alias: [
            'assets/vendor/components/backbone/backbone.js:backbone',
            'assets/js/compiled/templates:templates',
            'assets/js/compiled/json:json'
          ]
        }
      },
      app: {
        src: ['assets/js/lib/**/*.js', 'assets/js/app/**/*.js'],
        dest: 'assets/js/compiled/app.js',
        options: {
          debug: true,
          external: ['jQuery', 'handlebars', 'backbone', 'templates', 'json']
        }
      },
      json: {
        src: ['assets/json/**/*.json'],
        dest: 'assets/js/compiled/json.js'
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
          "assets/js/compiled/templates.js": ['server/templates/**/*.handlebars', 'shared/templates/**/*.handlebars']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'assets/css/compiled/screen.css': 'assets/css/screen.css.scss'
        }
      }
    },

    watch: {
      scss: {
        files: ['assets/css/scss/**/*.scss'],
        tasks: ['sass']
      },
      handlebars: {
        files: ['server/templates/**/*.handlebars', 'shared/templates/**/*.handlebars'],
        tasks: ['handlebars', 'browserify']
      },
      scripts: {
        files: ['assets/js/app/**/*.js', 'assets/js/lib/**/*.js'],
        tasks: ['browserify:app']
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('base', ['browserify', 'handlebars', 'sass']);
  grunt.registerTask('dev', ['base', 'watch']);
  grunt.registerTask('deploy', ['base', 'jshint'])
  grunt.registerTask('default', ['dev']);


};