document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => window.player.action(button.dataset.action));
});
