/* =====================================================================
   SchoolBus – Rotas Escolares · script principal
   ---------------------------------------------------------------------
   Funciona com três bancos de dados, escolhidos automaticamente:
     1. Claude (quando a página roda como artifact no claude.ai)
     2. Firebase (quando js/config.js tem a configuração do Firebase)
     3. Local (localStorage), quando nenhum dos dois está disponível
   Seções: ícones · utilidades · estado · domínio · banco · mapa ·
   navegação · páginas · formulários · ações · login · inicialização
   ===================================================================== */
"use strict";
(function(){const a=document.getElementById('aviso-arquivos');if(a)a.remove()})();
const CONF=window.SCHOOLBUS_CONFIG||{};
const COLECOES=['escolas','motoristas','onibus','rotas','alunos','consulta','avisos','status','presencas','config'];
/* ================= ícones ================= */
const ICONS={
painel:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
mapa:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
rota:'<circle cx="6" cy="19" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/><circle cx="18" cy="5" r="2.5"/>',
alunos:'<path d="M22 9.5 12 5 2 9.5l10 4.5 10-4.5z"/><path d="M6 11.5V16c3 2.2 9 2.2 12 0v-4.5M22 9.5V15"/>',
motorista:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><circle cx="8" cy="11.5" r="2.3"/><path d="M4.8 16.5c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14 10h4.5M14 14h3.5"/>',
onibus:'<rect x="4" y="3" width="16" height="15" rx="2.5"/><path d="M4 11h16M4 7h16M8 18v2.5M16 18v2.5"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/>',
escola:'<path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5M12 5V2h3"/>',
operacao:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12.5l2 2 4-4"/>',
responsaveis:'<path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M12 17.2s-3-1.8-3-3.7a1.5 1.5 0 0 1 3-.7 1.5 1.5 0 0 1 3 .7c0 1.9-3 3.7-3 3.7z"/>',
avisos:'<path d="M6 8.5a6 6 0 0 1 12 0c0 6.5 3 8.5 3 8.5H3s3-2 3-8.5"/><path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0"/>',
acesso:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
edit:'<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
pin:'<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
up:'<path d="m6 15 6-6 6 6"/>', down:'<path d="m6 9 6 6 6-6"/>',
eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
check:'<path d="m5 12 5 5 9-10"/>',
alert:'<path d="M12 3.5 2.5 20h19L12 3.5z"/><path d="M12 10v4M12 17h.01"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
locate:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/>',
move:'<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
db:'<ellipse cx="12" cy="5.5" rx="8" ry="2.5"/><path d="M4 5.5v13c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-13M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/>'
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ================= utilidades ================= */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const hm=s=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(s||'').trim());return m&&+m[1]<24&&+m[2]<60?(+m[1])*60+(+m[2]):null};
const fmt=m=>{if(m==null||!isFinite(m))return '--:--';const d=((Math.round(m)%1440)+1440)%1440;return pad(Math.floor(d/60))+':'+pad(d%60)};
const fkm=v=>(v<1?Math.round(v*1000)+' m':v.toFixed(1).replace('.',',')+' km');
const fmin=m=>{m=Math.round(m);return m<60?m+' min':Math.floor(m/60)+' h '+pad(m%60)+' min'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const today=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const realMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()+d.getSeconds()/60};
const DIAS=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const dataLonga=()=>{const d=new Date();return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`};
function quando(ms){if(!ms)return '';const d=new Date(ms),n=new Date();const hh=pad(d.getHours())+':'+pad(d.getMinutes());
  if(d.toDateString()===n.toDateString()){const dm=Math.round((n-d)/60000);return dm<1?'agora':dm<60?`há ${dm} min`:`hoje, ${hh}`}
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}, ${hh}`}
function hav(a,b){const R=6371,t=Math.PI/180,dl=(b.lat-a.lat)*t,dg=(b.lng-a.lng)*t;const x=Math.sin(dl/2)**2+Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
const okc=p=>p&&isFinite(p.lat)&&isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180;
function parseCoords(s){const m=String(s||'').replace(/[()]/g,'').match(/(-?\d+(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d+(?:[.,]\d+)?)/);if(!m)return null;const lat=+m[1].replace(',','.'),lng=+m[2].replace(',','.');return okc({lat,lng})?{lat,lng}:null}
const fcoord=p=>okc(p)?`${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`:'';
const gmPoint=p=>`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
function gmRoute(pts){if(pts.length<2)return '#';const o=pts[0],d=pts[pts.length-1],w=pts.slice(1,-1).slice(0,9).map(p=>p.lat+','+p.lng).join('|');
  return `https://www.google.com/maps/dir/?api=1&origin=${o.lat},${o.lng}&destination=${d.lat},${d.lng}${w?'&waypoints='+encodeURIComponent(w):''}&travelmode=driving`}
function fone(v){const d=String(v||'').replace(/\D/g,'').slice(0,11);if(!d)return '';if(d.length<=2)return '('+d;if(d.length<=6)return `(${d.slice(0,2)}) ${d.slice(2)}`;if(d.length<=10)return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`}
function maskFone(v){const d=String(v||'').replace(/\D/g,'');if(d.length<8)return fone(v);return `(${d.slice(0,2)}) ${d[2]}••••-${d.slice(-4)}`}
const maskCnh=v=>{const d=String(v||'');return d.length>4?'•••••••'+d.slice(-4):d};
function fplaca(p){p=String(p||'').toUpperCase();return /^[A-Z]{3}\d{4}$/.test(p)?p.slice(0,3)+'-'+p.slice(3):p}
function txtOn(hex){const c=String(hex||'#777').replace('#','');const n=parseInt(c.length===3?c.split('').map(x=>x+x).join(''):c,16);const r=n>>16&255,g=n>>8&255,b=n&255;return (0.299*r+0.587*g+0.114*b)/255>0.6?'#1A1400':'#FFFFFF'}
const initials=n=>String(n||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?';
const apelido=n=>{const p=String(n||'').trim().split(/\s+/);return p.length>1?`${p[0]} ${p[p.length-1][0]}.`:(p[0]||'')};
function codigo(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';const a=new Uint32Array(6);crypto.getRandomValues(a);for(const x of a)s+=A[x%A.length];return s}
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
class VErr extends Error{constructor(m,f){super(m);this.field=f}}

/* ================= estado ================= */
const PALETTE=['#1F5FD9','#D9452B','#13915F','#7B4BD6','#E09A00','#0E95AE','#C2378A','#5F7413'];
const DEFCFG={velocidade:24,fator:1.3,parada:1.5,garagem:{nome:'Garagem SchoolBus',lat:-5.1012,lng:-42.8092}};
const ROLE_LBL={admin:'Administrador',operador:'Motorista / Operador',responsavel:'Responsável'};
const S={backend:null,auth:null,usuarios:[],mode:'loading',role:'responsavel',realRole:'responsavel',uid:null,me:null,
  onibus:[],motoristas:[],alunos:[],rotas:[],escolas:[],avisos:[],status:{},presencas:{},config:{...DEFCFG},
  loaded:{},slow:false,errs:[],page:null,sim:null,simOpen:false,hidden:new Set(),selRota:null,selStop:null,edit:null,
  f:{q:'',escola:'',rota:'',grupo:'lista',sit:''},reveal:new Set(),op:{rotaId:null,viagem:null},opMsg:'',
  codigos:ls.get('sb_codigos',[]),consulta:{},lidoAte:ls.get('sb_lido',0),avRota:'',avMine:true,navOpen:false,_t:0,_est:{},_pl:{}};
let db=null,userCap=null,fbAuth=null;const BOOT=Date.now();
const isStaff=()=>S.role==='admin'||S.role==='operador';
const isAdmin=()=>S.role==='admin';

/* ================= domínio ================= */
const byId=(a,id)=>id?a.find(x=>x.id===id):undefined;
const rotaById=id=>byId(S.rotas,id),busById=id=>byId(S.onibus,id),motById=id=>byId(S.motoristas,id),escById=id=>byId(S.escolas,id);
const busOf=r=>r&&busById(r.onibusId);
const motOfBus=b=>b&&motById(b.motoristaId);
const corRota=r=>busOf(r)?.cor||'#7C8BA6';
const busStyle=b=>`--c:${b?.cor||'#7C8BA6'};--tc:${txtOn(b?.cor||'#7C8BA6')}`;
const atrasoDe=b=>{const st=b&&S.status[b.id];return st&&st.data===today()?(+st.atrasoMin||0):0};
const cfg=()=>({...DEFCFG,...S.config});

function plano(r,viagem='ida'){
  const key=(r.id||'draft')+':'+viagem+':'+(r._v||'');
  if(r.id&&!r._draft&&S._pl[key])return S._pl[key];
  const c=cfg(),vel=Math.max(5,+c.velocidade||24),fat=Math.max(1,+c.fator||1.3),dw=Math.max(0,+c.parada||0);
  let pts=[{...(r.origem||{}),tipo:'origem',id:'_o'},...(r.paradas||[]).map((p,i)=>({...p,tipo:'parada',n:i+1})),{...(r.destino||{}),tipo:'destino',id:'_d'}].filter(okc);
  if(viagem==='volta')pts=pts.slice().reverse();
  const arr=[0],dep=[0],cum=[0];let t=0,dist=0;
  for(let i=1;i<pts.length;i++){const d=hav(pts[i-1],pts[i])*fat;dist+=d;t+=d/vel*60;arr[i]=t;cum[i]=dist;dep[i]=t+(pts[i].tipo==='parada'?dw:0);t=dep[i]}
  const res={pts,arr,dep,cum,km:dist,min:pts.length>1?arr[pts.length-1]:0};
  if(r.id&&!r._draft)S._pl[key]=res;return res;
}
function trips(r){const out=[];const s1=hm(r.saida);if(s1!=null)out.push({viagem:'ida',start:s1,alvo:hm(r.chegada),pl:plano(r,'ida')});
  const s2=hm(r.retornoSaida);if(s2!=null)out.push({viagem:'volta',start:s2,alvo:hm(r.retornoChegada),pl:plano(r,'volta')});return out.filter(x=>x.pl.pts.length>=2)}
function posAt(pl,off){const{pts,arr,dep}=pl;
  for(let i=0;i<pts.length;i++){
    if(off<arr[i]){const a=pts[i-1],b=pts[i],f=clamp((off-dep[i-1])/((arr[i]-dep[i-1])||1),0,1);return{lat:a.lat+(b.lat-a.lat)*f,lng:a.lng+(b.lng-a.lng)*f,next:i,at:null}}
    if(off<=dep[i])return{lat:pts[i].lat,lng:pts[i].lng,next:i+1<pts.length?i+1:null,at:i};
  }const p=pts[pts.length-1];return{lat:p.lat,lng:p.lng,next:null,at:pts.length-1}}
function estado(r,t){
  if(r.ativa===false)return{k:'off',txt:'Rota inativa'};
  const b=busOf(r);if(!b)return{k:'off',txt:'Sem ônibus'};
  if(b.situacao==='manutencao')return{k:'manut',txt:'Ônibus em manutenção'};
  if(b.situacao==='inativo')return{k:'off',txt:'Ônibus inativo'};
  const a=atrasoDe(b),tr=trips(r);if(!tr.length)return{k:'off',txt:'Sem horário definido'};
  for(let i=0;i<tr.length;i++){const T=tr[i],s=T.start+a,e=s+T.pl.min;
    if(t<s)return i===0?{k:'aguard',txt:`Saída às ${fmt(s)}`,T,s,e,a,pos:T.pl.pts[0],em:s-t}:{k:'escola',txt:`Retorno às ${fmt(s)}`,T,s,e,a,pos:T.pl.pts[0],em:s-t};
    if(t<=e){const off=t-s,P=posAt(T.pl,off);return{k:'rota',txt:T.viagem==='ida'?'Em rota · ida':'Em rota · retorno',T,s,e,a,pos:P,off,prog:T.pl.min?off/T.pl.min:1,next:P.next,at:P.at,nextAt:P.next!=null?s+T.pl.arr[P.next]:null}}}
  const L=tr[tr.length-1];return{k:'fim',txt:'Viagens do dia concluídas',T:L,pos:L.pl.pts[L.pl.pts.length-1]};
}
const est=r=>S._est[r.id]||(S._est[r.id]=estado(r,S._t));
function busState(b){
  if(b.situacao==='manutencao')return{k:'manut',txt:'Em manutenção'};
  if(b.situacao==='inativo')return{k:'off',txt:'Inativo'};
  const rs=S.rotas.filter(r=>r.onibusId===b.id&&r.ativa!==false);
  if(!rs.length)return{k:'off',txt:b.situacao==='reserva'?'Reserva':'Sem rota atribuída'};
  const es=rs.map(r=>({r,e:est(r)}));const em=es.find(x=>x.e.k==='rota');if(em)return{...em.e,r:em.r};
  const up=es.filter(x=>x.e.k==='aguard'||x.e.k==='escola').sort((a,b)=>a.e.s-b.e.s)[0];
  if(up)return{...up.e,r:up.r,k:up.e.k==='escola'?'escola':'garagem',txt:up.e.k==='escola'?`Na escola · retorno ${fmt(up.e.s)}`:`Na garagem · saída ${fmt(up.e.s)}`};
  return{k:'fim',txt:'Viagens do dia concluídas',r:es[0].r};
}
const PK={rota:'p-blue',aguard:'p-mute',garagem:'p-mute',escola:'p-yellow',fim:'p-ok',manut:'p-bad',off:'p-mute'};
const pill=(e,txt)=>`<span class="pill ${PK[e.k]||'p-mute'}">${h(txt||e.txt)}</span>`;
const SIT_ON={operacao:['Em operação','p-ok'],manutencao:['Manutenção','p-bad'],reserva:['Reserva','p-yellow'],inativo:['Inativo','p-mute']};
const SIT_MOT={disponivel:['Disponível','p-ok'],afastado:['Afastado','p-bad'],ferias:['Férias','p-yellow']};
const plate=p=>p?`<span class="plate" aria-label="Placa ${h(fplaca(p))}"><span class="plate-top">BRASIL</span><span class="plate-num">${h(fplaca(p))}</span></span>`:'—';
const exTag=x=>x&&x.exemplo?' <span class="tag-ex">Exemplo</span>':'';
const alunosDaRota=id=>S.alunos.filter(a=>a.rotaId===id);
const pontoNome=(r,pid)=>{const p=(r?.paradas||[]).find(x=>x.id===pid);return p?p.nome:null};

function otimizar(o,stops,d){
  if(stops.length<2)return stops.slice();
  let rem=stops.slice(),ord=[],cur=o;
  while(rem.length){let bi=0,bd=Infinity;rem.forEach((p,i)=>{const x=hav(cur,p);if(x<bd){bd=x;bi=i}});cur=rem.splice(bi,1)[0];ord.push(cur)}
  const P=[o,...ord,d];let imp=true,guard=0;
  while(imp&&guard++<200){imp=false;for(let i=1;i<P.length-2;i++)for(let k=i+1;k<P.length-1;k++){
    const dl=hav(P[i-1],P[k])+hav(P[i],P[k+1])-hav(P[i-1],P[i])-hav(P[k],P[k+1]);
    if(dl<-1e-7){const seg=P.slice(i,k+1).reverse();P.splice(i,seg.length,...seg);imp=true}}}
  return P.slice(1,-1);
}

/* ================= banco de dados ================= */
const queues={};
function serial(path,fn){const p=(queues[path]||Promise.resolve()).then(fn,fn);queues[path]=p.catch(()=>{});return p}
function errMsg(e){const c=e&&e.code;
  if(c==='permission-denied'||c==='unauthenticated')return 'Seu nível de acesso não permite esta alteração. Entre com uma conta da equipe.';
  if(c==='invalid_argument')return 'Seu nível de acesso não permite esta alteração, ou os dados estão em formato inválido.';
  if(c==='quota_exceeded')return 'O banco de dados atingiu o limite de registros. Remova registros antigos e tente de novo.';
  if(c==='resource_exhausted')return 'Muitas alterações seguidas. Aguarde alguns segundos e tente de novo.';
  if(c==='not_granted'||c==='revoked')return 'O acesso ao banco de dados não está disponível nesta visualização.';
  return 'Não foi possível salvar agora. Verifique a conexão e tente de novo.'}
function needDb(){if(!db)throw new VErr('Sem banco de dados conectado. Verifique a configuração e recarregue a página.')}
async function dset(path,data){needDb();try{await serial(path,()=>db.doc(path).set(data))}catch(e){if(e instanceof VErr)throw e;throw new VErr(errMsg(e))}}
async function dupd(path,data){needDb();try{await serial(path,()=>db.doc(path).update(data))}catch(e){throw new VErr(errMsg(e))}}
async function ddel(path){needDb();try{await serial(path,()=>db.doc(path).delete())}catch(e){throw new VErr(errMsg(e))}}
const newId=col=>db?db.collection(col).doc().id:'x'+Math.random().toString(36).slice(2,12);
const strip=o=>{const c={...o};delete c.id;return c};

function sub(col,key,{order,limit,where,map,after}={}){
  let q=db.collection(col);if(where)q=q.where(...where);if(order)q=q.orderBy(...order);if(limit)q=q.limit(limit);
  let first=true;const timer=setTimeout(()=>{if(!S.loaded[key]){S.slow=true;schedule()}},10000);
  q.onSnapshot(snap=>{const rows=snap.docs.map(d=>({id:d.id,...d.data()}));S[key]=map?map(rows):rows;
    if(!snap.metadata.fromCache){S.loaded[key]=true;clearTimeout(timer);S.slow=false}
    after&&after(snap,first);first=false;S._pl={};schedule()},
  err=>{clearTimeout(timer);S.loaded[key]='err';S.errs.push(col);schedule()});
}
const byName=f=>rows=>rows.sort((a,b)=>String(a[f]||'').localeCompare(String(b[f]||''),'pt-BR',{numeric:true}));

function startSubs(){
  sub('onibus','onibus',{map:byName('numero')});
  sub('rotas','rotas',{map:byName('nome')});
  sub('escolas','escolas',{map:byName('nome')});
  sub('status','status',{map:rows=>Object.fromEntries(rows.map(r=>[r.id,r]))});
  sub('avisos','avisos',{order:['criadoEm','desc'],limit:80,after:(snap,first)=>{if(first)return;
    snap.docChanges().forEach(ch=>{if(ch.type!=='added')return;const a=ch.doc.data();if((a.criadoEm||0)>BOOT&&avisoRelevante(a)){
      const r=rotaById(a.rotaId);toast(`${tipoLbl(a)} · ${r?r.nome:'Todas as rotas'}: ${a.mensagem||''}`,a.tipo==='atraso'?'bad':'ok','avisos')}})}});
  db.doc('config/geral').onSnapshot(s=>{S.config=s.exists?{...DEFCFG,...s.data()}:{...DEFCFG};S.loaded.config=true;S._pl={};schedule()},()=>{S.loaded.config='err'});
  if(isStaffReal()){
    sub('motoristas','motoristas',{map:byName('nome')});
    sub('alunos','alunos',{map:byName('nome')});
    sub('presencas','presencas',{where:['data','==',today()],map:rows=>Object.fromEntries(rows.map(r=>[r.id,r]))});
  }
}
const isStaffReal=()=>S.realRole==='admin'||S.realRole==='operador';

/* ================= mapa ================= */
let PCOS=Math.cos(-5.09*Math.PI/180);
const KX=()=>111.32*PCOS,KY=110.574;
const PX=p=>p.lng*KX(),PY=p=>-p.lat*KY;
class MapView{
  constructor(){
    const el=this.el=document.createElement('div');el.className='map';
    el.innerHTML=`<svg class="map-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa das rotas"></svg>
<div class="map-ctrl"><button type="button" data-z="in" aria-label="Aproximar">${ic('plus')}</button><button type="button" data-z="out" aria-label="Afastar">${ic('minus')}</button><button type="button" data-z="fit" aria-label="Enquadrar rotas">${ic('locate')}</button></div>
<div class="map-scale" aria-hidden="true"><i></i><span></span></div><div class="map-hint" hidden></div>
<div class="map-attr">Coordenadas reais · trajeto em linha reta entre paradas</div>`;
    this.svg=el.querySelector('svg');this.cx=null;this.cy=null;this.k=0.02;this.d={routes:[],buses:[]};this.ptrs=new Map();this.moved=0;
    el.querySelector('.map-ctrl').addEventListener('click',e=>{const b=e.target.closest('[data-z]');if(!b)return;if(b.dataset.z==='fit')this.fit();else this.zoomAt(b.dataset.z==='in'?1/1.6:1.6)});
    this.svg.addEventListener('wheel',e=>{e.preventDefault();const r=this.svg.getBoundingClientRect();this.zoomAt(e.deltaY>0?1.18:1/1.18,e.clientX-r.left,e.clientY-r.top)},{passive:false});
    this.svg.addEventListener('pointerdown',e=>{this.svg.setPointerCapture(e.pointerId);this.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.ptrs.size===1){this.moved=0;this.down=e.target}if(this.ptrs.size===2){this.pd=this.pdist();this.moved=99}});
    this.svg.addEventListener('pointermove',e=>{const p=this.ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
      if(this.ptrs.size===1){this.moved+=Math.abs(dx)+Math.abs(dy);if(this.moved>4){this.cx-=dx*this.k;this.cy-=dy*this.k;this.draw()}}
      else if(this.ptrs.size===2){const nd=this.pdist(),r=this.svg.getBoundingClientRect(),ps=[...this.ptrs.values()];if(this.pd&&nd)this.zoomAt(this.pd/nd,(ps[0].x+ps[1].x)/2-r.left,(ps[0].y+ps[1].y)/2-r.top);this.pd=nd}});
    const up=e=>{if(!this.ptrs.has(e.pointerId))return;this.ptrs.delete(e.pointerId);if(this.ptrs.size)return;
      if(e.type==='pointerup'&&this.moved<=4){const hit=this.down&&this.down.closest&&this.down.closest('[data-hit]');
        if(hit&&this.onHit)this.onHit(hit.getAttribute('data-hit'));
        else if(this.onMapClick){const r=this.svg.getBoundingClientRect(),[w,hh]=this.size();const wx=this.cx+(e.clientX-r.left-w/2)*this.k,wy=this.cy+(e.clientY-r.top-hh/2)*this.k;this.onMapClick(-wy/KY,wx/KX())}}};
    this.svg.addEventListener('pointerup',up);this.svg.addEventListener('pointercancel',up);
    if(window.ResizeObserver)new ResizeObserver(()=>this.draw()).observe(el);
  }
  pdist(){const p=[...this.ptrs.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)}
  size(){return[this.el.clientWidth||640,this.el.clientHeight||400]}
  zoomAt(f,mx,my){const[w,hh]=this.size();if(mx==null){mx=w/2;my=hh/2}const wx=this.cx+(mx-w/2)*this.k,wy=this.cy+(my-hh/2)*this.k;this.k=clamp(this.k*f,0.0012,0.6);this.cx=wx-(mx-w/2)*this.k;this.cy=wy-(my-hh/2)*this.k;this.draw()}
  allPts(){const out=[];(this.d.focusPts||[]).forEach(p=>out.push(p));if(!out.length){this.d.routes.forEach(r=>r.pts.forEach(p=>out.push(p)));this.d.buses.forEach(b=>out.push(b))}return out.filter(okc)}
  fit(){const[w,hh]=this.size();const P=this.allPts();
    if(!P.length){const g=cfg().garagem;this.cx=PX(g);this.cy=PY(g);this.k=0.025;this.draw();return}
    let x1=Infinity,x2=-Infinity,y1=Infinity,y2=-Infinity;P.forEach(p=>{const x=PX(p),y=PY(p);x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y)});
    this.cx=(x1+x2)/2;this.cy=(y1+y2)/2;this.k=clamp(Math.max((x2-x1)/Math.max(w-110,80),(y2-y1)/Math.max(hh-110,80),0.004),0.0012,0.6);this.draw()}
  set(d){this.d={routes:[],buses:[],...d};this.el.classList.toggle('edit',!!d.edit);const hn=this.el.querySelector('.map-hint');hn.hidden=!d.hint;hn.textContent=d.hint||'';
    if(this.cx==null||d.refit){this.needFit=true}this.draw()}
  draw(){
    const[w,hh]=this.size();if(!this.el.isConnected||!this.el.clientWidth)return;
    if(this.needFit||this.cx==null){this.needFit=false;this.fit();return}
    const k=this.k,vw=w*k,vh=hh*k,x0=this.cx-vw/2,y0=this.cy-vh/2;
    this.svg.setAttribute('viewBox',`${x0} ${y0} ${vw} ${vh}`);
    let s='';const T=(x,y,inner,extra='')=>`<g transform="translate(${x} ${y}) scale(${k})" ${extra}>${inner}</g>`;
    const steps=[0.002,0.005,0.01,0.02,0.05,0.1,0.2,0.5,1,2,5];const st=steps.find(v=>v*KY/k>=95)||5;const dec=st<0.01?3:st<0.1?2:1;
    const la1=-(y0+vh)/KY,la2=-y0/KY,lo1=x0/KX(),lo2=(x0+vw)/KX();
    for(let i=Math.ceil(la1/st);i<=Math.floor(la2/st);i++){const la=i*st,y=-la*KY;s+=`<line class="g" x1="${x0}" x2="${x0+vw}" y1="${y}" y2="${y}"/>`;s+=T(x0,y,`<text class="gt" x="8" y="-5">${Math.abs(la).toFixed(dec).replace('.',',')}° ${la<0?'S':'N'}</text>`)}
    for(let i=Math.ceil(lo1/st);i<=Math.floor(lo2/st);i++){const lo=i*st,x=lo*KX();s+=`<line class="g" y1="${y0}" y2="${y0+vh}" x1="${x}" x2="${x}"/>`;s+=T(x,y0,`<text class="gt" x="5" y="${hh-12}">${Math.abs(lo).toFixed(dec).replace('.',',')}° ${lo<0?'O':'L'}</text>`)}
    const R=this.d.routes,hl=this.d.highlight;
    const ord=R.slice().sort((a,b)=>(a.id===hl)-(b.id===hl));
    ord.forEach(r=>{if(r.pts.length<2)return;const dim=hl&&r.id!==hl,wd=r.id===hl?6:4.5;
      const d=r.pts.map((p,i)=>(i?'L':'M')+PX(p).toFixed(4)+' '+PY(p).toFixed(4)).join('');
      s+=`<path class="rcase" d="${d}" style="stroke-width:${wd+4}px;opacity:${dim?.5:1}"/><path class="rline" d="${d}" style="stroke:${r.color};stroke-width:${wd}px;opacity:${dim?.3:1}"/>`;
      if(!dim&&(r.id===hl||R.length===1)){for(let i=1;i<r.pts.length;i++){const a=r.pts[i-1],b=r.pts[i],ax=PX(a),ay=PY(a),bx=PX(b),by=PY(b);if(Math.hypot(bx-ax,by-ay)/k<60)continue;
        s+=`<g transform="translate(${(ax+bx)/2} ${(ay+by)/2}) scale(${k}) rotate(${Math.atan2(by-ay,bx-ax)*180/Math.PI})" pointer-events="none"><path class="arw" d="M-3.5 -4 L1.5 0 L-3.5 4"/></g>`}}});
    ord.forEach(r=>{const dim=hl&&r.id!==hl,lab=!dim&&(r.id===hl||R.length===1)&&r.labels!==false;
      r.pts.forEach(p=>{const x=PX(p),y=PY(p);let g;const op=dim?' opacity="0.45"':'';
        if(p.tipo==='origem')g=`<rect x="-8" y="-8" width="16" height="16" rx="3.5" class="orig"/><text class="origt" y="3.3">G</text>`+(lab?`<text class="mlabel" x="13" y="4">${h(p.nome||'Partida')}</text>`:'');
        else if(p.tipo==='destino')g=`<rect x="-10" y="-10" width="20" height="20" rx="5" class="dest"/><path class="desti" d="M-5.5 4.5V-1L0-5l5.5 4V4.5ZM-1.6 4.5V1.2h3.2v3.3"/>`+(lab?`<text class="mlabel" x="15" y="4">${h(p.nome||'Escola')}</text>`:'');
        else{const f=this.d.focus&&this.d.focus===p.id&&r.id===hl;const showN=!dim&&(k<0.014||r.id===hl);
          g=f?`<circle r="12" class="stopf"/><text class="stopfn" y="3.6">${p.n}</text>`:`<circle r="${r.id===hl?8:6.5}" class="stopc" style="stroke:${r.color}"/>${showN?`<text class="stopn" y="3.2">${p.n}</text>`:''}`;
          if(lab||f)g+=`<text class="mlabel ${f?'focus':''}" x="${f?16:12}" y="4">${h(p.nome||'Parada '+p.n)}${f?' · seu ponto':''}</text>`}
        s+=T(x,y,g,`class="mk" data-hit="stop:${h(r.id)}:${h(p.id||'')}"${op}`)})});
    this.d.buses.forEach(b=>{if(!okc(b))return;const tc=txtOn(b.color);const lb=String(b.label||'').slice(0,6);const bw=Math.max(40,lb.length*8+14);
      s+=T(PX(b),PY(b),`<circle r="20" class="pulse" style="fill:${b.color}"/><rect x="${-bw/2}" y="-11.5" width="${bw}" height="23" rx="6" class="busr" style="fill:${b.color}"/><text class="bust" y="4.2" style="fill:${tc}">${h(lb)}</text>`,`class="busmk" data-hit="bus:${h(b.rotaId)}"`)});
    this.svg.innerHTML=s;
    const nice=[0.05,0.1,0.2,0.5,1,2,5,10,20,50,100];let L=nice[0];for(const n of nice)if(n/k<=120)L=n;
    this.el.querySelector('.map-scale i').style.width=(L/k)+'px';this.el.querySelector('.map-scale span').textContent=L<1?Math.round(L*1000)+' m':L+' km';
  }
}
const MAPS={};
function mountMaps(){
  $$('[data-map]').forEach(ph=>{const key=ph.dataset.map;let m=MAPS[key];if(!m){m=MAPS[key]=new MapView();m.fresh=true}
    ph.appendChild(m.el);const spec=mapSpec(key)||{};m.onHit=spec.onHit||null;m.onMapClick=spec.onMapClick||null;
    const sig=key==='editor'?'ed:'+(S.edit&&S.edit.id||'new'):(spec.routes||[]).map(r=>r.id).join(',');
    if(m.fresh||m.sig!==sig){m.fresh=false;spec.refit=true}m.sig=sig;
    requestAnimationFrame(()=>m.set(spec))});
}
function busMarkers(rotas){const out=[];rotas.forEach(r=>{const e=est(r);if(e.k==='rota'){const b=busOf(r);out.push({lat:e.pos.lat,lng:e.pos.lng,color:b.cor||'#555',label:b.numero,rotaId:r.id})}});return out}
function mapSpec(key){
  const ativas=S.rotas.filter(r=>r.ativa!==false);
  const rr=r=>({id:r.id,color:corRota(r),pts:plano(r,'ida').pts});
  if(key==='painel')return{routes:ativas.map(r=>({...rr(r),labels:false})),buses:busMarkers(ativas),onHit:x=>{const[t,id]=x.split(':');S.selRota=id;go('mapa')}};
  if(key==='mapa'){const vis=ativas.filter(r=>!S.hidden.has(r.id));const sel=S.selRota&&vis.find(r=>r.id===S.selRota)?S.selRota:null;
    return{routes:vis.map(rr),buses:busMarkers(vis),highlight:sel,focus:S.selStop,onHit:x=>{const p=x.split(':');S.selRota=p[1];S.selStop=p[0]==='stop'&&!p[2].startsWith('_')?p[2]:null;render()}}}
  if(key==='editor'&&S.edit){const d=S.edit.draft;const pl=plano({...d,_draft:true},'ida');const mv=S.edit.mode;
    const hint=mv==='add'?'Clique no mapa para adicionar uma parada':mv==='origem'?'Clique no mapa para definir o ponto de partida':mv&&mv.startsWith('move:')?`Clique no mapa para reposicionar: ${(d.paradas.find(p=>p.id===mv.slice(5))||{}).nome||'parada'}`:'';
    return{routes:[{id:'draft',color:busById(d.onibusId)?.cor||'#1F5FD9',pts:pl.pts}],buses:[],highlight:'draft',edit:true,hint,
      onMapClick:(lat,lng)=>edMapClick(lat,lng),onHit:x=>{const p=x.split(':');if(p[0]==='stop'&&p[2]&&!p[2].startsWith('_')){S.edit.mode='move:'+p[2];render()}else if(p[2]==='_o'){S.edit.mode='origem';render()}}}}
  if(key.startsWith('resp-')){const c=S.consulta[key.slice(5)];const r=c&&c.data&&rotaById(c.data.rotaId);if(!r)return{routes:[]};
    const pts=plano(r,'ida').pts;return{routes:[{...rr(r)}],buses:busMarkers([r]),highlight:r.id,focus:c.data.pontoId,onHit:()=>{}}}
  if(key==='op'){const r=rotaById(S.op.rotaId);if(!r)return{routes:[]};return{routes:[rr(r)],buses:busMarkers([r]),highlight:r.id}}
  return null;
}

/* ================= navegação ================= */
const NAV=[
 {sec:'Visão geral',roles:['admin','operador']},
 {id:'painel',t:'Painel',i:'painel',roles:['admin','operador']},
 {id:'mapa',t:'Mapa de rotas',i:'mapa'},
 {sec:'Cadastros',roles:['admin','operador']},
 {id:'rotas',t:'Rotas',i:'rota',roles:['admin','operador']},
 {id:'alunos',t:'Alunos',i:'alunos',roles:['admin','operador']},
 {id:'motoristas',t:'Motoristas',i:'motorista',roles:['admin','operador']},
 {id:'onibus',t:'Ônibus',i:'onibus',roles:['admin','operador']},
 {id:'escolas',t:'Escolas e cálculo',i:'escola',roles:['admin']},
 {sec:'Acompanhamento'},
 {id:'operacao',t:'Embarque e ocorrências',i:'operacao',roles:['admin','operador']},
 {id:'responsaveis',t:'Área dos responsáveis',i:'responsaveis'},
 {id:'avisos',t:'Avisos',i:'avisos',badge:true},
 {id:'acesso',t:'Acesso e privacidade',i:'acesso'},
];
const allowed=id=>{const n=NAV.find(x=>x.id===id);return n&&(!n.roles||n.roles.includes(S.role))};
const homePage=()=>isStaff()?'painel':'responsaveis';
function go(id){if(location.hash!=='#'+id)location.hash=id;else{route()}}
function route(){let p=(location.hash||'').slice(1);if(!allowed(p))p=homePage();if(S.page!==p){S.page=p;if(p!=='rotas')S.edit=null;window.scrollTo(0,0)}
  S.navOpen=false;$('#app').classList.remove('nav-open');render();if(p==='avisos')setTimeout(marcarLidos,600)}
window.addEventListener('hashchange',route);

/* ================= avisos (relevância) ================= */
const TIPOS={atraso:['Atraso','alert'],alteracao:['Alteração','rota'],info:['Informativo','info']};
const tipoLbl=a=>TIPOS[a.tipo]?.[0]||'Aviso';
function rotasSeguidas(){return Object.values(S.consulta).filter(c=>c&&c.data).map(c=>c.data.rotaId)}
function avisoRelevante(a){if(isStaff())return true;const rs=rotasSeguidas();return a.rotaId==='todas'||rs.includes(a.rotaId)}
const naoLidos=()=>S.avisos.filter(a=>avisoRelevante(a)&&(a.criadoEm||0)>S.lidoAte).length;
function marcarLidos(){S.lidoAte=Date.now();ls.set('sb_lido',S.lidoAte);renderChrome()}

/* ================= render ================= */
let sched=false;function schedule(){if(sched)return;sched=true;requestAnimationFrame(()=>{sched=false;render()})}
function renderChrome(){
  $('#nav').innerHTML=NAV.filter(n=>!n.roles||n.roles.includes(S.role)).map(n=>n.sec?`<div class="nav-sec">${n.sec}</div>`:
    `<a href="#${n.id}" ${S.page===n.id?'aria-current="page"':''} title="${n.t}">${ic(n.i)}<span class="lbl">${n.t}</span>${n.badge&&naoLidos()?`<span class="cnt">${naoLidos()}</span>`:''}</a>`).join('');
  $('[data-brand]').setAttribute('href','#'+homePage());
  $('.hamb').innerHTML=ic('menu');
  const ds=$('#dbstate');
  const st=S.mode==='live'?(S.slow?['wait','Banco de dados lento para responder']:S.errs.length?['bad','Parte dos dados não pôde ser lida']:['ok',S.backend==='local'?'Banco local · salvo só neste navegador':S.backend==='firebase'?'Banco de dados conectado (Firebase)':'Banco de dados conectado']):S.mode==='loading'?['wait','Conectando ao banco de dados…']:['bad','Sem banco de dados nesta visualização'];
  ds.innerHTML=`<span class="dot ${st[0]}"></span><span class="lbl">${st[1]}</span>`;ds.title=st[1];
  renderClock(false);
  $('#rolewrap').innerHTML=S.realRole==='admin'?`<label class="sr" for="rolesel">Visualizar como</label><select id="rolesel" class="rolesel" data-chg="role" title="Visualizar o sistema como outro nível de acesso">${Object.entries(ROLE_LBL).map(([k,v])=>`<option value="${k}" ${S.role===k?'selected':''}>${k===S.realRole?v:'Ver como: '+v}</option>`).join('')}</select>`:'';
  const nl=naoLidos();$('#bell').innerHTML=ic('avisos')+(nl?`<span class="badge">${nl>9?'9+':nl}</span>`:'');$('#bell').setAttribute('aria-label',nl?`Avisos: ${nl} não lidos`:'Avisos');
  const m=S.me;$('#me').innerHTML=`${m&&m.avatarUrl?`<img src="${h(m.avatarUrl)}" alt="">`:`<span class="avatar" style="width:32px;height:32px;font-size:14px;border-radius:9px">${ic('user','sm')}</span>`}<span class="me-t"><b>${h(m&&m.name||'Visitante')}</b><span>${ROLE_LBL[S.role]}${S.role!==S.realRole?' (prévia)':''}</span></span>`;
  const lw=$('#logoutwrap');if(lw)lw.innerHTML=S.backend&&S.backend!=='claude'?(S.auth?`<button type="button" class="chip" data-act="sair">${ic('lock','sm')}<span class="lbl">Sair</span></button>`:`<button type="button" class="chip" data-act="entrar">${ic('user','sm')}<span class="lbl">Entrar</span></button>`):'';
}
function renderClock(force){const t=S.sim!=null?S.sim:realMin();const w=$('#clockwrap');
  if(!force&&S.simOpen&&$('#simrange')){const ch=w.querySelector('.chip');ch.classList.toggle('sim',S.sim!=null);ch.querySelector('.mono').textContent=fmt(t);ch.querySelector('.lbl').textContent=S.sim!=null?'Simulação':'Agora';return}
  w.innerHTML=`<button type="button" class="chip ${S.sim!=null?'sim':''}" data-act="simToggle" aria-expanded="${S.simOpen}">${ic('clock','sm')}<span class="mono">${fmt(t)}</span><span class="lbl">${S.sim!=null?'Simulação':'Agora'}</span></button>${S.simOpen?simPop():''}`}
function simPop(){const v=S.sim!=null?S.sim:Math.round(realMin());
  return `<div class="pop" role="dialog" aria-label="Simular horário"><div class="row"><b>Simular horário</b><span class="mono" id="simval">${fmt(v)}</span></div>
  <input type="range" id="simrange" min="300" max="1260" step="1" value="${clamp(Math.round(v),300,1260)}" aria-label="Horário simulado">
  <p class="muted" style="font-size:13px">Move os ônibus pelo horário programado, para testar rotas fora do horário atual. Nada é gravado.</p>
  <div class="row"><button type="button" class="btn sm" data-act="simReal">Voltar ao horário real</button><button type="button" class="btn sm primary" data-act="simToggle">Fechar</button></div></div>`}

function render(){
  S._t=S.sim!=null?S.sim:realMin();S._est={};
  renderChrome();
  const main=$('#main');const a=document.activeElement;const fid=a&&a.id&&main.contains(a)?a.id:null;
  let sel=null;try{if(fid&&a.selectionStart!=null)sel=[a.selectionStart,a.selectionEnd]}catch(e){}
  const y=window.scrollY;
  const P={painel:pPainel,mapa:pMapa,rotas:pRotas,alunos:pAlunos,motoristas:pMotoristas,onibus:pOnibus,escolas:pEscolas,operacao:pOperacao,responsaveis:pResp,avisos:pAvisos,acesso:pAcesso}[S.page]||pResp;
  main.innerHTML=banners()+P();
  if(fid){const n=document.getElementById(fid);if(n){n.focus({preventScroll:true});if(sel&&n.setSelectionRange)try{n.setSelectionRange(sel[0],sel[1])}catch(e){}}}
  window.scrollTo(0,y);
  mountMaps();
}
function banners(){let b='';
  if(S.mode==='offline')b+=`<div class="banner warn">${ic('db')}<div><b>Sem acesso ao banco de dados nesta visualização</b>Abra o SchoolBus pelo link compartilhado, conectado à sua conta, para ver e gravar rotas, alunos e ônibus.</div></div>`;
  else if(S.slow)b+=`<div class="banner warn">${ic('alert')}<div><b>O banco de dados ainda não respondeu</b>Os dados exibidos podem estar incompletos ou desatualizados. A conexão continua tentando sozinha.</div></div>`;
  if(S.role!==S.realRole)b+=`<div class="banner yellow">${ic('eye')}<div><b>Prévia do nível ${ROLE_LBL[S.role]}</b>Você está vendo os menus e permissões deste nível. Os dados continuam sendo lidos com o seu acesso de administrador. <button class="btn sm" data-act="rolereset" style="margin-top:8px">Voltar para Administrador</button></div></div>`;
  if(isAdmin()&&hasExemplos())b+=`<div class="banner yellow">${ic('info')}<div><b>Há dados de exemplo no sistema</b>Registros marcados com <span class="tag-ex">Exemplo</span> servem para testar. Quando cadastrar os seus, remova-os em <a href="#acesso">Acesso e privacidade</a>.</div></div>`;
  return b}
const hasExemplos=()=>[S.onibus,S.motoristas,S.alunos,S.rotas,S.escolas,S.avisos].some(a=>a.some(x=>x.exemplo));
const head=(t,sub,act='')=>`<div class="phead"><div><h1>${t}</h1>${sub?`<p class="sub">${sub}</p>`:''}</div>${act?`<div class="phead-a">${act}</div>`:''}</div>`;
const empty=(i,t,p,act='')=>`<div class="empty">${ic(i)}<b>${t}</b><p>${p}</p>${act}</div>`;
const loading=k=>S.mode==='loading'||(S.mode==='live'&&!S.loaded[k]);
const loadingBox=()=>`<div class="empty">${ic('db')}<b>Carregando do banco de dados…</b></div>`;

/* ---------- Painel ---------- */
function pPainel(){
  const nB=S.onibus.length,nOp=S.onibus.filter(b=>b.situacao==='operacao').length;
  const nA=S.alunos.filter(a=>rotaById(a.rotaId)).length,semRota=S.alunos.length-nA;
  const ra=S.rotas.filter(r=>r.ativa!==false),nT=ra.filter(r=>est(r).k==='rota').length;
  const nM=S.motoristas.length,nMd=S.motoristas.filter(m=>m.situacao==='disponivel').length;
  const kpi=(i,l,v,n,hot)=>`<div class="card kpi ${hot?'hot':''}"><span class="lbl">${l}</span><span class="kic">${ic(i)}</span><span class="val">${v}</span><span class="note">${n}</span></div>`;
  const rows=S.onibus.map(b=>{const bs=busState(b),m=motOfBus(b);const pct=bs.k==='rota'?Math.round(bs.prog*100):0;
    let det='';if(bs.k==='rota'){const nx=bs.next!=null?bs.T.pl.pts[bs.next]:null;det=`<div class="prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso da viagem"><span style="width:${pct}%;--c:${b.cor}"></span></div><small>${bs.at!=null&&bs.T.pl.pts[bs.at].tipo==='parada'?'Parado em '+h(bs.T.pl.pts[bs.at].nome):nx?`Próxima: ${h(nx.nome||'Parada')} · ${fmt(bs.nextAt)}`:''} · chegada ${fmt(bs.e)}</small>`}
    else det=`<small>${bs.r?h(bs.r.nome):''}</small>`;
    return `<tr><td><span class="busno" style="${busStyle(b)}">${h(b.numero)}</span></td><td>${plate(b.placa)}</td><td>${h(m?.nome||'—')}</td><td>${pill(bs)}${bs.a?` <span class="pill p-bad nodot">+${bs.a} min</span>`:''}</td><td style="min-width:200px">${det}</td></tr>`}).join('');
  const ocup=ra.map(r=>{const b=busOf(r),n=alunosDaRota(r.id).length,cap=+b?.capacidade||0,p=cap?n/cap:0;const c=p>1?'var(--bad)':p>.85?'var(--warn)':(b?.cor||'var(--primary)');
    return `<div class="bar-row"><b>${h(r.nome)}</b><span class="num muted">${n} / ${cap||'—'} lugares</span><div class="prog"><span style="width:${Math.min(100,p*100)}%;--c:${c}"></span></div></div>`}).join('');
  const av=S.avisos.slice(0,5);
  return head('Painel',`${dataLonga()} · situação calculada às ${fmt(S._t)}${S.sim!=null?' (simulação)':''}`,isAdmin()?`<button class="btn" data-act="novoAluno">${ic('plus')}Aluno</button><a class="btn primary" href="#rotas" data-act="novaRota">${ic('plus')}Nova rota</a>`:'')+
  `<section class="kpis" aria-label="Resumo">
    ${kpi('onibus','Ônibus cadastrados',nB,`${nOp} em operação · ${nB-nOp} fora de operação`)}
    ${kpi('alunos','Alunos transportados',nA,semRota?`${semRota} aluno${semRota>1?'s':''} sem rota definida`:`em ${ra.length} rota${ra.length===1?'':'s'}`)}
    ${kpi('rota','Rotas em funcionamento',ra.length,`<b style="color:var(--fg)">${nT}</b> em trânsito agora`,nT>0)}
    ${kpi('motorista','Motoristas disponíveis',`${nMd}<small> / ${nM}</small>`,`${nM-nMd} afastado${nM-nMd===1?'':'s'} ou em férias`)}
  </section>
  <div class="grid-2">
    <section class="card"><div class="card-h"><h2>Status dos ônibus em tempo real</h2><span class="muted">Pelo horário programado${S.sim!=null?' · simulação':''}</span></div>
      ${loading('onibus')?loadingBox():S.onibus.length?`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Ônibus</th><th>Placa</th><th>Motorista</th><th>Situação</th><th>Viagem</th></tr></thead><tbody>${rows}</tbody></table></div>`:empty('onibus','Nenhum ônibus cadastrado','Cadastre os veículos da frota para acompanhar a situação de cada um.',isAdmin()?`<a class="btn primary" href="#onibus">Cadastrar ônibus</a>`:'')}
    </section>
    <section class="card mapcard"><div class="card-h"><h2>Frota no mapa</h2><a class="btn sm" href="#mapa">Abrir mapa</a></div><div class="mapholder sm" data-map="painel"></div>
      ${nT?'':`<p class="muted" style="padding:10px 14px;border-top:1px solid var(--line);font-size:13px">Nenhum ônibus em trânsito às ${fmt(S._t)}. Use o relógio no topo para simular outro horário.</p>`}</section>
  </div>
  <div class="grid-2 even">
    <section class="card"><div class="card-h"><h2>Ocupação por rota</h2><span class="muted">Alunos ÷ lugares do ônibus</span></div><div class="card-b">${ocup?`<div class="bars">${ocup}</div>`:empty('rota','Nenhuma rota ativa','Crie rotas para ver a ocupação dos ônibus.')}</div></section>
    <section class="card"><div class="card-h"><h2>Avisos recentes</h2><a class="btn sm" href="#avisos">Ver todos</a></div>${av.length?`<div class="feed">${av.map(avItem).join('')}</div>`:empty('avisos','Nenhum aviso','Atrasos e alterações informados pelos motoristas aparecem aqui.')}</section>
  </div>`;
}

/* ---------- Mapa ---------- */
function pMapa(){
  const ativas=S.rotas.filter(r=>r.ativa!==false);
  const list=ativas.map(r=>{const b=busOf(r),pl=plano(r,'ida'),e=est(r);return `<div class="rl-item ${S.selRota===r.id?'sel':''}">
    <label class="sw" title="Mostrar no mapa"><input type="checkbox" data-chg="vis" data-id="${h(r.id)}" ${S.hidden.has(r.id)?'':'checked'} aria-label="Mostrar ${h(r.nome)} no mapa"><span class="swatch" style="--c:${corRota(r)}"></span></label>
    <button type="button" class="rl-main" data-act="selRota" data-id="${h(r.id)}"><strong>${h(r.nome)}</strong><span>${h(b?.numero||'Sem ônibus')} · ${(r.paradas||[]).length} paradas · ${fkm(pl.km)} · ${fmin(pl.min)}</span></button>${pill(e)}</div>`}).join('');
  const r=rotaById(S.selRota);
  return head('Mapa de rotas','Localização dos ônibus, trajetos e pontos de embarque. Cada ônibus tem sua cor; clique numa rota, num ponto ou num ônibus para ver os detalhes.')+
  `<div class="mapgrid"><aside class="card routelist"><div class="card-h"><h2>Rotas</h2><span class="muted">${ativas.length} ativas</span></div>
    ${loading('rotas')?loadingBox():ativas.length?`<div class="rl">${list}</div>`:empty('rota','Nenhuma rota ativa','As rotas cadastradas aparecem aqui com sua cor.')}</aside>
   <section class="card mapcard"><div class="mapholder" data-map="mapa"></div>
    <div class="legend"><span><i class="lg o"></i>Garagem / partida</span><span><i class="lg s"></i>Ponto de embarque</span><span><i class="lg d"></i>Escola</span><span><i class="lg b"></i>Ônibus em trânsito</span></div></section></div>
  ${r?rotaDetalhe(r):''}`;
}
function rotaDetalhe(r){
  const b=busOf(r),m=motOfBus(b),e=est(r),ida=plano(r,'ida'),volta=plano(r,'volta');const a=atrasoDe(b);
  const sI=hm(r.saida),sV=hm(r.retornoSaida);
  const rows=ida.pts.map((p,i)=>{const iv=volta.pts.length-1-i;const nA=p.tipo==='parada'?S.alunos.filter(x=>x.rotaId===r.id&&x.pontoId===p.id).length:null;
    const now=e.k==='rota'&&((e.T.viagem==='ida'&&e.at===i)||(e.T.viagem==='volta'&&e.at===iv));
    return `<tr class="${S.selStop&&S.selStop===p.id?'hl':''}"><td class="nowrap">${p.tipo==='parada'?`<span class="swatch" style="--c:${corRota(r)};border-radius:50%;width:12px;height:12px"></span> ${p.n}`:p.tipo==='origem'?'Partida':'Escola'}</td>
    <td><b>${h(p.nome||'')}</b>${p.regiao?`<small>${h(p.regiao)}</small>`:''}${now?' <span class="pill p-blue">ônibus aqui</span>':''}</td>
    <td class="mono">${sI!=null?fmt(sI+a+ida.arr[i]):'—'}</td><td class="mono">${sV!=null?fmt(sV+a+volta.arr[iv]):'—'}</td>
    <td class="mono">${fkm(ida.cum[i])}</td>${isStaff()?`<td class="num">${nA==null?'':nA}</td>`:''}
    <td class="acts"><a class="btn sm ghost" href="${gmPoint(p)}" target="_blank" rel="noopener" aria-label="Abrir ${h(p.nome)} no Google Maps">${ic('ext','sm')}</a></td></tr>`}).join('');
  return `<section class="card rcard"><div class="sign"><span class="busno" style="${busStyle(b)}">${h(b?.numero||'—')}</span><span class="st">${h(r.nome)}</span>${pill(e)}</div>
  <div class="card-b" style="display:flex;flex-wrap:wrap;gap:10px 28px;border-bottom:1px solid var(--line)">
   <div><span class="muted" style="font-size:12.5px;font-weight:700">ÔNIBUS</span><div>${b?`${plate(b.placa)} <span class="muted">${h(b.modelo||'')}</span>`:'—'}</div></div>
   ${isStaff()?`<div><span class="muted" style="font-size:12.5px;font-weight:700">MOTORISTA</span><div><b>${h(m?.nome||'—')}</b></div></div>`:''}
   <div><span class="muted" style="font-size:12.5px;font-weight:700">DISTÂNCIA ESTIMADA</span><div class="num"><b>${fkm(ida.km)}</b> por viagem</div></div>
   <div><span class="muted" style="font-size:12.5px;font-weight:700">TEMPO ESTIMADO</span><div class="num"><b>${fmin(ida.min)}</b> com ${(r.paradas||[]).length} paradas</div></div>
   <div><span class="muted" style="font-size:12.5px;font-weight:700">HORÁRIOS</span><div class="num">Ida ${h(r.saida||'—')}–${h(r.chegada||'—')} · Retorno ${h(r.retornoSaida||'—')}–${h(r.retornoChegada||'—')}</div></div>
   ${a?`<div><span class="pill p-bad nodot">Atraso informado: +${a} min</span></div>`:''}
  </div>
  <div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Ponto</th><th>Ida</th><th>Retorno</th><th>Km</th>${isStaff()?'<th>Alunos</th>':''}<th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="acts" style="padding-top:14px"><a class="btn primary" href="${gmRoute(ida.pts)}" target="_blank" rel="noopener">${ic('ext')}Trajeto da ida no Google Maps</a><a class="btn" href="${gmRoute(volta.pts)}" target="_blank" rel="noopener">${ic('ext')}Retorno no Google Maps</a>${isAdmin()?`<button class="btn" data-act="editRota" data-id="${h(r.id)}">${ic('edit')}Editar rota</button>`:''}</div>
  ${ida.pts.length>11?'<p class="muted" style="padding:0 16px 14px;font-size:13px">O Google Maps aceita até 9 paradas intermediárias por link; as demais ficam de fora do trajeto aberto lá.</p>':''}</section>`;
}

/* ---------- Rotas ---------- */
function pRotas(){
  if(S.edit)return pEditor();
  const cards=S.rotas.map(r=>{const b=busOf(r),pl=plano(r,'ida'),e=est(r),n=alunosDaRota(r.id).length,esc=escById(r.escolaId);
    return `<article class="card rcard"><div class="sign"><span class="busno" style="${busStyle(b)}">${h(b?.numero||'—')}</span><span class="st">${h(r.nome)}</span></div>
    <dl><dt>Situação</dt><dd>${pill(e)}${exTag(r)}</dd><dt>Escola</dt><dd>${h(esc?.nome||r.destino?.nome||'—')}</dd>
    <dt>Ida</dt><dd class="num">${h(r.saida||'—')} → ${h(r.chegada||'—')}</dd><dt>Retorno</dt><dd class="num">${h(r.retornoSaida||'—')} → ${h(r.retornoChegada||'—')}</dd>
    <dt>Trajeto</dt><dd class="num">${(r.paradas||[]).length} paradas · ${fkm(pl.km)} · ${fmin(pl.min)}</dd><dt>Alunos</dt><dd class="num">${n}${b?.capacidade?` de ${b.capacidade} lugares`:''}</dd></dl>
    <div class="acts"><button class="btn sm" data-act="verMapa" data-id="${h(r.id)}">${ic('mapa','sm')}Ver no mapa</button>${isAdmin()?`<button class="btn sm" data-act="editRota" data-id="${h(r.id)}">${ic('edit','sm')}Editar</button><button class="btn sm ghost" data-act="delRota" data-id="${h(r.id)}" aria-label="Excluir ${h(r.nome)}">${ic('trash','sm')}</button>`:''}</div></article>`}).join('');
  return head('Rotas','Trajetos, pontos de parada e horários de cada ônibus. A sequência de paradas pode ser otimizada automaticamente.',isAdmin()?`<button class="btn primary" data-act="novaRota">${ic('plus')}Nova rota</button>`:'')+
    (loading('rotas')?`<div class="card">${loadingBox()}</div>`:S.rotas.length?`<div class="grid-cards">${cards}</div>`:`<div class="card">${empty('rota','Nenhuma rota cadastrada',isAdmin()?'Crie a primeira rota: escolha o ônibus, a escola de destino e marque as paradas no mapa.':'O administrador ainda não cadastrou rotas.',isAdmin()?`<button class="btn primary" data-act="novaRota">${ic('plus')}Criar rota</button>`:'')}</div>`);
}
function novaDraft(){const g=cfg().garagem;const e=S.escolas[0];
  return{nome:'',onibusId:'',escolaId:e?.id||'',origem:{nome:g.nome,lat:g.lat,lng:g.lng},destino:e?{nome:e.nome,lat:e.lat,lng:e.lng}:{nome:'',lat:null,lng:null},paradas:[],saida:'06:10',chegada:'07:00',retornoSaida:'11:40',retornoChegada:'12:30',ativa:true}}
function abrirEditor(id){const r=id&&rotaById(id);S.edit={id:r?r.id:null,draft:r?JSON.parse(JSON.stringify(strip(r))):novaDraft(),mode:'add',err:''};
  if(!S.edit.draft.paradas)S.edit.draft.paradas=[];if(location.hash!=='#rotas')location.hash='rotas';else render()}
function pEditor(){
  const E=S.edit,d=E.draft;const pl=plano({...d,_draft:true},'ida'),plv=plano({...d,_draft:true},'volta');
  const c=busById(d.onibusId)?.cor||'#1F5FD9';
  const prevC=hm(d.saida)!=null?hm(d.saida)+pl.min:null,alvo=hm(d.chegada);const prevV=hm(d.retornoSaida)!=null?hm(d.retornoSaida)+plv.min:null,alvoV=hm(d.retornoChegada);
  const warn=[];if(prevC!=null&&alvo!=null&&prevC>alvo)warn.push(`A ida deve terminar às ${fmt(prevC)}, ${Math.round(prevC-alvo)} min depois do horário definido (${d.chegada}). Antecipe a saída ou otimize a sequência.`);
  if(prevV!=null&&alvoV!=null&&prevV>alvoV)warn.push(`O retorno deve terminar às ${fmt(prevV)}, depois do horário definido (${d.retornoChegada}).`);
  const stops=d.paradas.map((p,i)=>{const n=E.id?S.alunos.filter(a=>a.rotaId===E.id&&a.pontoId===p.id).length:0;const mv=E.mode==='move:'+p.id;
    return `<div class="stoprow ${mv?'moving':''}"><span class="n" style="--c:${c}">${i+1}</span>
    <div class="sf"><label class="sr" for="sn-${h(p.id)}">Nome da parada ${i+1}</label><input class="inp" id="sn-${h(p.id)}" data-sf="nome" data-sid="${h(p.id)}" value="${h(p.nome)}" placeholder="Nome do ponto" maxlength="80">
    <label class="sr" for="sr-${h(p.id)}">Região da parada ${i+1}</label><input class="inp" id="sr-${h(p.id)}" data-sf="regiao" data-sid="${h(p.id)}" value="${h(p.regiao||'')}" placeholder="Bairro / região" maxlength="50"></div>
    <div class="tools"><button type="button" class="tb" data-act="stopUp" data-sid="${h(p.id)}" ${i===0?'disabled':''} aria-label="Subir">${ic('up','sm')}</button><button type="button" class="tb" data-act="stopDown" data-sid="${h(p.id)}" ${i===d.paradas.length-1?'disabled':''} aria-label="Descer">${ic('down','sm')}</button><button type="button" class="tb" data-act="stopDel" data-sid="${h(p.id)}" aria-label="Remover parada">${ic('trash','sm')}</button></div>
    <div class="meta"><span class="mono">${fcoord(p)}</span><button type="button" class="reveal" data-act="stopMove" data-sid="${h(p.id)}">${mv?'Clique no mapa…':'Reposicionar'}</button><a href="${gmPoint(p)}" target="_blank" rel="noopener">Google Maps</a>${n?`<span><b>${n}</b> aluno${n>1?'s':''}</span>`:''}<span class="mono">${hm(d.saida)!=null?'ida '+fmt(hm(d.saida)+pl.arr[i+1]):''}</span></div></div>`}).join('');
  const busOpts=S.onibus.map(b=>`<option value="${h(b.id)}" ${d.onibusId===b.id?'selected':''}>${h(b.numero)} · ${h(fplaca(b.placa))}${b.situacao!=='operacao'?' ('+(SIT_ON[b.situacao]?.[0]||'')+')':''}</option>`).join('');
  const escOpts=S.escolas.map(e=>`<option value="${h(e.id)}" ${d.escolaId===e.id?'selected':''}>${h(e.nome)}</option>`).join('');
  return head(E.id?'Editar rota':'Nova rota',E.id?h(d.nome):'Defina o ônibus, a escola, os horários e marque as paradas no mapa.',`<button class="btn" data-act="edCancel">Cancelar</button><button class="btn primary" data-act="edSave">${ic('check')}Salvar rota</button>`)+
  (E.err?`<div class="banner warn">${ic('alert')}<div><b>Não foi possível salvar</b>${h(E.err)}</div></div>`:'')+
  `<div class="editor"><div class="form">
    <section class="card card-b form"><div class="fsec">Identificação</div>
      <div class="field"><label class="req" for="ed-nome">Nome da rota</label><input class="inp" id="ed-nome" data-ed="nome" value="${h(d.nome)}" placeholder="Ex.: Norte · Mocambinho → Escola Ipê Amarelo" maxlength="90"></div>
      <div class="fgrid"><div class="field"><label for="ed-bus">Ônibus</label><select class="inp" id="ed-bus" data-ed="onibusId" data-rerender><option value="">Sem ônibus</option>${busOpts}</select></div>
      <div class="field"><label for="ed-ativa">Situação</label><select class="inp" id="ed-ativa" data-ed="ativa" data-rerender><option value="1" ${d.ativa!==false?'selected':''}>Ativa</option><option value="0" ${d.ativa===false?'selected':''}>Inativa</option></select></div></div>
    </section>
    <section class="card card-b form"><div class="fsec">Partida e destino</div>
      <div class="field"><label for="ed-onome">Ponto de partida</label><input class="inp" id="ed-onome" data-ed="origem.nome" value="${h(d.origem?.nome||'')}" maxlength="80">
        <span class="hint mono">${fcoord(d.origem)||'Sem coordenadas'} · <button type="button" class="reveal" data-act="edOrigemMapa">${E.mode==='origem'?'Clique no mapa…':'Definir no mapa'}</button> · <button type="button" class="reveal" data-act="edGaragem">Usar garagem padrão</button></span></div>
      <div class="field"><label class="req" for="ed-esc">Escola de destino</label><select class="inp" id="ed-esc" data-ed="escolaId" data-rerender><option value="">Selecione…</option>${escOpts}</select>${S.escolas.length?'':`<span class="hint">Cadastre as escolas em <a href="#escolas">Escolas e cálculo</a>.</span>`}</div>
    </section>
    <section class="card card-b form"><div class="fsec">Horários</div>
      <div class="fgrid"><div class="field"><label class="req" for="ed-s">Saída (ida)</label><input class="inp mono" type="time" id="ed-s" data-ed="saida" data-rerender value="${h(d.saida||'')}"></div>
      <div class="field"><label for="ed-c">Chegada na escola</label><input class="inp mono" type="time" id="ed-c" data-ed="chegada" data-rerender value="${h(d.chegada||'')}"></div>
      <div class="field"><label for="ed-rs">Saída (retorno)</label><input class="inp mono" type="time" id="ed-rs" data-ed="retornoSaida" data-rerender value="${h(d.retornoSaida||'')}"></div>
      <div class="field"><label for="ed-rc">Chegada (retorno)</label><input class="inp mono" type="time" id="ed-rc" data-ed="retornoChegada" data-rerender value="${h(d.retornoChegada||'')}"></div></div>
    </section>
    <section class="card card-b form"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div class="fsec">Paradas (${d.paradas.length})</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn sm ${E.mode==='add'?'on':''}" data-act="edAddMode">${ic('pin','sm')}Adicionar pelo mapa</button><button type="button" class="btn sm" data-act="edOtimizar" ${d.paradas.length<2?'disabled':''}>${ic('spark','sm')}Otimizar sequência</button></div></div>
      <div class="summary"><div><span>DISTÂNCIA</span><b>${fkm(pl.km)}</b></div><div><span>TEMPO (IDA)</span><b>${fmin(pl.min)}</b></div><div><span>CHEGADA PREVISTA</span><b class="mono">${fmt(prevC)}</b></div></div>
      ${warn.map(w=>`<div class="banner warn">${ic('alert')}<div>${h(w)}</div></div>`).join('')}
      <div class="stops">${stops||`<p class="muted">Nenhuma parada ainda. Clique no mapa para marcar os pontos de embarque, ou cole coordenadas abaixo.</p>`}</div>
      <div class="field"><label for="ed-coord">Adicionar por coordenadas</label><div style="display:flex;gap:8px"><input class="inp mono" id="ed-coord" placeholder="-5.08921, -42.80193" style="flex:1"><button type="button" class="btn" data-act="edAddCoord">Adicionar</button></div><span class="hint">No Google Maps, clique com o botão direito num local para copiar as coordenadas.</span></div>
    </section>
  </div>
  <section class="card mapcard"><div class="mapholder md" data-map="editor" style="height:min(70vh,640px)"></div>
   <div class="legend"><span><i class="lg o"></i>Partida</span><span><i class="lg s"></i>Parada (clique para reposicionar)</span><span><i class="lg d"></i>Escola</span><span>Tempo: ${cfg().velocidade} km/h · ${String(cfg().parada).replace('.',',')} min por parada · fator de via ${String(cfg().fator).replace('.',',')}</span></div></section></div>`;
}
function edMapClick(lat,lng){const E=S.edit;if(!E)return;const d=E.draft;const m=E.mode;
  if(m==='origem'){d.origem={...d.origem,lat,lng};E.mode='add'}
  else if(m&&m.startsWith('move:')){const p=d.paradas.find(x=>x.id===m.slice(5));if(p){p.lat=lat;p.lng=lng}E.mode='add'}
  else if(m==='add'){d.paradas.push({id:'p'+Math.random().toString(36).slice(2,9),nome:'Parada '+(d.paradas.length+1),regiao:'',lat,lng})}
  render()}

/* ---------- Alunos ---------- */
function pAlunos(){
  const f=S.f,q=f.q.trim().toLowerCase();
  let rows=S.alunos.filter(a=>(!q||[a.nome,a.responsavel,a.endereco,a.regiao,a.codigo].some(x=>String(x||'').toLowerCase().includes(q)))&&(!f.escola||a.escolaId===f.escola)&&(!f.rota||(f.rota==='_none'?!rotaById(a.rotaId):a.rotaId===f.rota)));
  const tr=a=>{const r=rotaById(a.rotaId),e=escById(a.escolaId),pn=pontoNome(r,a.pontoId),rv=S.reveal.has(a.id);
    return `<tr><td><b>${h(a.nome)}</b>${exTag(a)}<small>${h(a.endereco||'')}</small></td><td>${h(e?.nome||'—')}<small class="mono">${h(a.entrada||'--:--')} – ${h(a.saida||'--:--')}</small></td>
    <td>${r?`<span style="display:inline-flex;align-items:center;gap:6px"><span class="swatch" style="--c:${corRota(r)}"></span>${h(r.nome)}</span><small>${pn?h(pn):'<span style="color:var(--bad)">Ponto não definido</span>'}</small>`:'<span class="pill p-warn">Sem rota</span>'}</td>
    <td>${h(a.responsavel||'—')}<small class="mono">${rv?h(fone(a.telefone)):h(maskFone(a.telefone))}<button type="button" class="reveal" data-act="reveal" data-id="${h(a.id)}" aria-label="${rv?'Ocultar':'Mostrar'} telefone">${ic('eye','sm')}</button></small></td>
    <td><span class="code">${h(a.codigo||'—')}</span></td>
    <td class="acts">${isAdmin()?`<button class="btn sm" data-act="editAluno" data-id="${h(a.id)}" aria-label="Editar ${h(a.nome)}">${ic('edit','sm')}</button> <button class="btn sm ghost" data-act="delAluno" data-id="${h(a.id)}" aria-label="Excluir ${h(a.nome)}">${ic('trash','sm')}</button>`:''}</td></tr>`};
  const thead=`<thead><tr><th>Aluno</th><th>Escola · horário</th><th>Rota · ponto de embarque</th><th>Responsável</th><th>Código</th><th></th></tr></thead>`;
  let body;
  if(!rows.length)body=loading('alunos')?loadingBox():empty('alunos',S.alunos.length?'Nenhum aluno encontrado':'Nenhum aluno cadastrado',S.alunos.length?'Ajuste a busca ou os filtros.':'Cadastre os alunos com escola, horários, ponto de embarque e responsável.',isAdmin()&&!S.alunos.length?`<button class="btn primary" data-act="novoAluno">${ic('plus')}Cadastrar aluno</button>`:'');
  else if(f.grupo==='regiao'){const g={};rows.forEach(a=>{const k=a.regiao||'Sem região informada';(g[k]=g[k]||[]).push(a)});
    body=Object.keys(g).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(k=>{const rs=new Set(g[k].map(a=>a.rotaId).filter(Boolean));return `<div class="group-h">${ic('pin')}${h(k)}<span class="pill p-blue nodot">${g[k].length} aluno${g[k].length>1?'s':''}</span><span class="pill nodot">${rs.size} rota${rs.size===1?'':'s'}</span></div><div class="tbl-wrap"><table class="tbl">${thead}<tbody>${g[k].map(tr).join('')}</tbody></table></div>`}).join('');}
  else body=`<div class="tbl-wrap"><table class="tbl">${thead}<tbody>${rows.map(tr).join('')}</tbody></table></div>`;
  return head('Alunos',`${S.alunos.length} cadastrados. Dados pessoais visíveis só para a equipe; telefones aparecem mascarados até você pedir para ver.`,isAdmin()?`<button class="btn primary" data-act="novoAluno">${ic('plus')}Cadastrar aluno</button>`:'')+
  `<div class="toolbar"><div class="search">${ic('search')}<label class="sr" for="f-q">Buscar aluno</label><input class="inp" id="f-q" data-bind="q" value="${h(f.q)}" placeholder="Buscar por nome, responsável, bairro ou código"></div>
   <label class="sr" for="f-esc">Escola</label><select class="inp" id="f-esc" data-bind="escola"><option value="">Todas as escolas</option>${S.escolas.map(e=>`<option value="${h(e.id)}" ${f.escola===e.id?'selected':''}>${h(e.nome)}</option>`).join('')}</select>
   <label class="sr" for="f-rota">Rota</label><select class="inp" id="f-rota" data-bind="rota"><option value="">Todas as rotas</option><option value="_none" ${f.rota==='_none'?'selected':''}>Sem rota</option>${S.rotas.map(r=>`<option value="${h(r.id)}" ${f.rota===r.id?'selected':''}>${h(r.nome)}</option>`).join('')}</select>
   <div class="seg" role="group" aria-label="Organização"><button type="button" data-act="grupo" data-id="lista" aria-pressed="${f.grupo==='lista'}">Lista</button><button type="button" data-act="grupo" data-id="regiao" aria-pressed="${f.grupo==='regiao'}">Por região</button></div></div>
  <section class="card">${body}</section>`;
}

/* ---------- Motoristas ---------- */
function pMotoristas(){
  const cards=S.motoristas.map(m=>{const b=S.onibus.find(x=>x.motoristaId===m.id);const rs=b?S.rotas.filter(r=>r.onibusId===b.id):[];const st=SIT_MOT[m.situacao]||['—','p-mute'];
    return `<article class="card person"><div class="person-h">${m.foto?`<img class="avatar" src="${h(m.foto)}" alt="Foto de ${h(m.nome)}">`:`<span class="avatar" aria-hidden="true">${h(initials(m.nome))}</span>`}
    <div style="min-width:0"><h3>${h(m.nome)}</h3><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap"><span class="pill ${st[1]}">${st[0]}</span>${exTag(m)}</div></div></div>
    <dl><dt>Telefone</dt><dd class="mono">${h(fone(m.telefone))}</dd><dt>CNH</dt><dd class="mono">${h(maskCnh(m.cnh))}</dd>
    <dt>Ônibus</dt><dd>${b?`<span class="busno" style="${busStyle(b)}">${h(b.numero)}</span> ${h(fplaca(b.placa))}`:'<span class="muted">Nenhum</span>'}</dd>
    <dt>Rotas</dt><dd>${rs.length?rs.map(r=>h(r.nome)).join('<br>'):'<span class="muted">Nenhuma rota atribuída</span>'}</dd></dl>
    ${isAdmin()?`<div class="acts"><button class="btn sm" data-act="editMot" data-id="${h(m.id)}">${ic('edit','sm')}Editar</button><button class="btn sm ghost" data-act="delMot" data-id="${h(m.id)}" aria-label="Excluir ${h(m.nome)}">${ic('trash','sm')}</button></div>`:''}</article>`}).join('');
  return head('Motoristas','Equipe de condução, CNH, ônibus sob responsabilidade e rotas atribuídas.',isAdmin()?`<button class="btn primary" data-act="novoMot">${ic('plus')}Cadastrar motorista</button>`:'')+
  (loading('motoristas')?`<div class="card">${loadingBox()}</div>`:S.motoristas.length?`<div class="grid-cards">${cards}</div>`:`<div class="card">${empty('motorista','Nenhum motorista cadastrado','Cadastre os motoristas com foto, telefone e número da CNH.',isAdmin()?`<button class="btn primary" data-act="novoMot">${ic('plus')}Cadastrar motorista</button>`:'')}</div>`);
}

/* ---------- Ônibus ---------- */
function pOnibus(){
  const cards=S.onibus.map(b=>{const m=motOfBus(b),rs=S.rotas.filter(r=>r.onibusId===b.id),st=SIT_ON[b.situacao]||['—','p-mute'];
    const max=rs.reduce((mx,r)=>Math.max(mx,alunosDaRota(r.id).length),0),cap=+b.capacidade||0,p=cap?max/cap:0;
    return `<article class="card bus"><div class="bus-h"><span class="busno" style="${busStyle(b)}">${h(b.numero)}</span>${plate(b.placa)}<span class="pill ${st[1]}">${st[0]}</span></div>
    <p class="model">${h(b.modelo||'')}${exTag(b)}</p>
    <dl><dt>Capacidade</dt><dd class="num">${cap} passageiros</dd><dt>Lotação</dt><dd><div class="prog" style="margin:6px 0 3px"><span style="width:${Math.min(100,p*100)}%;--c:${p>1?'var(--bad)':p>.85?'var(--warn)':b.cor}"></span></div><span class="muted num" style="font-size:12.5px">até ${max} alunos por viagem</span></dd>
    <dt>Motorista</dt><dd>${h(m?.nome||'—')}</dd><dt>Rotas</dt><dd>${rs.length?rs.map(r=>h(r.nome)).join('<br>'):'<span class="muted">Nenhuma</span>'}</dd></dl>
    ${isAdmin()?`<div class="acts"><button class="btn sm" data-act="editBus" data-id="${h(b.id)}">${ic('edit','sm')}Editar</button><button class="btn sm ghost" data-act="delBus" data-id="${h(b.id)}" aria-label="Excluir ${h(b.numero)}">${ic('trash','sm')}</button></div>`:''}</article>`}).join('');
  return head('Ônibus','Frota cadastrada, situação de cada veículo e motorista responsável.',isAdmin()?`<button class="btn primary" data-act="novoBus">${ic('plus')}Cadastrar ônibus</button>`:'')+
  (loading('onibus')?`<div class="card">${loadingBox()}</div>`:S.onibus.length?`<div class="grid-cards">${cards}</div>`:`<div class="card">${empty('onibus','Nenhum ônibus cadastrado','Cadastre número, modelo, placa e capacidade de cada veículo.',isAdmin()?`<button class="btn primary" data-act="novoBus">${ic('plus')}Cadastrar ônibus</button>`:'')}</div>`);
}

/* ---------- Escolas ---------- */
function pEscolas(){
  const c=cfg();
  const rows=S.escolas.map(e=>{const n=S.alunos.filter(a=>a.escolaId===e.id).length,nr=S.rotas.filter(r=>r.escolaId===e.id).length;
    return `<tr><td><b>${h(e.nome)}</b>${exTag(e)}<small>${h(e.endereco||'')}</small></td><td class="mono">${fcoord(e)}</td><td class="num">${n}</td><td class="num">${nr}</td>
    <td class="acts"><a class="btn sm ghost" href="${gmPoint(e)}" target="_blank" rel="noopener" aria-label="Abrir no Google Maps">${ic('ext','sm')}</a><button class="btn sm" data-act="editEsc" data-id="${h(e.id)}" aria-label="Editar">${ic('edit','sm')}</button><button class="btn sm ghost" data-act="delEsc" data-id="${h(e.id)}" aria-label="Excluir">${ic('trash','sm')}</button></td></tr>`}).join('');
  return head('Escolas e cálculo','Escolas atendidas (destino das rotas) e parâmetros usados para estimar distância e tempo.',`<button class="btn primary" data-act="novaEsc">${ic('plus')}Cadastrar escola</button>`)+
  `<section class="card"><div class="card-h"><h2>Escolas</h2><span class="muted">${S.escolas.length}</span></div>${S.escolas.length?`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Escola</th><th>Coordenadas</th><th>Alunos</th><th>Rotas</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:loading('escolas')?loadingBox():empty('escola','Nenhuma escola cadastrada','Cadastre as escolas com as coordenadas do portão de embarque.')}</section>
  <section class="card"><div class="card-h"><h2>Parâmetros de cálculo</h2></div><form class="card-b form" id="cfgform" novalidate>
   <div class="fgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
    <div class="field"><label for="c-vel">Velocidade média (km/h)</label><input class="inp num" id="c-vel" name="velocidade" type="number" min="5" max="80" step="1" value="${h(c.velocidade)}"><span class="hint">Trânsito urbano com ônibus escolar: 20 a 30 km/h.</span></div>
    <div class="field"><label for="c-fat">Fator de via</label><input class="inp num" id="c-fat" name="fator" type="number" min="1" max="2.5" step="0.05" value="${h(c.fator)}"><span class="hint">Multiplica a distância em linha reta para aproximar o percurso pelas ruas.</span></div>
    <div class="field"><label for="c-par">Tempo por parada (min)</label><input class="inp num" id="c-par" name="parada" type="number" min="0" max="10" step="0.5" value="${h(c.parada)}"><span class="hint">Embarque e desembarque em cada ponto.</span></div>
   </div>
   <div class="fgrid"><div class="field"><label for="c-gn">Garagem (partida padrão)</label><input class="inp" id="c-gn" name="gnome" value="${h(c.garagem?.nome||'')}" maxlength="80"></div>
    <div class="field"><label for="c-gc">Coordenadas da garagem</label><input class="inp mono" id="c-gc" name="gcoord" value="${h(fcoord(c.garagem))}" placeholder="-5.10120, -42.80920"></div></div>
   <div><button class="btn primary" type="submit">${ic('check')}Salvar parâmetros</button></div></form></section>`;
}

/* ---------- Operação ---------- */
function pOperacao(){
  const ativas=S.rotas.filter(r=>r.ativa!==false);
  if(!S.op.rotaId||!rotaById(S.op.rotaId))S.op.rotaId=(ativas.find(r=>est(r).k==='rota')||ativas[0])?.id||null;
  const r=rotaById(S.op.rotaId);
  const top=head('Embarque e ocorrências','Para o motorista ou monitor: marque quem embarcou e avise os responsáveis sobre atrasos e alterações.');
  if(!r)return top+`<div class="card">${loading('rotas')?loadingBox():empty('rota','Nenhuma rota ativa','Quando houver rotas ativas, a lista de embarque aparece aqui.')}</div>`;
  const e=est(r),b=busOf(r);
  const vg=S.op.viagem||(e.k==='rota'?e.T.viagem:(hm(r.retornoSaida)!=null&&S._t>=hm(r.retornoSaida)-45?'volta':'ida'));
  const pl=plano(r,vg),pid=`${today()}_${r.id}_${vg}`,pres=S.presencas[pid]?.marcados||{};
  const kids=alunosDaRota(r.id);const marc=kids.filter(a=>pres[a.id]).length;const a=atrasoDe(b);const s0=(vg==='ida'?hm(r.saida):hm(r.retornoSaida));
  const groups=pl.pts.filter(p=>p.tipo==='parada').map(p=>{const i=pl.pts.indexOf(p);const ks=kids.filter(k=>k.pontoId===p.id);if(!ks.length)return '';
    return `<div class="stopgrp"><div class="stopgrp-h"><span class="swatch" style="--c:${corRota(r)};border-radius:50%"></span>${p.n}. ${h(p.nome)}<span class="t">${s0!=null?fmt(s0+a+pl.arr[i]):''}</span></div>
    ${ks.map(k=>`<div class="kid"><div class="who"><b>${h(k.nome)}</b><small>${h(k.responsavel||'')} · <span class="mono">${h(fone(k.telefone))}</span></small></div><button type="button" class="tgl" data-act="embarque" data-id="${h(k.id)}" aria-pressed="${!!pres[k.id]}">${pres[k.id]?ic('check','sm')+(vg==='ida'?'Embarcou':'Desembarcou'):(vg==='ida'?'Marcar embarque':'Marcar desembarque')}</button></div>`).join('')}</div>`}).join('');
  const orf=kids.filter(k=>!(r.paradas||[]).some(p=>p.id===k.pontoId));
  return top+`<div class="toolbar"><label class="sr" for="op-rota">Rota</label><select class="inp" id="op-rota" data-chg="opRota" style="max-width:420px;flex:1">${ativas.map(x=>`<option value="${h(x.id)}" ${x.id===r.id?'selected':''}>${h(x.nome)}</option>`).join('')}</select>
   <div class="seg" role="group" aria-label="Viagem"><button type="button" data-act="opViagem" data-id="ida" aria-pressed="${vg==='ida'}">Ida</button><button type="button" data-act="opViagem" data-id="volta" aria-pressed="${vg==='volta'}">Retorno</button></div></div>
  <div class="grid-2">
   <section class="card oplist"><div class="sign"><span class="busno" style="${busStyle(b)}">${h(b?.numero||'—')}</span><span class="st">${h(r.nome)}</span>${pill(e)}</div>
    <div class="card-h"><h2>${vg==='ida'?'Embarque':'Desembarque'} de hoje</h2><span class="pill ${marc===kids.length&&kids.length?'p-ok':'p-blue'} nodot num">${marc} de ${kids.length}</span></div>
    ${kids.length?groups+(orf.length?`<div class="stopgrp"><div class="stopgrp-h" style="color:var(--bad)">${ic('alert','sm')}Alunos sem ponto válido nesta rota</div>${orf.map(k=>`<div class="kid"><div class="who"><b>${h(k.nome)}</b><small>Atualize o ponto de embarque no cadastro.</small></div></div>`).join('')}</div>`:''):empty('alunos','Nenhum aluno nesta rota','Vincule alunos à rota no cadastro de alunos.')}
   </section>
   <div style="display:flex;flex-direction:column;gap:18px;min-width:0">
    <section class="card"><div class="card-h"><h2>Informar ocorrência</h2>${a?`<span class="pill p-bad nodot">Atraso atual: +${a} min</span>`:'<span class="pill p-ok">Sem atraso</span>'}</div>
     <div class="card-b form"><div class="field"><span class="flabel">Atraso estimado</span><div class="delays">${[5,10,15,20,30].map(n=>`<button type="button" class="btn sm ${a===n?'on':''}" data-act="atraso" data-id="${n}">+${n} min</button>`).join('')}<button type="button" class="btn sm" data-act="normalizar" ${a?'':'disabled'}>${ic('check','sm')}Normalizar</button></div><span class="hint">Os horários previstos para os responsáveis passam a considerar o atraso no dia de hoje.</span></div>
     <div class="field"><label for="op-msg">Mensagem (opcional para atraso; obrigatória para alteração)</label><textarea class="inp" id="op-msg" data-bind="opMsg" maxlength="280" placeholder="Ex.: Trânsito lento na Av. Frei Serafim. / Ponto 3 transferido para a esquina em frente à farmácia.">${h(S.opMsg)}</textarea></div>
     <div><button type="button" class="btn yellow" data-act="alteracao">${ic('avisos','sm')}Enviar aviso de alteração</button></div></div></section>
    <section class="card mapcard"><div class="mapholder sm" data-map="op"></div></section>
   </div></div>`;
}

/* ---------- Responsáveis ---------- */
function pResp(){
  const cards=S.codigos.map(code=>{const c=S.consulta[code];
    if(!c||c.st==='loading')return `<section class="card">${loadingBox()}</section>`;
    if(c.st==='notfound')return `<section class="card card-b" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><b>Código <span class="code">${h(code)}</span> não encontrado</b><p class="muted">Confira com a escola ou secretaria. O código pode ter sido trocado.</p></div><button class="btn sm" data-act="remCode" data-id="${h(code)}">Remover</button></section>`;
    if(c.st==='err')return `<section class="card card-b"><b>Não foi possível consultar o código ${h(code)}</b><p class="muted">Verifique a conexão. <button class="reveal" data-act="retryCode" data-id="${h(code)}">Tentar de novo</button></p></section>`;
    const d=c.data,r=rotaById(d.rotaId);
    if(!r)return `<section class="card card-b"><b>${h(d.apelido)}</b><p class="muted">A rota deste aluno não está disponível no momento. Fale com a escola.</p><button class="btn sm" data-act="remCode" data-id="${h(code)}">Remover</button></section>`;
    const b=busOf(r),e=est(r),a=atrasoDe(b),ida=plano(r,'ida'),vol=plano(r,'volta');
    const iI=ida.pts.findIndex(p=>p.id===d.pontoId),iV=vol.pts.findIndex(p=>p.id===d.pontoId),p=ida.pts[iI];
    const sI=hm(r.saida),sV=hm(r.retornoSaida);const tI=sI!=null&&iI>=0?sI+a+ida.arr[iI]:null,tV=sV!=null&&iV>=0?sV+a+vol.arr[iV]:null;
    let live='';
    if(e.k==='rota'){const myI=e.T.viagem==='ida'?iI:iV;const cur=e.at!=null?e.at:(e.next!=null?e.next-1:0);const falta=myI-(e.next!=null?e.next:cur+1);
      if(myI<0)live=`O ônibus está em rota (${e.T.viagem==='ida'?'ida':'retorno'}).`;
      else if(e.at===myI)live=`<b>O ônibus está no seu ponto agora.</b>`;
      else if(myI>cur)live=`<b>O ônibus está a ${falta+1} parada${falta>0?'s':''} do seu ponto.</b> Previsão: ${fmt((e.T.viagem==='ida'?tI:tV))}.`;
      else live=`O ônibus já passou pelo seu ponto nesta viagem${e.T.viagem==='ida'?' e segue para a escola':''}.`}
    else if(e.k==='aguard')live=`<b>Saída da garagem às ${fmt(e.s)}.</b> Embarque previsto às ${fmt(tI)}.`;
    else if(e.k==='escola')live=`<b>Ônibus na escola.</b> Retorno sai às ${fmt(e.s)}; desembarque previsto às ${fmt(tV)}.`;
    else live=`<b>${h(e.txt)}.</b>`;
    const avs=S.avisos.filter(x=>x.rotaId===r.id||x.rotaId==='todas').slice(0,3);
    return `<section class="card rcard"><div class="sign"><span class="busno" style="${busStyle(b)}">${h(b?.numero||'—')}</span><span class="st">${h(r.nome)}</span><button class="btn sm" data-act="remCode" data-id="${h(code)}" style="background:transparent;color:var(--sign-fg);border-color:currentColor">Remover</button></div>
     <div class="track"><div class="info">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><span class="muted" style="font-size:12.5px;font-weight:700">ALUNO</span><div style="font-size:18px;font-weight:700">${h(d.apelido)}</div></div>${pill(e)}</div>
      <div class="live">${ic(e.k==='rota'?'onibus':'clock')}<div>${live}${a?`<div style="margin-top:4px"><span class="pill p-bad nodot">Atraso informado: +${a} min</span></div>`:''}</div></div>
      <div class="big-time"><div><span>Embarque (ida)</span><b>${fmt(tI)}</b><small>chega à escola ~${fmt(sI!=null?sI+a+ida.min:null)}</small></div><div><span>Desembarque (retorno)</span><b>${fmt(tV)}</b><small>saída da escola ${h(r.retornoSaida||'—')}</small></div></div>
      <dl class="kv"><dt>Ponto</dt><dd><b>${h(p?.nome||'Não definido')}</b>${p?` · <a href="${gmPoint(p)}" target="_blank" rel="noopener">ver no Google Maps</a>`:''}</dd><dt>Escola</dt><dd>${h(d.escola||r.destino?.nome||'')}</dd><dt>Aulas</dt><dd class="num">${h(d.entrada||'--:--')} às ${h(d.saida||'--:--')}</dd><dt>Ônibus</dt><dd>${b?`${plate(b.placa)} <span class="muted">${h(b.modelo||'')}</span>`:'—'}</dd></dl>
      ${avs.length?`<div><span class="muted" style="font-size:12.5px;font-weight:700">AVISOS DESTA ROTA</span><div class="feed" style="margin:6px -16px -16px;border-top:1px solid var(--line)">${avs.map(avItem).join('')}</div></div>`:''}
     </div><div class="mapholder md" style="min-height:360px" data-map="resp-${h(code)}"></div></div>
     <details style="border-top:1px solid var(--line)"><summary style="padding:12px 16px;cursor:pointer;font-weight:700">Todos os pontos e horários da rota</summary>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Ponto</th><th>Ida</th><th>Retorno</th></tr></thead><tbody>${ida.pts.filter(x=>x.tipo==='parada').map(x=>{const i=ida.pts.indexOf(x),iv=vol.pts.findIndex(y=>y.id===x.id);return `<tr class="${x.id===d.pontoId?'hl':''}"><td>${x.n}</td><td>${h(x.nome)}${x.id===d.pontoId?' <span class="pill p-yellow nodot">seu ponto</span>':''}</td><td class="mono">${sI!=null?fmt(sI+a+ida.arr[i]):'—'}</td><td class="mono">${sV!=null&&iv>=0?fmt(sV+a+vol.arr[iv]):'—'}</td></tr>`}).join('')}</tbody></table></div></details></section>`}).join('');
  return head('Área dos responsáveis','Acompanhe o ônibus do seu filho: rota, horários previstos, ponto de embarque e avisos de atraso ou alteração.')+
  `<section class="card card-b form"><form class="addcode" data-form="addCode" novalidate><label class="sr" for="resp-code">Código do aluno</label><input class="inp" id="resp-code" name="code" maxlength="6" placeholder="Ex.: K7M2QX" autocomplete="off" spellcheck="false"><button class="btn primary" type="submit">${ic('plus')}Acompanhar</button></form>
   <p class="muted" style="font-size:13.5px">O código de 6 caracteres é entregue pela escola ou pela secretaria. Ele mostra apenas o primeiro nome do aluno, a rota e o ponto de embarque. Os códigos ficam salvos neste navegador. Os avisos de atraso e alteração das rotas acompanhadas aparecem no sino e na tela enquanto o sistema estiver aberto.</p></section>
  ${cards||`<div class="card">${empty('responsaveis','Nenhum aluno acompanhado','Digite o código do aluno acima para ver a rota e os horários do ônibus.')}</div>`}`;
}

/* ---------- Avisos ---------- */
function avItem(a){const r=a.rotaId==='todas'?null:rotaById(a.rotaId);const t=TIPOS[a.tipo]||TIPOS.info;const un=(a.criadoEm||0)>S.lidoAte&&avisoRelevante(a);
  return `<div class="av ${un?'unread':''}"><span class="avi ${h(a.tipo||'info')}">${ic(t[1])}</span><span class="t">${t[0]}${a.tipo==='atraso'&&a.minutos?` · +${+a.minutos} min`:''} · ${h(r?r.nome:a.rotaId==='todas'?'Todas as rotas':'Rota removida')}${exTag(a)}</span><time>${h(quando(a.criadoEm))}</time><span class="m">${h(a.mensagem||'')}</span></div>`}
function pAvisos(){
  let list=S.avisos.slice();if(!isStaff()&&S.avMine)list=list.filter(avisoRelevante);if(S.avRota)list=list.filter(a=>a.rotaId===S.avRota);
  const form=isStaff()?`<section class="card"><div class="card-h"><h2>Novo aviso</h2></div><form class="card-b form" data-form="aviso" novalidate>
    <div class="fgrid"><div class="field"><label for="av-tipo">Tipo</label><select class="inp" id="av-tipo" name="tipo"><option value="info">Informativo</option><option value="alteracao">Alteração de rota ou horário</option><option value="atraso">Atraso</option></select></div>
    <div class="field"><label for="av-rota">Rota</label><select class="inp" id="av-rota" name="rotaId"><option value="todas">Todas as rotas</option>${S.rotas.map(r=>`<option value="${h(r.id)}">${h(r.nome)}</option>`).join('')}</select></div>
    <div class="field full"><label class="req" for="av-msg">Mensagem</label><textarea class="inp" id="av-msg" name="mensagem" maxlength="280" placeholder="Ex.: Não haverá transporte na sexta-feira (20/11), feriado da Consciência Negra."></textarea></div></div>
    <div><button class="btn primary" type="submit">${ic('avisos','sm')}Publicar aviso</button></div></form></section>`:'';
  return head('Avisos',isStaff()?'Comunicados enviados aos responsáveis. Atrasos informados em Embarque e ocorrências aparecem aqui automaticamente.':'Atrasos e alterações das rotas que você acompanha.')+
  `<div class="grid-2" style="align-items:start"><section class="card"><div class="card-h"><h2>Histórico</h2><div class="toolbar">${!isStaff()?`<div class="seg" role="group" aria-label="Filtro"><button type="button" data-act="avMine" data-id="1" aria-pressed="${S.avMine}">Minhas rotas</button><button type="button" data-act="avMine" data-id="0" aria-pressed="${!S.avMine}">Todas</button></div>`:''}
    <label class="sr" for="av-f">Filtrar por rota</label><select class="inp" id="av-f" data-chg="avRota" style="height:34px"><option value="">Todas as rotas</option>${S.rotas.map(r=>`<option value="${h(r.id)}" ${S.avRota===r.id?'selected':''}>${h(r.nome)}</option>`).join('')}</select></div></div>
   ${list.length?`<div class="feed">${list.map(a=>avItem(a).replace('</div>',isAdmin()?'':'</div>')+(isAdmin()?`<span style="grid-column:2/-1"><button class="reveal" data-act="delAviso" data-id="${h(a.id)}" style="font-size:13px">Excluir aviso</button></span></div>`:'')).join('')}</div>`:empty('avisos','Nenhum aviso',!isStaff()&&!S.codigos.length?'Acompanhe um aluno na Área dos responsáveis para receber os avisos da rota dele.':'Nada foi comunicado até agora.')}</section>
   ${form||`<section class="card card-b prose"><b>Como funcionam os avisos</b><p class="muted">O motorista ou a equipe informam atrasos e mudanças pelo sistema. Eles aparecem aqui, no sino do topo e como alerta na tela enquanto o SchoolBus estiver aberto.</p></section>`}</div>`;
}

/* ---------- Acesso ---------- */
function textoLogin(){
  if(S.backend==='firebase')return `<p>A equipe entra com e-mail e senha pelo botão <b>Entrar</b>. As contas são criadas no Firebase Authentication e o nível de cada pessoa (Administrador ou Motorista/Operador) é definido abaixo, em <b>Usuários da equipe</b>.</p>
   <p>Quem abre o site sem entrar é tratado como <b>Responsável</b>: vê rotas, horários e avisos e acompanha o aluno pelo código. As permissões são aplicadas pelas regras de segurança do Firestore, não só pela tela.</p>`;
  if(S.backend==='local')return `<p><b>Modo local.</b> Os dados ficam salvos só neste navegador, e o login usa os usuários definidos em <code>js/config.js</code>. Serve para desenvolver e testar no VS Code.</p>
   <p>Neste modo as permissões são aplicadas só pela tela, porque tudo roda no navegador. Para um site público com dados compartilhados e protegidos, configure o Firebase (veja o README).</p>`;
  return `<p>O acesso usa a conta de quem abre o link do SchoolBus. Não há senha guardada no sistema. O nível de cada pessoa vem do compartilhamento: <b>Editor</b> vira Administrador, <b>Colaborador</b> vira Motorista/Operador e <b>Leitor</b> vira Responsável. Para mudar o nível de alguém, ajuste o compartilhamento.</p>
   <p>As permissões são aplicadas pelo próprio banco de dados, não só pela tela. Um Leitor que tente ler a lista de alunos recebe uma resposta vazia.</p>`}
function secBackup(){return `<section class="card card-b" style="display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>Backup dos dados</b><p class="muted">Exporte tudo num arquivo JSON para guardar ou levar para outro computador. A importação grava os registros do arquivo por cima dos que têm o mesmo código.</p></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="exportar">${ic('down')}Exportar backup</button><label class="btn" for="imp-file" style="cursor:pointer">${ic('up')}Importar backup</label><input type="file" id="imp-file" accept="application/json,.json" class="sr" data-chg="importar"><button class="btn" data-act="iniciais">${ic('db')}Carregar dados iniciais</button></div></section>`}
function secUsuarios(){const rows=S.usuarios.map(u=>`<tr><td><b>${h(u.nome||'—')}</b><small class="mono">${h(u.id)}</small></td><td>${h(ROLE_LBL[u.papel]||u.papel)}</td><td class="acts">${u.id===S.uid?'<span class="muted">você</span>':`<button class="btn sm ghost" data-act="delUsuario" data-id="${h(u.id)}" aria-label="Remover acesso">${ic('trash','sm')}</button>`}</td></tr>`).join('');
  return `<section class="card"><div class="card-h"><h2>Usuários da equipe</h2><span class="muted">${S.usuarios.length}</span></div>
  ${rows?`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Pessoa · UID</th><th>Nível</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:''}
  <form class="card-b form" data-form="usuario" novalidate style="border-top:1px solid var(--line)"><p class="muted" style="font-size:13.5px">1. Crie a conta (e-mail e senha) no Firebase, em <b>Authentication → Users → Add user</b>. 2. Copie o <b>User UID</b> e cole abaixo com o nível de acesso.</p>
   <div class="fgrid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)"><div class="field"><label for="u-uid" class="req">User UID</label><input class="inp mono" id="u-uid" name="uid" maxlength="128"></div>
   <div class="field"><label for="u-nome" class="req">Nome</label><input class="inp" id="u-nome" name="nome" maxlength="80"></div>
   <div class="field"><label for="u-papel">Nível</label><select class="inp" id="u-papel" name="papel"><option value="operador">Motorista / Operador</option><option value="admin">Administrador</option></select></div></div>
   <div><button class="btn primary" type="submit">${ic('plus')}Dar acesso</button></div></form></section>`}
function pAcesso(){
  const L=(k,t,items)=>`<div class="card level ${S.role===k?'me-lvl':''}"><span class="pill ${S.role===k?'p-blue':'p-mute'} nodot" style="align-self:flex-start">${S.role===k?'Seu nível':t}</span><h3>${ROLE_LBL[k]}</h3><ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
  return head('Acesso e privacidade','Como funcionam o login, os níveis de acesso e a proteção dos dados pessoais dos alunos.')+
  `<section class="card card-b" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">${S.me&&S.me.avatarUrl?`<img src="${h(S.me.avatarUrl)}" alt="" class="avatar">`:`<span class="avatar">${ic('user')}</span>`}<div style="flex:1;min-width:200px"><b style="font-size:17px">${h(S.me&&S.me.name||'Visitante')}</b><p class="muted">Conectado como <b>${ROLE_LBL[S.realRole]}</b>${S.auth&&S.auth.email?' · '+h(S.auth.email):''}${S.mode==='live'?' · banco de dados ativo':' · sem banco de dados nesta visualização'}</p></div>${S.backend&&S.backend!=='claude'?(S.auth?`<button class="btn" data-act="sair">${ic('lock')}Sair</button>`:`<button class="btn primary" data-act="entrar">${ic('user')}Entrar (equipe)</button>`):''}</section>
  <div class="levels">${L('admin','Editor',['Cadastra e edita alunos, motoristas, ônibus, escolas e rotas','Vê todos os dados pessoais','Define parâmetros de cálculo','Exclui avisos e registros'])}
   ${L('operador','Colaborador',['Vê alunos da rota, com telefone do responsável','Marca embarque e desembarque','Informa atrasos e alterações','Não altera cadastros'])}
   ${L('responsavel','Leitor',['Acompanha o aluno pelo código','Vê rota, horários, pontos e ônibus','Recebe avisos da rota','Não vê dados de outros alunos'])}</div>
  <div class="grid-2 even"><section class="card card-b prose"><h2 style="font-family:var(--f-display);font-size:20px">Login e níveis</h2>
   ${textoLogin()}</section>
  <section class="card card-b prose"><h2 style="font-family:var(--f-display);font-size:20px">Proteção dos dados (LGPD)</h2><ul>
   <li>Nome completo, endereço e telefone dos alunos e responsáveis ficam numa área do banco que só a equipe lê.</li>
   <li>CNH e telefone dos motoristas também são restritos à equipe.</li>
   <li>Responsáveis veem apenas o primeiro nome e a inicial do sobrenome do aluno, pelo código que receberam.</li>
   <li>Telefones aparecem mascarados nas listas até alguém pedir para ver.</li>
   <li>O sistema não registra a localização de pessoas: a posição dos ônibus é calculada pelo horário programado.</li></ul></section></div>
  ${isAdmin()&&S.role===S.realRole&&S.backend==='firebase'?secUsuarios():''}
  ${isAdmin()&&S.role===S.realRole&&S.backend!=='claude'?secBackup():''}
  ${isAdmin()&&S.role===S.realRole?`<section class="card card-b" style="display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap"><div><b>Dados de exemplo</b><p class="muted">${hasExemplos()?'Remove os ônibus, motoristas, alunos, escolas, rotas e avisos marcados como exemplo. Seus próprios cadastros não são afetados.':'Não há dados de exemplo no sistema.'}</p></div><button class="btn danger" data-act="limparExemplos" ${hasExemplos()?'':'disabled'}>${ic('trash')}Remover dados de exemplo</button></section>`:''}`;
}

/* ================= modais e toasts ================= */
function toast(msg,kind='ok',goto){const t=document.createElement('div');t.className='toast '+kind;t.innerHTML=ic(kind==='bad'?'alert':'check')+`<span>${h(msg)}</span>`;
  if(goto){t.style.cursor='pointer';t.addEventListener('click',()=>go(goto))}$('#toasts').appendChild(t);setTimeout(()=>t.remove(),5200)}
let modalClose=null;
function modal({title,body,submit='Salvar',danger=false,wide=false,onSubmit,onOpen}){
  const root=$('#modal-root');const prev=document.activeElement;
  root.innerHTML=`<div class="modal-back"><form class="modal ${wide?'wide':''}" novalidate role="dialog" aria-modal="true" aria-labelledby="m-title"><header class="modal-h"><h2 id="m-title">${h(title)}</h2><button type="button" class="icon-btn" data-close aria-label="Fechar">${ic('x')}</button></header>
  <div class="modal-b">${body}</div><p class="form-err" id="m-err" role="alert" hidden></p><footer class="modal-f"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="submit" class="btn ${danger?'danger':'primary'}" id="m-submit">${h(submit)}</button></footer></form></div>`;
  const back=root.firstElementChild,form=back.firstElementChild;
  const close=()=>{root.innerHTML='';modalClose=null;document.removeEventListener('keydown',esc);try{prev&&prev.focus()}catch(e){}};
  const esc=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',esc);modalClose=close;
  back.addEventListener('mousedown',e=>{if(e.target===back)back._down=true});back.addEventListener('click',e=>{if(e.target===back&&back._down)close();back._down=false;if(e.target.closest('[data-close]'))close()});
  form.addEventListener('input',e=>{const t=e.target;if(t.dataset.mask==='fone')t.value=fone(t.value);if(t.dataset.mask==='placa')t.value=t.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7);if(t.dataset.mask==='cnh')t.value=t.value.replace(/\D/g,'').slice(0,11);t.removeAttribute('aria-invalid')});
  form.addEventListener('submit',async e=>{e.preventDefault();const er=$('#m-err');er.hidden=true;$$('[aria-invalid]',form).forEach(x=>x.removeAttribute('aria-invalid'));
    const btn=$('#m-submit');btn.disabled=true;
    try{const fd={};new FormData(form).forEach((v,k)=>{if(k in fd){fd[k]=[].concat(fd[k],v)}else fd[k]=v});$$('input[type=checkbox][name]',form).forEach(c=>{if(!(c.name in fd))fd[c.name]=[]});
      const r=await onSubmit(fd,form);if(r!==false)close()}
    catch(err){er.textContent=err.message||'Não foi possível concluir.';er.hidden=false;if(err.field){const f=form.querySelector(`[name="${err.field}"]`);if(f){f.setAttribute('aria-invalid','true');f.focus()}}}
    finally{if(btn.isConnected)btn.disabled=false}});
  onOpen&&onOpen(form);setTimeout(()=>{const f=form.querySelector('.modal-b input:not([type=hidden]):not([type=file]),.modal-b select,.modal-b textarea');f&&f.focus()},30);
}
function confirmar(title,text,label='Excluir'){return new Promise(res=>{let ok=false;modal({title,body:`<p>${text}</p>`,submit:label,danger:true,onSubmit:()=>{ok=true;res(true)}});
  const root=$('#modal-root');const obs=new MutationObserver(()=>{if(!root.firstElementChild){obs.disconnect();if(!ok)res(false)}});obs.observe(root,{childList:true})})}
const fld=(label,name,val,{type='text',req,hint,ph,max,cls='',attrs=''}={})=>`<div class="field ${cls}"><label for="f-${name}" class="${req?'req':''}">${label}</label><input class="inp" id="f-${name}" name="${name}" type="${type}" value="${h(val??'')}" ${ph?`placeholder="${h(ph)}"`:''} ${max?`maxlength="${max}"`:''} ${attrs}>${hint?`<span class="hint">${hint}</span>`:''}</div>`;
const selFld=(label,name,opts,val,{req,hint,cls=''}={})=>`<div class="field ${cls}"><label for="f-${name}" class="${req?'req':''}">${label}</label><select class="inp" id="f-${name}" name="${name}">${opts.map(([v,t])=>`<option value="${h(v)}" ${String(v)===String(val??'')?'selected':''}>${h(t)}</option>`).join('')}</select>${hint?`<span class="hint">${hint}</span>`:''}</div>`;
const must=(v,f,m)=>{if(!String(v||'').trim())throw new VErr(m,f);return String(v).trim()};

/* ---------- formulário: aluno ---------- */
function formAluno(id){
  const a=id?byId(S.alunos,id):{};
  const pontoOpts=(rid,reg)=>{const r=rotaById(rid);if(!r)return[['','Escolha a rota primeiro']];return[['','Selecione o ponto…'],...(r.paradas||[]).map((p,i)=>[p.id,`${i+1}. ${p.nome}${p.regiao?' · '+p.regiao:''}${reg&&p.regiao&&p.regiao.toLowerCase()===reg.toLowerCase()?' (mesmo bairro)':''}`])]};
  modal({title:id?'Editar aluno':'Cadastrar aluno',wide:true,submit:id?'Salvar alterações':'Cadastrar aluno',
    body:`<div class="fgrid">${fld('Nome completo','nome',a.nome,{req:true,max:100,cls:'full'})}
     ${fld('Endereço residencial','endereco',a.endereco,{req:true,max:140,ph:'Rua, número, complemento'})}${fld('Bairro / região','regiao',a.regiao,{req:true,max:50,hint:'Usado para organizar os alunos por região.'})}
     ${selFld('Escola onde estuda','escolaId',[['','Selecione…'],...S.escolas.map(e=>[e.id,e.nome])],a.escolaId,{req:true,cls:'full'})}
     ${fld('Horário de entrada','entrada',a.entrada||'07:00',{type:'time',req:true})}${fld('Horário de saída','saida',a.saida||'11:30',{type:'time',req:true})}
     ${selFld('Rota','rotaId',[['','Sem rota por enquanto'],...S.rotas.map(r=>[r.id,r.nome])],a.rotaId)}${selFld('Ponto de embarque','pontoId',pontoOpts(a.rotaId,a.regiao),a.pontoId)}
     ${fld('Nome do responsável','responsavel',a.responsavel,{req:true,max:100})}${fld('Telefone do responsável','telefone',fone(a.telefone),{type:'tel',req:true,ph:'(86) 99999-9999',attrs:'data-mask="fone" inputmode="tel"'})}
     ${id?`<div class="field full"><span class="flabel">Código para o responsável</span><div><span class="code" style="font-size:16px">${h(a.codigo)}</span> <button type="button" class="btn sm" data-copy="${h(a.codigo)}">${ic('copy','sm')}Copiar</button></div><span class="hint">Entregue este código ao responsável para ele acompanhar a rota na Área dos responsáveis.</span></div>`:'<p class="muted full" style="font-size:13px">Um código de acompanhamento é gerado ao salvar, para o responsável consultar a rota.</p>'}</div>`,
    onOpen:form=>{const rs=form.querySelector('[name=rotaId]'),ps=form.querySelector('[name=pontoId]'),rg=form.querySelector('[name=regiao]');
      const upd=()=>{const cur=ps.value;const o=pontoOpts(rs.value,rg.value);ps.innerHTML=o.map(([v,t])=>`<option value="${h(v)}">${h(t)}</option>`).join('');if(o.some(x=>x[0]===cur))ps.value=cur;else{const sug=(rotaById(rs.value)?.paradas||[]).find(p=>p.regiao&&rg.value&&p.regiao.toLowerCase()===rg.value.trim().toLowerCase());if(sug)ps.value=sug.id}};
      rs.addEventListener('change',upd);rg.addEventListener('change',upd);bindCopy(form)},
    onSubmit:async fd=>{
      const d={nome:must(fd.nome,'nome','Informe o nome completo do aluno.'),endereco:must(fd.endereco,'endereco','Informe o endereço residencial.'),regiao:must(fd.regiao,'regiao','Informe o bairro ou região.'),
        escolaId:must(fd.escolaId,'escolaId','Selecione a escola.'),entrada:must(fd.entrada,'entrada','Informe o horário de entrada.'),saida:must(fd.saida,'saida','Informe o horário de saída.'),
        rotaId:fd.rotaId||'',pontoId:fd.rotaId?(fd.pontoId||''):'',responsavel:must(fd.responsavel,'responsavel','Informe o nome do responsável.'),telefone:String(fd.telefone||'').replace(/\D/g,'')};
      if(d.nome.split(/\s+/).length<2)throw new VErr('Informe nome e sobrenome do aluno.','nome');
      if(d.telefone.length<10)throw new VErr('Telefone incompleto. Use DDD + número, ex.: (86) 99999-9999.','telefone');
      if(d.rotaId&&!d.pontoId)throw new VErr('Escolha o ponto de embarque na rota selecionada.','pontoId');
      if(hm(d.saida)<=hm(d.entrada))throw new VErr('O horário de saída deve ser depois da entrada.','saida');
      const aid=id||newId('alunos');let cod=a.codigo;if(!cod){const used=new Set(S.alunos.map(x=>x.codigo));do{cod=codigo()}while(used.has(cod))}
      const e=escById(d.escolaId);
      await dset('alunos/'+aid,{...d,codigo:cod,exemplo:!!a.exemplo,atualizadoEm:Date.now()});
      await dset('consulta/'+cod,{apelido:apelido(d.nome),rotaId:d.rotaId,pontoId:d.pontoId,escola:e?.nome||'',entrada:d.entrada,saida:d.saida,exemplo:!!a.exemplo});
      toast(id?'Aluno atualizado':`Aluno cadastrado · código ${cod}`)}});
}
function bindCopy(root){root.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;const v=b.dataset.copy;
  Promise.resolve().then(()=>navigator.clipboard.writeText(v)).then(()=>toast('Código copiado')).catch(()=>{const s=b.previousElementSibling;if(s){const r=document.createRange();r.selectNodeContents(s);const sl=getSelection();sl.removeAllRanges();sl.addRange(r)}toast('Selecione e copie o código','bad')})})}

/* ---------- formulário: motorista ---------- */
function formMot(id){
  const m=id?byId(S.motoristas,id):{situacao:'disponivel'};const busAtual=S.onibus.find(b=>b.motoristaId===m.id);
  const rotasDoBus=busAtual?S.rotas.filter(r=>r.onibusId===busAtual.id).map(r=>r.id):[];
  modal({title:id?'Editar motorista':'Cadastrar motorista',wide:true,submit:id?'Salvar alterações':'Cadastrar motorista',
    body:`<div class="fgrid"><div class="field full"><span class="flabel">Foto do motorista</span><div class="photo-pick"><span id="ph-prev">${m.foto?`<img class="avatar" src="${h(m.foto)}" alt="">`:`<span class="avatar">${ic('user')}</span>`}</span>
      <div><label class="btn sm" for="f-foto" style="cursor:pointer">${ic('plus','sm')}Escolher foto</label><input id="f-foto" type="file" accept="image/*" class="sr"><input type="hidden" name="foto" value="${h(m.foto||'')}">${m.foto?' <button type="button" class="btn sm ghost" id="ph-rem">Remover</button>':''}<p class="hint" style="margin-top:6px">A foto é reduzida para 192 × 192 px antes de ser salva.</p></div></div></div>
     ${fld('Nome completo','nome',m.nome,{req:true,max:100,cls:'full'})}
     ${fld('Telefone','telefone',fone(m.telefone),{type:'tel',req:true,ph:'(86) 99999-9999',attrs:'data-mask="fone" inputmode="tel"'})}${fld('Número da CNH','cnh',m.cnh,{req:true,ph:'11 dígitos',hint:'Categoria D é exigida para ônibus escolar.',attrs:'data-mask="cnh" inputmode="numeric"'})}
     ${selFld('Situação','situacao',Object.entries(SIT_MOT).map(([k,v])=>[k,v[0]]),m.situacao)}
     ${selFld('Ônibus responsável','onibusId',[['','Nenhum'],...S.onibus.map(b=>{const o=motOfBus(b);return[b.id,`${b.numero} · ${fplaca(b.placa)}${o&&o.id!==m.id?' (hoje: '+o.nome.split(' ')[0]+')':''}`]})],busAtual?.id)}
     <div class="field full"><span class="flabel">Rotas atribuídas</span><div class="checks" id="rchecks">${S.rotas.length?S.rotas.map(r=>`<label><input type="checkbox" name="rotas" value="${h(r.id)}" ${rotasDoBus.includes(r.id)?'checked':''}> <span class="swatch" style="--c:${corRota(r)}"></span>${h(r.nome)}${r.onibusId&&r.onibusId!==busAtual?.id?` <span class="muted">(hoje: ${h(busById(r.onibusId)?.numero||'')})</span>`:''}</label>`).join(''):'<span class="muted">Nenhuma rota cadastrada.</span>'}</div><span class="hint">As rotas marcadas passam a ser feitas pelo ônibus deste motorista.</span></div></div>`,
    onOpen:form=>{const fi=form.querySelector('#f-foto'),hid=form.querySelector('[name=foto]'),pv=form.querySelector('#ph-prev');
      fi.addEventListener('change',()=>{const f=fi.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=192;const s=Math.min(img.width,img.height);c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,192,192);hid.value=c.toDataURL('image/jpeg',0.82);pv.innerHTML=`<img class="avatar" src="${hid.value}" alt="">`};img.onerror=()=>toast('Não foi possível ler essa imagem. Use JPG ou PNG.','bad');img.src=rd.result};rd.readAsDataURL(f)});
      const rm=form.querySelector('#ph-rem');rm&&rm.addEventListener('click',()=>{hid.value='';pv.innerHTML=`<span class="avatar">${ic('user')}</span>`})},
    onSubmit:async fd=>{
      const d={nome:must(fd.nome,'nome','Informe o nome completo.'),telefone:String(fd.telefone||'').replace(/\D/g,''),cnh:String(fd.cnh||'').replace(/\D/g,''),situacao:fd.situacao||'disponivel',foto:fd.foto||''};
      if(d.telefone.length<10)throw new VErr('Telefone incompleto. Use DDD + número.','telefone');
      if(d.cnh.length!==11)throw new VErr('O número da CNH tem 11 dígitos.','cnh');
      if(S.motoristas.some(x=>x.cnh===d.cnh&&x.id!==id))throw new VErr('Já existe um motorista com esta CNH.','cnh');
      const rotas=[].concat(fd.rotas||[]).filter(Boolean);if(rotas.length&&!fd.onibusId)throw new VErr('Escolha o ônibus responsável para atribuir rotas.','onibusId');
      const mid=id||newId('motoristas');
      await dset('motoristas/'+mid,{...d,exemplo:!!m.exemplo});
      for(const b of S.onibus){const want=b.id===fd.onibusId;if(want&&b.motoristaId!==mid)await dset('onibus/'+b.id,{...strip(b),motoristaId:mid});else if(!want&&b.motoristaId===mid)await dset('onibus/'+b.id,{...strip(b),motoristaId:''})}
      if(fd.onibusId)for(const r of S.rotas){const want=rotas.includes(r.id);if(want&&r.onibusId!==fd.onibusId)await dset('rotas/'+r.id,{...strip(r),onibusId:fd.onibusId});else if(!want&&r.onibusId===fd.onibusId)await dset('rotas/'+r.id,{...strip(r),onibusId:''})}
      toast(id?'Motorista atualizado':'Motorista cadastrado')}});
}

/* ---------- formulário: ônibus ---------- */
function formBus(id){
  const b=id?byId(S.onibus,id):{situacao:'operacao',capacidade:44,cor:PALETTE.find(c=>!S.onibus.some(x=>x.cor===c))||PALETTE[0]};
  modal({title:id?'Editar ônibus':'Cadastrar ônibus',submit:id?'Salvar alterações':'Cadastrar ônibus',
    body:`<div class="fgrid">${fld('Número de identificação','numero',b.numero||('SB-'+pad(S.onibus.length+1)),{req:true,max:10,hint:'Aparece no mapa e no letreiro da rota.'})}${fld('Placa','placa',b.placa,{req:true,ph:'ABC1D23',attrs:'data-mask="placa" autocapitalize="characters"',hint:'Padrão Mercosul ou antigo.'})}
     ${fld('Modelo','modelo',b.modelo,{req:true,max:60,ph:'Ex.: Marcopolo Volare V8L',cls:'full'})}
     ${fld('Capacidade de passageiros','capacidade',b.capacidade,{type:'number',req:true,attrs:'min="1" max="90" inputmode="numeric"'})}${selFld('Situação do veículo','situacao',Object.entries(SIT_ON).map(([k,v])=>[k,v[0]]),b.situacao)}
     ${selFld('Motorista','motoristaId',[['','Nenhum'],...S.motoristas.map(m=>[m.id,m.nome])],b.motoristaId,{cls:'full'})}
     <div class="field full"><span class="flabel">Cor no mapa</span><div class="colors" role="radiogroup" aria-label="Cor no mapa">${PALETTE.map(c=>`<label><input type="radio" name="cor" value="${c}" ${b.cor===c?'checked':''} aria-label="Cor ${c}"><span style="--c:${c}"></span></label>`).join('')}</div></div></div>`,
    onSubmit:async fd=>{
      const d={numero:must(fd.numero,'numero','Informe o número de identificação.').toUpperCase(),placa:String(fd.placa||'').toUpperCase(),modelo:must(fd.modelo,'modelo','Informe o modelo.'),capacidade:parseInt(fd.capacidade,10),situacao:fd.situacao,motoristaId:fd.motoristaId||'',cor:fd.cor||PALETTE[0]};
      if(!/^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(d.placa))throw new VErr('Placa inválida. Use o formato ABC1D23 (Mercosul) ou ABC1234.','placa');
      if(!(d.capacidade>=1&&d.capacidade<=90))throw new VErr('Informe a capacidade entre 1 e 90 passageiros.','capacidade');
      if(S.onibus.some(x=>x.placa===d.placa&&x.id!==id))throw new VErr('Já existe um ônibus com esta placa.','placa');
      if(S.onibus.some(x=>x.numero===d.numero&&x.id!==id))throw new VErr('Já existe um ônibus com este número.','numero');
      const bid=id||newId('onibus');await dset('onibus/'+bid,{...d,exemplo:!!b.exemplo});
      if(d.motoristaId)for(const o of S.onibus)if(o.id!==bid&&o.motoristaId===d.motoristaId)await dset('onibus/'+o.id,{...strip(o),motoristaId:''});
      toast(id?'Ônibus atualizado':'Ônibus cadastrado')}});
}

/* ---------- formulário: escola ---------- */
function formEsc(id){
  const e=id?byId(S.escolas,id):{};
  modal({title:id?'Editar escola':'Cadastrar escola',submit:'Salvar',
    body:`<div class="form">${fld('Nome da escola','nome',e.nome,{req:true,max:100})}${fld('Endereço','endereco',e.endereco,{max:140})}
     ${fld('Coordenadas do portão de embarque','coord',fcoord(e),{req:true,ph:'-5.07050, -42.79050',hint:'No Google Maps, clique com o botão direito no local e copie as coordenadas.'})}</div>`,
    onSubmit:async fd=>{const nome=must(fd.nome,'nome','Informe o nome da escola.');const c=parseCoords(fd.coord);if(!c)throw new VErr('Coordenadas inválidas. Use o formato -5.07050, -42.79050.','coord');
      const eid=id||newId('escolas');await dset('escolas/'+eid,{nome,endereco:String(fd.endereco||'').trim(),lat:c.lat,lng:c.lng,exemplo:!!e.exemplo});
      for(const r of S.rotas.filter(r=>r.escolaId===eid))await dset('rotas/'+r.id,{...strip(r),destino:{nome,lat:c.lat,lng:c.lng}});
      toast('Escola salva')}});
}

/* ================= ações ================= */
const ACT={
  openNav(){$('#app').classList.add('nav-open')},closeNav(){$('#app').classList.remove('nav-open')},
  go(el){go(el.dataset.id)},
  simToggle(){S.simOpen=!S.simOpen;renderClock(true)},
  simReal(){S.sim=null;S.simOpen=false;render()},
  rolereset(){S.role=S.realRole;route()},
  selRota(el){S.selRota=S.selRota===el.dataset.id?null:el.dataset.id;S.selStop=null;render()},
  verMapa(el){S.selRota=el.dataset.id;S.selStop=null;S.hidden.delete(el.dataset.id);go('mapa')},
  novaRota(el,e){e&&e.preventDefault();if(!isAdmin())return;abrirEditor(null)},
  editRota(el){abrirEditor(el.dataset.id)},
  async delRota(el){const r=rotaById(el.dataset.id);if(!r)return;const n=alunosDaRota(r.id).length;
    if(!await confirmar('Excluir rota',`A rota <b>${h(r.nome)}</b> será excluída.${n?` ${n} aluno${n>1?'s':''} ficará${n>1?'ão':''} sem rota.`:''}`))return;
    try{await ddel('rotas/'+r.id);toast('Rota excluída')}catch(e){toast(e.message,'bad')}},
  edCancel(){S.edit=null;render()},
  edAddMode(){S.edit.mode=S.edit.mode==='add'?null:'add';render()},
  edOrigemMapa(){S.edit.mode='origem';render()},
  edGaragem(){const g=cfg().garagem;S.edit.draft.origem={nome:g.nome,lat:g.lat,lng:g.lng};render()},
  edAddCoord(){const i=$('#ed-coord');const c=parseCoords(i.value);if(!c){toast('Coordenadas inválidas. Use o formato -5.08921, -42.80193.','bad');i.focus();return}
    const d=S.edit.draft;d.paradas.push({id:'p'+Math.random().toString(36).slice(2,9),nome:'Parada '+(d.paradas.length+1),regiao:'',lat:c.lat,lng:c.lng});i.value='';render()},
  stopUp(el){const p=S.edit.draft.paradas,i=p.findIndex(x=>x.id===el.dataset.sid);if(i>0){[p[i-1],p[i]]=[p[i],p[i-1]];render()}},
  stopDown(el){const p=S.edit.draft.paradas,i=p.findIndex(x=>x.id===el.dataset.sid);if(i>=0&&i<p.length-1){[p[i+1],p[i]]=[p[i],p[i+1]];render()}},
  stopDel(el){const d=S.edit.draft;d.paradas=d.paradas.filter(x=>x.id!==el.dataset.sid);if(S.edit.mode==='move:'+el.dataset.sid)S.edit.mode='add';render()},
  stopMove(el){S.edit.mode='move:'+el.dataset.sid;render()},
  edOtimizar(){const d=S.edit.draft;if(!okc(d.origem)||!okc(d.destino)){toast('Defina a partida e a escola antes de otimizar.','bad');return}
    const antes=plano({...d,_draft:true}).km;d.paradas=otimizar(d.origem,d.paradas,d.destino);const dep=plano({...d,_draft:true}).km;
    toast(dep<antes-0.05?`Sequência otimizada: ${fkm(antes)} → ${fkm(dep)} (economia de ${fkm(antes-dep)})`:'A sequência atual já é a mais curta encontrada.');render()},
  async edSave(){const E=S.edit,d=E.draft;E.err='';
    try{if(!String(d.nome||'').trim())throw new VErr('Dê um nome à rota.');if(!d.escolaId||!escById(d.escolaId))throw new VErr('Escolha a escola de destino.');
      if(!okc(d.origem))throw new VErr('Defina o ponto de partida (garagem).');if(!d.paradas.length)throw new VErr('Adicione pelo menos uma parada clicando no mapa.');
      if(hm(d.saida)==null)throw new VErr('Informe o horário de saída da ida.');
      if(hm(d.retornoSaida)!=null&&hm(d.saida)!=null&&hm(d.retornoSaida)<=hm(d.saida))throw new VErr('O retorno deve sair depois do horário de ida.');
      d.paradas.forEach((p,i)=>{if(!String(p.nome||'').trim())p.nome='Parada '+(i+1)});
      const e=escById(d.escolaId);const rid=E.id||newId('rotas');
      if(E.id){const ids=new Set(d.paradas.map(p=>p.id));const orf=S.alunos.filter(a=>a.rotaId===E.id&&a.pontoId&&!ids.has(a.pontoId));
        if(orf.length&&!E.okOrf){E.okOrf=true;throw new VErr(`${orf.length} aluno${orf.length>1?'s usam':' usa'} uma parada que você removeu (${orf.map(a=>a.nome.split(' ')[0]).join(', ')}). Clique em Salvar de novo para confirmar; depois atualize o ponto desses alunos.`)}}
      const doc={nome:d.nome.trim(),onibusId:d.onibusId||'',escolaId:d.escolaId,origem:{nome:d.origem.nome||'Partida',lat:d.origem.lat,lng:d.origem.lng},destino:{nome:e.nome,lat:e.lat,lng:e.lng},
        paradas:d.paradas.map(p=>({id:p.id,nome:String(p.nome).trim(),regiao:String(p.regiao||'').trim(),lat:+p.lat,lng:+p.lng})),saida:d.saida||'',chegada:d.chegada||'',retornoSaida:d.retornoSaida||'',retornoChegada:d.retornoChegada||'',ativa:d.ativa!==false,exemplo:!!d.exemplo,atualizadoEm:Date.now()};
      await dset('rotas/'+rid,doc);
      if(E.id){for(const a of S.alunos.filter(a=>a.rotaId===rid&&a.codigo)){await dset('consulta/'+a.codigo,{apelido:apelido(a.nome),rotaId:rid,pontoId:a.pontoId,escola:escById(a.escolaId)?.nome||'',entrada:a.entrada,saida:a.saida,exemplo:!!a.exemplo})}}
      S.edit=null;S.selRota=rid;toast(E.id?'Rota atualizada':'Rota criada');render()}
    catch(err){E.err=err.message;render();window.scrollTo(0,0)}},
  novoAluno(){if(!S.escolas.length){toast('Cadastre uma escola antes de cadastrar alunos.','bad');return}formAluno(null)},
  editAluno(el){formAluno(el.dataset.id)},
  async delAluno(el){const a=byId(S.alunos,el.dataset.id);if(!a)return;if(!await confirmar('Excluir aluno',`Os dados de <b>${h(a.nome)}</b> serão apagados e o código ${h(a.codigo)} deixará de funcionar.`))return;
    try{await ddel('alunos/'+a.id);if(a.codigo)await ddel('consulta/'+a.codigo);toast('Aluno excluído')}catch(e){toast(e.message,'bad')}},
  reveal(el){const id=el.dataset.id;S.reveal.has(id)?S.reveal.delete(id):S.reveal.add(id);render()},
  grupo(el){S.f.grupo=el.dataset.id;render()},
  novoMot(){formMot(null)},editMot(el){formMot(el.dataset.id)},
  async delMot(el){const m=motById(el.dataset.id);if(!m)return;if(!await confirmar('Excluir motorista',`<b>${h(m.nome)}</b> será removido e deixará de ser responsável por qualquer ônibus.`))return;
    try{for(const b of S.onibus.filter(b=>b.motoristaId===m.id))await dset('onibus/'+b.id,{...strip(b),motoristaId:''});await ddel('motoristas/'+m.id);toast('Motorista excluído')}catch(e){toast(e.message,'bad')}},
  novoBus(){formBus(null)},editBus(el){formBus(el.dataset.id)},
  async delBus(el){const b=busById(el.dataset.id);if(!b)return;const rs=S.rotas.filter(r=>r.onibusId===b.id);
    if(!await confirmar('Excluir ônibus',`O ônibus <b>${h(b.numero)}</b> será excluído.${rs.length?` ${rs.length} rota${rs.length>1?'s ficarão':' ficará'} sem ônibus.`:''}`))return;
    try{for(const r of rs)await dset('rotas/'+r.id,{...strip(r),onibusId:''});await ddel('onibus/'+b.id);toast('Ônibus excluído')}catch(e){toast(e.message,'bad')}},
  novaEsc(){formEsc(null)},editEsc(el){formEsc(el.dataset.id)},
  async delEsc(el){const e=escById(el.dataset.id);if(!e)return;const n=S.rotas.filter(r=>r.escolaId===e.id).length+S.alunos.filter(a=>a.escolaId===e.id).length;
    if(n){toast('Esta escola tem rotas ou alunos vinculados. Altere-os antes de excluir.','bad');return}
    if(!await confirmar('Excluir escola',`<b>${h(e.nome)}</b> será excluída.`))return;try{await ddel('escolas/'+e.id);toast('Escola excluída')}catch(x){toast(x.message,'bad')}},
  opViagem(el){S.op.viagem=el.dataset.id;render()},
  async embarque(el){const r=rotaById(S.op.rotaId);if(!r)return;const vg=$('[data-act=opViagem][aria-pressed=true]')?.dataset.id||'ida';const pid=`${today()}_${r.id}_${vg}`;
    const cur={...(S.presencas[pid]?.marcados||{})};const id=el.dataset.id;if(cur[id])delete cur[id];else cur[id]=Date.now();
    S.presencas[pid]={...(S.presencas[pid]||{}),marcados:cur};render();
    try{await dset('presencas/'+pid,{data:today(),rotaId:r.id,viagem:vg,marcados:cur})}catch(e){toast(e.message,'bad')}},
  async atraso(el){const r=rotaById(S.op.rotaId),b=busOf(r);if(!b){toast('Esta rota não tem ônibus.','bad');return}const n=+el.dataset.id;
    try{await dset('status/'+b.id,{atrasoMin:n,data:today(),rotaId:r.id,atualizadoEm:Date.now(),autorId:S.uid||''});
      await novoAviso({tipo:'atraso',rotaId:r.id,minutos:n,mensagem:S.opMsg.trim()||`O ônibus ${b.numero} está com cerca de ${n} minutos de atraso.`});S.opMsg='';toast(`Atraso de ${n} min informado aos responsáveis`);render()}catch(e){toast(e.message,'bad')}},
  async normalizar(){const r=rotaById(S.op.rotaId),b=busOf(r);if(!b)return;
    try{await dset('status/'+b.id,{atrasoMin:0,data:today(),rotaId:r.id,atualizadoEm:Date.now(),autorId:S.uid||''});await novoAviso({tipo:'info',rotaId:r.id,mensagem:`A rota voltou ao horário normal.`});toast('Rota normalizada');render()}catch(e){toast(e.message,'bad')}},
  async alteracao(){const r=rotaById(S.op.rotaId);const m=S.opMsg.trim();if(!m){toast('Escreva a mensagem da alteração.','bad');$('#op-msg')?.focus();return}
    try{await novoAviso({tipo:'alteracao',rotaId:r.id,mensagem:m});S.opMsg='';toast('Aviso de alteração enviado');render()}catch(e){toast(e.message,'bad')}},
  async delAviso(el){if(!await confirmar('Excluir aviso','O aviso deixará de aparecer para os responsáveis.'))return;try{await ddel('avisos/'+el.dataset.id);toast('Aviso excluído')}catch(e){toast(e.message,'bad')}},
  avMine(el){S.avMine=el.dataset.id==='1';render()},
  remCode(el){S.codigos=S.codigos.filter(c=>c!==el.dataset.id);ls.set('sb_codigos',S.codigos);delete S.consulta[el.dataset.id];delete MAPS['resp-'+el.dataset.id];render()},
  retryCode(el){carregarCodigo(el.dataset.id)},
  entrar(){abrirLogin()},
  async sair(){try{if(S.backend==='firebase'&&fbAuth)await fbAuth.signOut();else sessionStorage.setItem('sb_sessao',JSON.stringify({visitante:true}))}catch(e){}location.hash='';location.reload()},
  async exportar(){try{const out={};for(const c of COLECOES){out[c]={};try{const sn=await db.collection(c).get();sn.docs.forEach(d=>{out[c][d.id]=d.data()})}catch(e){}}
    baixarArquivo(`schoolbus-backup-${today()}.json`,JSON.stringify(out,null,2));toast('Backup exportado')}catch(e){toast('Não foi possível exportar o backup.','bad')}},
  async iniciais(){if(!window.SCHOOLBUS_DADOS_INICIAIS){toast('Arquivo js/dados-iniciais.js não encontrado.','bad');return}
    if(!await confirmar('Carregar dados iniciais','Os registros de <code>js/dados-iniciais.js</code> serão gravados no banco. Registros com o mesmo código serão substituídos; os demais continuam.','Carregar'))return;
    await importarDados(window.SCHOOLBUS_DADOS_INICIAIS)},
  async delUsuario(el){if(!await confirmar('Remover acesso','Esta pessoa continuará podendo entrar, mas como Responsável, sem acesso aos cadastros.','Remover acesso'))return;
    try{await ddel('usuarios/'+el.dataset.id);toast('Acesso removido')}catch(e){toast(e.message,'bad')}},
  async limparExemplos(){if(!await confirmar('Remover dados de exemplo','Todos os registros marcados como exemplo serão apagados do banco de dados. Seus cadastros não serão afetados.','Remover exemplos'))return;
    try{let n=0;for(const a of S.alunos.filter(x=>x.exemplo)){await ddel('alunos/'+a.id);if(a.codigo)await ddel('consulta/'+a.codigo);n++}
      for(const [col,arr] of [['avisos',S.avisos],['rotas',S.rotas],['motoristas',S.motoristas],['onibus',S.onibus],['escolas',S.escolas]])for(const x of arr.filter(x=>x.exemplo)){await ddel(col+'/'+x.id);n++}
      toast(`${n} registros de exemplo removidos`)}catch(e){toast(e.message,'bad')}}
};
async function novoAviso(a){needDb();const id=newId('avisos');await dset('avisos/'+id,{...a,criadoEm:Date.now(),data:today(),autorId:S.uid||''})}
async function carregarCodigo(code){S.consulta[code]={st:'loading'};schedule();
  if(!db){S.consulta[code]={st:'err'};schedule();return}
  try{const s=await db.doc('consulta/'+code).get();S.consulta[code]=s.exists?{st:'ok',data:s.data()}:{st:'notfound'}}catch(e){S.consulta[code]={st:'err'}}schedule()}

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;if(t.closest('#modal-root'))return;
  const fn=ACT[t.dataset.act];if(!fn)return;if(t.tagName==='A'&&t.dataset.act==='novaRota')e.preventDefault();fn(t,e)});
document.addEventListener('click',e=>{if(S.simOpen&&e.target.isConnected&&!e.target.closest('#clockwrap')){S.simOpen=false;renderChrome()}});
document.addEventListener('input',e=>{const t=e.target;
  if(t.id==='simrange'){S.sim=+t.value;const v=$('#simval');if(v)v.textContent=fmt(S.sim);const ch=$('#clockwrap .chip');if(ch){ch.classList.add('sim');ch.querySelector('.mono').textContent=fmt(S.sim);ch.querySelector('.lbl').textContent='Simulação'}clearTimeout(t._tm);t._tm=setTimeout(render,50);return}
  if(t.dataset.bind){if(t.dataset.bind==='opMsg'){S.opMsg=t.value;return}S.f[t.dataset.bind]=t.value;if(t.tagName==='INPUT'){clearTimeout(t._tm);t._tm=setTimeout(render,120)}return}
  if(t.dataset.ed&&S.edit){const k=t.dataset.ed;let v=t.value;if(k==='ativa')v=v==='1';if(k.includes('.')){const[a,b]=k.split('.');S.edit.draft[a]={...S.edit.draft[a],[b]:v}}else S.edit.draft[k]=v;if(k==='escolaId'){const es=escById(v);S.edit.draft.destino=es?{nome:es.nome,lat:es.lat,lng:es.lng}:{nome:'',lat:null,lng:null}}return}
  if(t.dataset.sf&&S.edit){const p=S.edit.draft.paradas.find(x=>x.id===t.dataset.sid);if(p)p[t.dataset.sf]=t.value}});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.ed&&t.hasAttribute('data-rerender')){if(t.dataset.ed==='escolaId'){const es=escById(t.value);S.edit.draft.escolaId=t.value;S.edit.draft.destino=es?{nome:es.nome,lat:es.lat,lng:es.lng}:{nome:'',lat:null,lng:null}}else if(t.dataset.ed==='ativa')S.edit.draft.ativa=t.value==='1';else S.edit.draft[t.dataset.ed]=t.value;render();return}
  if(t.dataset.bind&&t.tagName==='SELECT'){S.f[t.dataset.bind]=t.value;render();return}
  const c=t.dataset.chg;if(!c)return;
  if(c==='vis'){t.checked?S.hidden.delete(t.dataset.id):S.hidden.add(t.dataset.id);render()}
  if(c==='role'){S.role=t.value;S.edit=null;route()}
  if(c==='opRota'){S.op.rotaId=t.value;S.op.viagem=null;render()}
  if(c==='avRota'){S.avRota=t.value;render()}
  if(c==='importar'){const f=t.files&&t.files[0];t.value='';if(!f)return;const rd=new FileReader();rd.onload=async()=>{let obj;try{obj=JSON.parse(rd.result)}catch(x){toast('Esse arquivo não é um backup válido do SchoolBus.','bad');return}
    if(!await confirmar('Importar backup',`Os registros de <b>${h(f.name)}</b> serão gravados no banco. Registros com o mesmo código serão substituídos.`,'Importar'))return;await importarDados(obj)};rd.readAsText(f)}});
document.addEventListener('submit',async e=>{const f=e.target;if(f.closest('#modal-root'))return;e.preventDefault();
  if(f.dataset.form==='addCode'){const v=String(new FormData(f).get('code')||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
    if(v.length!==6){toast('O código tem 6 letras e números.','bad');return}if(!S.codigos.includes(v)){S.codigos.push(v);ls.set('sb_codigos',S.codigos)}f.reset();await carregarCodigo(v)}
  if(f.dataset.form==='aviso'){const fd=new FormData(f);const m=String(fd.get('mensagem')||'').trim();if(!m){toast('Escreva a mensagem do aviso.','bad');return}
    try{await novoAviso({tipo:fd.get('tipo'),rotaId:fd.get('rotaId'),mensagem:m});f.reset();toast('Aviso publicado')}catch(x){toast(x.message,'bad')}}
  if(f.dataset.form==='usuario'){const fd=new FormData(f);const uid=String(fd.get('uid')||'').trim(),nome=String(fd.get('nome')||'').trim(),papel=fd.get('papel');
    if(!/^[A-Za-z0-9]{10,128}$/.test(uid)){toast('Cole o User UID exatamente como aparece no Firebase.','bad');return}if(!nome){toast('Informe o nome da pessoa.','bad');return}
    try{await dset('usuarios/'+uid,{nome,papel});f.reset();toast(`${nome} agora é ${ROLE_LBL[papel]}`)}catch(x){toast(x.message,'bad')}}
  if(f.id==='cfgform'){const fd=new FormData(f);const g=parseCoords(fd.get('gcoord'));const vel=+fd.get('velocidade'),fat=+fd.get('fator'),par=+fd.get('parada');
    if(!(vel>=5&&vel<=80)){toast('Velocidade média entre 5 e 80 km/h.','bad');return}if(!(fat>=1&&fat<=2.5)){toast('Fator de via entre 1 e 2,5.','bad');return}if(!(par>=0&&par<=10)){toast('Tempo por parada entre 0 e 10 min.','bad');return}if(!g){toast('Coordenadas da garagem inválidas.','bad');return}
    try{await dset('config/geral',{velocidade:vel,fator:fat,parada:par,garagem:{nome:String(fd.get('gnome')||'Garagem').trim(),lat:g.lat,lng:g.lng}});toast('Parâmetros salvos. Distâncias e horários foram recalculados.')}catch(x){toast(x.message,'bad')}}});

/* ================= login e inicialização ================= */
function baixarArquivo(nome,txt){const b=new Blob([txt],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=nome;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}
async function importarDados(obj){
  if(!obj||typeof obj!=='object'){toast('Backup inválido.','bad');return}
  let n=0,falhas=0;
  for(const c of COLECOES){const docs=obj[c];if(!docs||typeof docs!=='object')continue;
    for(const [id,corpo] of Object.entries(docs)){if(!corpo||typeof corpo!=='object')continue;try{await dset(c+'/'+id,corpo);n++}catch(e){falhas++}}}
  toast(falhas?`${n} registros importados · ${falhas} não puderam ser gravados`:`${n} registros importados`,falhas?'bad':'ok');
}
function abrirLogin(){
  const local=S.backend==='local';
  const dica=local&&Array.isArray(CONF.usuariosLocais)&&CONF.mostrarUsuariosDeTeste!==false?`<div class="banner info" style="margin-top:4px">${ic('info')}<div><b>Usuários de teste (modo local)</b>${CONF.usuariosLocais.map(u=>`<span class="mono" style="display:block;font-size:13px">${h(u.usuario)} / ${h(u.senha)} → ${h(ROLE_LBL[u.papel]||u.papel)}</span>`).join('')}</div></div>`:'';
  modal({title:'Entrar no SchoolBus',submit:'Entrar',
    body:`<div class="form"><p class="muted">Acesso da equipe (administração e motoristas). Responsáveis não precisam entrar: basta usar o código do aluno na Área dos responsáveis.</p>
     ${fld(local?'Usuário':'E-mail','usuario','',{req:true,type:local?'text':'email',attrs:'autocomplete="username"'})}
     ${fld('Senha','senha','',{req:true,type:'password',attrs:'autocomplete="current-password"'})}${dica}</div>`,
    onSubmit:async fd=>{const u=String(fd.usuario||'').trim(),p=String(fd.senha||'');
      if(!u)throw new VErr(local?'Informe o usuário.':'Informe o e-mail.','usuario');if(!p)throw new VErr('Informe a senha.','senha');
      if(local){const ok=(CONF.usuariosLocais||[]).find(x=>x.usuario===u&&x.senha===p);if(!ok)throw new VErr('Usuário ou senha incorretos.','senha');
        sessionStorage.setItem('sb_sessao',JSON.stringify({papel:ok.papel,nome:ok.nome||ok.usuario,usuario:ok.usuario}));location.hash='';location.reload();return}
      try{await fbAuth.signInWithEmailAndPassword(u,p)}catch(e){const c=e&&e.code||'';
        throw new VErr(/wrong-password|invalid-credential|user-not-found|invalid-login/.test(c)?'E-mail ou senha incorretos.':c.includes('too-many-requests')?'Muitas tentativas. Aguarde alguns minutos.':c.includes('network')?'Sem conexão com a internet.':'Não foi possível entrar ('+c+').','senha')}
      location.hash='';location.reload()}});
}
function carregarScript(src){return new Promise((ok,falha)=>{const el=document.createElement('script');el.src=src;el.onload=ok;el.onerror=()=>falha(new Error('Falha ao carregar '+src));document.head.appendChild(el)})}
function iniciarComBanco(){S.role=S.realRole;S.mode='live';startSubs();S.codigos.forEach(c=>carregarCodigo(c));route()}
function iniciarLocal(){
  db=window.BancoLocal;S.backend='local';
  let ses=null;try{ses=JSON.parse(sessionStorage.getItem('sb_sessao')||'null')}catch(e){}
  // Sem login feito: abre como Administrador (igual ao protótipo), a menos que config.js diga o contrário
  if(!ses&&CONF.modoLocalComoAdmin!==false)ses={papel:'admin',nome:'Administrador',usuario:'admin'};
  if(ses&&ses.visitante)ses=null;
  const valido=ses&&['admin','operador','responsavel'].includes(ses.papel);
  S.auth=valido?{email:ses.usuario||''}:null;S.realRole=valido?ses.papel:'responsavel';S.uid=valido?'local-'+(ses.usuario||ses.papel):null;
  S.me={name:valido?ses.nome:'Visitante',avatarUrl:''};
  iniciarComBanco();
}
async function iniciarFirebase(){
  const v=CONF.versaoFirebase||'10.12.5';
  for(const m of ['app','auth','firestore'])await carregarScript(`https://www.gstatic.com/firebasejs/${v}/firebase-${m}-compat.js`);
  firebase.initializeApp(CONF.firebase);fbAuth=firebase.auth();db=firebase.firestore();S.backend='firebase';
  const user=await new Promise(r=>{const un=fbAuth.onAuthStateChanged(u=>{un();r(u)})});
  S.realRole='responsavel';S.me={name:'Visitante',avatarUrl:''};
  if(user){S.auth={uid:user.uid,email:user.email};S.uid=user.uid;S.me={name:user.email||'Equipe',avatarUrl:''};
    try{const p=await db.doc('usuarios/'+user.uid).get();if(p.exists){const d=p.data();if(['admin','operador'].includes(d.papel))S.realRole=d.papel;if(d.nome)S.me.name=d.nome}
      else setTimeout(()=>toast('Sua conta ainda não tem nível de acesso. Peça a um administrador para liberar.','bad'),800)}catch(e){}}
  if(S.realRole==='admin')db.collection('usuarios').onSnapshot(sn=>{S.usuarios=sn.docs.map(d=>({id:d.id,...d.data()}));schedule()},()=>{});
  iniciarComBanco();
}
async function iniciarClaude(){
  S.backend='claude';
  const use=n=>window.claude.use(n).catch(()=>null);
  const [d,u]=await Promise.all([use('db'),use('user')]);db=d;userCap=u;
  if(u){try{S.me=await u.me();S.uid=S.me.id;const ce=await u.canEdit();const w=await u.can('data.write');S.realRole=ce?'admin':w===true?'operador':'responsavel';
    if(!ce&&w===null&&d){try{const t=await d.collection('alunos').limit(1).get();if(t.size)S.realRole='operador'}catch(e){}}}catch(e){}}
  if(d)iniciarComBanco();else{S.role=S.realRole;S.mode='offline';S.codigos.forEach(c=>{S.consulta[c]={st:'err'}});route()}
}
async function boot(){
  render();
  if(window.claude&&typeof window.claude.use==='function')return iniciarClaude();
  if(CONF.firebase&&CONF.firebase.apiKey){
    try{return await iniciarFirebase()}
    catch(e){console.error(e);db=null;setTimeout(()=>toast('Não foi possível conectar ao Firebase. Usando o banco local deste navegador.','bad'),600)}}
  if(window.BancoLocal)return iniciarLocal();
  S.mode='offline';route();
}
setInterval(()=>{if(['painel','mapa','responsaveis','operacao'].includes(S.page)||(S.page==='rotas'&&!S.edit)){const a=document.activeElement;if(a&&a.tagName==='TEXTAREA')return;render()}else renderChrome()},15000);
boot();