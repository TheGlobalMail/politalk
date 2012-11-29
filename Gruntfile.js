module.exports = function( grunt ) {
  'use strict';

  grunt.renameTask('copy', 'yeoman-copy');

  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-copy');

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // Coffee to JS compilation
    handlebars: {
      compile: {
        files: {
          "temp/modules/compiled-templates.js": [
            "app/modules/*/templates/**/*.hbs"
          ]
        },
        options: {
          namespace: 'PolitalkApp.Templates',
          processName: function(filename) {
            return filename
                    .replace(/^app\/modules\//, '')
                    .replace(/\.hbs$/, '');
          }
        }
      }
    },

    recess: {
      dist: {
        src: 'app/modules/app/styles/main.less',
        dest: 'temp/styles/main.css',
        options: {
          compile: true
        }
      }
    },

    copy: {
      select: {
        options: {
          basePath: __dirname,
          flatten: true
        },
        files: {
          'temp/styles/': ['components/select2/*.png', 'components/select2/*.gif']
        }
      }
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      recess: {
        files: ['app/modules/**/*.less'],
        tasks: 'recess reload'
      },
      handlebars: {
        files: [
          'app/modules/*/templates/**/*.hbs'
        ],
        tasks: 'handlebars reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/modules/**/*.css',
          'app/**/*.js'
        ],
        tasks: 'lint reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        'Gruntfile.js',
        'app/modules/**/*.js',
        '!app/modules/scripts/modernizr.js'
      ],

      options: {
        options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true,
          browser: true,
          node: true
        },
        globals: {
          jQuery: true,
          moment: true,
          Backbone: true,
          _: true,
          $: true,
          Handlebars: true,
          Marionette: true,
          PolitalkApp: true,
          Politalk: true,
          Modernizr: true
        }
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    server: {
      app: 'clean lint recess handlebars watch'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'scripts/*.js',
      css: 'styles/*.css',
      img: ['modules/*/img/**', 'img/**', 'components/tgm-bootstrap/img/*']
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['index.html', 'scripts/*.js'],
      css: ['styles/**/*.css', 'components/select2/*.css']
    },

    // HTML minification
    html: {
      files: ['index.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    }

  });

  grunt.renameHelper('usemin:post:html', 'yeoman-usemin:post:html');
  grunt.registerHelper('usemin:post:html', function(content) {
    content = grunt.helper('yeoman-usemin:post:html', content);

    grunt.log.verbose.writeln('Update JavaScript with src attributes');
    content = grunt.helper('replace', content, /\.src=\\?['"]([^\\'"]+)\\?['"]/gm);

    return content;
  });

  // Alias the `test` task to run the `mocha` task instead
  grunt.registerTask('test', 'lint handlebars mocha');
  grunt.registerTask('test-server', 'handlebars grunt-server');
  grunt.registerTask('build', 'intro clean recess handlebars copy:select mkdirs usemin-handler concat css min img rev usemin yeoman-copy time');
  grunt.registerTask('build:minify', 'intro clean recess handlebars copy:select mkdirs usemin-handler concat css min img rev usemin html:compress yeoman-copy time');
};
