const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../mobile-life.js'),'utf8');
function boot(overrides={},storage=new Map()){
  const buttons=new Map();const app={innerHTML:'',querySelectorAll:()=>[],querySelector(id){if(!buttons.has(id))buttons.set(id,{value:'Test',remove(){},classList:{toggle(){}}});return buttons.get(id)},insertAdjacentHTML(_,html){this.innerHTML+=html}};
  const S={band:'Test Band',year:1,month:0,week:1,cash:211,fans:2400,fame:12,hype:5,chem:68,songs:[],members:[{name:'Jade',strength:'Loyal',flaw:'Jealous',heart:50}],feed:['Hello']};
  if(!storage.has('popDynastyMobileV1'))storage.set('popDynastyMobileV1',JSON.stringify({state:{phase:'game',milestones:{},player:{name:'Alex',age:20,role:'voice'},...overrides.state},S:{...S,...overrides.S}}));
  const timers=[];const ctx={S,months:['January','February','March','April','May','June','July','August','September','October','November','December'],rivals:[],clamp:n=>Math.max(0,Math.min(100,n)),localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{createElement:()=>app,body:{append(){},insertAdjacentHTML(){}},querySelector:()=>null},setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout(){},PopFeedback:{createToastQueue:()=>({push(){},setBlocked(){},clear(){}})}};
  vm.createContext(ctx);
  vm.runInContext(source.replace('  initializeFeedback();render();','  globalThis.financeTest={state,get meta(){return meta},S,activityData,progressionMechanics,hasValidProgressionPath,checkFinancialCrisis,takeEmergencyLoan,endCareer,startNewStory,generateMembers,perform,advanceTime,newWeek,resolveEvent,save,render,showRecap,addMilestone,collectMilestones};\n  initializeFeedback();render();'),ctx);
  return {api:ctx.financeTest,app,buttons,storage,timers};
}
test('first failure automatically shows loan; loan preserves progress and persists exactly once',()=>{
  const b=boot();assert.match(b.app.innerHTML,/YOU'RE BROKE/);const band=b.api.S.band;
  b.buttons.get('#takeEmergencyLoan').onclick();assert.equal(b.api.S.cash,30211);assert.equal(b.api.state.debt,30000);assert.equal(b.api.state.hasTakenEmergencyLoan,true);assert.equal(b.api.S.band,band);assert.equal(b.api.S.fans,2400);
  b.api.takeEmergencyLoan();assert.equal(b.api.S.cash,30211);
  const reload=boot({},b.storage);assert.equal(reload.api.state.debt,30000);assert.equal(reload.api.state.hasTakenEmergencyLoan,true);assert.doesNotMatch(reload.app.innerHTML,/YOU'RE BROKE/);
  reload.api.perform('show');assert.equal(reload.api.S.cash,28711);assert.equal(reload.api.state.days,2);
});
test('second failure ends career, summarizes peaks/earnings, resets everything except meta unlock',()=>{
  const b=boot({state:{hasTakenEmergencyLoan:true,debt:30000,peakFame:44,peakFans:9000,careerEarnings:3456,days:3},S:{songs:[{title:'Debut',released:true,pos:31,peak:18}]}});
  assert.equal(b.api.state.phase,'ended');assert.match(b.app.innerHTML,/THE DREAM/);assert.match(b.app.innerHTML,/#18/);assert.match(b.app.innerHTML,/3,456/);assert.match(b.app.innerHTML,/NEW ROLE UNLOCKED/);assert.doesNotMatch(b.app.innerHTML,/TAKE THE LOAN/);
  b.buttons.get('#newStory').onclick();assert.equal(b.api.state.phase,'create');assert.equal(b.api.state.debt,0);assert.equal(b.api.state.hasTakenEmergencyLoan,false);assert.equal(b.api.state.peakFans,0);assert.equal(b.api.state.careerEarnings,0);assert.equal(b.api.S.cash,50000);assert.equal(b.api.S.songs.length,0);assert.match(b.app.innerHTML,/data-role="wild"/);
  const reload=boot({},b.storage);assert.equal(reload.api.state.phase,'create');assert.ok(reload.api.meta.unlockedRoles.includes('wild'));
  reload.api.generateMembers();assert.equal(reload.api.state.hasTakenEmergencyLoan,false);assert.equal(reload.api.state.pendingWeek,false);
});
test('walk away ends first career and ending survives reload without awarding twice',()=>{
  const b=boot();b.buttons.get('#walkAway').onclick();assert.equal(b.api.state.phase,'ended');assert.equal(b.api.meta.completedCareers,1);
  const reload=boot({},b.storage);assert.equal(reload.api.state.phase,'ended');assert.equal(reload.api.meta.completedCareers,1);assert.match(reload.app.innerHTML,/YOUR POP DYNASTY/);
});
test('a mastered unreleased song is a valid free path even with zero cash',()=>{
  const b=boot({S:{cash:0,songs:[{title:'Free release',released:false}]}});assert.equal(b.api.hasValidProgressionPath(),true);assert.equal(b.api.state.financialCrisis,false);assert.doesNotMatch(b.app.innerHTML,/YOU'RE BROKE/);
});
test('free and income-producing opportunities count only when actually available',()=>{
  const b=boot({S:{cash:2000}});b.api.S.cash=0;b.api.activityData.free={cost:0,days:1};assert.equal(b.api.hasValidProgressionPath(),true);
  b.api.activityData.free.unlock=()=>false;assert.equal(b.api.hasValidProgressionPath(),false);
  b.api.progressionMechanics.push(()=>true);assert.equal(b.api.hasValidProgressionPath(),true);
});
test('pending week finishes before failure; royalties can rescue the career',()=>{
  const b=boot({state:{pendingWeek:true},S:{cash:1000,songs:[{title:'Hit',released:true,pos:1,peak:1,quality:90,catchy:90,weeks:1}]}});
  assert.equal(b.api.state.financialCrisis,false);b.api.newWeek();assert.equal(b.api.state.pendingWeek,false);assert.ok(b.api.S.cash>=1500);assert.ok(b.api.state.careerEarnings>0);
  assert.equal(b.api.state.phase,'game');assert.match(b.app.innerHTML,/recap-overlay/);
});
test('spending and event consequences immediately check for true financial dead ends',()=>{
  const b=boot({S:{cash:1600}});b.api.perform('show');assert.equal(b.api.S.cash,100);assert.equal(b.api.state.financialCrisis,true);
  b.api.takeEmergencyLoan();b.api.S.cash=1600;
  b.api.resolveEvent({choices:[['Duet','You paid for an arrangement.',{cash:-2500}]]},0,b.api.S.members[0]);assert.equal(b.api.state.phase,'ended');assert.match(b.app.innerHTML,/THE DREAM/);
});
test('a week with no income checks crisis after time advancement',()=>{
  const b=boot({state:{pendingWeek:true},S:{cash:211}});b.api.newWeek();assert.equal(b.api.S.week,2);assert.equal(b.api.state.financialCrisis,true);assert.match(b.app.innerHTML,/YOU'RE BROKE/);
});
module.exports={boot};
