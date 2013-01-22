var vapix = require('..');
var fs = require('fs');

var options = {
	address: '10.1.78.11',
	port: '80',
	username: 'FRC',
	password: 'FRC'
};

var camera = new vapix.camera(options);
camera.requestImage(function(data) {
	fs.appendFile("out.jpeg", data, function(err) {
		if (err) throw err;
	});
});