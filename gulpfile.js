var gulp            = require('gulp'),
    sass            = require('gulp-ruby-sass'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    include         = require('gulp-include'),
    jshint          = require('gulp-jshint'),
    cssnano         = require('gulp-cssnano'),
    cache           = require('gulp-cache'),
    livereload      = require('gulp-livereload'),
    notify          = require('gulp-notify'),
    del             = require('del');

var StylesCss       = 'src/scss/custom.scss',
    MainStylesCss   = 'src/scss/style.scss',
    HtmlPage        = '*.html',
    StylesCssFiles  = [StylesCss, 'src/scss/**/*.scss'],
    ImageFiles      = 'src/img/**/*',
    CssFiles        = 'src/scss/**/*.scss',
    JsFiles         = 'src/scripts/scripts.js',
    AllJsFiles      = 'src/scripts/**/*.js',
    FontFiles       = 'src/fonts/**/*',
    OutputCss       = 'dist/css',
    OutputJs        = 'dist/scripts',
    OutputImg       = 'dist/img',
    OutputFont      = 'dist/fonts';

// browser-sync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// main styles
gulp.task('main-styles', function(){
    return sass(MainStylesCss, {style:'expanded', noCache:true})
    .pipe(autoprefixer('last 2 version'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(OutputCss));
    // .pipe(notify({ message: 'Styles task complete' }));
});
// custom styles
gulp.task('styles', function(){
    return sass(StylesCss, {style:'expanded', noCache:true})
    .pipe(autoprefixer('last 2 version'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(OutputCss));
    // .pipe(notify({ message: 'Styles task complete' }));
});
//styles non minify
gulp.task('stylesNoMinify', function(){
    return sass(MainStylesCss, {style:'expanded', noCache:true})
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(OutputCss));
    // .pipe(notify({ message: 'Styles task complete' }));
});
// scripts
gulp.task('scripts', function(){
    return gulp.src(JsFiles)
    .pipe(rename({ suffix: '.min' }))
    .pipe(include())
    .on('error', console.log)
    .pipe(uglify())
    .pipe(gulp.dest(OutputJs));
    // .pipe(notify({ message: 'Scripts task complete' }));
});
// fonts
gulp.task('fonts', function(){
    return gulp.src(FontFiles)
    .pipe(gulp.dest(OutputFont));
    // .pipe(notify({ message: 'Fonts task complete' }));
})
// image
gulp.task('images', function(){
    return gulp.src(ImageFiles)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(OutputImg));
})

// start webserver
gulp.task('server', function(done) {
  return browserSync({
    server: {
      baseDir: './'
    }
  }, done);
});

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
});


gulp.task('clean', function(){
    return del([OutputCss,OutputJs,OutputFont,OutputImg]);
});

gulp.task('build', ['clean'], function(){
    gulp.start('main-styles', 'styles', 'stylesNoMinify', 'scripts', 'fonts', 'images');
});

gulp.task('watch', ['browser-sync'],function(){
    gulp.watch(HtmlPage, ['bs-reload'])
    gulp.watch(CssFiles,['styles', 'bs-reload']);
    gulp.watch(AllJsFiles,['scripts', 'bs-reload']);
})

gulp.task('watch-style', ['browser-sync'], function(){
    gulp.watch(CssFiles,['styles']);
    gulp.watch(HtmlPage).on('change', browserSync.reload);
})