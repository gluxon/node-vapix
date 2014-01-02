var vapix = require('..');
var fs = require('fs');

var camera = vapix.createCamera({
  address: '10.1.78.11',
  port: '80',
  username: 'FRC',
  password: 'FRC'
});

var options = {
  resolution: '640x480',
  compression: 25,
  duration: 30,
  fps: 10
}
var video = camera.createVideoStream(options);

if (!fs.existsSync('frames')) {
  fs.mkdirSync('frames');
}

var counter = 0;
video.on('data', function(data) {
	fs.writeFile('frames/' + counter + ".jpg", data, function(err) {
		if (err) throw err;
	});

	counter++;
});

video.on('end', function() {
	console.log('Finished. Processed ' + counter / options.duration + ' frames per second');
});