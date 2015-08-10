'use strict';
var test = require('tape');
var	Vinyl = require('vinyl');
var	filever = require('../');

test('should rename file without options', function(t) {
	t.plan(7);

	var testFile1 = new Vinyl({
		cwd: "/home/brwnll/broken-promises/",
		base: "/home/brwnll/broken-promises/test",
		path: "/home/brwnll/broken-promises/test/test1.js",
		contents: new Buffer('/* @version 100.4.N */')
	});

	var stream = filever();

	stream.on('data', function(newFile) {
    t.ok(newFile, 'emits a file');
		t.ok(newFile.path, 'file has a path');
    t.ok(newFile.relative, 'file has relative path information');
		t.ok(newFile.contents, 'file has contents');

    t.ok(newFile instanceof Vinyl, 'file is Vinyl');
		t.ok(newFile.contents instanceof Buffer, 'file contents are a buffer');

    t.equals(newFile.relative, 'test1-100.4.N.js');
	});

	stream.write(testFile1);
	stream.end();
});

test('should rename file with specified key', function(t) {
	t.plan(1);

	var testFile1 = new Vinyl({
		cwd: "/home/brwnll/broken-promises/",
		base: "/home/brwnll/broken-promises/test",
		path: "/home/brwnll/broken-promises/test/test1.js",
		contents: new Buffer('/* @specialKey 100.4.N */')
	});

	var stream = filever({ key: 'specialKey' });

	stream.on('data', function(newFile) {

    t.equals(newFile.relative, 'test1-100.4.N.js');
	});

	stream.write(testFile1);
	stream.end();
});

test('should throw error when version missing', function(t) {
	t.plan(1);

	var testFile1 = new Vinyl({
		cwd: "/home/brwnll/broken-promises/",
		base: "/home/brwnll/broken-promises/test",
		path: "/home/brwnll/broken-promises/test/test1.js",
		contents: new Buffer('/* @specialKey 100.4.N */')
	});

	var stream = filever();

	stream.on('data', function(newFile) {	});

  stream.on('error', function(err) {
      t.equals(err.toString(), 'Error: Missing version key @version in test1.js');
  })

	stream.write(testFile1);
	stream.end();
});

test('should ignore error when silenced', function(t) {
	t.plan(0);

	var testFile1 = new Vinyl({
		cwd: "/home/brwnll/broken-promises/",
		base: "/home/brwnll/broken-promises/test",
		path: "/home/brwnll/broken-promises/test/test1.js",
		contents: new Buffer('/* @specialKey 100.4.N */')
	});

	var stream = filever({ silent: true });

	stream.on('data', function(newFile) {	});

  stream.on('error', function(err) { t.end(err) })

  stream.on('end', function() { t.end(); })

	stream.write(testFile1);
	stream.end();
});
