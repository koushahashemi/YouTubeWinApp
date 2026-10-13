const commands = {
  play: `document.querySelector('ytmusic-player-bar #play-pause-button')?.click()`,
  next: `document.querySelector('ytmusic-player-bar .next-button')?.click()`,
  previous: `document.querySelector('ytmusic-player-bar .previous-button')?.click()`
};

function isMusicUrl(value) {
  try { return new URL(value).origin === 'https://music.youtube.com'; }
  catch { return false; }
}

function isAccountUrl(value) {
  try { return new URL(value).origin === 'https://accounts.google.com'; }
  catch { return false; }
}

module.exports = { commands, isMusicUrl, isAccountUrl };
