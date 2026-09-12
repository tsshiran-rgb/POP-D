(function(root){
  function toastDuration(text,level='normal'){return Math.min(6000,3500+Math.max(0,String(text).length-45)*35+(level==='important'?700:0))}
  function createToastQueue({show,setTimer=setTimeout,clearTimer=clearTimeout,now=Date.now}){
    const queue=[];let active=null,timer=null,blocked=false,exiting=false;
    function startTimer(){active.started=now();timer=setTimer(dismiss,active.remaining)}
    function pump(){if(blocked||active||!queue.length)return;active=queue.shift();active.remaining=toastDuration(active.text,active.level);active.view=show(active.text,active.level,dismiss);startTimer()}
    function dismiss(){if(!active||exiting)return;clearTimer(timer);exiting=true;active.view.exit();timer=setTimer(()=>{active.view.remove();active=null;exiting=false;pump()},180)}
    return {push(text,level='normal'){queue.push({text,level});pump()},setBlocked(value){if(blocked===value)return;blocked=value;if(active&&!exiting){clearTimer(timer);active.view.setHidden(value);if(value)active.remaining=Math.max(0,active.remaining-(now()-active.started));else startTimer()}pump()},clear(){clearTimer(timer);active?.view.remove();active=null;exiting=false;queue.length=0},dismiss};
  }
  root.PopFeedback={toastDuration,createToastQueue};if(typeof module==='object')module.exports=root.PopFeedback;
})(typeof globalThis!=='undefined'?globalThis:this);
