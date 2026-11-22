const repo = 'https://github.com/Tally-DE/a-place-in-grime';
const agentLink = 'https://raw.githubusercontent.com/Tally-DE/a-place-in-grime/main/research/AGENT-LINK.md';
const places = new Map(catalogue.places.map(p => [p.id, p]));
const artists = new Map(catalogue.artists.map(a => [a.id, a]));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const link = (path, label) => `<a href="${esc(path)}">${esc(label)}</a>`;
const artistURL = a => '/artists/' + encodeURIComponent(a.id);
const placeURL = p => '/places/' + encodeURIComponent(p.id);
const linkArtist = a => link(artistURL(a),a.name);
const linkPlace = p => link(placeURL(p),p.name);
const normal = s => s.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const rows = items => `<ul class="rows">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const heading = (title,body='') => `<header class="heading"><h1>${esc(title)}</h1>${body ? `<p class="lede">${esc(body)}</p>` : ''}</header>`;
function render(title,content,status=200,home=false) {
  const head=`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · A Place In Grime</title><meta name="description" content="A community catalogue of UK grime artists, their aliases, and the places they are connected to."><link rel="stylesheet" href="/site.css"><script src="/site.js" defer></script></head>`;
  const mast=`<a class="skip" href="#content">Skip to content</a><header class="mast"><a href="/" aria-label="A Place In Grime homepage"><img src="/assets/cassette.png" alt="A Place In Grime"></a><nav class="nav" aria-label="Main">${link('/artists','Artists')}${link('/places','Places')}${link('/contribute','Contribute')}</nav></header>`;
  const foot=`<footer><span>A Place In Grime</span><nav aria-label="Project">${link('/about','About')}${link('/agents','Agent research')}${link('/contributors','Contributors')}${link('/support','Support')}${link(repo,'GitHub')}</nav></footer>`;
  return new Response(head+'<body>'+mast+`<main id="content" class="${home?'home':'inside'}">`+content+'</main>'+foot+'</body></html>',{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'same-origin','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'"}});
}
function searchBox(query='') {
  return `<form action="/search" class="search" role="search"><i class="glass" aria-hidden="true"></i><input aria-label="Search artists, aliases or places" name="q" type="search" value="${esc(query)}" placeholder="Search artists, aliases or places" maxlength="160"><button>Search</button></form>`;
}
function home() {
  const fig=`<figure><div class="frame"><img id="photo" src="/assets/trim-flowdan.jpg" alt="Two MCs holding microphones at the front of the stage."></div><figcaption><div aria-live="polite"><div id="caption" class="photo-title">Trim &amp; Flowdan, 2005</div><div class="credit">Photo by <a id="source" href="https://www.flickr.com/photos/believekevin/34882249/">kevin</a> · ${link('https://creativecommons.org/licenses/by-sa/2.0/','CC BY-SA 2.0')} · cropped</div></div><button id="next" class="photo-switch" type="button">Change photo</button></figcaption></figure>`;
  return render('UK grime artist catalogue',`<div class="spread">${fig}<section class="index"><p class="intro">A catalogue of UK grime artists.</p><h1>Find an artist.</h1>${searchBox()}<h2>Browse by city or town</h2>${rows(catalogue.places.map(linkPlace))}<a class="suggest" href="/suggest">Suggest an artist</a></section></div>`,200,true);
}
function artistRows(list) {
  return rows(list.map(a=>linkArtist(a)+`<small>${a.placeIds.map(id=>places.get(id)).map(p=>esc(p.name)).join(', ')}</small>`));
}
function directory() {
  return render('Artists',heading('Artists','Find a stage name, a former alias or a place.')+searchBox()+artistRows(catalogue.artists));
}
function search(url) {
  const q=(url.searchParams.get('q')||'').trim().slice(0,160), key=normal(q);
  const foundPlaces=key?catalogue.places.filter(p=>normal(p.name).includes(key)):[];
  const matches=new Set(foundPlaces.map(p=>p.id));
  const foundArtists=key?catalogue.artists.filter(a=>[a.name,...a.aliases].some(n=>normal(n).includes(key))||a.placeIds.some(id=>matches.has(id))):[];
  let result='';
  if(q) {
    if(foundArtists.length)result+='<h2>Artists</h2>'+artistRows(foundArtists);
    if(foundPlaces.length)result+='<h2>Places</h2>'+rows(foundPlaces.map(linkPlace));
    if(!foundArtists.length&&!foundPlaces.length)result+=`<p class="empty">No catalogue matches for “${esc(q)}”. A remembered name is enough to start a research lead.</p>`;
    result+=link('/suggest?name='+encodeURIComponent(q),'Suggest an artist');
  }
  return render('Search',heading('Search the catalogue')+searchBox(q)+result);
}
function placePage(p) {
  const local=catalogue.artists.filter(a=>a.placeIds.includes(p.id));
  return render(p.name,`<nav class="crumb" aria-label="Place index">${link('/places','Cities and towns')}</nav>`+heading(p.name)+'<h2>Artists</h2>'+(local.length?artistRows(local):'<p class="empty">Help document the first artist connected to this place.</p>')+link('/suggest?place='+encodeURIComponent(p.name),'Suggest an artist'));
}
function artistPage(a) {
  const sources = new Map();
  for (const claim of a.claims) {
    if (!sources.has(claim.url)) sources.set(claim.url, []);
    sources.get(claim.url).push(claim);
  }
  const evidence = [...sources.values()].map(group => {
    const first = group[0];
    const entries = group.map(c => {
      const query = '?' + new URLSearchParams({artist:a.id, claim:c.id});
      return `<div class="evidence-item" id="${esc(c.id)}"><p>${esc(c.text)}</p><p class="source-note">${esc(c.locator)} Checked ${esc(c.checked)}.</p><div class="actions">${link('/verify'+query,'Verify')}${link('/correct'+query,'Suggest a correction')}</div></div>`;
    }).join('');
    return `<div class="source-entry"><strong>${link(first.url,first.source)}</strong><span class="source-publisher">${esc(first.publisher)}</span>${entries}</div>`;
  }).join('');
  const p = a.photo;
  const portrait = p ? `<figure class="artist-photo"><img src="${esc(p.path)}" alt="${esc(p.alt)}"><figcaption>${link(p.source,p.credit)} · ${link(p.licenceUrl,p.licence)}. ${esc(p.changes)}${p.originalSource?' '+link(p.originalSource,'Original interview'):''}</figcaption></figure>` : '';
  const socials = (a.socials || []).map(s => link(s.url,s.label)).join('');
  const unlinked = new Set((a.connections || []).map(c => artists.get(c.id)));
  const paragraphs = a.bio.map(({text}) => {
    const mentions = [];
    for (const person of unlinked) {
      const start = text.indexOf(person.name);
      if (start >= 0) mentions.push({start, person});
    }
    let html = '', offset = 0;
    for (const {start, person} of mentions.sort((m,n) => m.start-n.start)) {
      if (start < offset) continue;
      html += esc(text.slice(offset,start)) + linkArtist(person);
      offset = start + person.name.length;
      unlinked.delete(person);
    }
    return '<p>' + html + esc(text.slice(offset)) + '</p>';
  }).join('');
  const aliases = a.aliases.filter(name => !a.bio.some(b => b.text.includes(name)));
  const correction = link('/correct?artist='+encodeURIComponent(a.id),'Add information or suggest a correction');
  return render(a.name,`<article class="artist"><nav class="crumb" aria-label="Breadcrumb">${link('/artists','Artists')} / ${a.placeIds.map(id=>linkPlace(places.get(id))).join(', ')}</nav><h1>${esc(a.name)}</h1><div class="artist-layout${p?' with-photo':''}"><div class="biography">${paragraphs}${aliases.length?`<p class="artist-meta">Also known as ${aliases.map(esc).join(', ')}.</p>`:''}${socials?`<nav class="artist-links" aria-label="Official artist links">${socials}</nav>`:''}</div>${portrait}</div><details class="sources"><summary>Sources (${sources.size})</summary>${evidence}</details><p class="profile-contribute">${correction}</p></article>`);
}
const formNames={suggest:'Suggest an artist',verify:'Verify a source',correct:'Suggest a correction',private:'Private request',packet:'Submit research'};
function formPage(type,url,message='',values={},status=200) {
  const a=artists.get(url.searchParams.get('artist')||values.artist);
  const claim=a?.claims.find(c=>c.id===(url.searchParams.get('claim')||values.claim));
  const generalCorrection = type==='correct' && a && !url.searchParams.get('claim') && !values.claim;
  if(['verify','correct'].includes(type)&&!claim&&!generalCorrection)return render('Choose a fact',heading('Choose a fact','Open an artist profile and choose the statement you want to check.')+link('/artists','Browse artists'),400);
  const field=(label,name,required=false,multi=false,initial='')=>`<label>${esc(label)}${multi?`<textarea name="${name}" maxlength="${type==='packet'?45000:4000}" ${required?'required':''}>${esc(values[name]??initial)}</textarea>`:`<input name="${name}" maxlength="240" value="${esc(values[name]??initial)}" ${required?'required':''}>`}</label>`;
  const token=values.token||crypto.randomUUID();
  let inputs='';
  if(type==='suggest')inputs=field('Artist name or alias','name',true,false,url.searchParams.get('name')||'')+field('City or town (optional)','place',false,false,url.searchParams.get('place')||'')+field('What do you remember? (optional)','note',false,true);
  if(type==='verify')inputs='<label>What did the source show?<select required name="verdict"><option value="">Choose a finding</option>'+['Supports the statement','Partly supports it','Contradicts it','Source unavailable'].map(v=>`<option ${values.verdict===v?'selected':''}>${v}</option>`).join('')+'</select></label>'+field('Where did you check?','note',true,true);
  if(type==='correct')inputs=field('What should change, and how do you know?','note',true,true);
  if(type==='private')inputs=field('What would you like the editor to review?','note',true,true);
  if(type==='packet')inputs=field('Completed evidence packet (JSON)','note',true,true);
  if(['suggest','correct','verify'].includes(type))inputs+=field('Source or collection reference (optional)','source');
  if(type!=='private')inputs+=field('Public credit name (optional)','credit');
  const version=values.version|| (claim?JSON.stringify([claim.id,claim.text,claim.url,claim.locator,claim.checked]):'');
  const context=claim?`<article class="context"><strong>${esc(a.name)}</strong><p>${esc(claim.text)}</p>${link(claim.url,claim.publisher+' · '+claim.source)}<p>${esc(claim.locator)}</p></article>`:generalCorrection?`<p>${linkArtist(a)}</p>`:'';
  const descriptions={suggest:'A stage name is enough. Add a place or a source if you remember one.',private:'Use this for sensitive corrections, removal requests or information you want the editor to handle privately.',packet:'Use this private inbox if your agent has prepared a packet and cannot open a pull request.'};
  return render(formNames[type],heading(formNames[type],descriptions[type]||'')+context+(message?`<p role="alert" class="notice">${esc(message)}</p>`:'')+`<form class="editor" method="post" action="/${type}"><input type="hidden" name="token" value="${esc(token)}"><input type="hidden" name="artist" value="${esc(a?.id)}"><input type="hidden" name="claim" value="${esc(claim?.id)}"><input type="hidden" name="version" value="${esc(version)}">${inputs}<p class="hint">Your submission goes privately to the editor. Save the receipt link after sending.</p><button class="primary">Send for review</button></form>`,status);
}
const routeGroups = [
  ['/suggest','Suggest an artist','Start with a stage name, however small the paper trail.'],
  ['/artists','Check a source or correct a fact','Choose a statement on an artist page and tell us what you found.'],
  ['/agents','Research with an agent','Give a research assistant one link and as much time as you choose.'],
  ['/private','Contact the editor privately','Send sensitive corrections or ask for material to be removed.'],
  ['/support','Support the project','Help fund research time and compute.']
];
function contribute() {
  return render('Contribute',heading('Contribute','If you remember a name, a crew or a night, you can help fill a gap.')+rows(routeGroups.map(([path,label,desc])=>link(path,label)+`<p>${esc(desc)}</p>`)));
}
function agentPage() {
  return render('Research with an agent',heading('Research with an agent','Choose a place and give your agent one task or a time limit. The project supplies the research rules.')+`<div class="prose"><h2>First time using an agent?</h2><p>Open ${link('https://developers.openai.com/codex/quickstart/','Codex')} or ${link('https://code.claude.com/docs/en/quickstart','Claude Code')} and follow its sign-in and setup guide. Check what your existing plan includes before subscribing. For research, choose a session that can read public web pages and files. Connect your own GitHub account if you want it to claim a question and send a pull request.</p><h2>Give your agent a brief</h2><form id="brief-form" action="/brief.txt"><label>Where would you like to research?<input name="place" maxlength="100" placeholder="Any UK region, city, town or local area"></label><label>Time to give<select name="duration"><option>One task</option><option>30 minutes</option><option>2 hours</option><option>4 hours</option><option>8 hours</option></select></label><button class="primary">Open my brief</button></form><p>Paste the brief into your agent. Choose any UK area, including one missing from the catalogue. Your agent checks for existing work, opens a question if needed and saves its findings for the next session. If your agent can open links, you can give it the ${link(agentLink,'public agent guide')} directly with your place and time limit.</p><h2>Follow the work</h2><p>${link(repo+'/issues?q=is%3Aissue+is%3Aopen','Available research questions')} · ${link(repo+'/pulls','Submitted findings')} · ${link('/packet','Send a completed packet privately')}</p></div>`);
}
function about(env,path) {
  if(path==='/contributors'){
    const counts=new Map();
    for(const a of artists.values())for(const c of a.claims)for(const person of new Set(c.credits||[]))counts.set(person,(counts.get(person)||0)+1);
    return render('Contributors',heading('Contributors','Public credit is optional. This list counts accepted source checks credited to each contributor.')+(counts.size?rows([...counts].sort((a,b)=>b[1]-a[1]).map(([name,n])=>`${esc(name)}<small>${n} accepted</small>`)):'<p class="empty">No public contributor credits have been recorded yet.</p>')+link('/contribute','Ways to contribute'));
  }
  if(path==='/support'){
    let donation;try{const u=new URL(env.DONATION_URL);if(u.protocol==='https:')donation=u.href;}catch{}
    return render('Support',heading('Support the catalogue','Private donations can help pay for research compute and the editor’s time.')+`<div class="prose"><p>${donation?link(donation,'Make a private donation'):'A donation link has yet to be set up.'}</p><p>You can already ${link('/suggest','suggest an artist')}, ${link('/artists','check a source')} or ${link('/agents','give research time')}.</p></div>`);
  }
  return render('About',heading('A Place In Grime','A catalogue of the people who have made UK grime, from one appearance on a local set to a lifetime on the mic.')+`<div class="prose"><h2>What earns a profile?</h2><p>An original credit, first-hand account or contemporary listing can establish a narrow fact. Each profile shows the supporting source and where to look. A place might be someone’s hometown, a base or a documented scene connection. The wording on the profile explains which.</p><h2>From a lead to a record</h2><p>Community suggestions and agent submissions enter review. An editor checks each new claim before it reaches the catalogue. You can verify individual statements, submit a correction or ${link('/private','send a private request')}.</p><p>${link(repo+'/blob/main/research/METHOD.md','Read the research rules')} · ${link('/photos.txt','Photograph credits')}</p></div>`);
}
const receiptID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function intake(request,env,type,url) {
  if(request.headers.get('origin') && request.headers.get('origin')!==url.origin) return render('Request denied',heading('Open the form on this site.'),403);
  if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return new Response('Expected a web form.',{status:415});
  const reader=request.body?.getReader();let text='',size=0;
  if(!reader)return new Response('Missing form',{status:400});
  const decoder=new TextDecoder();
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>200000){await reader.cancel();return new Response('Form too large',{status:413});}text+=decoder.decode(value,{stream:true});}
  const params=new URLSearchParams(text+decoder.decode()),v={};
  for(const key of ['token','version','artist','claim','name','place','source','note','credit','verdict'])v[key]=(params.get(key)||'').trim();
  const invalid=message=>formPage(type,url,message,v,400);
  if(!receiptID.test(v.token))return render('Form expired',heading('Reopen the form and try again.'),400);
  if(v.note.length>(type==='packet'?45000:4000)||[v.artist,v.claim,v.name,v.place,v.source,v.credit,v.verdict].some(s=>s.length>240)||v.version.length>4000)return invalid('One of the entries is too long.');
  if(type==='suggest'&&!v.name)return invalid('Enter the stage name or alias you remember.');
  if(type!=='suggest'&&!v.note)return invalid('Add the details you want the editor to check.');
  if(type==='verify'&&!['Supports the statement','Partly supports it','Contradicts it','Source unavailable'].includes(v.verdict))return invalid('Choose what the source showed.');
  if(type==='verify'||(type==='correct'&&(v.claim||v.version||!artists.has(v.artist)))){
    const fact=artists.get(v.artist)?.claims.find(c=>c.id===v.claim);
    if(!fact)return invalid('Choose an existing statement on an artist page.');
    if(v.version!==JSON.stringify([fact.id,fact.text,fact.url,fact.locator,fact.checked]))return render('Statement updated',heading('This statement has changed','Please read the current version before sending your check.')+link('/artists/'+v.artist+'#'+v.claim,'Read the statement'),409);
  }
  if(type==='packet'){
    try{const packet=JSON.parse(v.note);if(packet.version!==2||!packet.task_id||!packet.artist?.name||!Array.isArray(packet.sources)||!packet.outcome)throw Error();}catch{return invalid('Paste a version 2 evidence packet with a task ID, artist, outcome and sources.');}
  }
  const key='intake/'+v.token+'.json';
  const payload={type,artist:v.artist,claim:v.claim,version:v.version,name:v.name,place:v.place,note:v.note,source:v.source,credit:v.credit,verdict:v.verdict};
  const item={status:'Awaiting editorial review',created:new Date().toISOString(),payload};
  try{
    const saved=await env.BUCKET.put(key,JSON.stringify(item),{onlyIf:new Headers({'If-None-Match':'*'}),httpMetadata:{contentType:'application/json'}});
    if(!saved){
      const existing=await env.BUCKET.get(key);
      if(!existing||JSON.stringify((await existing.json()).payload)!==JSON.stringify(payload))return render('Submission changed',heading('This form was already sent.')+link('/receipt/'+v.token,'Open the original receipt'),409);
    }
  }catch{return formPage(type,url,'The inbox is temporarily unavailable. Your text is still here. Please try again.',v,503);}
  return Response.redirect(url.origin+'/receipt/'+v.token,303);
}
async function review(request,env,url) {
  if(!env.REVIEW_KEY || request.headers.get('authorization')!=='Bearer '+env.REVIEW_KEY)return new Response('Not found',{status:404});
  const headers={'cache-control':'no-store','referrer-policy':'no-referrer'};
  if(url.pathname==='/editor/inbox' && request.method==='GET'){
    const result=await env.BUCKET.list({prefix:'intake/',limit:100,cursor:url.searchParams.get('cursor')||undefined});
    return Response.json({receipts:result.objects.map(o=>o.key.slice(7,-5)),cursor:result.truncated?result.cursor:null},{headers});
  }
  const id=url.pathname.split('/')[3]||'';
  if(!receiptID.test(id))return new Response('Unknown receipt',{status:404});
  const key='intake/'+id+'.json', item=await env.BUCKET.get(key);
  if(!item)return new Response('Unknown receipt',{status:404});
  const record=await item.json();
  if(request.method==='GET')return Response.json({...record,revision:item.etag},{headers});
  if(request.method!=='POST')return new Response('Method not allowed',{status:405});
  const decision=await request.json().catch(()=>null);
  if(!['Accepted','Needs more evidence','Closed'].includes(decision?.status)||!decision.revision)return new Response('Invalid decision',{status:400});
  const newRecord={...record,status:decision.status,reviewed:new Date().toISOString()};
  const saved=await env.BUCKET.put(key,JSON.stringify(newRecord),{onlyIf:{etagMatches:decision.revision},httpMetadata:{contentType:'application/json'}});
  return saved?Response.json({status:newRecord.status},{headers}):new Response('Receipt has changed. Read it again.',{status:409});
}
const entry = {
  async fetch(request,env) {
    const url=new URL(request.url), path=url.pathname.replace(/\/+$/,'')||'/';
    if(path==='/editor/inbox'||path.startsWith('/editor/inbox/'))return review(request,env,url);
    if(request.method==='POST' && Object.hasOwn(formNames,path.slice(1)))return intake(request,env,path.slice(1),url);
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
    if(Object.hasOwn(assets,path)){
      const ext=path.split('.').pop(),type={css:'text/css',js:'text/javascript',jpg:'image/jpeg',png:'image/png',txt:'text/plain'}[ext];
      return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(assets[path]),ch=>ch.charCodeAt(0)),{headers:{'content-type':type,'cache-control':'public,max-age=3600','x-content-type-options':'nosniff'}});
    }
    if(path==='/')return home();
    if(path==='/artists')return directory();
    if(path==='/search')return search(url);
    if(path==='/places')return render('Places',heading('Cities and towns','Browse artists by their documented connections to a UK city or town.')+rows(catalogue.places.map(linkPlace)) );
    if(path.startsWith('/places/')&&places.has(path.slice(8)))return placePage(places.get(path.slice(8)));
    if(path.startsWith('/artists/')){
      const artist=artists.get(path.slice('/artists/'.length));
      if(artist)return artistPage(artist);
    }
    if(path==='/contribute')return contribute();
    if(path==='/agents')return agentPage();
    if(path==='/brief.txt') {
      const place=(url.searchParams.get('place')||'Anywhere in the UK').replace(/[\r\n]/g,' ').slice(0,100);
      const duration=['30 minutes','2 hours','4 hours','8 hours'].includes(url.searchParams.get('duration'))?url.searchParams.get('duration'):'One task';
      return new Response(`Help A Place In Grime research UK grime artists.\nMy chosen research area: ${place}\nMy time budget: ${duration}\n\nOpen and follow the project’s public research instructions:\n${agentLink}\n\nHandle the research, reservation, checkpoints and submission for me. If my area has no available task, follow the guide to open and claim a focused discovery question there. If you cannot write to GitHub, check the public queue and prepare a private packet for me. Return your evidence and receipt.\n`,{headers:{'content-type':'text/plain; charset=utf-8'}});
    }
    if(path==='/catalogue.json')return Response.json(catalogue);
    if(['/support','/about','/contributors'].includes(path))return about(env,path);
    if(Object.hasOwn(formNames,path.slice(1)))return formPage(path.slice(1),url);
    if(path.startsWith('/receipt/')&&receiptID.test(path.slice(9))){
      let record;try{const object=await env.BUCKET.get('intake/'+path.slice(9)+'.json');record=object&&await object.json();}catch{return render('Unavailable',heading('The inbox is temporarily unavailable.'),503);}
      if(record)return render('Private receipt',heading('Submission received',record.status)+`<dl class="details"><dt>Submission</dt><dd>${esc(formNames[record.payload.type])}</dd><dt>Received</dt><dd>${esc(record.created.slice(0,10))}</dd></dl><p>Bookmark this private link to revisit the decision.</p>${link('/contribute','Back to contributions')}`);
    }
    return render('Page not found',heading('Page not found')+link('/','Back to the catalogue'),404);
  }
};
export default entry;
