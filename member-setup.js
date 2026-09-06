(() => {
  const input = document.querySelector('#bandName');
  const start = document.querySelector('#start');
  if (!input || !start) return;

  input.insertAdjacentHTML('afterend', `
    <fieldset class="size-picker">
      <legend>HOW MANY MEMBERS?</legend>
      <div role="radiogroup" aria-label="Band size">
        <button type="button" data-size="3" aria-pressed="true"><b>3</b><span>Tight-knit trio</span></button>
        <button type="button" data-size="4" aria-pressed="false"><b>4</b><span>Classic group</span></button>
        <button type="button" data-size="5" aria-pressed="false"><b>5</b><span>Big personalities</span></button>
      </div>
    </fieldset>`);

  let chosenSize = 3;
  document.querySelectorAll('[data-size]').forEach(button => {
    button.addEventListener('click', () => {
      chosenSize = Number(button.dataset.size);
      document.querySelectorAll('[data-size]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    });
  });

  const names = ['Maya','Chloe','Jade','Sasha','Lena','Riley','Nina','Zoe','Kira','Talia','Ari','Lexi'];
  const roles = ['Lead singer','Main dancer','Harmony vocals','Rapper / vocals','Songwriter'];
  const traits = ['Drama Queen','Ambitious','Peacemaker','Perfectionist','Wild Card','Hopeless Romantic','Workaholic','Secret Songwriter'];
  const colors = ['#ff4f93','#8f62dc','#20c3bb','#ff9b4a','#557fe2'];
  function shuffled(items) { return [...items].sort(() => Math.random() - .5); }
  function stat() { return 66 + Math.floor(Math.random() * 31); }
  function createCast(count) {
    const castNames = shuffled(names).slice(0, count);
    const castTraits = shuffled(traits);
    return castNames.map((name, index) => ({
      name, role: roles[index], v: stat(), s: stat(), c: stat(),
      trait: castTraits[index], heart: 68 + Math.floor(Math.random() * 21),
      wellbeing: 72 + Math.floor(Math.random() * 20), color: colors[index]
    }));
  }

  const begin = start.onclick;
  start.onclick = event => {
    S.members = createCast(chosenSize);
    S.chem = 72 + Math.floor(Math.random() * 12);
    begin.call(start, event);
  };
})();
