/**
 * Created by Quanta on 2016/5/9.
 */
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),

        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: 'css/less',
                    src: ['*.less'],
                    dest: 'css/styles',
                    ext: '.css'
                }]
            }
        },
        //watch 字面意思：看着某个事件。实现热部署，个人认为是grunt的自动化工具的精髓之一
        watch: {
            target:{
                options:{
                    livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
                },
                files: ['css/**/*.css','images/**/*','pages/**/*','scripts/**/**/*','common/**/*','index.html']
            },
            html:{
                options:{
                    livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
                },
                files:['pages/**/*.html'] //如果swig的文件有变化，就执行任务
            },
            styles:{
                options:{
                    livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
                },
                files: 'css/**/*.less',
                tasks:['less']
            }
        }
    });
    // 加载包含任务的插件。
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-swig');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['watch']);

};
