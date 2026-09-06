(() => {
  const originalRender = render;
  render = function () {
    originalRender();
    const heading = document.querySelector('.actionPanel .panelHead > b');
    if (heading) heading.textContent = 'THIS WEEK';
    const available = document.querySelector('#available');
    if (available) available.textContent = S.actions + '/2 AVAILABLE';
  };

  S.actions = 2;
  const nextButton = document.querySelector('#next');
  const originalNext = nextButton.onclick;
  nextButton.onclick = event => {
    originalNext.call(nextButton, event);
    S.actions = 2;
    render();
  };
  render();
})();
