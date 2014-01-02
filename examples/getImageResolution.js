var vapix = require('..');
var fs = require('fs');

var camera = vapix.createCamera({
  address: '10.1.78.11',
  port: '80',
  username: 'FRC',
  password: 'FRC'
});

camera.getImageResolution(function(err, data) {
	if (err) throw err;
	console.log(data);
});