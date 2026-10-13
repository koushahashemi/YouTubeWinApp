const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { commands, isMusicUrl, isAccountUrl } = require('./controls');

test('only the exact HTTPS music origin can receive playback commands', () => {
  assert.equal(isMusicUrl('https://music.youtube.com/playlist?list=LM'), true);
  for (const url of ['http://music.youtube.com', 'https://music.youtube.com.evil.test', 'https://music.youtube.com@evil.test', 'file:///tmp/index.html', 'invalid']) {
    assert.equal(isMusicUrl(url), false);
  }
});
test('account popup allows only the exact Google account origin', () => {
  assert.equal(isAccountUrl('https://accounts.google.com/ServiceLogin'), true);
  assert.equal(isAccountUrl('https://accounts.google.com.evil.test'), false);
});
test('playback commands click the intended site control and tolerate a missing player', () => {
  for (const [name, script] of Object.entries(commands)) {
    let selector, clicked = false;
    vm.runInNewContext(script, { document: { querySelector: value => {
      selector = value;
      return { click: () => { clicked = true; } };
    } } });
    assert.ok(clicked, name);
    assert.match(selector, /^ytmusic-player-bar /);
    vm.runInNewContext(script, { document: { querySelector: () => null } });
  }
});
