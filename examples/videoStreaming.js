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
	compression: 25,
	duration: 10,
	fps: 30
}

var mjpg = camera.createVideoStream(options);

var counter = 1;

fs.mkdir('frames');

mjpg.on('data', function(data) {
	fs.writeFile('frames/' + counter + ".jpg", data, function(err) {
		if (err) throw err;
	});

	counter++;
});

mjpg.on('end', function() {
	console.log('Finished. Processed ' + counter / options.duration + ' frames per second');
});