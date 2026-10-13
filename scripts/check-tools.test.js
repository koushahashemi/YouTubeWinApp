const { test } = require('node:test');
const assert = require('node:assert/strict');
const { supportedNode, supportedNpm } = require('./check-tools');

test('toolchain check rejects Node versions incompatible with Electron', () => {
  for (const version of ['v12.22.12', 'v20.19.0', 'v22.11.0']) assert.equal(supportedNode(version), false);
  for (const version of ['v22.12.0', 'v22.20.0', 'v24.0.0']) assert.equal(supportedNode(version), true);
});

test('toolchain check rejects legacy npm before it reads the lockfile', () => {
  for (const version of ['6.14.18', '8.19.4', '9.9.4', 'invalid']) assert.equal(supportedNpm(version), false);
  for (const version of ['10.0.0', '11.9.0', '12.0.0']) assert.equal(supportedNpm(version), true);
});
