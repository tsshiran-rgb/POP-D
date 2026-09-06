(() => {
  if (!document.querySelector('#yearMonth') || !document.querySelector('#week')) {
    const compatibility = document.createElement('div');
    compatibility.className = 'render-compatibility';
    compatibility.setAttribute('aria-hidden','true');
    compatibility.innerHTML = '<span id="yearMonth"></span><span id="week"></span>';
    document.querySelector('#game').append(compatibility);
  }
  const hero = document.querySelector('#careerHero');
  const nav = document.querySelector('#game nav');
  const syncHero = view => hero?.classList.toggle('structure-hidden', view !== 'hq');
  nav?.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => syncHero(button.dataset.view)));
  document.querySelector('.brand-bar [data-view]')?.addEventListener('click', () => syncHero('hq'));
  render();
})();
