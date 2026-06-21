# Figma 헬퍼 함수 — use_figma 코드 상단에 붙여넣기

3-Zone 와이어프레임 빌더. `use_figma` 호출 코드 최상단에 통째로 복붙.

```js
// ═══ LOAD FONTS ════════════════════════════════════════════════
await figma.loadFontAsync({family:'Inter', style:'Bold'});
await figma.loadFontAsync({family:'Inter', style:'Semi Bold'});
await figma.loadFontAsync({family:'Inter', style:'Medium'});
await figma.loadFontAsync({family:'Inter', style:'Regular'});

// ═══ COLOR TOKENS ═══════════════════════════════════════════════
const BLK  = {r:0.07,  g:0.07,  b:0.07};
const WHT  = {r:1,     g:1,     b:1};
const G50  = {r:0.976, g:0.980, b:0.984};
const G100 = {r:0.949, g:0.953, b:0.961};
const G200 = {r:0.898, g:0.906, b:0.918};
const G300 = {r:0.820, g:0.831, b:0.843};
const G400 = {r:0.620, g:0.635, b:0.658};
const G500 = {r:0.420, g:0.447, b:0.502};
const G700 = {r:0.239, g:0.267, b:0.318};
const LBL  = {r:0.53,  g:0.53,  b:0.53};
const DHDR = {r:0.20,  g:0.20,  b:0.20};
const ACC  = {r:0.20,  g:0.44,  b:0.95};
const YLW  = {r:0.98,  g:0.75,  b:0.08};
function solid(c) { return [{type:'SOLID', color:c}]; }

// ═══ LAYOUT CONSTANTS ═══════════════════════════════════════════
const FW=1920, FH=1080, HDR_H=68, DESC_W=430;
const WIRE_W=FW-DESC_W, WIRE_H=FH-HDR_H; // 1490, 1012

// ═══ 3-ZONE BUILDERS ════════════════════════════════════════════

// 메타 헤더 (2행×6열)
// cells: [경로, 화면ID, 버전, 화면명, 작성자, 작성일]
function metaHdr(parent, cells) {
  const hdr=figma.createFrame(); hdr.name='MetaHeader';
  hdr.resize(FW,HDR_H); hdr.x=0; hdr.y=0;
  hdr.fills=solid(WHT); hdr.clipsContent=true; parent.appendChild(hdr);
  const LABELS=[['화면 경로','화면ID','버전'],['화면명','작성자','작성일']];
  const rh=HDR_H/2, cw=FW/3;
  for(let r=0;r<2;r++) for(let c=0;c<3;c++){
    const lb=figma.createFrame(); lb.resize(100,rh); lb.x=c*cw; lb.y=r*rh; lb.fills=solid(LBL); hdr.appendChild(lb);
    const lt=figma.createText(); lt.fontName={family:'Inter',style:'Regular'};
    lt.characters=LABELS[r][c]; lt.fontSize=11; lt.fills=solid(WHT); lt.x=8; lt.y=(rh-13)/2; lb.appendChild(lt);
    const vb=figma.createFrame(); vb.resize(cw-100,rh); vb.x=c*cw+100; vb.y=r*rh;
    vb.fills=solid(WHT); vb.strokes=solid(G200); vb.strokeWeight=0.5; vb.strokeAlign='INSIDE'; hdr.appendChild(vb);
    const vt=figma.createText(); vt.fontName={family:'Inter',style:'Regular'};
    vt.characters=cells[r*3+c]||'—'; vt.fontSize=12; vt.fills=solid(BLK); vt.x=12; vt.y=(rh-14)/2; vb.appendChild(vt);
  }
}

// 와이어프레임 영역 (1490×1012)
function wireArea(parent, bg) {
  const a=figma.createFrame(); a.name='WireframeArea';
  a.resize(WIRE_W,WIRE_H); a.x=0; a.y=HDR_H;
  a.fills=solid(bg||WHT); a.clipsContent=true;
  a.strokes=solid(G200); a.strokeWeight=1; a.strokeAlign='INSIDE';
  parent.appendChild(a); return a;
}

// Description 패널 (430×1012)
// items: [{num:'01', title:'영역명', body:['bullet1','bullet2']}]
function descPanel(parent, items) {
  const p=figma.createFrame(); p.name='Description';
  p.resize(DESC_W,WIRE_H); p.x=WIRE_W; p.y=HDR_H;
  p.fills=solid(WHT); p.clipsContent=true; parent.appendChild(p);
  const ph=figma.createFrame(); ph.resize(DESC_W,40); ph.x=0; ph.y=0; ph.fills=solid(DHDR); p.appendChild(ph);
  const pt=figma.createText(); pt.fontName={family:'Inter',style:'Semi Bold'};
  pt.characters='Description'; pt.fontSize=14; pt.fills=solid(WHT); pt.x=16; pt.y=12; ph.appendChild(pt);
  let cy=56;
  for(const item of items){
    const circ=figma.createEllipse(); circ.resize(26,26); circ.x=16; circ.y=cy; circ.fills=solid(BLK); p.appendChild(circ);
    const cn=figma.createText(); cn.fontName={family:'Inter',style:'Bold'};
    cn.characters=item.num; cn.fontSize=11; cn.fills=solid(WHT);
    cn.textAlignHorizontal='CENTER'; cn.resize(26,26); cn.x=16; cn.y=cy; p.appendChild(cn);
    const ttl=figma.createText(); ttl.fontName={family:'Inter',style:'Semi Bold'};
    ttl.characters=item.title; ttl.fontSize=12; ttl.fills=solid(BLK);
    ttl.x=50; ttl.y=cy+5; ttl.textAutoResize='WIDTH_AND_HEIGHT'; p.appendChild(ttl);
    cy+=32;
    for(const b of item.body){
      const bt=figma.createText(); bt.fontName={family:'Inter',style:'Regular'};
      bt.characters='- '+b; bt.fontSize=12; bt.fills=solid(G700);
      bt.x=50; bt.y=cy; bt.resize(DESC_W-66,14); bt.textAutoResize='HEIGHT'; p.appendChild(bt);
      cy+=bt.height+3;
    }
    cy+=16;
  }
}

// ═══ UI COMPONENT HELPERS ════════════════════════════════════════

function inputBox(parent, x, y, w, label, placeholder) {
  if(label){ const lt=figma.createText(); lt.fontName={family:'Inter',style:'Regular'}; lt.characters=label; lt.fontSize=12; lt.fills=solid(G700); lt.x=x; lt.y=y; parent.appendChild(lt); y+=18; }
  const b=figma.createFrame(); b.resize(w,36); b.x=x; b.y=y;
  b.fills=solid(G50); b.strokes=solid(G300); b.strokeWeight=1; b.strokeAlign='INSIDE'; parent.appendChild(b);
  if(placeholder){ const t=figma.createText(); t.fontName={family:'Inter',style:'Regular'}; t.characters=placeholder; t.fontSize=13; t.fills=solid(G400); t.x=10; t.y=10; b.appendChild(t); }
  return y+36;
}

function selectBox(parent, x, y, w, label, value) {
  if(label){ const lt=figma.createText(); lt.fontName={family:'Inter',style:'Regular'}; lt.characters=label; lt.fontSize=12; lt.fills=solid(G700); lt.x=x; lt.y=y; parent.appendChild(lt); y+=18; }
  const b=figma.createFrame(); b.resize(w,36); b.x=x; b.y=y;
  b.fills=solid(WHT); b.strokes=solid(G300); b.strokeWeight=1; b.strokeAlign='INSIDE'; parent.appendChild(b);
  const sv=figma.createText(); sv.fontName={family:'Inter',style:'Regular'}; sv.characters=value||'선택'; sv.fontSize=13; sv.fills=solid(value?BLK:G400); sv.x=10; sv.y=10; b.appendChild(sv);
  return y+36;
}

function btnBox(parent, x, y, w, h, label, type) {
  const b=figma.createFrame(); b.resize(w,h); b.x=x; b.y=y;
  b.fills=solid(type==='primary'?BLK:WHT);
  if(type!=='primary'){ b.strokes=solid(G300); b.strokeWeight=1; b.strokeAlign='INSIDE'; }
  parent.appendChild(b);
  const t=figma.createText(); t.fontName={family:'Inter',style:'Semi Bold'};
  t.characters=label; t.fontSize=13; t.fills=solid(type==='primary'?WHT:BLK);
  t.textAlignHorizontal='CENTER'; t.resize(w,h); t.x=0; t.y=(h-15)/2; b.appendChild(t);
}

function divLine(parent, x, y, w) {
  const d=figma.createRectangle(); d.resize(w,1); d.x=x; d.y=y; d.fills=solid(G200); parent.appendChild(d);
}

function numCirc(parent, x, y, n) {
  const c=figma.createEllipse(); c.resize(24,24); c.x=x; c.y=y; c.fills=solid(BLK); parent.appendChild(c);
  const t=figma.createText(); t.fontName={family:'Inter',style:'Bold'};
  t.characters=String(n); t.fontSize=11; t.fills=solid(WHT);
  t.textAlignHorizontal='CENTER'; t.resize(24,24); t.x=x; t.y=y; parent.appendChild(t);
}

function sLbl(parent, x, y, n, title) {
  numCirc(parent,x,y,n);
  const t=figma.createText(); t.fontName={family:'Inter',style:'Semi Bold'};
  t.characters=title; t.fontSize=13; t.fills=solid(BLK); t.x=x+30; t.y=y+4; parent.appendChild(t);
}

function badgeBox(parent, x, y, label, style) {
  const b=figma.createFrame(); b.resize(84,24); b.x=x; b.y=y;
  b.fills=solid(style==='dark'?BLK:G100); b.cornerRadius=4;
  if(style!=='dark'){ b.strokes=solid(G300); b.strokeWeight=1; b.strokeAlign='INSIDE'; }
  parent.appendChild(b);
  const t=figma.createText(); t.fontName={family:'Inter',style:'Medium'};
  t.characters=label; t.fontSize=11; t.fills=solid(style==='dark'?WHT:BLK);
  t.textAlignHorizontal='CENTER'; t.resize(84,24); t.x=0; t.y=5; b.appendChild(t);
}

function tableRow(parent, y, cols, widths, isHdr) {
  let cx=0;
  for(let i=0;i<cols.length;i++){
    const c=figma.createFrame(); c.resize(widths[i],36); c.x=cx; c.y=y;
    c.fills=solid(isHdr?BLK:WHT);
    c.strokes=solid(G200); c.strokeWeight=0.5; c.strokeAlign='INSIDE'; parent.appendChild(c);
    const t=figma.createText(); t.fontName=isHdr?{family:'Inter',style:'Semi Bold'}:{family:'Inter',style:'Regular'};
    t.characters=cols[i]; t.fontSize=12; t.fills=solid(isHdr?WHT:G700); t.x=8; t.y=10; c.appendChild(t);
    cx+=widths[i];
  }
}

function imgBox(parent, x, y, w, h, label) {
  const f=figma.createFrame(); f.resize(w,h); f.x=x; f.y=y;
  f.fills=solid(G100); f.strokes=solid(G300); f.strokeWeight=1; f.strokeAlign='INSIDE'; parent.appendChild(f);
  if(label){ const t=figma.createText(); t.fontName={family:'Inter',style:'Regular'}; t.characters=label; t.fontSize=12; t.fills=solid(G500); t.textAlignHorizontal='CENTER'; t.resize(w,20); t.x=0; t.y=(h-20)/2; f.appendChild(t); }
  return f;
}
```

## 사용 시 주의

- `figma.setCurrentPageAsync(page)` 사용 — `figma.currentPage =` 할당 금지
- `opacity` 값은 0~1 범위 (0~100 금지)
- 한 `use_figma` 호출당 ~50,000자 제한 → 페이지 1~2개씩 분할
- Starter 플랜 3페이지 제한 → For:e / 팀 플랜 파일에서 실행
