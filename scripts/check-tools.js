// Keep this check compatible with older Node versions so it can explain an upgrade.
var childProcess = require('child_process');

function supportedNode(version) {
  var parts = version.replace(/^v/, '').split('.').map(Number);
  return parts[0] > 22 || (parts[0] === 22 && parts[1] >= 12);
}

function supportedNpm(version) {
  return /^\d+\.\d+\.\d+$/.test(version) && Number(version.split('.')[0]) >= 10;
}

function main() {
  console.log('Node.js: ' + process.version);
  if (!supportedNode(process.version)) {
    console.error('This player requires Node.js 22.12 or newer and npm 10 or newer.');
    return 1;
  }
  var npmVersion;
  try {
    npmVersion = childProcess.execSync('npm' + (process.platform === 'win32' ? '.cmd' : '') + ' --version', {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
  } catch (error) {
    console.error('Could not run npm. Reinstall the current Node.js LTS with npm included.');
    return 1;
  }
  console.log('npm: ' + npmVersion);
  if (!supportedNpm(npmVersion)) {
    console.error('This project requires npm 10 or newer. Older npm cannot read its lockfile.');
    return 1;
  }
  return 0;
}

module.exports = { supportedNode: supportedNode, supportedNpm: supportedNpm };
if (require.main === module) process.exitCode = main();
