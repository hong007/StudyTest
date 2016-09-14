module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        //jshint插件的配置信息
        jshint: {
            build: ['Gruntfile.js', 'src/js/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        //uglify插件的配置信息
        uglify: {
            options: {
                banner: '/*! Created By SilentCat <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/js/test01.js',
                dest: 'build/js/<%= pkg.name %>.min?<%= grunt.template.today("yyyy-mm-dd") %>.js'
            }
        },

        //csslint插件的配置信息
        csslint: {
            build: ['Gruntfile.js', 'src/*.css'],
            options: {
                csslintrc: '.csslintrc'
            }
        },
        connect: {
            server: {
                options: {
                    // 设置端口号
                    port: 9009,
                    hostname: 'localhost',
                    livereload: true
                }
            }
        },
        // less: {
        //     development: {
        //         files: [{
        //             expand: true,
        //             cwd: './static/less',
        //             src: ['**/*.less'],
        //             dest: 'static/css',
        //             ext: '.css'
        //         }]
        //     }
        // },
        // less: {
        //     development: {
        //         files: [{
        //             expand: true,
        //             cwd: 'css/less',
        //             src: ['*.less'],
        //             dest: 'css/styles',
        //             ext: '.css'
        //         }]
        //     }
        // },
        watch: {
            build: {
                // files: ['src/*.js','src/*.css','index.html'],
                files: ['src/css/**/*.css', 'src/images/**/*', 'src/pages/**/*', 'src/scripts/**/**/*', 'src/**/**/*', 'common/**/*', 'index.html', 'src/js/**/**/*','demo/**/**/**/**/*'],
                // tasks: ['jshint', 'uglify'],
                options: {
                    // spawn:false
                    livereload: true
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    // grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    // grunt.registerTask('default', ['uglify','less','connect','watch']);
    grunt.registerTask('default', ['jshint', 'uglify', 'csslint', 'connect', 'watch']);

};
