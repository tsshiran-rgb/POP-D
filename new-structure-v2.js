(() => {
  const game = document.querySelector('#game');
  const header = game.querySelector('header');
  const ticker = game.querySelector('.ticker');
  const stats = game.querySelector('.stats');
  const nav = game.querySelector('nav');
  const hq = game.querySelector('#hq');
  const hero = hq.querySelector('.title');
  const date = header.querySelector('.date');
  const nextButton = header.querySelector('#next');
  const heroControls = hero.querySelector('aside');

  header.classList.add('brand-bar');
  date.classList.add('render-compatibility');
  hero.id = 'careerHero';
  heroControls.classList.add('hero-controls');
  heroControls.insertAdjacentHTML('afterbegin','<div class="action-summary"></div>');
  const summary = heroControls.querySelector('.action-summary');
  summary.append(...[...heroControls.children].filter(child => child !== summary));
  heroControls.append(nextButton);
  ticker.after(hero);
  hero.after(nav);
  nav.after(stats);

  const previousRender = render;
  render = function () {
    previousRender();
    const era = hero.querySelector('.title>div:first-child>em');
    if (era) era.textContent = `CURRENT ERA · YEAR ${S.year} · ${months[S.month].toUpperCase()}`;
  };
  const syncHero = view => hero.classList.toggle('structure-hidden', view !== 'hq');
  nav.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => syncHero(button.dataset.view)));
  header.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => syncHero(button.dataset.view)));
  render();
})();
