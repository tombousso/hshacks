var server = "http://domain.com";

// Sends AJAX get request
function get(url, data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = callback;
	xhr.open("get", url, true);
	xhr.send(data);
}

// Function to send a message to the Pebble using AppMessage API
function sendMessage() {
	Pebble.sendAppMessage({"status": 0, "message": "Hi Pebble, I'm a Phone!"});
}
												
// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage",
							function(e) {
								var id = e.payload[0];
								var button = e.payload[1];
								
								if (!id) {
									// get new ID from /createUser
								} else if (!button) {
									// poll /getKeys for button assignments
								} else {
									// send button to /click
								}
							});
