const fs = require('fs');
const path = require('path');

// Patches a package.json in case it has variable substitution for
// the module's binary at runtime. Since we are cross-compiling
// for mobile, this substitution will have different values at
// build time and runtime, so we pre-substitute them with fixed
// values.
function patchPackageJSON_preNodeGyp_modulePath(packageJSONPath) {
  const packageJSONReadData = fs.readFileSync(packageJSONPath);
  const packageJSON = JSON.parse(packageJSONReadData);
  if (!packageJSON) return;
  if (!packageJSON.binary) return;
  if (!packageJSON.binary.module_path) return;
  let binaryPathConfiguration = packageJSON.binary.module_path;
  binaryPathConfiguration = binaryPathConfiguration.replace(
    /\{node_abi\}/g,
    'node_abi',
  );
  binaryPathConfiguration = binaryPathConfiguration.replace(
    /\{platform\}/g,
    'platform',
  );
  binaryPathConfiguration = binaryPathConfiguration.replace(
    /\{arch\}/g,
    'arch',
  );
  binaryPathConfiguration = binaryPathConfiguration.replace(
    /\{target_arch\}/g,
    'target_arch',
  );
  binaryPathConfiguration = binaryPathConfiguration.replace(
    /\{libc\}/g,
    'libc',
  );
  packageJSON.binary.module_path = binaryPathConfiguration;
  const packageJSONWriteData = JSON.stringify(packageJSON, null, 2);
  fs.writeFileSync(packageJSONPath, packageJSONWriteData);
}

/**
 * Since npm 7+, the environment variable npm_config_node_gyp (which we rely on
 * in scripts/ios-build-native-modules.sh) has not been forwarded to package
 * scripts, so here we patch each module's package.json to replace
 * node-gyp-build with our fork, node-gyp-build-mobile. This fork reads a
 * different environment variable, originally created in
 * scripts/ios-build-native-modules.sh, pointing to node-mobile-gyp.
 */
function patchPackageJSONNodeGypBuild(packageJSONPath) {
  const packageJSONReadData = fs.readFileSync(packageJSONPath);
  let packageJSON;
  try {
    packageJSON = JSON.parse(packageJSONReadData);
  } catch (err) {
    console.log(
      'nodejs-mobile-react-native patcher failed to parse ' + packageJSONPath,
    );
    return;
  }
  if (!packageJSON) return;
  if (!packageJSON.scripts) return;
  if (!packageJSON.scripts.install) return;
  if (!packageJSON.scripts.install.includes('node-gyp-build')) return;
  packageJSON.scripts.install = packageJSON.scripts.install.replace(
    /node-gyp-build(?!-)/g,
    '$PROJECT_DIR/../node_modules/.bin/node-gyp-build-mobile',
  );
  const packageJSONWriteData = JSON.stringify(packageJSON, null, 2);
  fs.writeFileSync(packageJSONPath, packageJSONWriteData);
}

// Visits every package.json to apply patches.
function visitPackageJSON(folderPath) {
  let files = fs.readdirSync(folderPath);
  for (var i in files) {
    let name = files[i];
    let filePath = path.join(folderPath, files[i]);
    if (fs.lstatSync(filePath).isDirectory()) {
      visitPackageJSON(filePath);
    } else {
      if (name === 'package.json') {
        try {
          patchPackageJSON_preNodeGyp_modulePath(filePath);
          patchPackageJSONNodeGypBuild(filePath);
        } catch (e) {
          console.warn(
            'Failed to patch the file : "' +
              filePath +
              '". The following error was thrown: ' +
              JSON.stringify(e),
          );
        }
      }
    }
  }
}

if (process.argv.length >= 3) {
  if (fs.existsSync(process.argv[2])) {
    visitPackageJSON(process.argv[2]);
  }
  process.exit(0);
} else {
  console.error('A path is expected as an argument.');
  process.exit(1);
}
