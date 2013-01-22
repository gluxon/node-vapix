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

function camera(options) {
	port = typeof port !== 'undefined' ? port : 80;

	this.address = options.address;
	this.port = options.port;

	this.username = options.username;
	this.password = options.password;
}

camera.prototype.requestImage = function(callback) {
	var options = {
		hostname: this.address,
		port: this.port,
		path: '/axis-cgi/jpg/image.cgi',
		auth: this.username + ':' + this.password
	};

	var req = http.request(options, function(res) {
		res.on('data', function (chunk) {
			callback(chunk);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});

	req.write('data\n');
	req.end();
}

exports.camera = camera;
exports.camera.prototype.requestImage = camera.prototype.requestImage;
