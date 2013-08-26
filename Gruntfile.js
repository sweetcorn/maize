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
            }
          },
          alias: [
            'assets/vendor/components/backbone/backbone.js:backbone'
          ]
        }
      },
      app: {
        src: ['assets/js/lib/**/*.js', 'assets/js/app/**/*.js'],
        dest: 'assets/js/compiled/app.js',
        options: {
          debug: true,
          external: ['jQuery', 'backbone']
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'SYP.Templates',
          processName: function(filePath) {
            return filePath.replace(/^templates\//, '').replace(/\.handlebars$/, '');
          }
        },
        files: {
          "assets/js/templates.js": ['server/templates/**/*.handlebars', 'shared/templates/**/*.handlebars']
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
          'assets/css/compiled/screen.css': 'assets/css/screen.scss'
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
        tasks: ['handlebars']
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

  grunt.registerTask('base', ['browserify', 'handlebars', 'sass']);
  grunt.registerTask('dev', ['base', 'watch']);
  grunt.registerTask('default', ['dev']);

};