const pkg = require("../package.json");
const path = require("path");

module.exports = {
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, ".."),
    },
  },
};
