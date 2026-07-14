const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>crypto.randomUUID();
const deepClone=o=>JSON.parse(JSON.stringify(o));
const now=()=>new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const viewTitles={library:"旅行圖書館",builder:"Journey Builder",studio:"旅行本工作室",itinerary:"行程細節",templates:"頁面母版",styles:"書籍風格包",live:"旅途中模式",diagnostics:"同步診斷"};

const defaultState={
  settings:{offline:false,latency:600,failureRate:10,autoRetry:true},
  ui:{view:"library",tripFilter:"all",tripSearch:"",selectedTripId:"trip-main",selectedDayId:"day-8",selectedPageId:"page-18",paper:"cream",decor:1,snap:true,texture:true},
  trips:[
    {id:"trip-main",title:"阪兵岡百城之旅",start:"2026-08-08",end:"2026-08-17",region:"兵庫・岡山・廣島",status:"planning",progress:42,cover:"assets/travel-90db60320abe.webp",pages:42,editedPages:18,bookStyleId:"minz-premium-journal"},
    {id:"trip-kyushu",title:"九州賞楓之旅",start:"2026-11-12",end:"2026-11-18",region:"福岡・熊本・由布院",status:"planning",progress:12,cover:"assets/travel-b61f95618e57.webp",pages:20,editedPages:3,bookStyleId:"nordic-snow"},
    {id:"trip-kanto",title:"關東櫻花之旅",start:"2025-03-20",end:"2025-03-27",region:"東京・鎌倉",status:"completed",progress:100,cover:"assets/travel-28cce8957c6c.webp",pages:36,editedPages:36,bookStyleId:"botanical-photo"},
    {id:"trip-kansai",title:"阪神京奈九日遊",start:"2024-07-06",end:"2024-07-14",region:"京都・奈良・神戶・大阪",status:"completed",progress:100,cover:"assets/travel-3112ff5f074e.webp",pages:54,editedPages:54,bookStyleId:"minz-premium-journal"}
  ],
  materials:[
    {id:"mat-1",title:"岡山城夜間點燈",source:"官方網站",note:"待確認日期",image:"assets/travel-3a63abedb7fa.webp"},
    {id:"mat-2",title:"吉備津神社參觀路線",source:"Google Maps",note:"可放 Day 8",image:"assets/travel-b61f95618e57.webp"},
    {id:"mat-3",title:"倉敷咖啡店候選",source:"Google Maps",note:"4 個地點",image:"assets/travel-39784bff4245.webp"},
    {id:"mat-4",title:"岡山伴手禮",source:"旅行本",note:"購物清單",image:"assets/travel-40a36ab25c0c.webp"}
  ],
  days:[
    {id:"day-1",tripId:"trip-main",index:1,date:"2026-08-08",title:"神戶・姬路",pageMasterId:"master-day-journal",bookSyncStatus:"clean"},
    {id:"day-8",tripId:"trip-main",index:8,date:"2026-08-15",title:"岡山",pageMasterId:"master-day-journal",bookSyncStatus:"clean"},
    {id:"day-9",tripId:"trip-main",index:9,date:"2026-08-16",title:"倉敷",pageMasterId:"master-day-photo",bookSyncStatus:"dirty"},
    {id:"day-10",tripId:"trip-main",index:10,date:"2026-08-17",title:"廣島",pageMasterId:"master-day-compact",bookSyncStatus:"manual"}
  ],
  stops:[
    {id:"stop-1",dayId:"day-8",time:"07:30",title:"從飯店出發",type:"transport",duration:20,status:"completed",address:"岡山市北區"},
    {id:"stop-2",dayId:"day-8",time:"09:00",title:"吉備津神社",type:"place",duration:60,status:"planned",address:"岡山市北區吉備津 931"},
    {id:"stop-3",dayId:"day-8",time:"11:30",title:"岡山後樂園",type:"place",duration:90,status:"planned",address:"岡山市北區後樂園 1-5"},
    {id:"stop-4",dayId:"day-8",time:"13:00",title:"Cafe Moyau",type:"food",duration:60,status:"planned",address:"岡山市北區出石町"},
    {id:"stop-5",dayId:"day-8",time:"14:30",title:"岡山城（烏城）",type:"place",duration:70,status:"planned",address:"岡山市北區丸之內"},
    {id:"stop-6",dayId:"day-8",time:"18:30",title:"岡山城夜間點燈",type:"place",duration:60,status:"planned",address:"岡山市北區丸之內"}
  ],
  pages:[
    {id:"page-1",tripId:"trip-main",number:1,title:"旅行封面",subtitle:"2026 阪兵岡百城之旅",type:"cover"},
    {id:"page-2",tripId:"trip-main",number:2,title:"行前準備",subtitle:"出發前確認事項",type:"info"},
    {id:"page-3",tripId:"trip-main",number:3,title:"交通與住宿",subtitle:"票券、飯店與重要文件",type:"info"},
    {id:"page-18",tripId:"trip-main",number:18,title:"岡山",subtitle:"烏城與長廊，一天走進桃太郎的故事裡。",type:"journal",dayId:"day-8",generatedFromDay:true,syncStatus:"clean",manualEdited:false},
    {id:"page-19",tripId:"trip-main",number:19,title:"岡山路線地圖",subtitle:"今日移動與交通",type:"map",dayId:"day-8"},
    {id:"page-20",tripId:"trip-main",number:20,title:"吉備津神社",subtitle:"桃太郎傳說與國寶長廊",type:"place",dayId:"day-8"},
    {id:"page-21",tripId:"trip-main",number:21,title:"倉敷",subtitle:"白壁老街與咖啡時間",type:"journal",dayId:"day-9",generatedFromDay:true,syncStatus:"dirty",manualEdited:false}
  ],
  freeItems:[],
  templates:[
    {id:"tpl-cover",name:"旅行封面",kind:"Cover"},
    {id:"tpl-journal",name:"當日手帳",kind:"Day journal"},
    {id:"tpl-place",name:"景點介紹",kind:"Place editorial"},
    {id:"tpl-map",name:"路線地圖",kind:"Route map"},
    {id:"tpl-info",name:"交通票券",kind:"Documents"}
  ],


  places:[
    {id:"place-kibitsu",title:"吉備津神社",category:"must",kind:"place",region:"岡山",duration:60,address:"岡山市北區吉備津 931",image:"assets/travel-b61f95618e57.webp",note:"國寶長廊與桃太郎傳說",assignedDayId:"day-8"},
    {id:"place-korakuen",title:"岡山後樂園",category:"must",kind:"place",region:"岡山",duration:90,address:"岡山市北區後樂園 1-5",image:"assets/travel-28cce8957c6c.webp",note:"早上光線較舒服",assignedDayId:"day-8"},
    {id:"place-okayama-castle",title:"岡山城（烏城）",category:"must",kind:"place",region:"岡山",duration:70,address:"岡山市北區丸之內",image:"assets/travel-3a63abedb7fa.webp",note:"傍晚可回來看點燈",assignedDayId:"day-8"},
    {id:"place-moyau",title:"Cafe Moyau",category:"food",kind:"food",region:"岡山",duration:60,address:"岡山市北區出石町",image:"assets/travel-39784bff4245.webp",note:"午餐候選",assignedDayId:"day-8"},
    {id:"place-kurashiki",title:"倉敷美觀地區",category:"must",kind:"place",region:"倉敷",duration:150,address:"倉敷市中央",image:"assets/travel-3385ede6e90e.webp",note:"白壁、運河、咖啡店",assignedDayId:"day-9"},
    {id:"place-ohara",title:"大原美術館",category:"want",kind:"place",region:"倉敷",duration:100,address:"倉敷市中央 1-1-15",image:"assets/travel-33b77841cb5e.webp",note:"視當天體力決定",assignedDayId:null},
    {id:"place-peach",title:"岡山白桃伴手禮",category:"shopping",kind:"shopping",region:"岡山",duration:30,address:"岡山站",image:"assets/travel-40a36ab25c0c.webp",note:"離開岡山前購買",assignedDayId:null},
    {id:"place-tsuyama",title:"津山城",category:"backup",kind:"place",region:"津山",duration:90,address:"津山市山下 135",image:"assets/travel-3385ede6e90e.webp",note:"下雨時不建議",assignedDayId:null}
  ],
  pageMasters:[
    {id:"master-day-journal",name:"當日手帳",pageType:"journal"},
    {id:"master-day-editorial",name:"景點特寫",pageType:"place"},
    {id:"master-day-compact",name:"資訊密集行程",pageType:"info"},
    {id:"master-day-photo",name:"照片故事頁",pageType:"free"}
  ],
  bookStyles:[
    {
      schemaVersion:"1.0",styleId:"minz-premium-journal",name:"Minz Premium Journal",version:"1.0.0",
      description:"精品旅行手帳：暖白紙、沉墨藍、赭紅、照片拼貼與克制的手作感。",
      author:"Jonaminz",source:"built-in",
      tokens:{
        colors:{pageBackground:"#F7EFDF",inkPrimary:"#334B58",inkSecondary:"#6A655C",accentPrimary:"#A45F43",accentSecondary:"#D9C5A4",rule:"#C8B79D"},
        typography:{displayPreset:"editorial-serif",bodyPreset:"humanist-sans",titleScale:1,bodyScale:1,letterSpacing:-0.01},
        paper:{texture:"warm-fiber",grainOpacity:0.08,edgeTreatment:"clean-soft"},
        photo:{shape:"polaroid",shadow:"soft-lift",saturation:0.92,contrast:0.98},
        decoration:{tapeStyle:"linen",stampStyle:"passport",dividerStyle:"hand-drawn",pageNumberStyle:"minimal"},
        spacing:{density:"comfortable",pageMargin:1,blockGap:1}
      },
      compatibility:{pageTypes:["cover","journal","place","map","info","free"]},
      assetRequests:[]
    },
    {
      schemaVersion:"1.0",styleId:"showa-railway-1980",name:"昭和鐵道旅行誌",version:"1.0.0",
      description:"奶油紙、深綠與橘紅，借用老車票和時刻表語彙，但保持現代可讀性。",
      author:"Jonaminz",source:"built-in",
      tokens:{
        colors:{pageBackground:"#F1E5C9",inkPrimary:"#29483E",inkSecondary:"#665D4D",accentPrimary:"#C45A35",accentSecondary:"#D8C795",rule:"#A79A7C"},
        typography:{displayPreset:"modern-serif",bodyPreset:"classic-sans",titleScale:0.95,bodyScale:1,letterSpacing:0.02},
        paper:{texture:"aged-speckle",grainOpacity:0.12,edgeTreatment:"aged-soft"},
        photo:{shape:"ticket-cut",shadow:"print-flat",saturation:0.82,contrast:0.94},
        decoration:{tapeStyle:"none",stampStyle:"railway",dividerStyle:"timetable",pageNumberStyle:"ticket"},
        spacing:{density:"compact",pageMargin:0.95,blockGap:0.9}
      },
      compatibility:{pageTypes:["cover","journal","map","info"]},
      assetRequests:["鐵道日期戳章 SVG","時刻表分隔線 SVG"]
    },
    {
      schemaVersion:"1.0",styleId:"nordic-snow",name:"北國雪景寫真",version:"1.0.0",
      description:"霧白、冷灰藍與大量留白，照片安靜而清透，適合冬季與自然旅行。",
      author:"Jonaminz",source:"built-in",
      tokens:{
        colors:{pageBackground:"#EEF2F1",inkPrimary:"#385363",inkSecondary:"#68777B",accentPrimary:"#7899A6",accentSecondary:"#D9E5E5",rule:"#BCCBCB"},
        typography:{displayPreset:"modern-serif",bodyPreset:"humanist-sans",titleScale:1.06,bodyScale:1.02,letterSpacing:-0.015},
        paper:{texture:"cold-grain",grainOpacity:0.04,edgeTreatment:"clean"},
        photo:{shape:"rounded",shadow:"none",saturation:0.78,contrast:1.02},
        decoration:{tapeStyle:"none",stampStyle:"minimal",dividerStyle:"minimal",pageNumberStyle:"minimal"},
        spacing:{density:"airy",pageMargin:1.12,blockGap:1.2}
      },
      compatibility:{pageTypes:["cover","journal","place","map","free"]},
      assetRequests:[]
    },
    {
      schemaVersion:"1.0",styleId:"botanical-photo",name:"植物圖鑑旅行書",version:"1.0.0",
      description:"植物標本、自然紙色與深綠墨線，適合庭園、花季與慢旅行。",
      author:"Jonaminz",source:"built-in",
      tokens:{
        colors:{pageBackground:"#F3ECDD",inkPrimary:"#3C5142",inkSecondary:"#6D6B5D",accentPrimary:"#8A674B",accentSecondary:"#D4D8B8",rule:"#B8B498"},
        typography:{displayPreset:"editorial-serif",bodyPreset:"book-serif",titleScale:1.02,bodyScale:1,letterSpacing:0},
        paper:{texture:"warm-fiber",grainOpacity:0.09,edgeTreatment:"deckled-soft"},
        photo:{shape:"polaroid",shadow:"soft-lift",saturation:0.84,contrast:0.96},
        decoration:{tapeStyle:"linen",stampStyle:"botanical",dividerStyle:"dotted",pageNumberStyle:"folio"},
        spacing:{density:"comfortable",pageMargin:1.05,blockGap:1.05}
      },
      compatibility:{pageTypes:["cover","journal","place","free"]},
      assetRequests:["植物標本角落裝飾 SVG"]
    }
  ],
  queue:[],
  log:[]
};

let state=JSON.parse(localStorage.getItem("jonaminzTravelJourneyBuilderV053")||"null")||deepClone(defaultState);

function migrateBookStyleState(){
  if(!Array.isArray(state.bookStyles)||!state.bookStyles.length) state.bookStyles=deepClone(defaultState.bookStyles);
  state.ui=state.ui||{};
  if(!state.ui.previewBookStyleId) state.ui.previewBookStyleId=state.trips?.find(t=>t.id===state.ui.selectedTripId)?.bookStyleId||"minz-premium-journal";
  (state.trips||[]).forEach(t=>{if(!t.bookStyleId)t.bookStyleId="minz-premium-journal"});
}
migrateBookStyleState();

function migrateJourneyBuilderState(){
  if(!Array.isArray(state.places)||!state.places.length) state.places=deepClone(defaultState.places);
  if(!Array.isArray(state.pageMasters)||!state.pageMasters.length) state.pageMasters=deepClone(defaultState.pageMasters);
  state.ui=state.ui||{};
  if(!state.ui.builderSearch) state.ui.builderSearch="";
  if(!state.ui.placeFilter) state.ui.placeFilter="all";
  (state.days||[]).forEach(d=>{
    if(!d.pageMasterId)d.pageMasterId="master-day-journal";
    if(!d.bookSyncStatus)d.bookSyncStatus="clean";
  });
  (state.pages||[]).forEach(p=>{
    if(p.generatedFromDay&&p.manualEdited===undefined)p.manualEdited=false;
    if(p.generatedFromDay&&!p.syncStatus)p.syncStatus="clean";
  });
  (state.places||[]).forEach(place=>{
    if(!place.assignedDayId)return;
    const matchingStop=state.stops.find(stop=>stop.dayId===place.assignedDayId&&stop.title===place.title);
    if(matchingStop&&!matchingStop.sourcePlaceId)matchingStop.sourcePlaceId=place.id;
  });
  if(!state.ui.v051UxMigrationApplied){
    state.ui.tripSearch="";
    if(state.ui.tripFilter==="archived")state.ui.tripFilter="all";
    const selected=state.trips.find(t=>t.id===state.ui.selectedTripId);
    if(selected?.status==="archived"){
      const next=state.trips.find(t=>t.status!=="archived");
      if(next)state.ui.selectedTripId=next.id;
    }
    state.ui.v051UxMigrationApplied=true;
    saveLocal();
  }
}
migrateJourneyBuilderState();


let undoStack=[],redoStack=[];
const saveLocal=()=>localStorage.setItem("jonaminzTravelJourneyBuilderV053",JSON.stringify(state));

class MockRepository{
  async mutate(action){
    if(state.settings.offline) throw new Error("OFFLINE");
    await new Promise(r=>setTimeout(r,state.settings.latency));
    if(Math.random()*100<state.settings.failureRate) throw new Error("MOCK_FAILURE");
    return {ok:true,serverAt:Date.now(),actionId:action.id};
  }
}
const repo=new MockRepository();

function logAction(label,status="local"){
  state.log.unshift({id:uid(),time:now(),label,status});
  state.log=state.log.slice(0,60);
  saveLocal();
}
function snapshot(){return deepClone(state)}
function setSyncUI(){
  const chip=$("#syncChip"),orb=$("#diagnosticStatus");
  const pending=state.queue.filter(q=>q.status==="pending"||q.status==="retrying").length;
  const failed=state.queue.filter(q=>q.status==="failed").length;
  chip.className="sync-chip";
  orb.className="status-orb";
  if(state.settings.offline){chip.classList.add("offline");orb.classList.add("offline");chip.querySelector("span").textContent="離線";orb.querySelector("span").textContent="OFFLINE"}
  else if(failed){chip.classList.add("error");orb.classList.add("error");chip.querySelector("span").textContent="同步失敗";orb.querySelector("span").textContent="ERROR"}
  else if(pending){chip.classList.add("syncing");orb.classList.add("syncing");chip.querySelector("span").textContent="同步中";orb.querySelector("span").textContent="SYNCING"}
  else{chip.classList.add("synced");orb.classList.add("synced");chip.querySelector("span").textContent="已同步";orb.querySelector("span").textContent="SYNCED"}
  chip.querySelector("b").textContent=pending+failed;
  orb.querySelector("b").textContent=pending+failed;
}
function toast(title,detail="",type="",actionLabel="",actionFn=null){
  const el=document.createElement("div");el.className=`toast ${type}`;
  el.innerHTML=`<div><b>${title}</b>${detail?`<span>${detail}</span>`:""}</div>${actionFn?`<button>${actionLabel}</button>`:""}`;
  $("#toastHost").appendChild(el);
  if(actionFn)el.querySelector("button").onclick=()=>{actionFn();el.remove()};
  setTimeout(()=>el.remove(),4200);
}
async function optimistic({label,apply,rollbackRender=true,actionType="mutation",payload={}}){
  const before=snapshot();
  undoStack.push(before);if(undoStack.length>30)undoStack.shift();redoStack=[];
  apply();
  const after=snapshot();
  const action={id:uid(),type:actionType,label,payload,status:"pending",createdAt:Date.now(),attempts:0,before,after,rolledBack:false};
  state.queue.push(action);logAction(label,"optimistic");saveLocal();renderAll();setSyncUI();
  if(state.settings.offline){
    action.error="OFFLINE";logAction(label+"（離線排隊）","queued-offline");saveLocal();renderDiagnostics();setSyncUI();
    toast("已在離線狀態完成操作","恢復連線後會送出同步佇列","warn");return;
  }
  try{
    action.attempts++;
    await repo.mutate(action);
    state.queue=state.queue.filter(q=>q.id!==action.id);
    logAction(label,"synced");saveLocal();renderDiagnostics();setSyncUI();
  }catch(err){
    if(state.settings.autoRetry&&action.attempts<2){
      action.status="retrying";saveLocal();setSyncUI();
      try{
        action.attempts++;await repo.mutate(action);
        state.queue=state.queue.filter(q=>q.id!==action.id);logAction(label+"（重試成功）","synced");saveLocal();renderDiagnostics();setSyncUI();return;
      }catch{}
    }
    action.status="failed";action.error=err.message;action.rolledBack=true;
    state=before;state.queue.push(action);logAction(label+"（已復原）","rolled-back");saveLocal();renderAll();setSyncUI();
    toast("後端同步失敗，畫面已復原",label,"error","重試",()=>retryAction(action.id));
  }
}
async function retryAction(id){
  let action=state.queue.find(q=>q.id===id);if(!action)return;
  if(state.settings.offline){toast("目前是離線模式","請先切回線上","warn");return}
  const retryBefore=snapshot();
  if(action.rolledBack&&action.after){
    const preserved={settings:deepClone(state.settings),ui:deepClone(state.ui),log:deepClone(state.log),queue:deepClone(state.queue)};
    state=deepClone(action.after);
    state.settings=preserved.settings;state.ui=preserved.ui;state.log=preserved.log;state.queue=preserved.queue;
    action=state.queue.find(q=>q.id===id);action.rolledBack=false;
  }
  action.status="retrying";action.attempts++;saveLocal();renderAll();setSyncUI();
  try{
    await repo.mutate(action);state.queue=state.queue.filter(q=>q.id!==id);logAction(action.label+"（手動重試成功）","synced");saveLocal();renderAll();toast("重試成功",action.label)
  }catch(e){
    state=retryBefore;action=state.queue.find(q=>q.id===id);if(action){action.status="failed";action.error=e.message;action.rolledBack=true}saveLocal();renderAll();setSyncUI();toast("重試仍失敗",action?.label||"同步操作","error")
  }
}
async function flushQueue(){
  if(state.settings.offline)return;
  const pending=[...state.queue].filter(q=>q.status==="pending"||q.status==="failed");
  for(const q of pending)await retryAction(q.id);
}
function undo(){
  if(!undoStack.length)return;
  redoStack.push(snapshot());state=undoStack.pop();state.queue=[];saveLocal();renderAll();toast("已撤銷上一個本地操作");
}
function redo(){
  if(!redoStack.length)return;
  undoStack.push(snapshot());state=redoStack.pop();state.queue=[];saveLocal();renderAll();toast("已重做");
}
$("#undoBtn").onclick=undo;$("#redoBtn").onclick=redo;

function currentTrip(){return state.trips.find(t=>t.id===state.ui.selectedTripId)||state.trips[0]}
function currentDay(){return state.days.find(d=>d.id===state.ui.selectedDayId)||state.days[0]}
function currentPage(){return state.pages.find(p=>p.id===state.ui.selectedPageId)||state.pages[0]}
function stopsForDay(id=currentDay().id){return state.stops.filter(s=>s.dayId===id).sort((a,b)=>a.time.localeCompare(b.time))}
function statusLabel(s){return {planning:"規劃中",completed:"已完成",archived:"封存"}[s]||s}
function typeIcon(t){return {place:"景",food:"食",transport:"車",hotel:"宿"}[t]||"點"}
function formatDate(d){return new Date(d+"T00:00:00").toLocaleDateString("zh-TW",{month:"2-digit",day:"2-digit",weekday:"short"})}

function showView(name){
  state.ui.view=name;saveLocal();
  $$(".view").forEach(v=>v.classList.remove("active"));$(`#view-${name}`).classList.add("active");
  $$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $("#pageTitle").textContent=viewTitles[name];window.scrollTo({top:0,behavior:"smooth"});
  renderAll();
}
$$(".nav").forEach(b=>b.onclick=()=>showView(b.dataset.view));
$$("[data-jump]").forEach(b=>b.onclick=()=>showView(b.dataset.jump));

function renderLibrary(){
  const activeTrips=state.trips.filter(t=>t.status!=="archived");
  let trip=currentTrip();
  if(trip?.status==="archived"&&activeTrips.length){
    trip=activeTrips[0];
    state.ui.selectedTripId=trip.id;
    saveLocal();
  }
  $("#heroTitle").textContent=trip?.title||"尚未建立旅行";
  const q=(state.ui.tripSearch||"").toLowerCase(),f=state.ui.tripFilter||"all";
  $("#tripSearch").value=state.ui.tripSearch||"";
  $$(".filters button").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));
  const items=state.trips.filter(t=>{
    const visibleByFilter=f==="archived"?t.status==="archived":f==="all"?t.status!=="archived":t.status===f;
    return visibleByFilter&&(!q||(`${t.title} ${t.region}`).toLowerCase().includes(q));
  });
  $("#tripGrid").innerHTML=items.map(t=>`<article class="trip-card" data-id="${t.id}">
    <div class="trip-cover"><img src="${t.cover}" alt=""><span class="trip-state">${statusLabel(t.status)}</span>
      <button class="trip-menu"><svg><use href="#i-more"/></svg></button>
      <div class="card-menu-popover">
        <button data-act="edit"><svg><use href="#i-edit"/></svg>編輯旅行</button>
        <button data-act="duplicate"><svg><use href="#i-copy"/></svg>複製旅行</button>
        <button data-act="archive"><svg><use href="#i-archive"/></svg>${t.status==="archived"?"取消封存":"封存旅行"}</button>
        <button data-act="delete" class="danger"><svg><use href="#i-trash"/></svg>刪除旅行</button>
      </div>
    </div>
    <div class="trip-card-body"><h3>${t.title}</h3><p>${t.start} — ${t.end} · ${t.region}</p>
      <div class="trip-card-footer"><span>${t.editedPages} / ${t.pages} 頁 · ${t.progress}%</span><button data-open>打開 →</button></div>
    </div></article>`).join("")||`<div class="queue-empty">沒有符合條件的旅行</div>`;
  $$(".trip-card").forEach(card=>{
    const id=card.dataset.id;
    card.querySelector(".trip-menu").onclick=e=>{e.stopPropagation();card.querySelector(".card-menu-popover").classList.toggle("open")};
    card.querySelector("[data-open]").onclick=()=>{state.ui.selectedTripId=id;saveLocal();showView("studio")};
    $$("[data-act]",card).forEach(btn=>btn.onclick=e=>{e.stopPropagation();handleTripAction(id,btn.dataset.act);card.querySelector(".card-menu-popover").classList.remove("open")});
  });
  $("#materialStrip").innerHTML=state.materials.map(m=>`<article class="material-card"><b>${m.title}</b><span>${m.source} · ${m.note}</span><button data-material="${m.id}">加入旅行 →</button></article>`).join("");
  $$("[data-material]").forEach(b=>b.onclick=()=>toast("素材已準備加入","可在旅行本工作室使用"));
}
function handleTripAction(id,act){
  const t=state.trips.find(x=>x.id===id);if(!t)return;
  if(act==="edit")return openTripModal(t);
  if(act==="duplicate")return optimistic({label:`複製旅行：${t.title}`,actionType:"trip.duplicate",payload:{id},apply:()=>{state.trips.unshift({...deepClone(t),id:uid(),title:t.title+"（副本）",status:"planning",progress:0,editedPages:0})}});
  if(act==="archive")return optimistic({
    label:`${t.status==="archived"?"取消封存":"封存"}旅行：${t.title}`,
    actionType:"trip.archive",payload:{id},
    apply:()=>{
      const willArchive=t.status!=="archived";
      t.status=willArchive?"archived":"planning";
      if(willArchive&&state.ui.selectedTripId===t.id){
        const next=state.trips.find(x=>x.id!==t.id&&x.status!=="archived");
        if(next)state.ui.selectedTripId=next.id;
      }
      state.ui.tripSearch="";
      state.ui.tripFilter=willArchive?"all":"archived";
    }
  });
  if(act==="delete"){
    if(!confirm(`刪除「${t.title}」？`))return;
    return optimistic({label:`刪除旅行：${t.title}`,actionType:"trip.delete",payload:{id},apply:()=>{state.trips=state.trips.filter(x=>x.id!==id)}});
  }
}
$("#tripSearch").oninput=e=>{state.ui.tripSearch=e.target.value;saveLocal();renderLibrary()};
$$(".filters button").forEach(b=>b.onclick=()=>{$$(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.ui.tripFilter=b.dataset.filter;saveLocal();renderLibrary()});

function openModal({kicker="CREATE",title,fields,onSubmit,submitLabel="儲存"}){
  $("#modalKicker").textContent=kicker;$("#modalTitle").textContent=title;
  $("#modalForm").innerHTML=fields+`<div class="modal-actions"><button type="button" class="secondary" id="modalCancel">取消</button><button class="primary" type="submit">${submitLabel}</button></div>`;
  $("#modalBackdrop").classList.add("open");$("#modalCancel").onclick=closeModal;
  $("#modalForm").onsubmit=e=>{e.preventDefault();onSubmit(new FormData(e.target));closeModal()};
}
function closeModal(){$("#modalBackdrop").classList.remove("open")}
$("#modalClose").onclick=closeModal;$("#modalBackdrop").onclick=e=>{if(e.target===e.currentTarget)closeModal()};
function openTripModal(t=null){
  openModal({kicker:t?"EDIT":"CREATE",title:t?"編輯旅行":"新增旅行",fields:`
    <label>旅行名稱<input name="title" required value="${t?.title||""}"></label>
    <label>主要地區<input name="region" value="${t?.region||""}"></label>
    <label>開始日期<input name="start" type="date" value="${t?.start||"2026-09-01"}"></label>
    <label>結束日期<input name="end" type="date" value="${t?.end||"2026-09-03"}"></label>`,
    onSubmit:fd=>{
      const data=Object.fromEntries(fd.entries());
      if(t)optimistic({label:`編輯旅行：${t.title}`,actionType:"trip.update",payload:{id:t.id},apply:()=>Object.assign(t,data)});
      else{
        const newTripId=uid();
        optimistic({
          label:`新增旅行：${data.title}`,actionType:"trip.create",payload:data,
          apply:()=>{
            state.trips.unshift({id:newTripId,...data,status:"planning",progress:0,cover:"assets/travel-28cce8957c6c.webp",pages:1,editedPages:0,bookStyleId:"minz-premium-journal"});
            state.ui.selectedTripId=newTripId;
            state.ui.tripSearch="";
            state.ui.tripFilter="all";
          }
        });
      }
    }});
}
$("#newTripBtn").onclick=()=>openTripModal();
$("#quickMaterialBtn").onclick=$("#quickMaterialBtn").onclick=()=>openModal({title:"快速新增素材",fields:`<label>素材名稱<input name="title" required></label><label>來源<select name="source"><option>Google Maps</option><option>官方網站</option><option>部落格</option><option>手動</option></select></label><label>備註<textarea name="note"></textarea></label>`,onSubmit:fd=>{const d=Object.fromEntries(fd.entries());optimistic({label:`新增素材：${d.title}`,actionType:"material.create",payload:d,apply:()=>state.materials.unshift({id:uid(),...d,image:"assets/travel-39784bff4245.webp"})})}});

function renderStudio(){
  const trip=currentTrip(),page=currentPage(),day=state.days.find(d=>d.id===page.dayId)||currentDay();
  $("#studioTripTitle").value=trip.title;$("#pageList").innerHTML=state.pages.filter(p=>p.tripId===trip.id).sort((a,b)=>a.number-b.number).map(p=>`<button class="${p.id===page.id?"active":""}" data-page="${p.id}"><i>${String(p.number).padStart(2,"0")}</i><span><b>${p.title}</b><small>${p.type}${p.generatedFromDay?` · <span class="page-sync-badge ${p.syncStatus||"clean"}">${p.syncStatus==="dirty"?"待同步":p.syncStatus==="manual"?"手動保護":"已同步"}</span>`:""}</small></span><em>⋮⋮</em></button>`).join("");
  $$("[data-page]").forEach(b=>b.onclick=()=>{state.ui.selectedPageId=b.dataset.page;saveLocal();renderStudio()});
  $("#canvasTitle").textContent=page.title;$("#canvasSubtitle").textContent=page.subtitle||"";$("#canvasKicker").textContent=day?`DAY ${day.index} · ${formatDate(day.date).toUpperCase()}`:"TRIP BOOK";$("#canvasPageNumber").textContent=`${page.number} / ${trip.pages}`;
  $("#pageTitleInput").value=page.title;$("#pageSubtitleInput").value=page.subtitle||"";$("#pageTypeSelect").value=["journal","place","info","free"].includes(page.type)?page.type:"journal";
  $("#canvasSchedule").innerHTML=stopsForDay(day?.id).map(s=>`<li><time>${s.time}</time><span>${s.title}</span></li>`).join("");
  $("#assetGrid").innerHTML=state.materials.slice(0,6).map(m=>`<button class="asset" data-asset="${m.id}"><img src="${m.image}" alt=""><span><b>${m.title}</b><small>${m.source}</small></span></button>`).join("");
  $$("[data-asset]").forEach(b=>b.ondblclick=()=>{const m=state.materials.find(x=>x.id===b.dataset.asset);addFreeItem({kind:"photo",title:m.title,image:m.image,x:320+Math.random()*40,y:520+Math.random()*80})});
  $("#journalCanvas").className=`journal-page book-style-runtime paper-${state.ui.paper}${state.ui.texture?"":" no-texture"}${state.ui.decor===0?" decor-low":state.ui.decor===2?" decor-high":""}`;
  applyBookStyleVisual($("#journalCanvas"),styleForTrip(trip));
  $$(".paper-dot").forEach(b=>b.classList.toggle("active",b.dataset.paper===state.ui.paper));$("#paperSelect").value=state.ui.paper;$("#decorRange").value=state.ui.decor;$("#snapToggle").checked=state.ui.snap;$("#textureToggle").checked=state.ui.texture;
  renderFreeItems();
}
$("#studioTripTitle").onchange=e=>{const t=currentTrip(),value=e.target.value.trim();if(value)optimistic({label:`重新命名旅行：${value}`,actionType:"trip.update",payload:{id:t.id,title:value},apply:()=>t.title=value})};
function addPage(){
  const trip=currentTrip(),n=Math.max(...state.pages.filter(p=>p.tripId===trip.id).map(p=>p.number),0)+1,id=uid();
  optimistic({label:"新增旅行頁",actionType:"page.create",payload:{tripId:trip.id},apply:()=>{state.pages.push({id,tripId:trip.id,number:n,title:"自由手帳頁",subtitle:"",type:"free"});state.ui.selectedPageId=id;trip.pages=Math.max(trip.pages,n)}});
}
$("#addPageBtn").onclick=addPage;$("#outlineAddPage").onclick=addPage;
$("#duplicatePageBtn").onclick=()=>{const p=currentPage(),trip=currentTrip(),id=uid(),n=Math.max(...state.pages.filter(x=>x.tripId===trip.id).map(x=>x.number),0)+1;optimistic({label:`複製頁面：${p.title}`,actionType:"page.duplicate",payload:{id:p.id},apply:()=>{state.pages.push({...deepClone(p),id,number:n,title:p.title+"（副本）"});state.ui.selectedPageId=id;trip.pages=Math.max(trip.pages,n)}})};
$("#deletePageBtn").onclick=()=>{const p=currentPage();if(!confirm(`刪除頁面「${p.title}」？`))return;optimistic({label:`刪除頁面：${p.title}`,actionType:"page.delete",payload:{id:p.id},apply:()=>{state.pages=state.pages.filter(x=>x.id!==p.id);state.ui.selectedPageId=state.pages.find(x=>x.tripId===p.tripId)?.id}})};
$("#savePageBtn").onclick=()=>{const p=currentPage(),title=$("#pageTitleInput").value.trim()||"未命名頁面",subtitle=$("#pageSubtitleInput").value,type=$("#pageTypeSelect").value;optimistic({label:`儲存頁面：${title}`,actionType:"page.update",payload:{id:p.id},apply:()=>{Object.assign(p,{title,subtitle,type,manualEdited:true,syncStatus:"manual"});const d=state.days.find(x=>x.id===p.dayId);if(d)d.bookSyncStatus="manual"}})};
$$(".inspector-tabs button").forEach(b=>b.onclick=()=>{$$(".inspector-tabs button").forEach(x=>x.classList.remove("active"));$$(".inspector-body").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(`#panel-${b.dataset.panel}`).classList.add("active")});
$$(".paper-dot").forEach(b=>b.onclick=()=>{state.ui.paper=b.dataset.paper;saveLocal();renderStudio()});
$("#paperSelect").onchange=e=>{state.ui.paper=e.target.value;saveLocal();renderStudio()};$("#decorRange").oninput=e=>{state.ui.decor=Number(e.target.value);saveLocal();renderStudio()};$("#snapToggle").onchange=e=>{state.ui.snap=e.target.checked;saveLocal()};$("#textureToggle").onchange=e=>{state.ui.texture=e.target.checked;saveLocal();renderStudio()};
$("#addAssetBtn").onclick=()=>openModal({title:"新增素材",fields:`<label>名稱<input name="title" required></label><label>來源<input name="source" value="手動"></label><label>備註<textarea name="note"></textarea></label>`,onSubmit:fd=>{const d=Object.fromEntries(fd.entries());optimistic({label:`新增素材：${d.title}`,actionType:"material.create",payload:d,apply:()=>state.materials.unshift({id:uid(),...d,image:"assets/travel-33b77841cb5e.webp"})})}});

function addFreeItem(item){
  const p=currentPage();const full={id:uid(),pageId:p.id,kind:"photo",x:330,y:520,...item};
  optimistic({label:`加入拼貼素材：${full.title}`,actionType:"page.freeItem.create",payload:full,apply:()=>{state.freeItems.push(full);const pg=state.pages.find(x=>x.id===full.pageId);if(pg){pg.manualEdited=true;pg.syncStatus="manual";const d=state.days.find(x=>x.id===pg.dayId);if(d)d.bookSyncStatus="manual"}}});
}
function renderFreeItems(){
  $("#freeLayer").innerHTML="";
  state.freeItems.filter(i=>i.pageId===currentPage().id).forEach(item=>{
    const el=document.createElement("div");el.className=`free-item ${item.kind==="photo"?"free-photo":"free-note"}`;el.dataset.id=item.id;el.style.left=item.x+"px";el.style.top=item.y+"px";el.innerHTML=item.kind==="photo"?`<img src="${item.image}" alt=""><span>${item.title}</span><button class="delete">×</button>`:`<span>${item.title}</span><button class="delete">×</button>`;
    $("#freeLayer").appendChild(el);makeDraggable(el,item);
    el.querySelector(".delete").onclick=e=>{e.stopPropagation();optimistic({label:`移除拼貼素材：${item.title}`,actionType:"page.freeItem.delete",payload:{id:item.id},apply:()=>{state.freeItems=state.freeItems.filter(x=>x.id!==item.id);const pg=state.pages.find(x=>x.id===item.pageId);if(pg){pg.manualEdited=true;pg.syncStatus="manual"}}})};
  });
}
function makeDraggable(el,item){
  let sx,sy,ox,oy,drag=false;
  el.onpointerdown=e=>{if(e.target.classList.contains("delete"))return;drag=true;sx=e.clientX;sy=e.clientY;ox=item.x;oy=item.y;el.setPointerCapture(e.pointerId)};
  el.onpointermove=e=>{if(!drag)return;let nx=ox+e.clientX-sx,ny=oy+e.clientY-sy;if(state.ui.snap){nx=Math.round(nx/10)*10;ny=Math.round(ny/10)*10}nx=Math.max(5,Math.min(455,nx));ny=Math.max(5,Math.min(790,ny));el.style.left=nx+"px";el.style.top=ny+"px"};
  el.onpointerup=()=>{if(!drag)return;drag=false;const nx=parseFloat(el.style.left)||0,ny=parseFloat(el.style.top)||0;optimistic({label:`移動拼貼素材：${item.title}`,actionType:"page.freeItem.move",payload:{id:item.id,x:nx,y:ny},apply:()=>{item.x=nx;item.y=ny}})};
}

function renderItinerary(){
  const trip=currentTrip(),day=currentDay();$("#itineraryTitle").textContent=trip.title;
  $("#dayList").innerHTML=state.days.filter(d=>d.tripId===trip.id).sort((a,b)=>a.index-b.index).map(d=>`<button class="day-btn ${d.id===day.id?"active":""}" data-day="${d.id}"><i>D${d.index}</i><span><b>${d.title}</b><small>${formatDate(d.date)}</small></span></button>`).join("");
  $$("[data-day]").forEach(b=>b.onclick=()=>{state.ui.selectedDayId=b.dataset.day;saveLocal();renderItinerary();renderLive()});
  $("#dayDateLabel").textContent=formatDate(day.date).toUpperCase();$("#dayNameLabel").textContent=`DAY ${day.index} · ${day.title}`;
  const stops=stopsForDay();$("#stopList").innerHTML=stops.map(s=>`<article class="stop-card ${s.status}" data-stop="${s.id}">
    <time>${s.time}</time><span class="type-icon">${typeIcon(s.type)}</span><div class="stop-main"><b>${s.title}</b><small>${s.address} · ${s.duration} 分鐘</small></div>
    <div class="stop-actions"><button data-sa="complete" title="完成"><svg><use href="#i-check"/></svg></button><button data-sa="edit" title="編輯"><svg><use href="#i-edit"/></svg></button><button data-sa="delete" title="刪除"><svg><use href="#i-trash"/></svg></button></div></article>`).join("");
  $$(".stop-card").forEach(card=>$$("[data-sa]",card).forEach(b=>b.onclick=()=>handleStopAction(card.dataset.stop,b.dataset.sa)));
  $("#summaryStops").textContent=stops.length;const min=stops.reduce((a,s)=>a+s.duration,0);$("#summaryDuration").textContent=`${Math.floor(min/60)}h ${min%60}m`;$("#summaryCompleted").textContent=`${stops.length?Math.round(stops.filter(s=>s.status==="completed").length/stops.length*100):0}%`;
}
function openStopModal(stop=null){
  openModal({kicker:stop?"EDIT":"CREATE",title:stop?"編輯行程":"新增行程",fields:`<label>時間<input name="time" type="time" required value="${stop?.time||"10:00"}"></label><label>名稱<input name="title" required value="${stop?.title||""}"></label><label>類型<select name="type"><option value="place">景點</option><option value="food">餐廳</option><option value="transport">交通</option><option value="hotel">住宿</option></select></label><label>預計停留（分鐘）<input name="duration" type="number" min="0" value="${stop?.duration||60}"></label><label>地址<input name="address" value="${stop?.address||""}"></label>`,onSubmit:fd=>{const d=Object.fromEntries(fd.entries());d.duration=Number(d.duration);if(stop)optimistic({label:`編輯行程：${stop.title}`,actionType:"stop.update",payload:{id:stop.id},apply:()=>{Object.assign(stop,d);markDayDirty(stop.dayId)}});else optimistic({label:`新增行程：${d.title}`,actionType:"stop.create",payload:d,apply:()=>{state.stops.push({id:uid(),dayId:currentDay().id,status:"planned",...d});markDayDirty(currentDay().id)}})}});
  if(stop)$("#modalForm [name=type]").value=stop.type;
}
function markDayDirty(dayId){
  const day=state.days.find(d=>d.id===dayId);
  if(day&&day.bookSyncStatus!=="manual")day.bookSyncStatus="dirty";
  state.pages.filter(p=>p.dayId===dayId&&p.generatedFromDay&&!p.manualEdited).forEach(p=>p.syncStatus="dirty");
}
function handleStopAction(id,act){
  const s=state.stops.find(x=>x.id===id);if(!s)return;
  if(act==="edit")return openStopModal(s);
  if(act==="complete")return optimistic({label:`${s.status==="completed"?"恢復":"完成"}行程：${s.title}`,actionType:"stop.status",payload:{id},apply:()=>{s.status=s.status==="completed"?"planned":"completed"}});
  if(act==="delete"){if(!confirm(`刪除「${s.title}」？`))return;return optimistic({label:`刪除行程：${s.title}`,actionType:"stop.delete",payload:{id},apply:()=>{state.stops=state.stops.filter(x=>x.id!==id);markDayDirty(s.dayId)}})}
}
$("#newStopBtn").onclick=()=>openStopModal();$("#inlineAddStop").onclick=()=>openStopModal();
$("#newDayBtn").onclick=()=>openModal({title:"新增一天",fields:`<label>Day 編號<input name="index" type="number" value="11"></label><label>日期<input name="date" type="date" value="2026-08-18"></label><label>地區或主題<input name="title" required></label>`,onSubmit:fd=>{const d=Object.fromEntries(fd.entries());d.index=Number(d.index);optimistic({label:`新增 Day ${d.index}：${d.title}`,actionType:"day.create",payload:d,apply:()=>{const id=uid();state.days.push({id,tripId:currentTrip().id,pageMasterId:"master-day-journal",bookSyncStatus:"dirty",...d});state.ui.selectedDayId=id}})}});
$("#optimizeBtn").onclick=()=>{const list=stopsForDay();const sorted=[...list].sort((a,b)=>a.time.localeCompare(b.time));optimistic({label:"整理當日路線順序",actionType:"day.optimize",payload:{dayId:currentDay().id},apply:()=>{sorted.forEach((s,i)=>s.time=["08:30","10:00","11:30","13:00","14:30","18:30"][i]||s.time)}})};



/* =========================================================
   Journey Builder v0.5.0
   ========================================================= */
function placeCategoryLabel(value){
  return {must:"必去",want:"想去",food:"餐廳",shopping:"購物",backup:"備選"}[value]||value;
}
function masterById(id){return state.pageMasters.find(m=>m.id===id)||state.pageMasters[0]}
function placesForDay(dayId){return state.places.filter(p=>p.assignedDayId===dayId)}
function nextTimeForDay(dayId){
  const existing=stopsForDay(dayId);
  if(!existing.length)return "09:00";
  const last=existing[existing.length-1];
  const [h,m]=last.time.split(":").map(Number);
  const total=h*60+m+Math.max(60,last.duration||60);
  return `${String(Math.min(23,Math.floor(total/60))).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
}
function renderJourneyBuilder(){
  const trip=currentTrip();
  $("#builderTripTitle").textContent=trip.title;
  const assigned=state.places.filter(p=>p.assignedDayId).length;
  const unassigned=state.places.length-assigned;
  const dirty=state.days.filter(d=>d.tripId===trip.id&&d.bookSyncStatus==="dirty").length;
  $("#builderAssignedCount").textContent=assigned;
  $("#builderUnassignedCount").textContent=unassigned;
  $("#builderDirtyCount").textContent=dirty;

  const q=(state.ui.builderSearch||"").toLowerCase();
  const filter=state.ui.placeFilter||"all";
  const pool=state.places.filter(p=>{
    const matchesFilter=filter==="all"||p.category===filter;
    const matchesSearch=!q||(`${p.title} ${p.region} ${p.note} ${p.address}`).toLowerCase().includes(q);
    return !p.assignedDayId&&matchesFilter&&matchesSearch;
  });
  $("#poolCountLabel").textContent=`${pool.length} 個`;
  $("#builderPlacePool").innerHTML=pool.map(p=>`<article class="builder-place-card" draggable="true" data-place-id="${p.id}">
    <span class="place-tag">${placeCategoryLabel(p.category)}</span>
    <img src="${p.image}" alt="">
    <div><b>${escapeHtml(p.title)}</b><small>${escapeHtml(p.region)} · ${escapeHtml(p.note||"")}</small><em>拖曳到右側安排</em></div>
    <button data-place-menu="${p.id}"><svg><use href="#i-more"/></svg></button>
  </article>`).join("")||`<div class="queue-empty">沒有符合條件的素材</div>`;

  $$(".builder-place-card").forEach(card=>{
    card.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/place-id",card.dataset.placeId);card.classList.add("dragging")});
    card.addEventListener("dragend",()=>card.classList.remove("dragging"));
  });
  $$("[data-place-menu]").forEach(b=>b.onclick=e=>{e.stopPropagation();openPlaceModal(state.places.find(p=>p.id===b.dataset.placeMenu))});

  const days=state.days.filter(d=>d.tripId===trip.id).sort((a,b)=>a.index-b.index);
  $("#builderDayBoard").innerHTML=days.map(day=>{
    const dayStops=stopsForDay(day.id);
    const status=day.bookSyncStatus||"clean";
    return `<article class="builder-day-column" data-builder-day="${day.id}">
      <header>
        <div><small>${formatDate(day.date).toUpperCase()}</small><h4>DAY ${day.index} · ${escapeHtml(day.title)}</h4><p>${dayStops.length} 個行程 · ${placesForDay(day.id).length} 個素材</p></div>
        <button data-edit-day="${day.id}"><svg><use href="#i-edit"/></svg></button>
      </header>
      <select class="day-master-select" data-master-day="${day.id}">
        ${state.pageMasters.map(m=>`<option value="${m.id}" ${day.pageMasterId===m.id?"selected":""}>母版：${m.name}</option>`).join("")}
      </select>
      <div class="builder-stop-list">
        ${dayStops.length?dayStops.map(s=>`<div class="builder-stop" draggable="true" data-builder-stop-id="${s.id}" title="拖曳到其他 Day">
          <span class="builder-stop-grip">⋮⋮</span>
          <time>${s.time}</time>
          <div><b>${escapeHtml(s.title)}</b><small>${s.sourcePlaceId?"素材":"手動"} · ${typeIcon(s.type)} · ${s.duration} 分鐘</small></div>
          <button data-builder-return-stop="${s.id}" title="${s.sourcePlaceId?"移回未安排素材池":"刪除手動行程"}"><svg><use href="#i-x"/></svg></button>
        </div>`).join(""):`<div class="builder-day-empty">把左側未安排素材拖到這裡</div>`}
      </div>
      <div class="builder-day-footer"><span class="page-sync-badge ${status}">${status==="clean"?"旅行書頁面已同步":status==="manual"?"旅行書頁面手動保護":"旅行書頁面待同步"}</span><button data-builder-add-stop="${day.id}">＋ 手動新增</button></div>
    </article>`;
  }).join("");

  $$(".builder-stop").forEach(card=>{
    card.addEventListener("dragstart",e=>{
      e.stopPropagation();
      e.dataTransfer.setData("text/stop-id",card.dataset.builderStopId);
      card.classList.add("dragging");
    });
    card.addEventListener("dragend",()=>card.classList.remove("dragging"));
  });
  $$(".builder-day-column").forEach(col=>{
    col.addEventListener("dragover",e=>{e.preventDefault();col.classList.add("drop-active")});
    col.addEventListener("dragleave",e=>{if(!col.contains(e.relatedTarget))col.classList.remove("drop-active")});
    col.addEventListener("drop",e=>{
      e.preventDefault();col.classList.remove("drop-active");
      const targetDayId=col.dataset.builderDay;
      const stopId=e.dataTransfer.getData("text/stop-id");
      const placeId=e.dataTransfer.getData("text/place-id");
      if(stopId)moveStopToDay(stopId,targetDayId);
      else if(placeId)assignPlaceToDay(placeId,targetDayId);
    });
  });
  $$("[data-master-day]").forEach(sel=>sel.onchange=()=>{
    const day=state.days.find(d=>d.id===sel.dataset.masterDay);
    optimistic({label:`變更 Day ${day.index} 頁面母版`,actionType:"day.master.update",payload:{dayId:day.id,masterId:sel.value},apply:()=>{day.pageMasterId=sel.value;markDayDirty(day.id)}});
  });
  $$("[data-builder-add-stop]").forEach(b=>b.onclick=()=>{state.ui.selectedDayId=b.dataset.builderAddStop;saveLocal();openStopModal()});
  $$("[data-builder-return-stop]").forEach(b=>b.onclick=()=>{
    const stop=state.stops.find(s=>s.id===b.dataset.builderReturnStop);
    if(stop?.sourcePlaceId)returnStopToPool(stop.id);
    else handleStopAction(stop.id,"delete");
  });
  $$("[data-edit-day]").forEach(b=>b.onclick=()=>editBuilderDay(b.dataset.editDay));

  $("#generationStatusList").innerHTML=days.map(day=>`<div class="generation-status-item"><div><b>DAY ${day.index} · ${escapeHtml(day.title)}</b><span>${masterById(day.pageMasterId).name}</span></div><em class="${day.bookSyncStatus}">${day.bookSyncStatus==="clean"?"已同步":day.bookSyncStatus==="manual"?"手動保護":"待更新"}</em></div>`).join("");
}
function moveStopToDay(stopId,targetDayId){
  const stop=state.stops.find(s=>s.id===stopId);
  const targetDay=state.days.find(d=>d.id===targetDayId);
  if(!stop||!targetDay||stop.dayId===targetDayId)return;
  const oldDayId=stop.dayId;
  const nextTime=nextTimeForDay(targetDayId);
  const place=stop.sourcePlaceId?state.places.find(p=>p.id===stop.sourcePlaceId):null;
  optimistic({
    label:`移動行程：${stop.title} → Day ${targetDay.index}`,
    actionType:"journey.moveStop",
    payload:{stopId,targetDayId},
    apply:()=>{
      stop.dayId=targetDayId;
      stop.time=nextTime;
      if(place)place.assignedDayId=targetDayId;
      markDayDirty(oldDayId);
      markDayDirty(targetDayId);
      state.ui.selectedDayId=targetDayId;
    }
  });
}
function returnStopToPool(stopId){
  const stop=state.stops.find(s=>s.id===stopId);
  if(!stop)return;
  const oldDayId=stop.dayId;
  const place=stop.sourcePlaceId?state.places.find(p=>p.id===stop.sourcePlaceId):null;
  optimistic({
    label:`移回未安排素材：${stop.title}`,
    actionType:"journey.unassignPlace",
    payload:{stopId,placeId:place?.id||null},
    apply:()=>{
      if(place)place.assignedDayId=null;
      state.stops=state.stops.filter(s=>s.id!==stopId);
      markDayDirty(oldDayId);
    }
  });
}
function assignPlaceToDay(placeId,dayId){
  const place=state.places.find(p=>p.id===placeId),day=state.days.find(d=>d.id===dayId);
  if(!place||!day)return;
  const oldDay=place.assignedDayId;
  const existingStop=state.stops.find(s=>s.sourcePlaceId===place.id);
  optimistic({
    label:`安排素材：${place.title} → Day ${day.index}`,actionType:"journey.assignPlace",payload:{placeId,dayId},
    apply:()=>{
      place.assignedDayId=dayId;
      if(existingStop){existingStop.dayId=dayId;existingStop.time=nextTimeForDay(dayId)}
      else state.stops.push({id:uid(),sourcePlaceId:place.id,dayId,time:nextTimeForDay(dayId),title:place.title,type:place.kind||"place",duration:place.duration||60,status:"planned",address:place.address||""});
      if(oldDay)markDayDirty(oldDay);
      markDayDirty(dayId);
      state.ui.selectedDayId=dayId;
    }
  });
}
function openPlaceModal(place=null){
  openModal({kicker:place?"EDIT":"CREATE",title:place?"編輯素材":"新增旅行素材",fields:`
    <label>名稱<input name="title" required value="${escapeHtml(place?.title||"")}"></label>
    <label>分類<select name="category"><option value="must">必去</option><option value="want">想去</option><option value="food">餐廳</option><option value="shopping">購物</option><option value="backup">備選</option></select></label>
    <label>地區<input name="region" value="${escapeHtml(place?.region||"")}"></label>
    <label>地址<input name="address" value="${escapeHtml(place?.address||"")}"></label>
    <label>預計停留（分鐘）<input name="duration" type="number" value="${place?.duration||60}"></label>
    <label>備註<textarea name="note">${escapeHtml(place?.note||"")}</textarea></label>`,
    onSubmit:fd=>{
      const d=Object.fromEntries(fd.entries());d.duration=Number(d.duration);
      if(place)optimistic({label:`編輯素材：${place.title}`,actionType:"place.update",payload:{id:place.id},apply:()=>Object.assign(place,d)});
      else optimistic({label:`新增素材：${d.title}`,actionType:"place.create",payload:d,apply:()=>state.places.unshift({id:uid(),kind:d.category==="food"?"food":d.category==="shopping"?"shopping":"place",image:"assets/travel-33b77841cb5e.webp",assignedDayId:null,...d})});
    }});
  $("#modalForm [name=category]").value=place?.category||"want";
}
function editBuilderDay(dayId){
  const day=state.days.find(d=>d.id===dayId);if(!day)return;
  openModal({kicker:"EDIT",title:`編輯 Day ${day.index}`,fields:`
    <label>Day 編號<input name="index" type="number" value="${day.index}"></label>
    <label>日期<input name="date" type="date" value="${day.date}"></label>
    <label>地區或主題<input name="title" required value="${escapeHtml(day.title)}"></label>`,
    onSubmit:fd=>{const d=Object.fromEntries(fd.entries());d.index=Number(d.index);optimistic({label:`編輯 Day ${day.index}`,actionType:"day.update",payload:{id:day.id},apply:()=>{Object.assign(day,d);markDayDirty(day.id)}})}});
}
function generationPlan(){
  const trip=currentTrip(),preserve=$("#preserveManualToggle")?.checked!==false;
  return state.days.filter(d=>d.tripId===trip.id).sort((a,b)=>a.index-b.index).map(day=>{
    const existing=state.pages.find(p=>p.dayId===day.id&&p.generatedFromDay);
    let action="create";
    if(existing){
      if(existing.manualEdited&&preserve)action="preserve";
      else if(day.bookSyncStatus==="dirty")action="update";
      else action="none";
    }
    return {day,existing,action,master:masterById(day.pageMasterId)};
  });
}
function showGenerationPreview(){
  const plan=generationPlan();
  const text=plan.map(x=>`Day ${x.day.index} ${x.day.title}：${x.action==="create"?"建立新頁":x.action==="update"?"更新生成內容":x.action==="preserve"?"保留手動排版": "不變"}`).join("\n");
  openModal({kicker:"PREVIEW",title:"旅行書同步預覽",fields:`<label>這次預計執行<textarea readonly style="min-height:260px">${escapeHtml(text)}</textarea></label>`,submitLabel:"關閉",onSubmit:()=>{}});
}
function generateBookPages(){
  const trip=currentTrip(),plan=generationPlan();
  const changes=plan.filter(x=>x.action!=="none"&&x.action!=="preserve");
  if(!changes.length){toast("旅行書已是最新狀態","沒有需要生成或同步的頁面");return}
  optimistic({
    label:`生成／同步旅行書：${changes.length} 個 Day`,actionType:"book.generate",payload:{tripId:trip.id,days:changes.map(x=>x.day.id)},
    apply:()=>{
      let maxNumber=Math.max(...state.pages.filter(p=>p.tripId===trip.id).map(p=>p.number),0);
      plan.forEach(({day,existing,action,master})=>{
        if(action==="preserve"){day.bookSyncStatus="manual";return}
        if(action==="create"){
          maxNumber++;
          const subtitle=stopsForDay(day.id).slice(0,3).map(s=>s.title).join("・")||"尚未安排內容";
          state.pages.push({id:uid(),tripId:trip.id,number:maxNumber,title:day.title,subtitle,type:master.pageType,dayId:day.id,generatedFromDay:true,syncStatus:"clean",manualEdited:false,pageMasterId:master.id});
        }
        if(action==="update"&&existing){
          existing.title=day.title;
          existing.subtitle=stopsForDay(day.id).slice(0,3).map(s=>s.title).join("・")||existing.subtitle;
          existing.type=master.pageType;
          existing.pageMasterId=master.id;
          existing.syncStatus="clean";
        }
        day.bookSyncStatus="clean";
      });
      trip.pages=Math.max(trip.pages,maxNumber);
      trip.editedPages=Math.min(trip.pages,state.pages.filter(p=>p.tripId===trip.id).length);
    }
  });
}
function initJourneyBuilderEvents(){
  if($("#builderAddPlaceBtn").dataset.bound)return;
  $("#builderAddPlaceBtn").dataset.bound="1";
  $("#builderAddPlaceBtn").onclick=()=>openPlaceModal();
  $("#builderNewDayBtn").onclick=()=>$("#newDayBtn").click();
  $("#masterTestHelpBtn").onclick=()=>openModal({
    kicker:"HOW TO TEST",
    title:"頁面母版怎麼測？",
    fields:`<div class="master-test-copy">
      ① 在任一 Day 把「母版：當日手帳」改成「照片故事頁」或其他母版。<br>
      ② 該 Day 下方會變成黃色「旅行書頁面待同步」。<br>
      ③ 按右上角「生成／同步旅行書」，再到「旅行本工作室」看該 Day 生成頁的頁面類型是否改變。<br><br>
      母版只改頁面結構；整本書的顏色與美術仍由 Book Style 控制。
    </div>`,
    submitLabel:"知道了",
    onSubmit:()=>{}
  });
  $("#generateBookBtn").onclick=generateBookPages;
  $("#previewGenerationBtn").onclick=showGenerationPreview;
  $("#builderSearch").oninput=e=>{state.ui.builderSearch=e.target.value;saveLocal();renderJourneyBuilder()};
  $$(".builder-filters button").forEach(b=>b.onclick=()=>{$$(".builder-filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.ui.placeFilter=b.dataset.placeFilter;saveLocal();renderJourneyBuilder()});
}

/* =========================================================
   Book Style Pack Lab
   ========================================================= */
const BOOK_STYLE_ENUMS={
  displayPreset:["editorial-serif","modern-serif","humanist-sans","timetable-mono"],
  bodyPreset:["humanist-sans","classic-sans","book-serif"],
  texture:["warm-fiber","clean","cold-grain","aged-speckle"],
  edgeTreatment:["clean","clean-soft","aged-soft","deckled-soft"],
  photoShape:["polaroid","rounded","ticket-cut","full-bleed"],
  photoShadow:["soft-lift","print-flat","deep-frame","none"],
  tapeStyle:["linen","masking","none"],
  stampStyle:["passport","railway","botanical","minimal","retro"],
  dividerStyle:["hand-drawn","timetable","minimal","dotted"],
  pageNumberStyle:["minimal","ticket","folio"],
  density:["compact","comfortable","airy"],
  pageTypes:["cover","journal","place","map","info","free"]
};
const FONT_PRESETS={
  "editorial-serif":`"Iowan Old Style","Noto Serif TC",Georgia,serif`,
  "modern-serif":`Rockwell,"Sitka Text","Noto Serif TC",serif`,
  "humanist-sans":`system-ui,"Noto Sans TC","Microsoft JhengHei",sans-serif`,
  "timetable-mono":`ui-monospace,SFMono-Regular,Consolas,monospace`
};
function currentPreviewStyle(){
  return state.bookStyles.find(s=>s.styleId===state.ui.previewBookStyleId)||state.bookStyles[0];
}
function styleForTrip(trip=currentTrip()){
  return state.bookStyles.find(s=>s.styleId===trip.bookStyleId)||state.bookStyles[0];
}
function safeHex(value,fallback){
  return /^#[0-9a-f]{6}$/i.test(String(value||""))?String(value).toUpperCase():fallback;
}
function clampNumber(value,min,max,fallback){
  const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;
}
function styleVisualConfig(style){
  const t=style.tokens||{},c=t.colors||{},ty=t.typography||{},p=t.paper||{},ph=t.photo||{},d=t.decoration||{};
  return {
    page:safeHex(c.pageBackground,"#F7EFDF"),
    ink:safeHex(c.inkPrimary,"#334B58"),
    muted:safeHex(c.inkSecondary,"#6A655C"),
    accent:safeHex(c.accentPrimary,"#A45F43"),
    accent2:safeHex(c.accentSecondary,"#D9C5A4"),
    rule:safeHex(c.rule,"#C8B79D"),
    titleScale:clampNumber(ty.titleScale,.8,1.3,1),
    bodyScale:clampNumber(ty.bodyScale,.9,1.2,1),
    letter:clampNumber(ty.letterSpacing,-.04,.08,-.01),
    display:FONT_PRESETS[ty.displayPreset]||FONT_PRESETS["editorial-serif"],
    texture:p.texture||"warm-fiber",
    photoShape:ph.shape||"polaroid",
    photoShadow:ph.shadow||"soft-lift",
    tape:d.tapeStyle||"linen",
    divider:d.dividerStyle||"hand-drawn"
  };
}
function applyBookStyleVisual(element,style){
  if(!element||!style)return;
  const v=styleVisualConfig(style);
  element.style.setProperty("--bs-page",v.page);
  element.style.setProperty("--bs-ink",v.ink);
  element.style.setProperty("--bs-muted",v.muted);
  element.style.setProperty("--bs-accent",v.accent);
  element.style.setProperty("--bs-accent2",v.accent2);
  element.style.setProperty("--bs-rule",v.rule);
  element.style.setProperty("--bs-title-scale",v.titleScale);
  element.style.setProperty("--bs-body-scale",v.bodyScale);
  element.style.setProperty("--bs-letter",v.letter+"em");
  element.style.setProperty("--bs-display",v.display);
  element.classList.toggle("no-grain",v.texture==="clean");
  ["photo-rounded","photo-ticket","shadow-none","shadow-flat","tape-none","tape-masking","divider-timetable","divider-minimal"].forEach(c=>element.classList.remove(c));
  if(v.photoShape==="rounded")element.classList.add("photo-rounded");
  if(v.photoShape==="ticket-cut")element.classList.add("photo-ticket");
  if(v.photoShadow==="none")element.classList.add("shadow-none");
  if(v.photoShadow==="print-flat")element.classList.add("shadow-flat");
  if(v.tape==="none")element.classList.add("tape-none");
  if(v.tape==="masking")element.classList.add("tape-masking");
  if(v.divider==="timetable")element.classList.add("divider-timetable");
  if(v.divider==="minimal")element.classList.add("divider-minimal");
}
function renderBookStyles(){
  const selected=currentPreviewStyle(),trip=currentTrip(),applied=styleForTrip(trip);
  $("#styleCountBadge").textContent=`${state.bookStyles.length} 套`;
  $("#bookStyleList").innerHTML=state.bookStyles.map(s=>{
    const c=s.tokens.colors;
    return `<button class="book-style-item ${s.styleId===selected.styleId?"active":""} ${s.styleId===trip.bookStyleId?"applied":""}" data-style-id="${s.styleId}">
      <span class="book-style-swatch" style="background:linear-gradient(145deg,${safeHex(c.pageBackground,"#eee")},${safeHex(c.accentSecondary,"#ccc")});border-left:8px solid ${safeHex(c.accentPrimary,"#999")}"></span>
      <div><b>${escapeHtml(s.name)}</b><small>${escapeHtml(s.description)}</small><em>v${escapeHtml(s.version||"1.0.0")} · ${s.source==="built-in"?"內建":"已匯入"}</em></div>
      <i class="style-applied-dot" title="目前旅行使用中"></i>
    </button>`;
  }).join("");
  $$("[data-style-id]").forEach(b=>b.onclick=()=>{state.ui.previewBookStyleId=b.dataset.styleId;saveLocal();renderBookStyles()});
  $("#stylePreviewName").textContent=selected.name;
  $("#stylePreviewDescription").textContent=selected.description;
  const isApplied=selected.styleId===trip.bookStyleId;
  $("#appliedStyleStatus").textContent=isApplied?"目前旅行使用中":`預覽中 · 目前使用 ${applied.name}`;
  $("#appliedStyleStatus").classList.toggle("preview-only",!isApplied);
  $("#applyStyleBtn").disabled=isApplied;
  $("#applyStyleBtn").textContent=isApplied?"已套用到這本書":"套用到這本旅行書";
  applyBookStyleVisual($("#bookStylePreview"),selected);
  const t=selected.tokens;
  $("#styleTokenSummary").innerHTML=[
    ["紙張",t.paper.texture],["照片",t.photo.shape],["裝飾",t.decoration.dividerStyle],["密度",t.spacing.density]
  ].map(([k,v])=>`<div class="style-token-chip"><span>${k}</span><b>${escapeHtml(v)}</b></div>`).join("");
}
function escapeHtml(value){
  return String(value??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function buildStylePrompt(){
  const theme=$("#styleThemeInput").value.trim()||"＿＿＿＿（請填入主題）";
  const mood=$("#styleMoodInput").value.trim()||"由主題合理推導，但保持高級、清楚、可閱讀";
  const colors=$("#styleColorInput").value.trim()||"由主題合理推導 5–6 個協調色";
  const avoid=$("#styleAvoidInput").value.trim()||"廉價感、功能文字過小、過度裝飾";
  const prompt=`今天要的主題是：${theme}
希望的氣氛：${mood}
偏好的色彩或材質：${colors}
不希望出現：${avoid}

你是 Jonaminz Travel 的 Book Style Designer。請為上述主題設計一套可匯入的「書籍風格包（Book Style Pack）」。

先理解三層差異：
1. App Theme：Travel 操作介面的外觀，本次不要修改。
2. Page Master：封面、當日手帳、景點、地圖等頁面的結構與資料插槽，本次不要修改。
3. Book Style：整本旅行書的色彩、紙張、字體預設、照片處理、線條、裝飾與資訊密度；本次只輸出這一層。

請輸出一個 JSON 物件，不要輸出 CSS、JavaScript、HTML、Markdown 說明、外部網址、base64、字型檔或可執行內容。JSON 必須符合以下結構：

{
  "schemaVersion": "1.0",
  "styleId": "英文小寫 kebab-case，必須唯一",
  "name": "繁體中文或中英並列名稱",
  "version": "1.0.0",
  "description": "1–2 句清楚描述風格與適用旅行",
  "author": "AI generated for Jonaminz",
  "tokens": {
    "colors": {
      "pageBackground": "#RRGGBB",
      "inkPrimary": "#RRGGBB",
      "inkSecondary": "#RRGGBB",
      "accentPrimary": "#RRGGBB",
      "accentSecondary": "#RRGGBB",
      "rule": "#RRGGBB"
    },
    "typography": {
      "displayPreset": "editorial-serif | modern-serif | humanist-sans | timetable-mono",
      "bodyPreset": "humanist-sans | classic-sans | book-serif",
      "titleScale": "0.80–1.30 的數字",
      "bodyScale": "0.90–1.20 的數字",
      "letterSpacing": "-0.04–0.08 的數字，單位視為 em"
    },
    "paper": {
      "texture": "warm-fiber | clean | cold-grain | aged-speckle",
      "grainOpacity": "0–0.20 的數字",
      "edgeTreatment": "clean | clean-soft | aged-soft | deckled-soft"
    },
    "photo": {
      "shape": "polaroid | rounded | ticket-cut | full-bleed",
      "shadow": "soft-lift | print-flat | deep-frame | none",
      "saturation": "0.60–1.20 的數字",
      "contrast": "0.80–1.20 的數字"
    },
    "decoration": {
      "tapeStyle": "linen | masking | none",
      "stampStyle": "passport | railway | botanical | minimal | retro",
      "dividerStyle": "hand-drawn | timetable | minimal | dotted",
      "pageNumberStyle": "minimal | ticket | folio"
    },
    "spacing": {
      "density": "compact | comfortable | airy",
      "pageMargin": "0.85–1.20 的數字",
      "blockGap": "0.80–1.25 的數字"
    }
  },
  "compatibility": {
    "pageTypes": ["cover", "journal", "place", "map", "info", "free"] 中適用的類型
  },
  "assetRequests": [
    "若風格未來需要額外 SVG／紙紋／郵戳，僅用文字描述需求；沒有就給空陣列"
  ]
}

硬性規則：
- 所有色彩必須是六位 HEX。
- 一般正文在 100% 瀏覽器縮放下必須維持舒適可讀；不要靠縮小文字製造高級感。
- titleScale、bodyScale、spacing 必須在指定範圍內。
- 風格要能同時用於 A4 PDF 與手機閱讀投影。
- 不得加入 selector、className、style、css、script、url、fontFile 等欄位。
- 不得改變頁面母版結構。
- 內容要完整，不要省略任何必要欄位。
- 最終只輸出合法 JSON；不要加 \`\`\`json，也不要在 JSON 前後解釋。`;
  $("#stylePromptOutput").value=prompt;
  return prompt;
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}
  catch{
    const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();
    const ok=document.execCommand("copy");ta.remove();return ok;
  }
}
function stripJsonFence(raw){
  let text=String(raw||"").trim();
  const fenced=text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if(fenced)text=fenced[1].trim();
  const first=text.indexOf("{"),last=text.lastIndexOf("}");
  if(first>=0&&last>first)text=text.slice(first,last+1);
  return text;
}
function normalizeStyleId(value){
  return String(value||"").trim().toLowerCase().replace(/[^a-z0-9-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,64);
}
function validateBookStylePack(raw){
  const errors=[],warnings=[];let pack;
  try{pack=JSON.parse(stripJsonFence(raw))}
  catch(e){return {valid:false,errors:["JSON 無法解析："+e.message],warnings,pack:null}}
  if(!pack||Array.isArray(pack)||typeof pack!=="object")errors.push("最外層必須是 JSON object");
  const forbidden=["css","style","script","javascript","html","url","fontFile","base64","selector","className"];
  const serialized=JSON.stringify(pack);
  forbidden.forEach(k=>{if(new RegExp(`"${k}"\\s*:`,`i`).test(serialized))errors.push(`禁止欄位：${k}`)});
  if(pack.schemaVersion!=="1.0")errors.push('schemaVersion 必須是 "1.0"');
  pack.styleId=normalizeStyleId(pack.styleId);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pack.styleId))errors.push("styleId 必須是英文小寫 kebab-case");
  if(!String(pack.name||"").trim())errors.push("缺少 name");
  if(!/^\d+\.\d+\.\d+$/.test(String(pack.version||"")))errors.push("version 必須是 semver，例如 1.0.0");
  if(!String(pack.description||"").trim())errors.push("缺少 description");
  const t=pack.tokens;
  if(!t||typeof t!=="object")errors.push("缺少 tokens");
  const colors=t?.colors||{};
  ["pageBackground","inkPrimary","inkSecondary","accentPrimary","accentSecondary","rule"].forEach(k=>{
    if(!/^#[0-9A-F]{6}$/i.test(String(colors[k]||"")))errors.push(`tokens.colors.${k} 必須是 #RRGGBB`);
  });
  const ty=t?.typography||{};
  if(!BOOK_STYLE_ENUMS.displayPreset.includes(ty.displayPreset))errors.push("typography.displayPreset 不在允許值");
  if(!BOOK_STYLE_ENUMS.bodyPreset.includes(ty.bodyPreset))errors.push("typography.bodyPreset 不在允許值");
  [["titleScale",ty.titleScale,.8,1.3],["bodyScale",ty.bodyScale,.9,1.2],["letterSpacing",ty.letterSpacing,-.04,.08]].forEach(([k,v,min,max])=>{
    if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)errors.push(`typography.${k} 必須介於 ${min}–${max}`);
  });
  const paper=t?.paper||{};
  if(!BOOK_STYLE_ENUMS.texture.includes(paper.texture))errors.push("paper.texture 不在允許值");
  if(!BOOK_STYLE_ENUMS.edgeTreatment.includes(paper.edgeTreatment))errors.push("paper.edgeTreatment 不在允許值");
  if(!Number.isFinite(Number(paper.grainOpacity))||Number(paper.grainOpacity)<0||Number(paper.grainOpacity)>.2)errors.push("paper.grainOpacity 必須介於 0–0.20");
  const photo=t?.photo||{};
  if(!BOOK_STYLE_ENUMS.photoShape.includes(photo.shape))errors.push("photo.shape 不在允許值");
  if(!BOOK_STYLE_ENUMS.photoShadow.includes(photo.shadow))errors.push("photo.shadow 不在允許值");
  [["saturation",photo.saturation,.6,1.2],["contrast",photo.contrast,.8,1.2]].forEach(([k,v,min,max])=>{
    if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)errors.push(`photo.${k} 必須介於 ${min}–${max}`);
  });
  const deco=t?.decoration||{};
  if(!BOOK_STYLE_ENUMS.tapeStyle.includes(deco.tapeStyle))errors.push("decoration.tapeStyle 不在允許值");
  if(!BOOK_STYLE_ENUMS.stampStyle.includes(deco.stampStyle))errors.push("decoration.stampStyle 不在允許值");
  if(!BOOK_STYLE_ENUMS.dividerStyle.includes(deco.dividerStyle))errors.push("decoration.dividerStyle 不在允許值");
  if(!BOOK_STYLE_ENUMS.pageNumberStyle.includes(deco.pageNumberStyle))errors.push("decoration.pageNumberStyle 不在允許值");
  const spacing=t?.spacing||{};
  if(!BOOK_STYLE_ENUMS.density.includes(spacing.density))errors.push("spacing.density 不在允許值");
  [["pageMargin",spacing.pageMargin,.85,1.2],["blockGap",spacing.blockGap,.8,1.25]].forEach(([k,v,min,max])=>{
    if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max)errors.push(`spacing.${k} 必須介於 ${min}–${max}`);
  });
  const pages=pack.compatibility?.pageTypes;
  if(!Array.isArray(pages)||!pages.length)errors.push("compatibility.pageTypes 至少需要一項");
  else pages.forEach(p=>{if(!BOOK_STYLE_ENUMS.pageTypes.includes(p))errors.push(`未知 pageType：${p}`)});
  if(pack.assetRequests&&!Array.isArray(pack.assetRequests))errors.push("assetRequests 必須是陣列");
  if(state.bookStyles.some(s=>s.styleId===pack.styleId))warnings.push("相同 styleId 已存在，匯入時會更新該風格版本");
  pack.author=String(pack.author||"AI generated for Jonaminz");
  pack.source="imported";
  pack.assetRequests=Array.isArray(pack.assetRequests)?pack.assetRequests:[];
  return {valid:errors.length===0,errors,warnings,pack};
}
function showStyleValidation(result){
  const el=$("#styleValidationResult");
  if(result.valid){
    el.className="validation-result valid";
    el.innerHTML=`✓ 格式通過：<b>${escapeHtml(result.pack.name)}</b> · ${escapeHtml(result.pack.styleId)}${result.warnings.length?`<br>提醒：${result.warnings.map(escapeHtml).join("；")}`:""}`;
  }else{
    el.className="validation-result invalid";
    el.innerHTML=`驗證失敗：<br>${result.errors.map(e=>"• "+escapeHtml(e)).join("<br>")}`;
  }
}
function sampleImportedStyle(){
  return {
    schemaVersion:"1.0",styleId:"taiwan-retro-postcard",name:"台灣復古明信片",version:"1.0.0",
    description:"褪色郵局綠、朱紅郵戳與暖紙色，像收藏多年的島內旅行明信片。",
    author:"AI generated for Jonaminz",
    tokens:{
      colors:{pageBackground:"#F2E6CF",inkPrimary:"#334B43",inkSecondary:"#6D6255",accentPrimary:"#B14F3D",accentSecondary:"#D5C49F",rule:"#A99A7D"},
      typography:{displayPreset:"editorial-serif",bodyPreset:"classic-sans",titleScale:1.02,bodyScale:1,letterSpacing:0.01},
      paper:{texture:"aged-speckle",grainOpacity:0.11,edgeTreatment:"aged-soft"},
      photo:{shape:"rounded",shadow:"print-flat",saturation:0.86,contrast:0.95},
      decoration:{tapeStyle:"masking",stampStyle:"retro",dividerStyle:"dotted",pageNumberStyle:"folio"},
      spacing:{density:"comfortable",pageMargin:1.02,blockGap:1}
    },
    compatibility:{pageTypes:["cover","journal","place","map","free"]},
    assetRequests:["台灣舊郵戳 SVG","低對比紙纖維紋理"]
  };
}
function initStyleLabEvents(){
  if($("#buildPromptBtn").dataset.bound)return;
  $("#buildPromptBtn").dataset.bound="1";
  $("#buildPromptBtn").onclick=()=>{buildStylePrompt();toast("正式 Prompt 已更新","可以先閱讀，再按複製")};
  $("#copyPromptBtn").onclick=async()=>{const text=buildStylePrompt();const ok=await copyText(text);toast(ok?"Prompt 已複製":"無法自動複製",ok?"直接貼到新的 AI 對話即可":"請手動選取文字","",null)};
  ["styleThemeInput","styleMoodInput","styleColorInput","styleAvoidInput"].forEach(id=>$("#"+id).addEventListener("input",buildStylePrompt));
  $$(".ai-panel-tabs button").forEach(b=>b.onclick=()=>{$$(".ai-panel-tabs button").forEach(x=>x.classList.remove("active"));$$(".ai-style-body").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(`#style-panel-${b.dataset.stylePanel}`).classList.add("active")});
  $("#sampleStyleBtn").onclick=()=>{$("#stylePackInput").value=JSON.stringify(sampleImportedStyle(),null,2);showStyleValidation(validateBookStylePack($("#stylePackInput").value))};
  $("#validateStyleBtn").onclick=()=>showStyleValidation(validateBookStylePack($("#stylePackInput").value));
  $("#importStyleBtn").onclick=()=>{
    const result=validateBookStylePack($("#stylePackInput").value);showStyleValidation(result);if(!result.valid)return;
    const existing=state.bookStyles.find(s=>s.styleId===result.pack.styleId);
    optimistic({
      label:`匯入書籍風格：${result.pack.name}`,actionType:"bookStyle.import",payload:{styleId:result.pack.styleId},
      apply:()=>{
        if(existing)Object.assign(existing,result.pack);else state.bookStyles.unshift(result.pack);
        state.ui.previewBookStyleId=result.pack.styleId;
      }
    });
  };
  $("#applyStyleBtn").onclick=()=>{
    const style=currentPreviewStyle(),trip=currentTrip();
    optimistic({label:`套用書籍風格：${style.name}`,actionType:"trip.bookStyle.apply",payload:{tripId:trip.id,styleId:style.styleId},apply:()=>trip.bookStyleId=style.styleId});
  };
  $("#exportStyleBtn").onclick=()=>{
    const style=currentPreviewStyle(),blob=new Blob([JSON.stringify(style,null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${style.styleId}.travel-style.json`;a.click();URL.revokeObjectURL(a.href);
    toast("風格包已匯出",a.download);
  };
  buildStylePrompt();
}

function renderTemplates(){
  $("#templateList").innerHTML=state.templates.map((t,i)=>`<button class="template-row ${i===1?"active":""}"><i>${String(i+1).padStart(2,"0")}</i><span><b>${t.name}</b><small>${t.kind}</small></span></button>`).join("");
}
$("#saveTemplateBtn").onclick=()=>optimistic({label:"儲存模板設定",actionType:"template.update",payload:{templateId:"tpl-journal"},apply:()=>{} });

function renderLive(){
  const trip=currentTrip(),day=currentDay(),stops=stopsForDay();$("#mobileTripTitle").textContent=trip.title;$("#mobileDay").textContent=`DAY ${day.index} · ${day.title}`;
  const next=stops.find(s=>s.status==="planned")||stops[0];
  $("#nextStopCard").innerHTML=next?`<img src="assets/travel-b61f95618e57.webp" alt=""><div><small>${next.time} 出發</small><h2>${next.title}</h2><p>預計停留 ${next.duration} 分鐘</p><button id="navigateBtn">開始導航</button></div>`:`<div><h2>今天完成了</h2><p>可以開始整理回憶。</p></div>`;
  $("#mobileSchedule").innerHTML=stops.map(s=>`<article class="mobile-row ${s.status==="completed"?"completed":s.id===next?.id?"current":""}" data-mobile-stop="${s.id}"><time>${s.time}</time><i></i><div><b>${s.title}</b><small>${s.status==="completed"?"已完成":s.duration+" 分鐘"}</small></div><button title="切換完成"><svg><use href="#i-check"/></svg></button></article>`).join("");
  $$("[data-mobile-stop] button").forEach(b=>b.onclick=()=>handleStopAction(b.closest("[data-mobile-stop]").dataset.mobileStop,"complete"));
  $("#navigateBtn")?.addEventListener("click",()=>toast("MVP 導航","此處未來接 Google Maps deeplink"));
}
$("#memoryBtn").onclick=()=>openModal({title:"加入一句旅行回憶",fields:`<label>今天想記住什麼？<textarea name="memory" required placeholder="例如：長廊比想像中還漂亮。"></textarea></label>`,onSubmit:fd=>optimistic({label:"新增旅行回憶",actionType:"memory.create",payload:{text:fd.get("memory")},apply:()=>{}})});

function renderDiagnostics(){
  const queue=state.queue;
  $("#queueList").innerHTML=queue.length?queue.map(q=>`<article class="queue-item ${q.status==="failed"?"failed":""}"><div><b>${q.label}</b><span>${q.status} · attempts ${q.attempts}</span></div><button data-retry="${q.id}">${q.status==="failed"?"重試":"等待中"}</button></article>`).join(""):`<div class="queue-empty">同步佇列目前是空的</div>`;
  $$("[data-retry]").forEach(b=>b.onclick=()=>retryAction(b.dataset.retry));
  $("#actionLog").innerHTML=state.log.slice(0,25).map(l=>`<article class="log-item"><time>${l.time}</time><div><b>${l.label}</b><span>${l.status}</span></div></article>`).join("")||`<div class="queue-empty">還沒有操作紀錄</div>`;
  $("#dataStats").innerHTML=[["旅行",state.trips.length],["頁面",state.pages.length],["行程",state.stops.length],["素材",state.materials.length],["景點池",state.places.length],["風格包",state.bookStyles.length],["待同步",state.queue.length],["失敗",state.queue.filter(q=>q.status==="failed").length]].map(([k,v])=>`<div class="stat"><span>${k}</span><b>${v}</b></div>`).join("");
  setSyncUI();
}
$("#retryAllBtn").onclick=()=>state.queue.filter(q=>q.status==="failed").forEach(q=>retryAction(q.id));
$("#clearLogBtn").onclick=()=>{state.log=[];saveLocal();renderDiagnostics()};

function renderAll(){
  $("#undoBtn").disabled=!undoStack.length;$("#redoBtn").disabled=!redoStack.length;
  renderLibrary();renderJourneyBuilder();renderStudio();renderItinerary();renderTemplates();renderBookStyles();renderLive();renderDiagnostics();setSyncUI();
}
$("#offlineToggle").onclick=()=>{state.settings.offline=!state.settings.offline;saveLocal();const b=$("#offlineToggle");b.classList.toggle("offline",state.settings.offline);b.querySelector("span").textContent=state.settings.offline?"離線模式":"線上模式";b.querySelector("use").setAttribute("href",state.settings.offline?"#i-offline":"#i-cloud");renderDiagnostics();toast(state.settings.offline?"已切換離線模式":"已恢復線上模式",state.settings.offline?"新的操作會立即更新並留在同步佇列":"正在送出離線期間的操作","warn");if(!state.settings.offline)flushQueue()};
$("#settingsOpen").onclick=()=>$("#settingsDrawer").classList.add("open");$("#settingsClose").onclick=()=>$("#settingsDrawer").classList.remove("open");
$("#latencyRange").value=state.settings.latency;$("#failureRange").value=state.settings.failureRate;$("#autoRetryToggle").checked=state.settings.autoRetry;
$("#latencyValue").textContent=state.settings.latency+" ms";$("#failureValue").textContent=state.settings.failureRate+"%";
$("#latencyRange").oninput=e=>{state.settings.latency=Number(e.target.value);$("#latencyValue").textContent=e.target.value+" ms";saveLocal()};
$("#failureRange").oninput=e=>{state.settings.failureRate=Number(e.target.value);$("#failureValue").textContent=e.target.value+"%";saveLocal()};
$("#autoRetryToggle").onchange=e=>{state.settings.autoRetry=e.target.checked;saveLocal()};
$("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="jonaminz-travel-demo-data.json";a.click();URL.revokeObjectURL(a.href);toast("已匯出 JSON","可交給後續 AI 或匯入另一台瀏覽器")};
$("#importInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);saveLocal();renderAll();toast("資料匯入成功")}catch{toast("匯入失敗","JSON 格式不正確","error")}};r.readAsText(f);e.target.value=""};
$("#settingsOpen").addEventListener("click",()=>{});
$("#settingsClose").addEventListener("click",()=>{});
$("#modalClose").addEventListener("click",closeModal);

initJourneyBuilderEvents();
initStyleLabEvents();
if(state.settings.offline){$("#offlineToggle").classList.add("offline");$("#offlineToggle span").textContent="離線模式";$("#offlineToggle use").setAttribute("href","#i-offline")}
showView(state.ui.view||"library");renderAll();