(() => {
  const game = document.querySelector('#game');
  const hero = document.querySelector('#careerHero');
  const ticker = game.querySelector('.ticker');
  const stats = game.querySelector('.stats');
  const nav = game.querySelector('nav');
  const hq = game.querySelector('#hq');
  const charts = game.querySelector('#charts');
  const band = game.querySelector('#band');

  nav.hidden = true;
  hero.after(ticker);
  ticker.after(stats);
  stats.after(hq);

  const lower = document.createElement('section');
  lower.className = 'lower-dashboard';
  lower.append(band, charts);
  hq.after(lower);

  show = function () {
    [hq, charts, band].forEach(page => page.classList.remove('hidden'));
    hero.classList.remove('structure-hidden');
  };
  show('hq');
})();
