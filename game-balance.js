(() => {
  const nextButton = document.querySelector('#next');
  const previousNext = nextButton.onclick;
  const previousRender = render;

  function activeSongs() { return S.songs.filter(song => song.released && !song.retired); }
  function inflatedRevenue(songs) {
    return songs.reduce((total, song) => total + Math.max(250, (101 - song.pos) * 72) + Math.round(S.fans * .012), 0);
  }
  function fairRevenue(songs) {
    return Math.round(songs.reduce((total, song) => {
      const chart = Math.max(120, (101 - song.pos) * 16);
      const audience = Math.min(600, S.fans * .0015);
      const agePenalty = Math.max(.25, 1 - Math.max(0, song.weeks - 5) * .1);
      return total + (chart + audience) * agePenalty;
    }, 0));
  }

  renderSongs = function () {
    const box = document.querySelector('#songs');
    document.querySelector('#songCount').textContent = S.songs.length + ' SONG' + (S.songs.length === 1 ? '' : 'S');
    if (!S.songs.length) return;
    box.className = 'songList';
    box.innerHTML = S.songs.map((song, index) => `<article class="${song.retired ? 'catalog-song' : ''}"><i>♪</i><span><b>${song.title}</b><small>${song.retired ? 'Catalog · Peak #' + song.peak : song.released ? '#' + song.pos + ' · Peak #' + song.peak + ' · Week ' + song.weeks : 'Quality ' + song.quality + ' · Ready'}</small></span>${!song.released && !song.retired ? `<button data-release="${index}">RELEASE</button>` : ''}</article>`).join('');
    document.querySelectorAll('[data-release]').forEach(button => button.onclick = () => release(Number(button.dataset.release)));
  };

  renderChart = function () {
    let rows = rivals.map((rival, index) => ({ act:rival[0], title:rival[1], pos:index + 1, player:false }));
    activeSongs().forEach(song => rows.push({ act:S.band.toUpperCase(), title:song.title, pos:song.pos, player:true }));
    rows.sort((a,b) => a.pos - b.pos);
    document.querySelector('#chart').innerHTML = rows.slice(0,10).map((row,index) => `<article class="${row.player ? 'player' : ''}"><b>${row.pos}</b><i>${index % 3 === 0 ? '▲' : index % 3 === 1 ? '▼' : '—'}</i><span><strong>${row.title}</strong><small>${row.act}</small></span>${row.player ? '<mark>YOUR SINGLE</mark>' : ''}</article>`).join('');
  };

  render = function () {
    previousRender();
    const hasMusic = S.songs.length > 0;
    document.querySelector('.actionPanel').classList.toggle('has-music', hasMusic);
    const video = document.querySelector('[data-action="video"]');
    if (video && !activeSongs().length) video.disabled = true;
  };

  nextButton.onclick = event => {
    const retiredBefore = S.songs.filter(song => song.retired);
    retiredBefore.forEach(song => song.released = false);
    previousNext.call(nextButton, event);
    retiredBefore.forEach(song => song.released = true);

    const charting = activeSongs();
    const overpayment = inflatedRevenue(charting);
    S.cash -= overpayment;

    charting.forEach(song => {
      if (song.weeks > 6) song.pos = Math.min(100, song.pos + Math.min(18, (song.weeks - 6) * 3));
      if (song.weeks >= 15) {
        song.retired = true;
        news(`“${song.title}” leaves the chart after a ${song.weeks}-week run, peaking at #${song.peak}.`);
      }
    });
    const revenue = fairRevenue(activeSongs());
    S.cash += revenue;
    const moneyLine = S.feed.findIndex(text => /It earned \$|Weekly sales and royalties earned/.test(text));
    if (moneyLine >= 0) S.feed[moneyLine] = S.feed[moneyLine].replace(/It earned \$[\d,]+\.|Weekly sales and royalties earned \$[\d,]+\./, 'It earned ' + fmt(revenue) + '.');
    render();
  };

  document.addEventListener('click', event => {
    if (event.target?.id !== 'recordNow') return;
    const input = document.querySelector('#songTitle');
    const duplicate = S.songs.some(song => song.title.trim().toLowerCase() === input.value.trim().toLowerCase());
    if (!duplicate) return;
    event.preventDefault(); event.stopImmediatePropagation();
    let error = document.querySelector('.song-name-error');
    if (!error) { input.insertAdjacentHTML('afterend','<p class="song-name-error">You already released a song with this title. Give the new era its own anthem.</p>'); error = document.querySelector('.song-name-error'); }
    input.focus();
  }, true);
  render();
})();
