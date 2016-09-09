module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //uglify插件的配置信息
    uglify: {
      options: {
        banner: '/*! Created By SilentCat <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/test01.js',
        dest: 'build/<%= pkg.name %>.min?<%= grunt.template.today("yyyy-mm-dd") %>.js'
      }
    },
    //jshint插件的配置信息
    // jshint:{
    //     build:['Gruntfile.js','src/*.js'],
    //     options:{
    //         jshintrc:'.jshintrc'
    //     }
    // },
    // //csslint插件的配置信息
    // csslint:{
    //     build:['Gruntfile.js','src/*.css'],
    //     options:{
    //         csslintrc:'.csslintrc'
    //     }
    // },
    connect:{
         server:{
             options:{
                 // 设置端口号
                 port:9009,
                 hostname:'localhost',
                 livereload:true
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
        build:{
            // files: ['src/*.js','src/*.css','index.html'],
            files: ['css/**/*.css','images/**/*','pages/**/*','scripts/**/**/*','src/**/**/*','common/**/*','index.html'],
            // tasks: ['jshint', 'uglify'],
            options:{ 
                // spawn:false
                livereload:true
            }
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

  // 加载包含 "uglify" 任务的插件。
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-csslint');
  // grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认被执行的任务列表。
  // grunt.registerTask('default', ['uglify','less','connect','watch']);
  grunt.registerTask('default', ['uglify','connect','watch']);

};

// /**
//  * Created by Quanta on 2016/5/9.
//  */
// module.exports = function(grunt) {
//     require('load-grunt-tasks')(grunt);
//     grunt.initConfig({
//         pkg:grunt.file.readJSON('package.json'),

//         less: {
//             development: {
//                 files: [{
//                     expand: true,
//                     cwd: 'css/less',
//                     src: ['*.less'],
//                     dest: 'css/styles',
//                     ext: '.css'
//                 }]
//             }
//         },
//         //watch 字面意思：看着某个事件。实现热部署，个人认为是grunt的自动化工具的精髓之一
//         watch: {
//             target:{
//                 options:{
//                     livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
//                 },
//                 files: ['css/**/*.css','images/**/*','pages/**/*','scripts/**/**/*','common/**/*','index.html']
//             },
//             html:{
//                 options:{
//                     livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
//                 },
//                 files:['pages/**/*.html'] //如果swig的文件有变化，就执行任务
//             },
//             styles:{
//                 options:{
//                     livereload:true  //livereload工具，浏览器安装插件后，不用重启服务器，不用刷新页面，好神奇的说
//                 },
//                 files: 'css/**/*.less',
//                 tasks:['less']
//             }
//         }
//     });
//     // 加载包含任务的插件。
//     grunt.loadNpmTasks('grunt-concurrent');
//     grunt.loadNpmTasks('grunt-contrib-clean');
//     grunt.loadNpmTasks('grunt-contrib-connect');
//     grunt.loadNpmTasks('grunt-contrib-cssmin');
//     grunt.loadNpmTasks('grunt-contrib-jshint');
//     grunt.loadNpmTasks('grunt-contrib-less');
//     grunt.loadNpmTasks('grunt-contrib-uglify');
//     grunt.loadNpmTasks('grunt-contrib-watch');
//     grunt.loadNpmTasks('grunt-nodemon');
//     grunt.loadNpmTasks('grunt-swig');

//     // 默认被执行的任务列表。
//     grunt.registerTask('default', ['watch']);

// };
