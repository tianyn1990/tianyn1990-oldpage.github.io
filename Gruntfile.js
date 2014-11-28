'use strict';
module.exports = function (grunt) {

    // 加载各种grunt插件 -- BEGIN
    // 自动加载grunt任务
    require('load-grunt-tasks')(grunt);
    //计算grunt运行时间
    require('time-grunt')(grunt);

    // 加载各种grunt插件 -- END

    // 变量、对象
    var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
    var cfg = {
        src: 'app/',
        // Change 'localhost' to '0.0.0.0' to access the server from outside.
        serverHost: '0.0.0.0',
        serverPort: 8000,
        livereload: 35729
    };

    //定义所有grunt任务
    grunt.initConfig({

        // 变量
        yeoman: {
            // configurable paths
            app: 'app',
            dist: 'dist',
            mock: 'mock',
            tempDir: '.tmp'
        },
        pkg: grunt.file.readJSON('package.json'),

        // 配置Web Server
        connect: {
            'static': {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    livereload: cfg.livereload
                }
            },
            dist: {
                options: {
                    hostname: 'localhost',
                    port: 9901,
                    base: [
                        '<%= yeoman.dist %>'
                    ],
                    livereload: cfg.livereload
                }
            },
            mock: {
                options: {
                    hostname: 'localhost',
                    port: 9903,
                    base: [
                        '<%= yeoman.mock %>'
                    ],
                    livereload: cfg.livereload
                }
            },
            server: {
                options: {
                    hostname: '10010.com',
                    port: 9900,
                    middleware: function (connect) {
                        return [proxySnippet];
                    }
                    //,
                    //open: true
                },
                proxies: [
                    //访问后台接口
                    {
                        context: '/bee-apis',
                        host: '10.50.12.11',
                        port: 6009
                        //,changeOrigin: true
                    },
                    //访问静态资源
                    {
                        context: '/',
                        host: 'localhost',
                        port: 9901
                    }
                ]
            }
        },

        // 编译less文件
        less: {
            dist: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles_less',
                        src: '{,**/}*.less',
                        dest: '<%= yeoman.app %>/styles',
                        ext: '.css'
                    }
                ]
            }
        },

        // 为应对浏览器缓存，更换文件名
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,**/}*.js',
                        '<%= yeoman.dist %>/styles/{,**/}*.css'
                        //图片不进行更换，直接改名
                        //,'<%= yeoman.dist %>/images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}',
                        //'<%= yeoman.dist %>/styles/fonts/**'
                    ]
                }
            }
        },

        // 优化图片文件
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,**/}*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            },
            options: {
                cache: false
            }
        },
        // 优化svg格式文件
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,**/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },

        // html优化
        htmlmin: {
            dist: {
                options: {
                    // Optional configurations that you can uncomment to use
                    // removeCommentsFromCDATA: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['views/{,**/}*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/views/{,**/}*.html',
            options: {
                dest: '<%= yeoman.dist %>/views'
            }

        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,**/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,**/}*.css']
        },

        //所有文件加时间戳
        replace: {
            dist_build_time: {
                options: {
                    variables: {
                        "build-time": (new Date()).getTime().toString()
                    },
                    prefix: '@@'
                },
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.*'],
                dest: '<%= yeoman.dist %>'
            }
        },

        // 清除文件
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            'dist_after': {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/dev_components',
                            '<%= yeoman.dist %>/scripts/build.txt'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // 自动添加样式前缀
        autoprefixer: {
            options: {
                browsers: ['last 20 versions']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,**/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        //js压缩
        uglify: {
            dist: {
//        options: {
//          report:'min',//'gzip'
//          sourceMap: true,
//          mangle:{
//            except: ['jQuery']
//          },
//          beautify:false,
//          compress:true
//        },
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/scripts/',
                        src: '{,**/}*.js',
                        dest: '.tmp/scripts/',
                        ext: '.js'
                    }
                ]
            }
        },

        //压缩css
        cssmin: {
            minify: {
                expand: true,
                cwd: '.tmp/styles/',
                src: ['{,**/}*.css', '!{,**/}*.min.css'],
                dest: '.tmp/styles/',
                ext: '.css'
            }
        },

        //文件拷贝
        copy: {
            tmp: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles',
                        dest: '<%= yeoman.dist %>/styles',
                        src: [
                            '{,**/}*.css'
                        ]
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'bower_components/**/*',
                            'dev_components/**/*',
                            'images/{,**/}*.{webp}',
                            'fonts/**',
                            'scripts/**/*'
                        ]
                    }
//                    ,
//                    {
//                        expand: true,
//                        cwd: '.tmp/images',
//                        dest: '<%= yeoman.dist %>/images',
//                        src: [
//                            'generated/*'
//                        ]
//                    }
                ]
            },
            styles: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles',
                        dest: '.tmp/styles/',
                        src: '{,**/}*.css'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles_less/lib',
                        dest: '.tmp/styles/lib',
                        src: '{,**/}*.css'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles_less/lib',
                        dest: '<%= yeoman.app %>/styles/lib',
                        src: '{,**/}*.css'
                    }
                ]
            }
        },

        //多线程执行任务，以加快grunt运行
        // Run some tasks in parallel to speed up the build process
        concurrent: {
            dist: [
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },

        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        requireJSOptimise: 'uglify2',
        requirejs: {
            compile: {
                options: {
                    appDir: '<%= yeoman.app %>/scripts/',
                    baseUrl: '.',
                    keepBuildDir: true,
                    generateSourceMaps: false,              //开启调试工具
                    optimize: '<%= requireJSOptimise %>',
                    uglify2: {
                        output: {
                            beautify: false
                        },
                        mangle: true
                    },
                    mainConfigFile: '<%= yeoman.app %>/scripts/common.js',
                    preserveLicenseComments: false,
                    dir: '<%= yeoman.dist %>/scripts/',
                    modules: [
                        {
                            name: 'common',
                            include: [
                                'jquery',
                                'jqCookie',
                                'angular',
                                'ngRoute',
                                'ngSanitize',
                                'ngResource',
                                'ngAnimate',
                                'alertify'//,
//                                'strap',
//                                'strapTpl'
                            ]
                        },
                        {
                            name: 'ppt/ppt',
                            exclude: ['common']
                        }
                    ],
                    findNestedDependencies: true,
                    fileExclusionRegExp: /^\./,
                    inlineText: true
                }
            }
        },

        // 文件监听
        watch: {
            options: {
                livereload: cfg.livereload,
                debounceDelay: 500
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            css: {
                files: ['<%= yeoman.app%>/styles_less/{,**/}*.less'],
                tasks: ['newer:less', 'newer:copy:styles', 'autoprefixer:dist'],
                options: {
                    nospawn: false
                }
            },
            js: {
                files: ['<%= yeoman.app %>/{scripts,dev_components}/{,**/}*.js'],
                tasks: ['newer:all']
            },
            html: {
                files: ['<%= yeoman.app %>/{views,dev_components}/{,**/}*.html'],
                tasks: ['newer:all']
            },
            mock: {
                files: ['<%= yeoman.app %>/mock/**'],
                tasks: ['newer:all']
            },
            livereload: {
                options: {
                    livereload: cfg.livereload,
                    debounceDelay: 500
                },
                files: [
                    '<%= yeoman.app %>/{,**/}*.html',
                    '<%= yeoman.app %>/styles/{,**/}*.css',
                    '<%= yeoman.app %>/images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.app %>/mock/{,**/}*'
                ]
            }
        },

        //打开浏览器
        open: {
            dev: {
                path: 'http://10010.com:9900/views/',
                app: 'Google Chrome'
            },
            dist: {
                path: 'http://10010.com:9900/views/',
                app: 'Google Chrome'
            }
        }
    });
    grunt.registerTask('stylesPre', ['less', 'copy:styles', 'autoprefixer:dist']);
    grunt.registerTask('scripts', ['ngmin', 'requirejs']);
    grunt.registerTask('useminBuild', ['useminPrepare', 'ngmin', 'rev', 'usemin']);

    //开发
    grunt.registerTask('server', [
        'clean:server',
        'connect:static',
        'connect:mock',
        'configureProxies:server',
        'connect:server',
        'stylesPre',
        'open:dev',
        'watch'
    ]);

    //部署
    grunt.registerTask('build', [
        'clean:dist',
        'stylesPre',
        'concurrent:dist',
        'copy:dist',
        'scripts',
        'cssmin',
        'copy:tmp',
        'useminBuild',
        'replace:dist_build_time',
        'clean:dist_after'
    ]);

    //测试部署结果
    grunt.registerTask('dist', [
        'clean:server',
        'connect:dist',
        'configureProxies:server',
        'connect:server',
        'open:dist',
        'watch'
    ]);

};
