(() => {
  const previousRender = render;
  function isLaunchWeek() { return S.year === 1 && S.month === 0 && S.week === 1; }
  S.actions = 3;
  render = function () {
    previousRender();
    const available = document.querySelector('#available');
    if (available) available.textContent = S.actions + '/' + (isLaunchWeek() ? 3 : 2) + ' AVAILABLE';
    const video = document.querySelector('[data-action="video"]');
    if (video) {
      const needsRelease = !S.songs.some(song => song.released);
      video.classList.toggle('needs-release', needsRelease);
      if (needsRelease) {
        video.disabled = true;
        video.dataset.prerequisite = 'RELEASE A SINGLE FIRST';
        video.title = 'Release your recorded single before making its music video';
      } else {
        video.removeAttribute('data-prerequisite');
      }
    }
  };
  render();
})();
