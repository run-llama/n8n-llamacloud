const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', copyIcons);
task('build:vendor', copyVendor);
task('build:assets', series('build:icons', 'build:vendor'));

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

function copyVendor() {
	const vendorSource = path.resolve('vendor', '**', '*');
	const vendorDestination = path.resolve('dist', 'vendor');

	return src(vendorSource).pipe(dest(vendorDestination));
}
