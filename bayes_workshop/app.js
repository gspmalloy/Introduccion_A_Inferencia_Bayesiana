const slides=[...document.querySelectorAll('.slide')];
let index=0, lang='en', presenter=false;
const state={flips:[],responses:[],rainyDays:10,totalDays:31,posteriorVisible:false};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function showSlide(i){
  index=Math.max(0,Math.min(slides.length-1,i));
  slides.forEach((s,j)=>s.classList.toggle('active',j===index));
  $('#slideCounter').textContent=`${index+1} / ${slides.length}`;
  $('#progressBar').style.width=`${((index+1)/slides.length)*100}%`;
  $('#presenterTitle').textContent=slides[index].dataset.title||'';
  slides[index].querySelectorAll('.reveal').forEach(r=>r.classList.remove('shown'));
  if(slides[index].querySelector('#priorChart')) drawPrior();
  if(slides[index].querySelector('#updateChart')) drawUpdate();
}
function nextRevealOrSlide(){
  const hidden=[...slides[index].querySelectorAll('.reveal:not(.shown)')];
  if(hidden.length){hidden[0].classList.add('shown');return;} showSlide(index+1);
}
function prev(){showSlide(index-1)}
function togglePresenter(){presenter=!presenter;document.body.classList.toggle('presenter-mode',presenter);$('#presenterPanel').classList.toggle('open',presenter);$('#presenterPanel').setAttribute('aria-hidden',String(!presenter));}
function toggleLang(){lang=lang==='en'?'es':'en';$$('[data-en]').forEach(el=>{el.textContent=el.dataset[lang]});document.documentElement.lang=lang;}
function toggleFull(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();}

document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){nextRevealOrSlide();}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();}
  if(e.code==='Space'){e.preventDefault();nextRevealOrSlide();}
  if(e.key.toLowerCase()==='p')togglePresenter();
  if(e.key.toLowerCase()==='l')toggleLang();
  if(e.key.toLowerCase()==='f')toggleFull();
});
$('#prevBtn').onclick=prev;$('#nextBtn').onclick=nextRevealOrSlide;$('#langBtn').onclick=toggleLang;$('#fullscreenBtn').onclick=toggleFull;

// Coin experiment
function addFlip(v){if(state.flips.length>=15)return;state.flips.push(v);renderFlips()}
function renderFlips(){
  $('#coinResults').innerHTML=state.flips.map(v=>`<span class="flip-chip ${v==='H'?'head':'tail'}">${v}</span>`).join('');
  const h=state.flips.filter(x=>x==='H').length,t=state.flips.length-h;
  $('#headsCount').textContent=h;$('#tailsCount').textContent=t;$('#observedRate').textContent=state.flips.length?`${Math.round(h/state.flips.length*100)}%`:'—';
  if(state.flips.length===15)$('#coinPrompt').textContent=lang==='en'?'Fifteen flips complete. Now ask: did your belief about flip #16 change?':'Quince lanzamientos completos. Ahora pregunta: ¿cambió tu creencia sobre el lanzamiento #16?';
}
$('#headsBtn').onclick=()=>addFlip('H');$('#tailsBtn').onclick=()=>addFlip('T');$('#randomBtn').onclick=()=>addFlip(Math.random()<.5?'H':'T');$('#resetCoinBtn').onclick=()=>{state.flips=[];renderFlips()};

// Bayesian math on a grid. Each student response becomes a Beta distribution; the class prior is an equal-weight mixture.
const grid=Array.from({length:199},(_,i)=>(i+1)/200); // 0.005..0.995
const confStrength={1:2,2:5,3:10,4:20,5:40};
function logGamma(z){const p=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.6150291621406,12.507343278686905,-0.13857109526572012,9.984369578019571e-6,1.5056327351493116e-7];if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z-=1;let x=.9999999999998099;for(let i=0;i<p.length;i++)x+=p[i]/(z+i+1);const t=z+p.length-.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)}
function betaPdf(x,a,b){const log=(a-1)*Math.log(x)+(b-1)*Math.log(1-x)- (logGamma(a)+logGamma(b)-logGamma(a+b));return Math.exp(log)}
function normalize(arr){const s=arr.reduce((a,b)=>a+b,0)||1;return arr.map(v=>v/s)}
function classPrior(){
  if(!state.responses.length)return normalize(grid.map(()=>1));
  const dens=grid.map(x=>state.responses.reduce((sum,r)=>{const n=confStrength[r.c];const a=1+r.p*n,b=1+(1-r.p)*n;return sum+betaPdf(x,a,b)},0)/state.responses.length);
  return normalize(dens);
}
function posterior(){const prior=classPrior();const r=state.rainyDays,n=state.totalDays;return normalize(prior.map((v,i)=>v*Math.pow(grid[i],r)*Math.pow(1-grid[i],Math.max(0,n-r))));}
function stats(d){let mean=0;d.forEach((v,i)=>mean+=v*grid[i]);let cum=0,lo=grid[0],hi=grid.at(-1);for(let i=0;i<d.length;i++){cum+=d[i];if(cum>=.05&&lo===grid[0])lo=grid[i];if(cum>=.95){hi=grid[i];break}}return{mean,lo,hi}}
function drawDist(canvas,series){
  if(!canvas)return;const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height,pad={l:60,r:30,t:28,b:48};ctx.clearRect(0,0,W,H);ctx.fillStyle='rgba(2,6,23,.3)';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#243044';ctx.lineWidth=1;for(let k=0;k<=4;k++){const y=pad.t+(H-pad.t-pad.b)*k/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke()}
  const max=Math.max(...series.flatMap(s=>s.d));
  const colors=['#67e8f9','#a78bfa'];
  series.forEach((s,si)=>{ctx.beginPath();s.d.forEach((v,i)=>{const x=pad.l+(W-pad.l-pad.r)*i/(grid.length-1);const y=H-pad.b-(H-pad.t-pad.b)*(v/max);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=colors[si%colors.length];ctx.lineWidth=5;ctx.stroke();ctx.fillStyle=colors[si%colors.length];ctx.font='22px system-ui';ctx.fillText(s.label,pad.l+10,pad.t+24+si*28)});
  ctx.fillStyle='#94a3b8';ctx.font='18px system-ui';ctx.textAlign='center';[0,25,50,75,100].forEach(v=>{const x=pad.l+(W-pad.l-pad.r)*v/100;ctx.fillText(`${v}%`,x,H-14)});ctx.textAlign='left';
}
function drawPrior(){const d=classPrior();drawDist($('#priorChart'),[{label:lang==='en'?'Class prior':'Prior de la clase',d}]);const s=stats(d);$('#responseCount').textContent=state.responses.length;$('#priorMean').textContent=state.responses.length?`${Math.round(s.mean*100)}%`:'—';$('#priorSpread').textContent=state.responses.length?`${Math.round(s.lo*100)}–${Math.round(s.hi*100)}%`:'—';}
function drawUpdate(){const p=classPrior(),post=posterior();drawDist($('#updateChart'),state.posteriorVisible?[{label:lang==='en'?'Prior':'Prior',d:p},{label:lang==='en'?'Posterior':'Posterior',d:post}]:[{label:lang==='en'?'Prior':'Prior',d:p}]);const s=stats(post);$('#posteriorMean').textContent=state.posteriorVisible?`${Math.round(s.mean*100)}%`:'—';$('#posteriorRange').textContent=state.posteriorVisible?`${Math.round(s.lo*100)}–${Math.round(s.hi*100)}%`:'—';}
function renderResponses(){
  $('#responseDots').innerHTML=state.responses.map((r,i)=>`<span class="response-dot" title="confidence ${r.c}">${Math.round(r.p*100)}% · C${r.c}</span>`).join('');drawPrior();drawUpdate();
}
$('#addResponseBtn').onclick=()=>{const p=Math.max(1,Math.min(99,Number($('#probInput').value)))/100,c=Number($('#confInput').value);state.responses.push({p,c});state.posteriorVisible=false;renderResponses();};
$('#clearResponsesBtn').onclick=()=>{state.responses=[];state.posteriorVisible=false;renderResponses();};
$('#setEvidenceBtn').onclick=()=>{const n=Math.max(1,Number($('#totalDaysInput').value)),r=Math.max(0,Math.min(n,Number($('#rainyDaysInput').value)));state.totalDays=n;state.rainyDays=r;$('#rainyDaysDisplay').textContent=r;$('#totalDaysDisplay').textContent=n;state.posteriorVisible=false;drawUpdate();};
$('#updateBayesBtn').onclick=()=>{state.posteriorVisible=true;drawUpdate();};$('#resetPosteriorBtn').onclick=()=>{state.posteriorVisible=false;drawUpdate();};

// Keep charts crisp and synced when language changes or window resizes.
window.addEventListener('resize',()=>{drawPrior();drawUpdate()});
const oldToggleLang=toggleLang;toggleLang=function(){lang=lang==='en'?'es':'en';$$('[data-en]').forEach(el=>{el.textContent=el.dataset[lang]});document.documentElement.lang=lang;drawPrior();drawUpdate();};
$('#langBtn').onclick=toggleLang;
showSlide(0);renderFlips();renderResponses();
