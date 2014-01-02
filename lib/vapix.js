// Copyright (c) 2013-2014 Brandon Cheng <gluxon@gluxon.com> (http://gluxon.com)
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

var http = require('http');
var util = require('util');
var request = require('request');
var MjpegConsumer = require('mjpeg-consumer');

exports.createCamera = function(options) {
  return new Camera(options);
};

function Camera(options) {
  this.address = options.address;
  this.port = options.port;

  this.username = options.username;
  this.password = options.password;

  this.cameraURI = 'http://' + this.address + ':' + this.port;
  this.auth = {
    'user': this.username,
    'pass': this.password,
    'sendImmediately': false
  };
}

Camera.prototype.generateGET = function(options) {
  // Create string for GET requests in a url
  var arguments = '?';

  var i = 1;
  for (var key in options) {
    arguments += key + '=' + options[key];

    // Append & separator to all but last value
    if (i != Object.keys(options).length)
      arguments += '&';

    i++;
  }

  return arguments;
};

Camera.prototype.requestImage = function(options, callback) {
  var path = this.cameraURI;
  if (typeof options === 'object') {
    path += '/axis-cgi/jpg/image.cgi' + this.generateGET(options);
  } else {
    // Options was never passed, only the callback. Use default.
    path += '/axis-cgi/jpg/image.cgi';
    callback = options;
  }

  var req_opt = {
    'auth': this.auth,
    'encoding': null // buffer
  }
  request.get(path, req_opt, function(err, response, body) {
    callback(err, body);
  });
};

Camera.prototype.getImageResolution = function(callback) {
  var path = this.cameraURI + '/axis-cgi/imagesize.cgi?camera=1';

  request(path, {'auth': this.auth}, function(err, response, body) {
    if (err) {
      callback(err, null);
    } else {
      // Parse the string data
      data = body.toString('ascii').split("\n");
      width = data[0].split(' = ')[1];
      height = data[1].split(' = ')[1];

      // Return object with width and height elements
      callback(null, { 'width': width, 'height': height } );
    }
  }); 
};

Camera.prototype.createVideoStream = function(options) {
  var GET_request = this.generateGET(options);
  var path = this.cameraURI + '/axis-cgi/mjpg/video.cgi' + GET_request;

  var mjpg = new MjpegConsumer();

  request(path, {'auth': this.auth}).pipe(mjpg);

  return mjpg;
};