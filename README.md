# node-vapix

node-vapix is a Node.js implementation of VAPIX®, an HTTP-based API to
interface with Axis cameras.

## What is VAPIX?

> VAPIX® is Axis’ own open API (Application Programming Interface). It
> makes Axis network video solutions costefficient, flexible, scalable,
> future-proof and easy to integrate with other systems.

> All Axis network cameras and video servers have an HTTP-based
> application programming interface. VAPIX® provides functionality for
> requesting images, controlling network camera functions (PTZ, relays
> etc.) and setting/retrieving internal parameter values. The purpose
> of the API is to make it easier for developers to build applications
> that support Axis video products.

For more details, and the source of the above quote, see Axis' page on
the API.

[http://www.axis.com/techsup/cam_servers/dev/cam_http_api_index.php](http://www.axis.com/techsup/cam_servers/dev/cam_http_api_index.php)

## Install and usage

Install from npm:

	npm install vapix

And to use...

	var vapix = require('vapix');

## Methods

### camera.createVideoSream(options)

Returns a video stream. Each data event is a full frame. Parameters are
outlined in the VAPIX® [Video Streaming API](http://www.axis.com/files/manuals/vapix_video_streaming_48700_en_1208.pdf)
document.

	var options = {
		resolution: '640x480',
		compression: 25,
		duration: 10,
		fps: 30
	}

	var mjpg = camera.createVideoStream(options);

	mjpg.on('data', function(data) {
		// do something with the frame here
	});

	mjpg.on('end', function() {
		console.log('Finished.');
	});


## License

node-vapix is written under the [MIT License](http://opensource.org/licenses/MIT)

## Status

#### 0.3
- Added createVideoStream()
- Created method for generating HTTP GET queries

#### 0.2

- Added getImageResolution()
- Reworked two request methods to use a common request template

#### 0.1
2-22-13: requestImage() now complete. Correctly throws error.  
1-22-13: Basic image download refined, no longer need to concatenate
chunks on frontend. Moving from alpha status to beta.  
1-21-13: Only a basic image download works.  
