// Aliases for major page elements
var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name'),
	bg: document.getElementById('background'),
	location: document.getElementById('location')
};

// Pick rand team from team array in data.js
var teamNum = teams[parseInt(Math.random() * teams.length)];
// Put team number on page
el.number.innerHTML = '<a href="https://www.thebluealliance.com/team/' + teamNum + '">' + teamNum + '</a>';

try {
	// Create request to get data from TBA
	var req = new XMLHttpRequest();
	// Get data for team
	req.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
	// Send empty data for conclusion
	req.send();
	// When the data is ready
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			// Parse the data into JSON to get it ready to be used
			team = JSON.parse(req.responseText);
			// Set team name on page
			el.name.innerHTML = (team.website && team.website !== 'Coming Soon') ? '<a href="' + team.website + '">' + team.nickname + '</a>' : team.nickname;
			el.location.innerHTML = team.location;
		}
	};
} catch (e) {}

// Source it to a random photo in the bg folder.
var src = 'bg/' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

// Make a new request to get list of team media from TBA
var mediaReq = new XMLHttpRequest();
// Set function to be executed when the data is ready
mediaReq.onreadystatechange = function() {
	if (mediaReq.readyState == 4 && mediaReq.status == 200) {
		// Parse data for processing
		var media = [];
		try {
			media = JSON.parse(mediaReq.responseText);
		} catch (e) {}
        console.log(media.length);
		if (media.length > 0) {
			var target;
			// Go through every piece of media
			for (i = 0; i < media.length; i++) {
				// Find media that's an image
				if (media[i].type === 'imgur' || media[i].type === 'cdphotothread') {
					// Set target to that image and break loop.
					target = i;
					break;
				}
			}
			// Check where the media is sourced from. Use this to build a link to the image.
			if (target !== null) {
                console.log('targeted ', media[target].type);
				switch (media[target].type) {
					case 'imgur':
						src = 'http://i.imgur.com/' + media[target].foreign_key + '.png';
						break;
					case 'cdphotothread':
						src = 'https://www.chiefdelphi.com/media/img/' + media[target].details.image_partial;
						break;
				}
			}
		}
        // Log URL of background image
        console.log(src);
        // Put the image into the background (see below).
        renderImage();
	}
};

// Get data
mediaReq.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '/media?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
mediaReq.send();

function renderImage() {
    // Create image. This will be used to check if the image is smaller than the window.
    var img = new Image();
    // Give it the proper source.
    img.src = src;
    // When the source is done loading,
    img.onload = function() {
    	// Check if the image is smaller than the window.
    	if (img.naturalWidth >= window.innerWidth) {
    		// If it is, blur the background image.
    		el.bg.style['-webkit-filter'] = 'contrast(0.7)';
    	}
    };

    // Set the src of the real background image.
    el.bg.style.backgroundImage = 'url(' + src + ')';
}

// TODO: This process could probably be way more efficient. Find a way to improve.
