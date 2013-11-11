// Generated on 2013-09-30 using generator-webapp 0.4.3
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var path = require('path');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        yeoman: {
            app: 'app',
            dist: 'dist'
        },

        watch: {
            recess: {
              files: ['app/modules/**/*.less'],
              tasks: 'recess'
            },
            handlebars: {
              files: [
                'app/modules/*/templates/**/*.hbs'
              ],
              tasks: 'handlebars'
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '<%= yeoman.app %>/geoData/*.json',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Allow access from other machiens
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        recess: {
          dist: {
            src: 'app/modules/app/styles/main.less',
            dest: '.tmp/styles/main.css',
            options: {
              compile: true
            }
          }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        handlebars: {
          compile: {
            files: {
              "app/modules/compiled-templates.js": [
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
        // Put files not handled in other tasks here
        copy: {
            select: {
              options: {
                basePath: __dirname,
                flatten: true
              },
              files: {
                '.tmp/styles/': ['app/components/select2/*.png', 'app/components/select2/*.gif']
              }
            },
            tmp: {
              files: [{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '.tmp',
                src: ['scripts/*.js']
              },{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '.tmp',
                src: ['components/**']
              },{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '.tmp',
                src: ['geoData/*']
              },{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '.tmp',
                src: ['templates/*']
              }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif,svg}',
                        'modules/members/img/*.{webp,gif,svg,jpg,png}',
                        'modules/members/members-img/mpsL/*.{webp,gif,svg,jpg,png}',
                        'modules/app/img/*.{webp,gif,svg,jpg,png}',
                        'styles/fonts/{,*/}*.*',
                        'components/select2/*.{png,gif}',
                        'components/bootstrap/fonts/*.*',
                        'components/font-awesome/font/*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        cdn: {
            dist: {
                options: { flatten: true },
                src: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/styles/*.css'],
                cdn: 'http://politalk-assets.theglobalmail.org'
                //cdn: 'http://localhost:9000'
            },
            staging: {
                options: { flatten: true },
                src: ['<%= cdn.dist.src %>'],
                cdn: 'http://politalk-staging-assets.theglobalmail.org'
            }
        },
        s3: {
          options: {
            region: 'ap-southeast-2',
            cacheTTL: 0,
            accessKeyId: "<%= aws.accessKeyId %>",
            secretAccessKey: "<%= aws.secretAccessKey %>",
            bucket: "<%= aws.targetBucket %>"
          },
          build: {
            cwd: "dist/",
            src: "**"
          }
        },
        modernizr: {
            devFile: '<%= yeoman.app %>/components/modernizr/modernizr.js',
            outputFile: '<%= yeoman.dist %>/components/modernizr/modernizr.js',
            files: [
                '<%= yeoman.dist %>/scripts/{,*/}*.js',
                '<%= yeoman.dist %>/styles/{,*/}*.css',
                '!<%= yeoman.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'recess',
                'handlebars',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'recess',
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= yeoman.app %>/.tmp/main.js'
            },
            dir: 'app/components'
        }
    });

    // Update javscript src attributes
    grunt.registerTask('usemin:js', function(content) {
      grunt.log.verbose.writeln('Update JavaScript with src attributes');
      //content = grunt.task.run('replace', content, /\.src=\\?['"]([^\\'"]+)\\?['"]/gm);
      //content = grunt.task.run('replace', content, /avatarUrl:\\?['"]([^\\'"]+)\\?['"]/gm);
      return content;
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', function(target){
      var tasks = [
        'clean:dist',
        'handlebars',
        'useminPrepare',
        'copy:tmp',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'cssmin',
        'uglify',
        'modernizr',
        'copy:dist',
        'rev',
        'usemin'
      ];

      // allow building with different CDN URLs
      if (target === 'staging') {
        tasks.push('cdn:staging');
      } else if (target !== 'dev') {
        tasks.push('cdn:dist');
      }

      grunt.task.run(tasks);
    });

    grunt.registerTask('default', [
        // 'jshint', disabled for coffeescript
        'test',
        'build'
    ]);

    grunt.registerTask('deploy', function(target) {
      // Build and deploy (TODO add CORS configuration for font-awesome)
      var _ = grunt.util._;

      try{
        grunt.config.data.aws = grunt.file.readJSON(path.join(process.env.HOME, '.tgm-aws-deploy-credentials.json'));
      }catch(e){
        throw new Error('You will need to create ~/.tgm-aws-deploy-credentials.json before deploying');
      }

      // Deploy bucket
      var buckets = {
        production: 'politalk.theglobalmail.org',
        staging: 'politalk-staging.theglobalmail.org'
      };

      // Deploy targets
      var targetToTask = {
        production: [
          'build:production',
          's3'
        ],
        staging: [
          'build:staging',
          's3'
        ]
      };

      var tasks = targetToTask[target];
      var targetBucket = buckets[target];

      if (tasks === undefined || targetBucket === undefined) {
        throw new Error(
          'Select a target destination from: ' +
          _.keys(targetToTask).join(', ')
        );
      }

      grunt.config.data.aws.targetBucket = targetBucket;

      grunt.task.run(tasks);
    });
};
