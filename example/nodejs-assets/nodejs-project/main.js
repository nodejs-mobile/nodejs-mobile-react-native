var rn_bridge = require("rn-bridge");

// Echo every message received from react-native.
rn_bridge.channel.on("foo", (msg) => {
  rn_bridge.channel.post("foo", msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");
