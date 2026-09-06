(() => {
  let rescueUsed = false;
  let showing = false;

  function bankruptcyCheck() {
    if (showing || S.cash >= 0) return;
    showing = true;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="bankrupt-screen" role="dialog" aria-modal="true" aria-labelledby="bankruptTitle">
        <div class="bankrupt-noise"></div>
        <section>
          <div class="bankrupt-stamp">CAREER CRISIS</div>
          <div class="bankrupt-icon">$</div>
          <p class="bankrupt-kicker">THE MONEY IS GONE</p>
          <h2 id="bankruptTitle">YOU'RE<br><i>BANKRUPT.</i></h2>
          <p>Your label freezes every project. The band is waiting for you to decide whether this story ends here.</p>
          <div class="bankrupt-balance"><span>ACCOUNT BALANCE</span><b>${fmt(S.cash)}</b></div>
          <button class="bankrupt-retry">START A NEW CAREER <b>↻</b></button>
          ${rescueUsed ? '' : '<button class="bankrupt-rescue">TAKE AN EMERGENCY ADVANCE <b>+$30,000</b><small>One time only · Fame −5 · Chemistry −5</small></button>'}
        </section>
      </div>`);
    document.querySelector('.bankrupt-retry').onclick = () => location.reload();
    const rescue = document.querySelector('.bankrupt-rescue');
    if (rescue) rescue.onclick = () => {
      rescueUsed = true; S.cash += 30000; S.fame = clamp(S.fame - 5); S.chem = clamp(S.chem - 5);
      news('An emergency investor keeps the band alive—but now they expect results.');
      document.querySelector('.bankrupt-screen').remove(); showing = false; render();
    };
  }

  document.addEventListener('click', () => setTimeout(bankruptcyCheck, 0));
})();
