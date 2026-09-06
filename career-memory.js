(() => {
  S.milestones = S.milestones || [];
  const isMilestone = text => /video premieres|release day|#1 single|crisis|mastered|award|bankrupt|takes the lead|replace the single|performs under protest/i.test(text);
  const remember = text => {
    if (isMilestone(text) && !S.milestones.includes(text)) S.milestones.unshift(text);
    S.milestones = S.milestones.slice(0, 4);
  };
  S.feed.forEach(remember);

  const previousNews = news;
  news = function (text) {
    if (/^Weekly sales and royalties earned/.test(text) && /moves to|holds at/.test(S.feed[0] || '')) {
      S.feed[0] += ' ' + text.replace('Weekly sales and royalties earned', 'It earned');
      return;
    }
    previousNews(text);
    remember(text);
  };

  renderFeed = function () {
    const recent = S.feed.slice(0, 3).map((text, index) => ({ text, label: index ? 'PAST' : 'NOW', memory: false }));
    const visibleText = new Set(recent.map(item => item.text));
    const memories = S.milestones.filter(text => !visibleText.has(text)).slice(0, 2).map(text => ({ text, label: '★', memory: true }));
    document.querySelector('#feed').innerHTML = [...recent, ...memories].map(item =>
      `<p class="${item.memory ? 'memory' : ''}"><b>${item.label}</b><span>${item.text}</span></p>`
    ).join('');
  };
  render();
})();
