var server = "http://pebblix-heroku.herokuapp.com";

// Sends AJAX get request
function get(url, data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = callback;
	xhr.open("get", url, true);
	xhr.send(data);
}

// get new ID from /createUser
function getID() {
	get(server + "/createUser", "", function () {
		Pebble.sendAppMessage({"0": parseInt(this.responseText, 10)});
		debug("new id: " + parseInt(this.responseText, 10));
	});
}

// poll for button assignments
function getKeys(id) {
	get(server + "/getKeys", "serial=" + id, function () {
		var data = JSON.parse(this.responseText);
		Pebble.sendAppMessage({"0": data.top, "1": data.mid, "2": data.bot});
	});
}

// send button to /click
function sendButton(id, btn) {
	get(server + "/click", "serial=" + id + "&button=" + btn);
}

function debug(data) {
	get(server + "/debug", "debug=" + data);
}
												
// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage",
							function(e) {
								var id = e.payload[0];
								var button = e.payload[1];
								debug("id: " + id + ", button: " + button);
								debug("typeof id: " + typeof id);
								debug("typeof button: " + typeof button);
								
								if (!id) {
									getID();
								} else if (!button) {
									getKeys(id);
								} else {
									switch (button) {
									case 1:
										sendButton(id, "top");
										break;
									case 2:
										sendButton(id, "mid");
										break;
									case 3:
										sendButton(id, "bot");
										break;
									}
								}
							});
