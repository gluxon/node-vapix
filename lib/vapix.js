// Copyright (c) 2013 Brandon Cheng <gluxon@gluxon.com> (http://gluxon.com)
// node-vapix: Node.js implementation of VAPIX
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var http = require("http");
var events = require('events');
require('buffertools');

function Camera(options) {
	port = typeof port !== 'undefined' ? port : 80;

	this.address = options.address;
	this.port = options.port;

	this.username = options.username;
	this.password = options.password;
}

Camera.prototype.generateGET = function(options) {
	// Create string for GET requests in a url
	var arguments = '?';

	var i = 1;
	for (var key in options) {
		arguments += key + '=' + options[key];

		// Append & separator to all bug last value
		if (i != Object.keys(options).length)
			arguments += '&';

		i++;
	}

	return arguments;
}

Camera.prototype.request = function(options, callback) {
	var options = {
		hostname: this.address,
		port: this.port,
		path: options.path,
		auth: this.username + ':' + this.password
	};

	var fullChunk = [];

	var req = http.request(options, function(res) {
		// Push chunks to array
		res.on('data', function(chunk) {
			fullChunk.push(chunk);
		});

		// Return the full data
		res.on('end', function() {
			callback(null, Buffer.concat(fullChunk));
		});
	});

	req.on('error', function(e) {
		callback(e, null);
	});

	req.write('data\n');
	req.end();
}

Camera.prototype.requestImage = function(callback) {
	var options = {
		path: '/axis-cgi/jpg/image.cgi'
	};

	this.request(options, callback);
}

Camera.prototype.getImageResolution = function(callback) {
	var options = {
		path: '/axis-cgi/imagesize.cgi?camera=1'
	};

	this.request(options, function(err, data) {
		if (err) {
			callback(err, null);
		} else {
			// Parse the string data
			data = data.toString('ascii').split("\n");
			width = data[0].split(' = ')[1];
			height = data[1].split(' = ')[1];

			// Return object with width and height elements
			callback(null, { width: width, height: height } );
		}
	});
}

Camera.prototype.createVideoStream = function(options) {

	var soi = new Buffer('ffd8', 'hex'); // JPEG SOI marker (FFD8 hex)
	var header_length = 65;

	// Create event emitter for stream
	var mjpg = new events.EventEmitter();

	// Generate string of HTTP GET arguments
	var GET_request = this.generateGET(options);

	var options = {
		hostname: this.address,
		port: this.port,
		path: '/axis-cgi/mjpg/video.cgi' + GET_request,
		auth: this.username + ':' + this.password
	};

	var fullChunk = [];
	var hitherto, firstSOI, secondSOI;

	var req = http.request(options, function(res) {

		res.on('data', function(chunk) {
			// Push chunks to array
			fullChunk.push(chunk);

			hitherto = Buffer.concat(fullChunk);

			// Find the start of image JPG headers.
			firstSOI = hitherto.indexOf(soi);
			secondSOI = hitherto.indexOf(soi, firstSOI + 2);

			if ( secondSOI !== -1) {
				// Emit a complete frame (1 image)
				mjpg.emit('data', hitherto.slice(firstSOI, secondSOI - header_length));

				// Remove processed images to free memory
				fullChunk = [chunk];
			}

		});

		res.on('end', function() {
			mjpg.emit('end');
		});
	});

	req.on('error', function(e) {
		mjpg.emit('error', e);
	});

	req.write('data\n');
	req.end();

	return mjpg;
}

exports.Camera = Camera;