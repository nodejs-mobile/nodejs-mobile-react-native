var rn_bridge = require("rn-bridge");

// Echo every message received from react-native.
rn_bridge.channel.on("message", (msg) => {
  rn_bridge.channel.send(msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send("initialized");
