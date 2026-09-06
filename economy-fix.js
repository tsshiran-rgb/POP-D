(() => {
  const costs = { record:22000, promo:8000, video:15000, show:4000, photo:6000, break:0 };
  const previousRender = render;

  function weeklyRevenue() {
    const released = S.songs.filter(song => song.released);
    if (!released.length) return 0;
    return released.reduce((total, song) => {
      const chartSales = Math.max(250, (101 - song.pos) * 72);
      const fanSales = Math.round(S.fans * .012);
      return total + chartSales + fanSales;
    }, 0);
  }

  render = function () {
    previousRender();
    const heading = document.querySelector('.actionPanel .panelHead > b');
    if (heading) heading.textContent = 'THIS WEEK';
    const available = document.querySelector('#available');
    if (available) available.textContent = S.actions + '/2 AVAILABLE';
    document.querySelectorAll('[data-action]').forEach(button => {
      const cost = costs[button.dataset.action] ?? 0;
      const unaffordable = S.cash < cost;
      button.disabled = S.actions < 1 || unaffordable || (button.dataset.action === 'video' && !S.songs.some(song => song.released));
      button.classList.toggle('cant-afford', unaffordable);
      if (unaffordable) {
        const missing = cost - S.cash;
        button.title = 'You need ' + fmt(missing) + ' more';
        button.dataset.shortfall = 'NEED ' + fmt(missing) + ' MORE';
      } else {
        button.removeAttribute('title'); button.removeAttribute('data-shortfall');
      }
    });
  };

  const nextButton = document.querySelector('#next');
  const previousNext = nextButton.onclick;
  nextButton.onclick = event => {
    const oldMonth = S.month;
    previousNext.call(nextButton, event);
    const revenue = weeklyRevenue();
    if (revenue > 0) {
      S.cash += revenue;
      news('Weekly sales and royalties earned ' + fmt(revenue) + '.');
    }
    if (S.month !== oldMonth) news(months[S.month] + ' begins. New bills, new chances, new chart battles.');
    render();
  };
  render();
})();
