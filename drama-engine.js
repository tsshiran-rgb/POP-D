(() => {
  const EVENTS = [
    {id:'video_fight',kicker:'ON SET',title:'THE VIDEO SHOOT STOPS',body:'{a} and {b} are screaming at each other while the cameras wait. Every wasted minute costs money.',weight:20,choices:[
      {label:'Stop and mediate',preview:'Cash −$2K · Chemistry +6',outcome:'You clear the set. The honest conversation saves the shoot.',effects:{cash:-2000,chem:6,heart:5}},
      {label:'Keep the cameras rolling',preview:'Hype +10 · Chemistry −12 · Wellbeing −8',outcome:'The tension makes the video electric—and the dressing room poisonous.',effects:{hype:10,chem:-12,wellbeing:-8}},
      {label:'Take {a}’s side',preview:'Hype +4 · {b} loyalty −16',outcome:'The shoot continues, but {b} will remember who you chose.',effects:{hype:4,heart:-16,target:'b'}}]},
    {id:'tabloid',kicker:'TABLOID SCANDAL',title:'4AM. FRONT PAGE.',body:'A photographer catches {a} leaving a nightclub at 4AM. By breakfast, every radio host is talking about it.',conditions:{minFame:8},weight:12,choices:[
      {label:'Ignore it',preview:'Hype +8 · Chemistry −3',outcome:'Mystery feeds the story. The band hates the distraction.',effects:{hype:8,chem:-3}},
      {label:'Issue an apology',preview:'Hype −3 · Fame +3 · {a} wellbeing −4',outcome:'The apology is awkward, but the press begins to move on.',effects:{hype:-3,fame:3,wellbeing:-4}},
      {label:'Lean into it 😈',preview:'Hype +15 · Chemistry −10 · Sponsor risk',outcome:'The bad-girl image explodes. A sponsor may not find it funny.',effects:{hype:15,chem:-10},delayed:{chance:.35,weeks:2,cash:-9000,text:'A family sponsor drops the band over the nightclub scandal. −$9,000.'}}]},
    {id:'label_calls',kicker:'THE LABEL CALLS',title:'THEY WANT ANOTHER HIT. NOW.',body:'Your single is climbing. The label demands a follow-up before the moment disappears.',conditions:{hasReleased:true,topPosition:35},weight:16,choices:[
      {label:'Rush a new single',preview:'Cash −$18K · Chemistry −8 · New song added',outcome:'Three sleepless nights later, the label has its follow-up.',effects:{cash:-18000,chem:-8,rushSong:true}},
      {label:'Take your time',preview:'Next song quality +10 · Hype −4',outcome:'You protect the music, even as the label taps its watch.',effects:{hype:-4,nextQuality:10}},
      {label:'Tell them no',preview:'Chemistry +5 · Fame −4',outcome:'The band feels protected. The label stops returning calls.',effects:{chem:5,fame:-4}}]},
    {id:'jealous_member',kicker:'BACKSTAGE',title:'“WHY AM I EVEN IN THIS GROUP?”',body:'{a} thinks {b} gets every spotlight. Rehearsal ends with a slammed door.',conditions:{maxChem:88},weight:12,choices:[
      {label:'Promise the next lead',preview:'{a} loyalty +12 · Hype −3',outcome:'A promise buys peace—for now.',effects:{heart:12,hype:-3,nextLead:true}},
      {label:'The best singer leads',preview:'{a} loyalty −18 · Fame +4',outcome:'You defend the hierarchy. The room goes silent.',effects:{heart:-18,fame:4}},
      {label:'Rewrite it as a duet',preview:'Cash −$5K · Chemistry +8',outcome:'The new arrangement gives both voices a moment.',effects:{cash:-5000,chem:8}}]},
    {id:'burnout',kicker:'WARNING SIGN',title:'{a} CAN’T GET OUT OF BED',body:'Weeks of rehearsals, cameras, and interviews have caught up with {a}. Tonight’s appearance is sold out.',conditions:{maxWellbeing:68},weight:18,choices:[
      {label:'Cancel the appearance',preview:'Hype −10 · {a} wellbeing +18',outcome:'Fans complain. {a} finally sleeps.',effects:{hype:-10,wellbeing:18}},
      {label:'Perform without {a}',preview:'Fame ? · Chemistry −6',outcome:'The group survives the stage, but rumors spread backstage.',effects:{fame:5,chem:-6}},
      {label:'Push through it',preview:'Hype +8 · {a} wellbeing −15 · High risk',outcome:'The performance lands. The physical cost does not disappear.',effects:{hype:8,wellbeing:-15},delayed:{chance:.45,weeks:1,chem:-12,text:'{a} collapses during rehearsal. The band blames management. Chemistry −12.'}}]},
    {id:'rival_shade',kicker:'CHART WAR',title:'SUGAR RUSH COMES FOR YOU',body:'Sugar Rush calls {band} “manufactured karaoke” live on radio. Your fans are waiting for a response.',conditions:{hasReleased:true},weight:10,choices:[
      {label:'Release a classy statement',preview:'Fame +3 · Hype −2',outcome:'The press praises your restraint. The fans wanted blood.',effects:{fame:3,hype:-2}},
      {label:'Clap back publicly',preview:'Hype +12 · Chemistry +3 · Reputation risk',outcome:'Your reply becomes the quote of the week.',effects:{hype:12,chem:3}},
      {label:'Challenge them on stage',preview:'Cash −$4K · Fame ?',outcome:'The surprise performance becomes a genuine chart-war moment.',effects:{cash:-4000,fame:7}}]},
    {id:'leaked_demo',kicker:'LEAKED!',title:'YOUR UNFINISHED DEMO IS ONLINE',body:'A rough vocal from {a} spreads through fan forums overnight. It is messy—and people love it.',conditions:{hasSong:true},weight:9,choices:[
      {label:'Release it officially',preview:'Cash +$3K · Hype +9 · Fame ?',outcome:'Imperfection becomes part of the band’s mythology.',effects:{cash:3000,hype:9,fame:3}},
      {label:'Take it down',preview:'Hype −5 · Next song quality +6',outcome:'The leak disappears, but the studio gains breathing room.',effects:{hype:-5,nextQuality:6}},
      {label:'Blame the label',preview:'Chemistry +4 · Fame −3',outcome:'The band rallies around you. Industry calls go unanswered.',effects:{chem:4,fame:-3}}]},
    {id:'fan_favorite',kicker:'FAN MOMENT',title:'A SONG FINDS ITS PEOPLE',body:'Fans begin holding handmade “{a} SAVED ME” signs. The member who felt invisible is suddenly the heart of the fandom.',conditions:{minFans:5000},weight:8,choices:[
      {label:'Put {a} front and center',preview:'{a} loyalty +15 · Hype +5',outcome:'For one night, {a} owns the stage.',effects:{heart:15,hype:5}},
      {label:'Keep the group balanced',preview:'Chemistry +7',outcome:'Every member shares the moment.',effects:{chem:7}},
      {label:'Turn it into merchandise',preview:'Cash +$6K · {a} loyalty −5',outcome:'The shirts sell out. {a} wonders who the moment belonged to.',effects:{cash:6000,heart:-5}}]}
  ];

  const flaws = ['Jealous','Hot-headed','Party Animal','Insecure','Impulsive','Perfectionist'];
  const strengths = ['Loyal','Fearless','Charismatic','Creative','Disciplined','Empathetic'];
  const interpolate = (text,ctx) => String(text).replaceAll('{a}',ctx.a.name).replaceAll('{b}',ctx.b.name).replaceAll('{band}',S.band);
  const totalWeek = () => (S.year-1)*48 + S.month*4 + S.week;
  S.delayedConsequences = S.delayedConsequences || [];
  S.eventHistory = S.eventHistory || [];
  S.nextSongBonus = S.nextSongBonus || 0;

  function prepareMembers(){S.members.forEach((m,i)=>{m.strength ||= strengths[i%strengths.length];m.flaw ||= flaws[(i+S.members.length)%flaws.length];m.wellbeing ??= 80;});}
  const oldRenderMembers = renderMembers;
  renderMembers = function(){prepareMembers();oldRenderMembers();document.querySelectorAll('#members .member').forEach((card,i)=>{const m=S.members[i];const mark=card.querySelector('mark');if(mark)mark.insertAdjacentHTML('afterend',`<div class="person-traits"><span>★ ${m.strength}</span><span>◆ ${m.flaw}</span></div>`);const footer=card.querySelector('footer');if(footer)footer.insertAdjacentHTML('beforebegin',`<div class="wellbeing"><span>WELLBEING <b>${m.wellbeing}</b></span><i><u style="width:${m.wellbeing}%"></u></i></div>`);});};

  function context(){const sorted=[...S.members].sort((x,y)=>x.heart-y.heart);return{a:sorted[0],b:sorted[1]||sorted[0]};}
  function eligible(e){const c=e.conditions||{};const active=S.songs.filter(s=>s.released&&!s.retired);return (!c.minFame||S.fame>=c.minFame)&&(!c.minFans||S.fans>=c.minFans)&&(!c.maxChem||S.chem<=c.maxChem)&&(!c.hasReleased||active.length)&&(!c.hasSong||S.songs.length)&&(!c.topPosition||active.some(s=>s.pos<=c.topPosition))&&(!c.maxWellbeing||S.members.some(m=>m.wellbeing<=c.maxWellbeing));}
  function pickEvent(){if(S.pendingEventId){const e=EVENTS.find(x=>x.id===S.pendingEventId);S.pendingEventId=null;return e;}if(Math.random()>.62)return null;const pool=EVENTS.filter(e=>e.id!=='video_fight'&&eligible(e)&&S.eventHistory.at(-1)!==e.id);if(!pool.length)return null;const bag=pool.flatMap(e=>Array(Math.max(1,e.weight||1)).fill(e));return bag[Math.floor(Math.random()*bag.length)];}
  function applyEffects(effects,ctx){if(!effects)return;for(const [key,value] of Object.entries(effects)){if(key==='cash')S.cash+=value;if(key==='hype')S.hype=clamp(S.hype+value);if(key==='chem')S.chem=clamp(S.chem+value);if(key==='fame')S.fame=clamp(S.fame+value);if(key==='heart'){const member=effects.target==='b'?ctx.b:ctx.a;member.heart=clamp(member.heart+value);}if(key==='wellbeing')ctx.a.wellbeing=clamp(ctx.a.wellbeing+value);if(key==='nextQuality')S.nextSongBonus+=value;if(key==='rushSong'){S.songs.push({title:'Under Pressure',quality:62+S.nextSongBonus,catchy:78,released:false,pos:100,peak:100,weeks:0});S.nextSongBonus=0;}}render();}
  function resolveChoice(event,choice,ctx){applyEffects(choice.effects,ctx);if(choice.delayed&&Math.random()<(choice.delayed.chance??1))S.delayedConsequences.push({...choice.delayed,due:totalWeek()+choice.delayed.weeks,member:ctx.a.name});const deltas=choice.preview.split(' · ').map(x=>`<span>${interpolate(x,ctx)}</span>`).join('');document.querySelector('#modalBody').innerHTML=`<div class="event-result-mark">★</div><div class="kicker">DECISION MADE</div><h2>${interpolate(choice.label,ctx)}</h2><p class="story">${interpolate(choice.outcome,ctx)}</p><div class="event-deltas">${deltas}</div><button class="primary event-continue">CONTINUE THE STORY →</button>`;document.querySelector('.event-continue').onclick=()=>close();news(interpolate(choice.outcome,ctx));}
  function showEvent(event){const ctx=context();S.eventHistory.push(event.id);open(`<div class="alert">${event.kicker}</div><h2>${interpolate(event.title,ctx)}</h2><p class="story">${interpolate(event.body,ctx)}</p><div class="choices">${event.choices.map((choice,i)=>`<button data-drama-choice="${i}"><b>${String.fromCharCode(65+i)}</b><span><strong>${interpolate(choice.label,ctx)}</strong><small>${interpolate(choice.preview,ctx)}</small></span></button>`).join('')}</div>`,true);document.querySelectorAll('[data-drama-choice]').forEach(button=>button.onclick=()=>resolveChoice(event,event.choices[Number(button.dataset.dramaChoice)],ctx));}
  function processDelayed(){const due=S.delayedConsequences.filter(x=>x.due<=totalWeek());S.delayedConsequences=S.delayedConsequences.filter(x=>x.due>totalWeek());due.forEach(item=>{const ctx=context();ctx.a=S.members.find(m=>m.name===item.member)||ctx.a;applyEffects({cash:item.cash||0,chem:item.chem||0,hype:item.hype||0},ctx);news(interpolate(item.text,ctx));});}

  document.addEventListener('click',e=>{const action=e.target.closest?.('[data-action="video"]');if(action&&!action.disabled)S.pendingEventId='video_fight';});
  const nextButton=document.querySelector('#next');const previousNext=nextButton.onclick;
  nextButton.onclick=e=>{previousNext.call(nextButton,e);prepareMembers();S.members.forEach(m=>m.wellbeing=clamp(m.wellbeing-(S.actions===2?2:0)));processDelayed();const event=pickEvent();const transition=document.createElement('div');transition.className='week-transition';transition.innerHTML='<div><i>✦</i><span>THE CHARTS ARE IN</span><b>'+months[S.month].toUpperCase()+' · WEEK '+S.week+'</b></div>';document.body.append(transition);nextButton.disabled=true;setTimeout(()=>{transition.classList.add('reveal');transition.querySelector('span').textContent=S.feed[0];},350);setTimeout(()=>{transition.remove();nextButton.disabled=false;if(event&&!document.querySelector('.bankrupt-screen'))showEvent(event);},950);render();};
  render();
})();
