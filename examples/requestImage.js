var vapix = require('..');
var fs = require('fs');

var options = {
	address: '10.1.78.11',
	port: '80',
	username: 'FRC',
	password: 'FRC'
};

var camera = new vapix.Camera(options);

var options = {
	resolution: '640x480',
	compression: 30,
	rotation: 0
}

camera.requestImage(options, function(err, data) {
	if (err) throw err;

	// Write returned image data to file
	fs.writeFile("out.jpg", data, function(err) {
		if (err) throw err;
	});
});