let preprocessor = 'sass', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
	fileswatch = 'html,htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

import pkg from 'gulp'
const {
	gulp,
	src,
	dest,
	parallel,
	series,
	watch
} = pkg

import browserSync from 'browser-sync'
import bssi from 'browsersync-ssi'
import ssi from 'ssi'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import sassglob from 'gulp-sass-glob'
const sass = gulpSass(dartSass)
import less from 'gulp-less'
import lessglob from 'gulp-less-glob'
import styl from 'gulp-stylus'
import stylglob from 'gulp-noop'
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import imagemin from 'gulp-imagemin'
import changed from 'gulp-changed'
import concat from 'gulp-concat'
import rsync from 'gulp-rsync'
import del from 'del'
import uglify from 'gulp-uglify'
import webp from 'gulp-webp'
import htmlmin from 'gulp-htmlmin'
import jadeModule from 'gulp-jade'

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/',
			middleware: bssi({
				baseDir: 'app/',
				ext: '.html'
			})
		},
		ghostMode: {
			clicks: false
		},
		notify: false,
		online: true,
		// tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function scripts() {
	return src([
			'app/libs/jquery/dist/jquery.min.js',
			'app/libs/jquery.maskedinput/dist/jquery.maskedinput.min.js',
			'app/libs/locomotive-scroll/dist/locomotive-scroll.min.js',
			'app/libs/gsap/dist/gsap.min.js',
			'app/libs/gsap/dist/ScrollTrigger.min.js',
			'app/js/app.js', // Всегда в конце
		])
		.pipe(uglify())
		.pipe(concat('app.min.js')) // Конкатенируем в один файл
		.pipe(dest('app/js/')) // Выгружаем готовый файл в папку назначения
		.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
	return src([`app/${preprocessor}/*.*`, `!app/${preprocessor}/_*.*`])
		.pipe(eval(`${preprocessor}glob`)())
		.pipe(eval(preprocessor)({
			'include css': true
		}))
		.pipe(postCss([
			autoprefixer({
				grid: 'autoplace'
			}),
			cssnano({
				preset: ['default', {
					discardComments: {
						removeAll: true
					}
				}]
			})
		]))
		.pipe(concat('app.min.css'))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function jade() {
	return src(['app/jade/**/*.jade'])
		.pipe(jadeModule())
		.pipe(dest('app'))
		.pipe(browserSync.stream())
}

function convertToWebp() {
	return src('app/img/src/**/*.+(jpg|jpeg|png)')
		.pipe(webp())
		.pipe(dest('app/img/src'))
		.pipe(dest('app/img/dist'))
		.pipe(browserSync.stream())
}

function cleanImages() {
	return del(['app/img/dist/**/*.png', 'app/img/dist/**/*.jpg', 'app/img/dist/**/*.jpeg']);
}

function cleanhtml() {
	return del(['app/base.html', 'app/data.html']);
}

function buildcopy() {
	return src([
			'app/css/*.min.*',
			'app/img/**/*.*',
			'!app/img/src/**/*',
			'app/fonts/**/*',
			'app/*.php',
			'app/video/**/*',
			'app/js/**/*.js', 
			'!app/js/**/app.js',
			'app/libs/locomotive-scroll/dist/locomotive-scroll.min.css'
		], {
			base: 'app/'
		})
		.pipe(dest('dist'))
}

function minifyhtml() {
	return src('dist/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('app/', 'dist/', '/*.html')
	includes.compile();
}

async function cleandist() {
	del('dist/**/*', {
		force: true
	})
}

function deploy() {
	return src('dist/')
		.pipe(rsync({
			root: 'dist/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// clean: true, // Mirror copy with file deletion
			include: [ /* '*.htaccess' */ ], // Included files to deploy,
			exclude: ['**/Thumbs.db', '**/*.DS_Store'],
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}))
}

function startwatch() {
	watch(['app/jade/**/*.jade'], {
		usePolling: true
	}, jade)
	watch([`app/sass/**/*`], {
		usePolling: true
	}, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], {
		usePolling: true
	}, scripts)
	watch('app/img/src/**/*', {
		usePolling: true
	}, convertToWebp)
	watch(`app/**/*.{${fileswatch}}`, {
		usePolling: true
	}).on('change', browserSync.reload)
}

export {
	scripts,
	styles,
	convertToWebp,
	cleanImages,
	cleanhtml,
	deploy,
	jade
}

export let assets = series(scripts, styles, jade, convertToWebp, cleanImages, cleanhtml)
export let build = series(scripts, cleandist, cleanhtml, convertToWebp, cleanImages, styles, buildcopy, buildhtml, minifyhtml)

export default series(scripts, styles, jade, convertToWebp, cleanImages, cleanhtml, parallel(browsersync, startwatch))