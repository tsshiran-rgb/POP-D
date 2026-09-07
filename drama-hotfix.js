(() => {
  document.addEventListener('click', event => {
    const video = event.target.closest?.('[data-action="video"]');
    if (video && !video.disabled) S.pendingEventId = 'video_fight';
  }, true);
  document.addEventListener('click', event => {
    if (event.target?.id !== 'recordNow' || !S.nextSongBonus || !S.songs.length) return;
    const song = S.songs.at(-1);
    song.quality = clamp(song.quality + S.nextSongBonus);
    news(`Taking extra time pays off: “${song.title}” reaches ${song.quality}/100 quality.`);
    S.nextSongBonus = 0;
    render();
  });
})();
