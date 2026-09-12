const test=require('node:test');const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');const feedbackContext={setTimeout,clearTimeout};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../feedback.js'),'utf8'),feedbackContext);const {toastDuration,createToastQueue}=feedbackContext.PopFeedback;const {boot}=require('./financial-crisis.test.cjs');
test('toast reading durations have correct bounds and importance weighting',()=>{
  assert.equal(toastDuration('Short'),3500);assert.ok(toastDuration('x'.repeat(80))>3500);assert.equal(toastDuration('x'.repeat(500)),6000);assert.ok(toastDuration('Interview','important')>toastDuration('Interview'));
});
test('toasts queue sequentially, dismiss on tap, and suspend behind full-screen results',()=>{
  const timers=new Map();let id=0;const shown=[];const removed=[];const q=createToastQueue({setTimer(fn,ms){const key=++id;timers.set(key,{fn:()=>{timers.delete(key);fn()},ms});return key},clearTimer(id){timers.delete(id)},show(text,level,tap){shown.push({text,level,tap});return {exit(){},remove(){removed.push(text)},setHidden(){}}}});
  q.push('First');q.push('Second','important');assert.equal(shown.length,1);assert.equal([...timers.values()][0].ms,3500);
  shown[0].tap();assert.equal([...timers.values()][0].ms,180);[...timers.values()][0].fn();assert.deepEqual(removed,['First']);assert.equal(shown[1].text,'Second');
  q.setBlocked(true);q.push('Third');assert.equal(shown.length,2);q.setBlocked(false);q.dismiss();[...timers.values()].at(-1).fn();assert.equal(shown[2].text,'Third');q.clear();assert.deepEqual(removed,['First','Second','Third']);
});
test('weekly earnings equal actual balance increase and first #1 appears only once',()=>{
  const b=boot({S:{cash:10000,songs:[{title:'Hit',released:true,pos:3,peak:3,quality:90,catchy:90,weeks:1},{title:'Other',released:true,pos:30,peak:30,quality:80,catchy:80,weeks:1}]}});
  const before=b.api.S.cash;b.api.newWeek();assert.equal(b.api.state.lastRecap.earned,b.api.S.cash-before);assert.match(b.app.innerHTML,/\+\$/);assert.match(b.app.innerHTML,/YOUR FIRST #1 SINGLE/);
  b.api.state.pendingMilestones=[];b.api.newWeek();assert.ok(!b.api.state.lastRecap.milestones.some(m=>m.includes('#1')));
});
test('100K fans, pop star and first MTV appearance use persistent full-screen milestones',()=>{
  const b=boot({S:{cash:10000,fans:99000}});b.api.perform('tv');assert.match(b.app.innerHTML,/YOUR FIRST MTV APPEARANCE/);assert.match(b.app.innerHTML,/100,000 FANS/);assert.match(b.app.innerHTML,/YOU ARE A POP STAR/);assert.match(b.app.innerHTML,/milestoneContinue/);
  const reload=boot({},b.storage);assert.match(reload.app.innerHTML,/milestoneContinue/);reload.buttons.get('#milestoneContinue').onclick();reload.api.perform('tv');assert.equal(reload.api.state.pendingMilestones.length,0);
});
