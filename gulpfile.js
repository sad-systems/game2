/*
 * CLI:
 * browserify --debug -r ./main.js:main -r ./scene2.js:scene2 > ../build/bundle.js 
 */

var gulp       = require('gulp');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

//==============================================================================
// Config
//==============================================================================

var config = {
    basedir:      'src/', 
    destination:  'build/bundle.js',
    addFiles:     {
        "./application.js"  :"application"
        //'./filename1.js':expose_name, 
        //'./filename2.js':{expose:expose_name, ...}
        //...
    },
    requireFiles: [
        './src/application-scenes',
        './src/application-maps'
    ] //require('./src/application-scenes')
        //{
        //'./filename1.js':expose_name, 
        //'./filename2.js':{expose:expose_name, ...}
        //...
        //}
    ,
    minify: false,
    minifySuffix: '', //.min
    debug:  true
};

//==============================================================================
// Tasks
//==============================================================================

/**
 * Watch Task
 * 
 */ 
gulp.task('watch', function(){
  gulp.watch([config.basedir + '**/*.js', config.basedir + '**/*.json'], ['default']);
});

/**
 * Build complite bundle.js
 * 
 */
gulp.task('default', function () {
    
    function pushData(funcPush, inputData) {
        if (inputData) {
            inputData = inputData instanceof Array ? inputData : [inputData];
            for (var index in inputData) {
                
                var data = inputData[index];
                
                if (typeof(data) === 'string') { 
                    var filename = data;
                    //--- Load a data file:
                    data = require(filename);
                    //var extend = require('util')._extend; // clone object (v.1)
                    //data = extend({}, require(filename)); // clone object (v.1)
                    //data = JSON.parse(JSON.stringify(require(filename))); // clone object (v.2)
                    //--- Clear cache:
                    delete require.cache[require.resolve(filename)];
                    //console.log(data);
                }

                for (var file in data) {
                    var opt = data[file];
                    if (opt && typeof(opt) === 'string') {
                        opt = { expose:opt };
                    } else {
                        var name = file.replace(/^\.+\/|\.js$|\.json$/gm, ''); 
                        opt = { expose:name };
                    }
                    funcPush(file, opt); console.log('include: ' + file + ' as ' + opt.expose);
                }
                
            }
        }
    };

    //try {
        
        var b = browserify([], config);
            //--- add modules:
            pushData(b.add.bind(b), config.addFiles);
            //--- require modules:
            pushData(b.require.bind(b), config.requireFiles);
            //--- build:
        var run = b.bundle(); //.pipe(process.stdout);
            run = run.pipe(source(config.destination));
        if (config.minify) {
            //--- Minify:
            var rename = require('gulp-rename');
            var uglify = require('gulp-uglify');
            var buffer = require('vinyl-buffer');
            run = run.pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
                     .pipe(uglify()) // now gulp-uglify works
                     .pipe(rename({suffix: config.minifySuffix}));
                     //.pipe(gulp.dest(''));
        };
        //--- Save:      
        run.pipe(gulp.dest(''));
        
    //} catch (e) {
    //    console.error(e);
    //}
    
});